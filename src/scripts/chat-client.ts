export interface ChatConfig {
  apiBase: string;
  lang: 'en' | 'es';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  warning?: string;
}

interface ChatOption {
  id: string;
  label: string;
  message: string;
}

interface ParsedAssistantContent {
  markdown: string;
  options: ChatOption[];
}

export interface InitOptions {
  mount?: string;
  config?: string;
  timeoutMs?: number;
}

interface ServerSseEvent {
  delta?: string;
  done?: boolean;
  agents?: unknown[];
  warning?: string;
  error?: { code?: string; message?: string };
  requestId?: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const CONFIG_WAIT_MS = 1_000;
const TAXALIA_OPTIONS_BLOCK_RE = /```taxalia-options-json\s*[\s\S]*?```/gi;
const TAXALIA_OPTIONS_INCOMPLETE_BLOCK_RE = /```taxalia-options-json\s*[\s\S]*$/i;

function isChatConfig(value: unknown): value is ChatConfig {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.apiBase === 'string' && (v.lang === 'en' || v.lang === 'es');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSafeHref(raw: string): boolean {
  if (raw.startsWith('/') && !raw.startsWith('//')) return true;
  if (raw.startsWith('#')) return true;
  try {
    const url = new URL(raw, window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function renderInlineMarkdown(text: string): string {
  const codeSpans: string[] = [];
  let output = escapeHtml(text);

  output = output.replace(/`([^`]+)`/g, (_, code: string) => {
    const token = `\u0000CODE${codeSpans.length}\u0000`;
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  output = output.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
    if (!isSafeHref(href)) return label;
    const safeHref = escapeHtml(href);
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, (_, prefix: string, value: string) => {
    return `${prefix}<em>${value}</em>`;
  });
  output = output.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, (_, prefix: string, value: string) => {
    return `${prefix}<em>${value}</em>`;
  });

  return output.replace(/\u0000CODE(\d+)\u0000/g, (_, index: string) => codeSpans[Number(index)] ?? '');
}

function renderMarkdown(markdown: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const text = markdown.replace(/\r\n/g, '\n').trim();

  if (!text) return fragment;

  const blocks = text.split(/\n{2,}/);

  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;

    const lines = block.split('\n').map((line) => line.trimEnd());
    const listItems = lines.filter((line) => line.length > 0);
    const isBulletList = listItems.length > 0 && listItems.every((line) => /^[-*+]\s+/.test(line));
    const isOrderedList = listItems.length > 0 && listItems.every((line) => /^\d+[.)]\s+/.test(line));

    if (isBulletList || isOrderedList) {
      const listEl = document.createElement(isOrderedList ? 'ol' : 'ul');
      for (const line of listItems) {
        const item = document.createElement('li');
        item.innerHTML = renderInlineMarkdown(line.replace(/^([-*+]|\d+[.)])\s+/, ''));
        listEl.appendChild(item);
      }
      fragment.appendChild(listEl);
      continue;
    }

    const paragraph = document.createElement('p');
    paragraph.innerHTML = lines.map((line) => renderInlineMarkdown(line)).join('<br>');
    fragment.appendChild(paragraph);
  }

  return fragment;
}

function normalizeOption(option: unknown): ChatOption | null {
  if (!option || typeof option !== 'object') return null;
  const value = option as Record<string, unknown>;
  if (typeof value.id !== 'string' || typeof value.label !== 'string' || typeof value.message !== 'string') return null;

  const id = value.id.trim();
  const label = value.label.trim();
  const message = value.message.trim();

  if (!id || !label || !message) return null;
  return { id, label, message };
}

function parseAssistantContent(rawText: string): ParsedAssistantContent {
  const blockPattern = /```taxalia-options-json\s*\n?([\s\S]*?)```/gi;
  const incompleteBlockPattern = /```taxalia-options-json\s*\n?([\s\S]*)$/i;
  const optionPayloads: string[] = [];
  const withoutCompleteBlocks = rawText.replace(blockPattern, (_block, payload: string) => {
    optionPayloads.push(payload);
    return '';
  });
  const incompleteMatch = incompleteBlockPattern.exec(withoutCompleteBlocks);
  if (incompleteMatch?.[1]) {
    optionPayloads.push(incompleteMatch[1]);
  }

  let options: ChatOption[] = [];
  for (const payload of optionPayloads) {
    try {
      const parsed: unknown = JSON.parse(payload.trim());
      if (!parsed || typeof parsed !== 'object') continue;
      const value = parsed as { options?: unknown };
      if (!Array.isArray(value.options)) continue;
      const normalized = value.options.map(normalizeOption).filter((item): item is ChatOption => item !== null);
      if (normalized.length > 0) {
        options = normalized;
      }
    } catch {
      // Ignore invalid option payloads and continue rendering the visible text.
    }
  }

  const visibleMarkdown = rawText
    .replace(TAXALIA_OPTIONS_BLOCK_RE, '')
    .replace(TAXALIA_OPTIONS_INCOMPLETE_BLOCK_RE, '')
    .trimEnd();

  return {
    markdown: visibleMarkdown.trim(),
    options,
  };
}

function renderAssistantMessage(
  assistantBubble: HTMLElement,
  assistantEl: HTMLElement,
  onOptionSelected: (message: string) => void,
  rawText: string,
): ParsedAssistantContent {
  const parsed = parseAssistantContent(rawText);
  assistantBubble.replaceChildren(renderMarkdown(parsed.markdown));

  const existingOptions = assistantEl.querySelector<HTMLElement>('.chat-msg-options');
  if (existingOptions) existingOptions.remove();

  if (parsed.options.length > 0) {
    const optionsEl = document.createElement('div');
    optionsEl.className = 'chat-msg-options';

    for (const option of parsed.options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-msg-option';
      button.textContent = option.label;
      button.dataset.message = option.message;
      button.dataset.optionId = option.id;
      button.addEventListener('click', () => {
        onOptionSelected(option.message);
      });
      optionsEl.appendChild(button);
    }

    assistantEl.appendChild(optionsEl);
  }

  return parsed;
}

function waitForElement<T extends Element>(selector: string, timeoutMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const found = document.querySelector<T>(selector);
    if (found) {
      resolve(found);
      return;
    }
    const start = Date.now();
    const observer = new MutationObserver(() => {
      const el = document.querySelector<T>(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      } else if (Date.now() - start >= timeoutMs) {
        observer.disconnect();
        resolve(null);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector<T>(selector));
    }, timeoutMs);
  });
}

function readConfig(scriptEl: HTMLScriptElement | null): ChatConfig | null {
  if (!scriptEl) return null;
  const raw = scriptEl.textContent?.trim();
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isChatConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

interface ActiveRequest {
  controller: AbortController;
  timeoutId: number;
}

export function init(options: InitOptions = {}): void {
  const mountSelector = options.mount ?? '#chat-widget';
  const configSelector = options.config ?? '#chat-config';
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  void (async () => {
    const mount = await waitForElement<HTMLElement>(mountSelector, CONFIG_WAIT_MS);
    if (!mount) {
      console.error('[chat-client] mount element not found:', mountSelector);
      return;
    }

    const widget = mount.id === 'chat-widget' ? mount : mount.closest('#chat-widget') ?? mount;
    const configEl = await waitForElement<HTMLScriptElement>(configSelector, CONFIG_WAIT_MS);
    const config = readConfig(configEl);
    if (!config) {
      console.error('[chat-client] chat-config block missing or invalid:', configSelector);
      return;
    }

    const messagesEl = widget.querySelector<HTMLElement>('#chat-messages');
    const formEl = widget.querySelector<HTMLFormElement>('#chat-form');
    const inputEl = widget.querySelector<HTMLInputElement>('#chat-text');
    const sendEl = widget.querySelector<HTMLButtonElement>('#chat-send');
    const closeEl = widget.querySelector<HTMLButtonElement>('#chat-close');
    const resizeEl = widget.querySelector<HTMLButtonElement>('#chat-resize');
    const launcherEl = document.querySelector<HTMLButtonElement>('#chat-launcher');
    const typingEl = widget.querySelector<HTMLElement>('#chat-typing');
    const errorEl = widget.querySelector<HTMLElement>('#chat-error');

    if (!messagesEl || !formEl || !inputEl || !sendEl || !closeEl || !resizeEl || !launcherEl || !typingEl || !errorEl) {
      console.error('[chat-client] required widget sub-elements missing');
      return;
    }

    let active: ActiveRequest | null = null;
    const history: ChatMessage[] = [];
    const partialCopy = widget.dataset.chatPartial ?? 'Some answers may be incomplete.';

    // Pre-rendered welcome option buttons (server-side from ChatWidget.astro).
    // Looked up here so both the send() path and the button click handlers can
    // dismiss the container on the first user message regardless of origin.
    const welcomeOptionsEl = widget.querySelector<HTMLElement>('[data-welcome-options]');
    const dismissWelcomeOptions = (): void => {
      if (welcomeOptionsEl && !welcomeOptionsEl.hidden) {
        welcomeOptionsEl.hidden = true;
      }
    };

    const setBusy = (busy: boolean): void => {
      sendEl.disabled = busy || inputEl.value.trim().length === 0;
      inputEl.readOnly = busy;
    };

    const showTyping = (show: boolean): void => {
      typingEl.hidden = !show;
    };

    const showError = (message: string): void => {
      errorEl.textContent = message;
      errorEl.hidden = false;
    };

    const clearError = (): void => {
      errorEl.textContent = '';
      errorEl.hidden = true;
    };

    const appendMessage = (msg: ChatMessage): HTMLElement => {
      const el = document.createElement('div');
      el.className = `chat-msg chat-msg--${msg.role}`;
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
      bubble.textContent = msg.content;
      el.appendChild(bubble);

      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    };

    const updateSendState = (): void => {
      if (!active) {
        sendEl.disabled = inputEl.value.trim().length === 0;
      }
    };

    const setExpanded = (expanded: boolean): void => {
      widget.classList.toggle('is-expanded', expanded);
      resizeEl.setAttribute('aria-expanded', String(expanded));
      resizeEl.setAttribute('aria-label', expanded ? 'Shrink chat' : 'Expand chat');
      resizeEl.textContent = expanded ? '⤡' : '⤢';
      messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    const cancelActive = (): void => {
      if (!active) return;
      window.clearTimeout(active.timeoutId);
      active.controller.abort();
      active = null;
    };

    const parseSseChunk = (rawChunk: string): ServerSseEvent[] => {
      const events: ServerSseEvent[] = [];
      const lines = rawChunk.split('\n');
      let data = '';

      const pushData = (): void => {
        if (!data) return;
        try {
          const parsed: unknown = JSON.parse(data);
          if (parsed && typeof parsed === 'object') {
            events.push(parsed as ServerSseEvent);
          }
        } catch {
          // Ignore malformed payloads; backend may include non-JSON keep-alives.
        }
        data = '';
      };

      for (const line of lines) {
        const normalizedLine = line.replace(/\r$/, '');
        if (normalizedLine.startsWith('data:')) {
          data += normalizedLine.slice(5).trim();
        } else if (normalizedLine === '') {
          pushData();
        }
      }

      pushData();
      return events;
    };

    const send = async (text: string): Promise<void> => {
      if (active) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      dismissWelcomeOptions();
      clearError();
      const userMsg: ChatMessage = { role: 'user', content: trimmed };
      history.push(userMsg);
      appendMessage(userMsg);

      const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
      let assistantEl: HTMLElement | null = null;
      let assistantBubble: HTMLElement | null = null;
      let assistantText = '';
      const submitOption = (message: string): void => {
        if (!message.trim() || active) return;
        void send(message);
      };

      const ensureAssistantMessage = (): { el: HTMLElement; bubble: HTMLElement } | null => {
        if (!assistantEl || !assistantBubble) {
          history.push(assistantMsg);
          assistantEl = appendMessage(assistantMsg);
          assistantBubble = assistantEl.querySelector<HTMLElement>('.chat-msg-bubble');
        }

        if (!assistantEl || !assistantBubble) return null;
        return { el: assistantEl, bubble: assistantBubble };
      };

      const controller = new AbortController();
      const requestId = crypto.randomUUID();
      const startedAt = performance.now();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
        showError('Sorry, the request timed out. Please try again.');
        if (assistantEl && assistantBubble && assistantBubble.textContent !== '') {
          const parsed = renderAssistantMessage(
            assistantBubble,
            assistantEl,
            submitOption,
            assistantText,
          );
          assistantMsg.content = parsed.markdown;
        }
        showTyping(false);
        setBusy(false);
        inputEl.value = '';
        updateSendState();
        active = null;
      }, timeoutMs);
      active = { controller, timeoutId };

      setBusy(true);
      showTyping(true);

      try {
        const response = await fetch(`${config.apiBase.replace(/\/+$/, '')}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            'X-Request-Id': requestId,
          },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
            lang: config.lang,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          showError('Sorry, something went wrong. Please try again.');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let gotAnyDelta = false;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            for (const event of parseSseChunk(part)) {
              if (typeof event.delta === 'string' && event.delta.length > 0) {
                const assistant = ensureAssistantMessage();
                if (!assistant) return;
                assistantText += event.delta;
                const parsed = renderAssistantMessage(
                  assistant.bubble,
                  assistant.el,
                  submitOption,
                  assistantText,
                );
                assistantMsg.content = parsed.markdown;
                messagesEl.scrollTop = messagesEl.scrollHeight;
                gotAnyDelta = true;
              }
              if (event.done) {
                if (!assistantEl || !assistantBubble) {
                  const latencyMs = Math.round(performance.now() - startedAt);
                  console.info(
                    `[chat-client] requestId=${requestId} latencyMs=${latencyMs} outcome=done-empty`,
                  );
                  return;
                }
                if (typeof event.warning === 'string' && event.warning.length > 0) {
                  assistantMsg.warning = event.warning;
                }
                const parsed = renderAssistantMessage(
                  assistantBubble,
                  assistantEl,
                  submitOption,
                  assistantText,
                );
                assistantMsg.content = parsed.markdown;
                messagesEl.scrollTop = messagesEl.scrollHeight;
                const latencyMs = Math.round(performance.now() - startedAt);
                console.info(
                  `[chat-client] requestId=${requestId} latencyMs=${latencyMs} outcome=done`,
                );
                return;
              }
              if (event.error && typeof event.error === 'object') {
                const code = event.error.code ?? 'STREAM_ERROR';
                showError(`Sorry, something went wrong. Please try again. (${code})`);
              }
            }
          }
        }

        if (!gotAnyDelta) {
          showError('Sorry, something went wrong. Please try again.');
        } else {
          if (!assistantEl || !assistantBubble) return;
          // Stream ended without explicit done — log partial outcome, keep message.
          const parsed = renderAssistantMessage(
            assistantBubble,
            assistantEl,
            submitOption,
            assistantText,
          );
          assistantMsg.content = parsed.markdown;
          const latencyMs = Math.round(performance.now() - startedAt);
          console.info(
            `[chat-client] requestId=${requestId} latencyMs=${latencyMs} outcome=stream-end`,
          );
        }
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') {
          return;
        }
        showError('Sorry, something went wrong. Please try again.');
        if (assistantEl && assistantBubble && assistantBubble.textContent !== '') {
          const parsed = renderAssistantMessage(
            assistantBubble,
            assistantEl,
            submitOption,
            assistantText,
          );
          assistantMsg.content = parsed.markdown;
          assistantMsg.warning = partialCopy;
        }
      } finally {
        window.clearTimeout(timeoutId);
        showTyping(false);
        setBusy(false);
        inputEl.value = '';
        updateSendState();
        active = null;
      }
    };

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = inputEl.value;
      if (!value.trim() || active) return;
      void send(value);
    });

    inputEl.addEventListener('input', updateSendState);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formEl.requestSubmit();
      }
    });

    closeEl.addEventListener('click', () => {
      cancelActive();
      widget.hidden = true;
      launcherEl.hidden = false;
      launcherEl.focus();
    });

    resizeEl.addEventListener('click', () => {
      setExpanded(!widget.classList.contains('is-expanded'));
    });

    launcherEl.addEventListener('click', () => {
      launcherEl.hidden = true;
      widget.hidden = false;
      inputEl.focus();
    });

    // Wire up welcome option buttons (server-side from ChatWidget.astro).
    // dismissWelcomeOptions() is hoisted above so the send() path also hides
    // the container when the user types a message instead of clicking a button.
    if (welcomeOptionsEl) {
      const welcomeButtons = welcomeOptionsEl.querySelectorAll<HTMLButtonElement>('.chat-msg-option');
      welcomeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const message = btn.dataset.message ?? '';
          if (!message.trim() || active) return;
          void send(message);
        });
      });
    }
  })();
}
