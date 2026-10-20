import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { blogIndex } from "../generated/blogIndex";
import { formatPostDate, safeHref, type BlogBlock, type BlogPost as Post, type RichText } from "../lib/blog";
import NotFound from "./NotFound";

function Rich({ parts }: { parts: RichText[] }) {
  return parts.map((part, i) => {
    let node: ReactNode = part.text;
    if (part.code) node = <code className="rounded bg-page px-1.5 py-0.5 font-mono text-[0.9em] text-heading">{node}</code>;
    if (part.bold) node = <strong className="font-semibold text-heading">{node}</strong>;
    if (part.italic) node = <em>{node}</em>;
    if (part.strikethrough) node = <s>{node}</s>;
    if (part.underline) node = <u>{node}</u>;
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

const headingClass = {
  2: "mt-12 text-[28px]",
  3: "mt-10 text-[22px]",
  4: "mt-8 text-lg",
} as const;

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
        <Tag className={`font-display font-semibold leading-snug tracking-tight text-heading ${headingClass[block.level]}`}>
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
    case "callout":
      return (
        <div className="mt-6 flex gap-3 rounded-xl border border-secondary-100 bg-page p-5 text-[15px] leading-relaxed text-body">
          {block.icon && <span aria-hidden="true">{block.icon}</span>}
          <div className="whitespace-pre-line">
            <Rich parts={block.text} />
          </div>
        </div>
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
          <img src={block.src} alt={block.caption?.map((c) => c.text).join("") ?? ""} loading="lazy" className="w-full rounded-2xl" />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-caption">
              <Rich parts={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "divider":
      return <hr className="mt-12 border-secondary-100" />;
  }
}

type Loaded = { slug: string; post?: Post; failed?: boolean };

export default function BlogPost() {
  const { slug = "" } = useParams();
  const summary = blogIndex.posts.find((p) => p.slug === slug);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const current = loaded?.slug === slug ? loaded : null;

  useEffect(() => {
    if (!summary) return;
    const controller = new AbortController();
    fetch(`/blog-data/posts/${encodeURIComponent(slug)}.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Post>;
      })
      .then((post) => setLoaded({ slug, post }))
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          console.error("Failed to load blog post", err);
          setLoaded({ slug, failed: true });
        }
      });
    return () => controller.abort();
  }, [slug, summary]);

  useEffect(() => {
    if (!summary) return;
    const previous = document.title;
    document.title = `${summary.title} | Superatom AI`;
    return () => {
      document.title = previous;
    };
  }, [summary]);

  if (!summary) return <NotFound />;

  return (
    <article className="pb-[120px] pt-[100px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-[760px]">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-caption transition-colors hover:text-heading"
          >
            <ArrowBackIcon style={{ fontSize: 16 }} />
            All articles
          </Link>
          <div className="mt-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-500">
            {summary.category && (
              <>
                <span>{summary.category}</span>
                <span className="h-px w-6 bg-accent-300" aria-hidden="true" />
              </>
            )}
            <span>{summary.readMinutes} min read</span>
          </div>
          <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.12] tracking-tight text-heading sm:text-[48px]">
            {summary.title}
          </h1>
          {summary.date && (
            <p className="mt-5 text-sm text-caption">{formatPostDate(summary.date)}</p>
          )}
        </div>

        {summary.cover && (
          <img
            src={summary.cover}
            alt=""
            className="mx-auto mt-12 aspect-[16/9] w-full max-w-5xl rounded-[28px] object-cover"
          />
        )}

        <div className="mx-auto mt-12 max-w-[680px] [&>*:first-child]:mt-0">
          {current?.post ? (
            current.post.blocks.map((block, i) => <Block key={i} block={block} />)
          ) : current?.failed ? (
            <p className="text-sm text-caption">
              We couldn&rsquo;t load this article. Please refresh the page to try again.
            </p>
          ) : (
            <div className="animate-pulse space-y-4" aria-label="Loading article">
              {[100, 95, 88, 100, 70].map((w, i) => (
                <div key={i} className="h-4 rounded bg-secondary-100" style={{ width: `${w}%` }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
