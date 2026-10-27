import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ScienceIcon from "@mui/icons-material/Science";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import type { IconComponent } from "../types/icon";
import SectionHeading from "../components/ui/SectionHeading";
import { useDarkTransition } from "../context/DarkTransitionContext";
import { formatPostDate, partLabel, posts } from "../lib/blog";

const categoryIcon: Record<string, IconComponent> = {
  "Inventory intelligence": Inventory2Icon,
  Procurement: ShoppingCartIcon,
  "Design operations": DesignServicesIcon,
  Pharma: ScienceIcon,
  "AI adoption": AutoAwesomeIcon,
};

/** Uses the post's cover image when it has one; otherwise a brand-colored
 * placeholder (category icon on a gradient wash), consistent with the
 * illustration-box treatment used across the solutions pages. */
function ArticleArt({
  category,
  label,
  cover,
}: {
  category: string;
  label?: string | null;
  cover?: string | null;
}) {
  const Icon = categoryIcon[category] ?? ArticleIcon;
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #5B47E0 0%, #2A1C6B 100%)",
      }}
    >
      {cover ? (
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Icon style={{ fontSize: 40 }} className="text-white/85" />
      )}
      {/* Covers already print their own "Part N of 3", so the label is only for posts without a cover. */}
      {label && !cover && (
        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}

type Article = {
  slug: string;
  partLabel: string | null;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  date: string;
  publishedMonth?: string;
  cover: string | null;
};

const articles: Article[] = posts.map((post) => ({
  slug: post.slug,
  partLabel: partLabel(post),
  category: post.category ?? "Insights",
  readTime: `${post.readMinutes} min read`,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date ? formatPostDate(post.date) : "",
  publishedMonth: post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : undefined,
  cover: post.cover,
}));

const featuredSlug = (posts.find((p) => p.featured) ?? posts[0])?.slug;
const featured = articles.find((a) => a.slug === featuredSlug);

const categories = ["All posts", ...new Set(articles.map((a) => a.category))];

function ArticleCard({
  article,
  dark = false,
}: {
  article: Article;
  dark?: boolean;
}) {
  return (
    <Link to={`/blog/${article.slug}`} className="block h-full rounded-2xl">
      <article className="group flex h-full flex-col">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
            <ArticleArt
              category={article.category}
              label={article.partLabel}
              cover={article.cover}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-500">
            {article.category}
          </p>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-700 ease-in-out ${
              dark ? "text-white/50" : "text-caption"
            }`}
          >
            {article.readTime}
          </p>
        </div>
        <p
          className={`mt-3 flex-1 font-display text-xl font-semibold leading-snug tracking-tight transition-colors duration-700 ease-in-out ${
            dark ? "text-white" : "text-heading"
          }`}
        >
          {article.title}
        </p>
        <div
          className={`mt-4 flex items-center justify-between border-t pt-4 transition-colors duration-700 ease-in-out ${
            dark ? "border-white/10" : "border-secondary-100"
          }`}
        >
          <p
            className={`text-xs transition-colors duration-700 ease-in-out ${dark ? "text-white/50" : "text-caption"}`}
          >
            {article.date}
          </p>
          <p
            className={`text-xs font-medium transition-colors duration-700 ease-in-out ${
              dark ? "text-white/50" : "text-caption"
            }`}
          >
            Read article ↗
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const [active, setActive] = useState("All posts");
  const [query, setQuery] = useState("");
  const isDark = useDarkTransition();

  const filtered = useMemo(() => {
    const byCategory =
      active === "All posts"
        ? articles
        : articles.filter((a) => a.category === active);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((a) =>
      [a.title, a.category, a.excerpt ?? ""].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [active, query]);

  return (
    <>
      {/* Hero */}
      <section className="pb-[88px] pt-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            headingAs="h1"
            heading="Superatom Digest"
            description="Trends, insights, and practical guidance on how decision intelligence is reshaping supply chains."
            descriptionClassName="max-w-2xl"
            animate
          />
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="pb-[120px]">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
            <div className="mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] border border-secondary-100 lg:grid-cols-[3fr_2fr]">
              <div className="relative min-h-[320px]">
                <ArticleArt
                  category={featured.category}
                  cover={featured.cover}
                />
                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  {featured.category}
                  {featured.partLabel && ` · ${featured.partLabel}`}
                </span>
              </div>
              <div className="flex flex-col justify-between gap-8 bg-page p-8 sm:p-12">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-500">
                      Featured
                    </p>
                    <span
                      className="h-px w-6 bg-accent-300"
                      aria-hidden="true"
                    />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-500">
                      {featured.readTime}
                    </p>
                  </div>
                  <p className="mt-5 font-display text-[28px] font-semibold leading-tight tracking-tight text-heading sm:text-[32px]">
                    {featured.title}
                  </p>
                  {featured.excerpt && (
                    <p className="mt-5 text-sm leading-relaxed text-body">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <div>
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-3 rounded-full bg-secondary-500 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-secondary-600"
                  >
                    Read the article <span aria-hidden="true">&#8599;</span>
                  </Link>
                  {featured.publishedMonth && (
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-caption">
                      Published {featured.publishedMonth}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest from the blog */}
      <section
        className={`py-[120px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              theme={isDark ? "dark" : "light"}
              heading="Latest from the blog"
              description="Research and practical thinking across inventory, procurement, design operations, and regulated supply chains."
              descriptionClassName="max-w-xl"
            />
          </div>

          {articles.length > 0 && (
            <div
              className={`mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-y py-4 transition-colors duration-700 ease-in-out lg:flex-row lg:items-center lg:justify-between ${
                isDark ? "border-white/10" : "border-secondary-100"
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActive(c)}
                    className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors duration-700 ease-in-out ${
                      active === c
                        ? isDark
                          ? "bg-white text-secondary-500"
                          : "bg-secondary-500 text-white"
                        : isDark
                          ? "text-white/60 hover:bg-white/10"
                          : "text-caption hover:bg-page"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative shrink-0 lg:w-64">
                <SearchIcon
                  style={{ fontSize: 17 }}
                  className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-700 ease-in-out ${
                    isDark ? "text-white/50" : "text-caption"
                  }`}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  aria-label="Search articles"
                  className={`w-full rounded-full border py-2.5 pl-10 pr-9 text-xs font-medium outline-none transition-colors duration-700 ease-in-out ${
                    isDark
                      ? "border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:border-white/30"
                      : "border-secondary-100 bg-page text-heading placeholder:text-caption focus:border-primary-500/40"
                  }`}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className={`absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center transition-colors duration-700 ease-in-out ${
                      isDark
                        ? "text-white/50 hover:text-white"
                        : "text-caption hover:text-heading"
                    }`}
                  >
                    <CloseIcon style={{ fontSize: 15 }} />
                  </button>
                )}
              </div>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  dark={isDark}
                />
              ))}
            </div>
          ) : (
            <p
              className={`mx-auto mt-16 max-w-6xl text-center text-sm transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/60" : "text-caption"
              }`}
            >
              {articles.length === 0 ? (
                "No articles published yet. Check back soon."
              ) : (
                <>
                  No articles match &ldquo;{query}&rdquo;. Try a different
                  search or category.
                </>
              )}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
