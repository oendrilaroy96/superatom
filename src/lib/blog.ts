// Blog posts live as Markdown files in /content/blog (see content/blog/README.md).
// They are read at build time, so adding a post is just adding a file.

export type RichText = {
  text: string;
  href?: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

export type BlogBlock =
  | { type: "paragraph" | "quote"; text: RichText[] }
  | { type: "heading"; level: 2 | 3 | 4; text: RichText[]; id: string }
  | { type: "list"; ordered: boolean; items: RichText[][] }
  | { type: "code"; code: string; language?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "divider" };

export type BlogStat = { value: string; label: string };

/** A post's place in a multi-part series, read from a `series` like "Inventory Intelligence — Part 2 of 3". */
export type SeriesInfo = { name: string; part: number; total: number };

export type BlogPost = {
  slug: string;
  title: string;
  /** Optional line shown under the title, e.g. "Inventory Intelligence: Part 1 of 3". */
  series: string | null;
  seriesInfo: SeriesInfo | null;
  /** Optional standfirst shown under the title. */
  subtitle: string | null;
  excerpt: string;
  category: string | null;
  /** ISO date (YYYY-MM-DD) from the post's front matter. */
  date: string | null;
  readMinutes: number;
  cover: string | null;
  featured: boolean;
  /** Up to three headline numbers shown on cards under the title. */
  stats: BlogStat[];
  blocks: BlogBlock[];
};

export function formatPostDate(iso: string, month: "long" | "short" = "long"): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Only allow web, mail and same-site links from post content, never javascript: and the like. */
export function safeHref(href: string): string | undefined {
  try {
    const { protocol } = new URL(href, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}

// ---------- Markdown parsing ----------

const INLINE =
  /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function parseInline(text: string): RichText[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part): RichText => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return { text: part.slice(2, -2), bold: true };
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return { text: part.slice(1, -1), code: true };
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return { text: part.slice(1, -1), italic: true };
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) return { text: link[1], href: link[2] };
      return { text: part };
    });
}

const plainText = (parts: RichText[]) => parts.map((p) => p.text).join("");

const FENCE = /^```(\w*)\s*$/;
const HEADING = /^(#{1,4})\s+(.+)$/;
const DIVIDER = /^(-{3,}|\*{3,}|_{3,})$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;
const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function startsNewBlock(line: string) {
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    DIVIDER.test(line.trim()) ||
    IMAGE.test(line.trim()) ||
    BULLET.test(line) ||
    NUMBERED.test(line) ||
    line.startsWith(">")
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
}

function parseBlocks(markdown: string): BlogBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: BlogBlock[] = [];
  const usedIds = new Set<string>();
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !FENCE.test(lines[i])) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", code: code.join("\n"), language: fence[1] || undefined });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      // The post title is the page's only h1, so # and ## both become h2.
      const level = Math.max(2, heading[1].length) as 2 | 3 | 4;
      const text = parseInline(heading[2].trim());
      const base = slugify(plainText(text));
      let id = base;
      for (let n = 2; usedIds.has(id); n++) id = `${base}-${n}`;
      usedIds.add(id);
      blocks.push({ type: "heading", level, text, id });
      i++;
      continue;
    }

    if (DIVIDER.test(line.trim())) {
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    const image = line.trim().match(IMAGE);
    if (image) {
      if (/^(\/|https?:\/\/)/.test(image[2])) {
        blocks.push({ type: "image", src: image[2], alt: image[1], caption: image[3] || undefined });
      }
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: parseInline(quote.join(" ").trim()) });
      continue;
    }

    const ordered = NUMBERED.test(line);
    if (ordered || BULLET.test(line)) {
      const marker = ordered ? NUMBERED : BULLET;
      const items: string[] = [];
      while (i < lines.length && lines[i].trim()) {
        const item = lines[i].match(marker);
        if (item) items.push(item[1]);
        else if (/^\s+\S/.test(lines[i]) && items.length) items[items.length - 1] += ` ${lines[i].trim()}`;
        else break;
        i++;
      }
      blocks.push({ type: "list", ordered, items: items.map((t) => parseInline(t.trim())) });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && (paragraph.length === 0 || !startsNewBlock(lines[i]))) {
      paragraph.push(lines[i++].trim());
    }
    blocks.push({ type: "paragraph", text: parseInline(paragraph.join(" ")) });
  }

  return blocks;
}

function blockText(block: BlogBlock): string {
  if (block.type === "list") return block.items.map(plainText).join(" ");
  if (block.type === "paragraph" || block.type === "quote" || block.type === "heading") return plainText(block.text);
  return "";
}

function excerptFrom(blocks: BlogBlock[]): string {
  const first = blocks.find((b) => b.type === "paragraph");
  const text = first ? blockText(first).replace(/\s+/g, " ").trim() : "";
  if (text.length <= 180) return text;
  return `${text.slice(0, 180).replace(/\s+\S*$/, "")}…`;
}

function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon < 1) continue;
    const value = line.slice(colon + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
    data[line.slice(0, colon).trim().toLowerCase()] = value;
  }
  return { data, body: match[2] };
}

function parseSeries(series: string | undefined): SeriesInfo | null {
  const match = series?.match(/^(.*?)\s*[—–-]\s*Part\s+(\d+)\s+of\s+(\d+)\s*$/i);
  if (!match || !match[1]) return null;
  return { name: match[1].trim(), part: Number(match[2]), total: Number(match[3]) };
}

function parseStats(data: Record<string, string>): BlogStat[] {
  return [data.stat1, data.stat2, data.stat3].flatMap((raw) => {
    if (!raw) return [];
    const bar = raw.indexOf("|");
    const value = (bar < 0 ? raw : raw.slice(0, bar)).trim();
    const label = bar < 0 ? "" : raw.slice(bar + 1).trim();
    return value ? [{ value, label }] : [];
  });
}

function parsePost(slug: string, source: string): BlogPost | null {
  const { data, body } = parseFrontMatter(source);
  if (!data.title) {
    if (import.meta.env.DEV) console.warn(`[blog] Skipping "${slug}.md": it has no title in its front matter.`);
    return null;
  }
  if (data.draft?.toLowerCase() === "true") return null;
  if (import.meta.env.DEV && data.date && !/^\d{4}-\d{2}-\d{2}/.test(data.date)) {
    console.warn(`[blog] "${slug}.md": date "${data.date}" should look like 2026-10-12.`);
  }
  // A future date schedules the post: it stays hidden until that day.
  if (data.date && new Date(data.date) > new Date()) return null;

  const blocks = parseBlocks(body);
  const words = blocks.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    series: data.series || null,
    seriesInfo: parseSeries(data.series),
    subtitle: data.subtitle || null,
    excerpt: data.excerpt || data.subtitle || excerptFrom(blocks),
    category: data.category || null,
    date: data.date || null,
    readMinutes: Math.max(1, Math.round(words / 225)),
    cover: data.cover || null,
    featured: data.featured?.toLowerCase() === "true",
    stats: parseStats(data),
    blocks,
  };
}

const files = import.meta.glob(["../../content/blog/*.md", "!../../content/blog/README.md"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Published posts, newest first. */
export const posts: BlogPost[] = Object.entries(files)
  .map(([path, source]) => parsePost(path.split("/").pop()!.replace(/\.md$/, ""), source))
  .filter((post): post is BlogPost => post !== null)
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const partLabel = (post: BlogPost) =>
  post.seriesInfo ? `Part ${post.seriesInfo.part} of ${post.seriesInfo.total}` : null;

/** Every published part of the series this post belongs to, in reading order. */
export function getSeriesPosts(post: BlogPost): BlogPost[] {
  const info = post.seriesInfo;
  if (!info) return [];
  return posts
    .filter((p) => p.seriesInfo?.name.toLowerCase() === info.name.toLowerCase())
    .sort((a, b) => a.seriesInfo!.part - b.seriesInfo!.part);
}
