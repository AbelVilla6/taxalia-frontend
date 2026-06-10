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
  translationGroupId: string;
  published: boolean;
  title: string;
  description: string;
  author: string;
  heroImage: string | null;
  heroAlt: string | null;
  tags: string[];
  pubDate: string;
  updatedDate: string | null;
}

export interface PostAlternate {
  slug: string;
  url: string;
}

export interface PostSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  secondaryKeywords: string[];
  openGraphImage: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
}

export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

export interface PostDetail extends PostSummary {
  contentHtml: string;
  alternates: Partial<Record<Lang, PostAlternate>>;
  seo: PostSeo | null;
  toc: TocEntry[];
  articleJsonLd: Record<string, unknown> | null;
  /** Hand-curated JSON-LD (e.g. FAQPage) stored with the post, if any. */
  customJsonLd: Record<string, unknown> | null;
}

/**
 * Serializes JSON-LD for inline <script> embedding. Escapes `<` so payload
 * content can never close the script tag early.
 */
export function jsonLdForScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Builds the localized blog URL for a post slug. */
export function blogPath(lang: Lang, slug: string): string {
  return lang === 'es' ? `/es/blog/${slug}` : `/blog/${slug}`;
}

export interface PostSeoProps {
  title: string;
  description: string;
  canonicalUrl: string;
  alternateUrls: Partial<Record<Lang, string>>;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | undefined;
  keywords: string | null;
}

/**
 * Head metadata for a post detail page. Canonical and alternate URLs are
 * built from the frontend's own site origin and the backend-provided
 * alternate slugs — the absolute URLs in the payload depend on the backend's
 * FRONTEND_SITE_URL env and are not trusted for SEO tags.
 */
export function postSeoProps(
  post: PostDetail,
  lang: Lang,
  site: URL | undefined,
): PostSeoProps {
  const origin = site ?? new URL('https://lbcoglobaladvisors.com');
  const seo = post.seo;
  const title = seo?.metaTitle ?? post.title;
  const description = seo?.metaDescription ?? post.description;

  const alternateUrls: Partial<Record<Lang, string>> = {};
  for (const altLang of ['en', 'es'] as const) {
    const alternate = post.alternates[altLang];
    if (alternate) {
      alternateUrls[altLang] = new URL(blogPath(altLang, alternate.slug), origin).toString();
    }
  }

  const ogImagePath = seo?.openGraphImage ?? post.heroImage;
  const keywordList = [seo?.focusKeyword, ...(seo?.secondaryKeywords ?? [])].filter(
    (keyword): keyword is string => Boolean(keyword),
  );

  return {
    title,
    description,
    canonicalUrl: new URL(blogPath(lang, post.slug), origin).toString(),
    alternateUrls,
    ogTitle: seo?.openGraphTitle ?? title,
    ogDescription: seo?.openGraphDescription ?? description,
    ogImage: ogImagePath ? new URL(ogImagePath, origin).toString() : undefined,
    keywords: keywordList.length > 0 ? keywordList.join(', ') : null,
  };
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
