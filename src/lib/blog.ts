// Server-side client for the backend blog content API.
//
// These functions run only during SSR (the blog routes set `prerender = false`),
// so the backend base URL is a server-only env var — never exposed to the
// browser. The frontend acts as a BFF: the browser only talks to Astro, Astro
// talks to the backend.

import type { Lang } from '../i18n';

// Resolved at runtime via process.env: `import.meta.env` is statically
// replaced at build time, which would bake the localhost fallback into the
// production bundle. process.env keeps the deployed value working without a
// rebuild; import.meta.env covers dev where Vite loads .env files.
const BACKEND_API_BASE = (
  process.env.BACKEND_API_BASE ??
  import.meta.env.BACKEND_API_BASE ??
  'http://localhost:4324'
).replace(/\/+$/, '');

export interface PostSummary {
  slug: string;
  lang: Lang;
  translationKey: string;
  title: string;
  description: string;
  author: string;
  heroImage: string | null;
  heroAlt: string | null;
  tags: string[];
  pubDate: string;
  updatedDate: string | null;
}

export interface PostDetail extends PostSummary {
  contentHtml: string;
}

/** Builds the localized blog URL for a post slug. */
export function blogPath(lang: Lang, slug: string): string {
  return lang === 'es' ? `/es/blog/${slug}` : `/blog/${slug}`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Backend unreachable: callers render an empty/" not found" state instead
    // of crashing the page.
    return null;
  }
}

/** Published posts for a language, newest first. Empty array on backend error. */
export async function listPosts(lang: Lang): Promise<PostSummary[]> {
  const data = await fetchJson<{ posts: PostSummary[] }>(
    `${BACKEND_API_BASE}/api/posts?lang=${lang}`,
  );
  return data?.posts ?? [];
}

/** Single published post with rendered HTML, or null if missing/unreachable. */
export async function getPost(
  lang: Lang,
  slug: string,
): Promise<PostDetail | null> {
  const data = await fetchJson<{ post: PostDetail }>(
    `${BACKEND_API_BASE}/api/posts/${encodeURIComponent(slug)}?lang=${lang}`,
  );
  return data?.post ?? null;
}
