import { Fragment, useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatPostDate, getPost, safeHref, type BlogBlock, type RichText } from "../lib/blog";
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
    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-xl bg-secondary-500 p-5 font-mono text-[13px] leading-relaxed text-white">
          <code>{block.code}</code>
        </pre>
      );
    case "image":
      return (
        <figure className="mt-10">
          <img src={block.src} alt={block.caption ?? ""} loading="lazy" className="w-full rounded-2xl" />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-caption">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "divider":
      return <hr className="mt-12 border-secondary-100" />;
  }
}

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    const previous = document.title;
    document.title = `${post.title} | Superatom AI`;
    return () => {
      document.title = previous;
    };
  }, [post]);

  if (!post) return <NotFound />;

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
            {post.category && (
              <>
                <span>{post.category}</span>
                <span className="h-px w-6 bg-accent-300" aria-hidden="true" />
              </>
            )}
            <span>{post.readMinutes} min read</span>
          </div>
          <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.12] tracking-tight text-heading sm:text-[48px]">
            {post.title}
          </h1>
          {post.date && (
            <p className="mt-5 text-sm text-caption">{formatPostDate(post.date)}</p>
          )}
        </div>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="mx-auto mt-12 aspect-[16/9] w-full max-w-5xl rounded-[28px] object-cover"
          />
        )}

        <div className="mx-auto mt-12 max-w-[680px] [&>*:first-child]:mt-0">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
}
