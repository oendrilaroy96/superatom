// Shapes of the blog data written by scripts/sync-notion-blog.mjs. The
// script turns Notion's API format into this smaller, render-ready format so
// the site never needs to know about Notion itself.

export type RichText = {
  text: string;
  href?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type BlogBlock =
  | { type: "paragraph" | "quote"; text: RichText[] }
  | { type: "heading"; level: 2 | 3 | 4; text: RichText[] }
  | { type: "list"; ordered: boolean; items: RichText[][] }
  | { type: "callout"; icon?: string; text: RichText[] }
  | { type: "code"; code: string; language?: string }
  | { type: "image"; src: string; caption?: RichText[] }
  | { type: "divider" };

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  /** ISO date (YYYY-MM-DD or full timestamp) from the post's Notion date property. */
  date: string | null;
  readMinutes: number;
  cover: string | null;
  featured: boolean;
};

export type BlogPost = BlogPostSummary & { blocks: BlogBlock[] };

/** `source: "none"` means the build ran without Notion credentials. */
export type BlogIndex = { source: "notion" | "none"; posts: BlogPostSummary[] };

export function formatPostDate(iso: string, month: "long" | "short" = "long"): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Only allow web, mail and same-site links from Notion content, never javascript: and the like. */
export function safeHref(href: string): string | undefined {
  try {
    const { protocol } = new URL(href, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}
