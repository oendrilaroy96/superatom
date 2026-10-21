import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatPostDate, getPost, getSeriesPosts, safeHref, type BlogBlock, type BlogPost as Post, type RichText } from "../lib/blog";
import NotFound from "./NotFound";

function Rich({ parts }: { parts: RichText[] }) {
  return parts.map((part, i) => {
    let node: ReactNode = part.text;
    if (part.code) node = <code className="rounded bg-page px-1.5 py-0.5 font-mono text-[0.9em] text-heading">{node}</code>;
    if (part.bold) node = <strong className="font-semibold text-heading">{node}</strong>;
    if (part.italic) node = <em>{node}</em>;
    const href = part.href ? safeHref(part.href) : undefined;
    if (href) {
      const external = /^https?:/i.test(href);
      node = (
        <a
          href={href}
          className="font-medium text-primary-600 underline decoration-primary-500/30 underline-offset-2 hover:decoration-primary-500"
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {node}
        </a>
      );
    }
    return <Fragment key={i}>{node}</Fragment>;
  });
}

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

const headingClass = {
  2: "mt-12 text-[28px]",
  3: "mt-10 text-[22px]",
  4: "mt-8 text-lg",
} as const;

/** The reader's scroll position decides which contents entry is "current". */
const ACTIVE_OFFSET = 220;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="mt-5 whitespace-pre-line text-[17px] leading-[1.75] text-body">
          <Rich parts={block.text} />
        </p>
      );
    case "heading": {
      const Tag = `h${block.level}` as const;
      return (
        <Tag
          id={block.id}
          className={`scroll-mt-28 font-display font-semibold leading-snug tracking-tight text-heading ${headingClass[block.level]}`}
        >
          <Rich parts={block.text} />
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`mt-5 space-y-2 pl-6 text-[17px] leading-[1.7] text-body marker:text-primary-500 ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Rich parts={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-primary-500 pl-5 font-display text-xl font-medium leading-relaxed text-heading">
          <Rich parts={block.text} />
        </blockquote>
      );
    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-xl bg-secondary-500 p-5 font-mono text-[13px] leading-relaxed text-white">
          <code>{block.code}</code>
        </pre>
      );
    case "image":
      return (
        <figure className="mt-10">
          <img src={block.src} alt={block.alt || block.caption || ""} loading="lazy" className="w-full rounded-2xl" />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-caption">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "divider":
      return <hr className="mt-12 border-secondary-100" />;
  }
}

/** Links to every published part of a series, shown after the article. */
function SeriesNav({ post }: { post: Post }) {
  const parts = getSeriesPosts(post);
  const info = post.seriesInfo;
  if (!info || parts.length < 2) return null;
  return (
    <nav aria-label="More in this series" className="mt-16 border-t border-secondary-100 pt-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-caption">More in this series</p>
      <p className="mt-2 font-display text-xl font-semibold tracking-tight text-heading">{info.name}</p>
      <ol className="mt-5 space-y-3">
        {parts.map((part) => {
          const current = part.slug === post.slug;
          const body = (
            <>
              <span className="w-[72px] shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-primary-500">
                Part {part.seriesInfo!.part}
              </span>
              <span className="min-w-0 flex-1 font-display text-base font-semibold leading-snug text-heading">
                {part.title.startsWith(`${info.name}:`) ? part.title.slice(info.name.length + 1).trim() : part.title}
              </span>
              {current ? (
                <span className="shrink-0 text-xs font-medium text-caption">You&rsquo;re reading this</span>
              ) : (
                <ArrowForwardIcon style={{ fontSize: 18 }} className="shrink-0 text-primary-500" />
              )}
            </>
          );
          return (
            <li key={part.slug}>
              {current ? (
                <div aria-current="page" className="flex items-center gap-4 rounded-2xl border border-secondary-100 bg-page p-5">
                  {body}
                </div>
              ) : (
                <Link
                  to={`/blog/${part.slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-secondary-100 bg-white p-5 transition-colors hover:border-primary-200 hover:bg-page"
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);
  const articleRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;
    const previous = document.title;
    document.title = `${post.title} | Superatom AI`;
    return () => {
      document.title = previous;
    };
  }, [post]);

  const sections = post
    ? post.blocks.flatMap((b) => (b.type === "heading" && b.level === 2 ? [{ id: b.id, text: b.text }] : []))
    : [];
  const showContents = sections.length >= 3;

  // Reading progress bar and the highlighted contents entry follow the scroll position.
  useEffect(() => {
    if (!post) return;
    const ids = post.blocks.flatMap((b) => (b.type === "heading" && b.level === 2 ? [b.id] : []));
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = articleRef.current;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < ACTIVE_OFFSET) current = id;
      }
      setActiveId(current ?? ids[0] ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [post]);

  if (!post) return <NotFound />;

  const jumpTo = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const hasStats = post.stats.length > 0;

  return (
    <article ref={articleRef}>
      <div
        ref={progressRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0"
        style={{ backgroundImage: BRAND_GRADIENT }}
      />

      {/* Dark hero: the header reads its id to switch to its dark look while this is on screen. */}
      <header
        id="blog-dark-zone"
        className={`relative overflow-hidden bg-secondary-700 pt-12 ${hasStats ? "pb-24 sm:pb-28" : "pb-16 sm:pb-20"}`}
        style={{
          backgroundImage:
            "radial-gradient(900px 400px at 80% -10%, rgba(83,58,253,0.45), transparent 60%), radial-gradient(700px 360px at 0% 110%, rgba(255,118,0,0.22), transparent 60%)",
        }}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-[980px]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowBackIcon style={{ fontSize: 16 }} />
              All articles
            </Link>
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
              <span className="h-0.5 w-7 shrink-0 rounded-full" style={{ backgroundImage: BRAND_GRADIENT }} aria-hidden="true" />
              {(post.series ?? post.category) && (
                <>
                  <span>{post.series ?? post.category}</span>
                  <span className="hidden h-px w-6 bg-white/30 sm:block" aria-hidden="true" />
                </>
              )}
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="mt-5 max-w-[860px] font-display text-[36px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[48px] lg:text-[56px]">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="mt-5 max-w-[720px] text-lg leading-relaxed text-secondary-200 sm:text-xl">{post.subtitle}</p>
            )}
            {post.date && <p className="mt-6 text-sm text-secondary-300">{formatPostDate(post.date)}</p>}
          </div>
        </div>
      </header>

      {hasStats && (
        <div className="relative z-10 mx-auto -mt-14 max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <ul className="mx-auto grid max-w-[980px] gap-3 sm:grid-cols-3">
            {post.stats.map((stat) => (
              <li
                key={stat.value}
                className="rounded-[20px] border border-secondary-100 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(13,23,56,0.25)]"
              >
                <p
                  className="bg-clip-text font-display text-[34px] font-bold leading-none tracking-tight text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {stat.value}
                </p>
                {stat.label && <p className="mt-3 text-[13px] leading-snug text-caption">{stat.label}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mx-auto max-w-[1920px] px-4 pb-[120px] pt-12 sm:px-10 lg:pt-16 xl:px-20">
        <div
          className={`mx-auto grid max-w-[1100px] ${
            showContents ? "lg:grid-cols-[240px_minmax(0,680px)] lg:gap-[72px]" : "lg:grid-cols-[minmax(0,680px)] lg:justify-center"
          }`}
        >
          {showContents && (
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-caption">Contents</h2>
              <nav aria-label="Contents" className="mt-4 flex flex-col">
                {sections.map((section) => {
                  const active = section.id === activeId;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={jumpTo(section.id)}
                      aria-current={active ? "location" : undefined}
                      className={`border-l-2 py-2 pl-3.5 text-sm leading-snug transition-colors ${
                        active
                          ? "border-primary-500 font-semibold text-heading"
                          : "border-secondary-100 text-caption hover:text-heading"
                      }`}
                    >
                      <Rich parts={section.text} />
                    </a>
                  );
                })}
              </nav>
              <p className="mt-7 text-[13px] text-caption">{post.readMinutes} min read</p>
            </aside>
          )}

          <div className="[&>*:first-child]:mt-0">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <SeriesNav post={post} />
          </div>
        </div>
      </div>
    </article>
  );
}
