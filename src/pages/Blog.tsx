import { useMemo, useState, type ReactNode } from "react";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ScienceIcon from "@mui/icons-material/Science";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import type { IconComponent } from "../types/icon";
import { useDarkTransition } from "../context/DarkTransitionContext";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

/** Small gradient dash + label, matching the eyebrow treatment used on the solutions pages. */
function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-0.5 w-7 shrink-0 rounded-full"
        style={{ backgroundImage: BRAND_GRADIENT }}
        aria-hidden="true"
      />
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-700 ease-in-out ${
          dark ? "text-white/60" : "text-caption"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

type Category = "Inventory intelligence" | "Procurement" | "Design operations" | "Pharma" | "AI adoption";

const categoryIcon: Record<Category, IconComponent> = {
  "Inventory intelligence": Inventory2Icon,
  Procurement: ShoppingCartIcon,
  "Design operations": DesignServicesIcon,
  Pharma: ScienceIcon,
  "AI adoption": AutoAwesomeIcon,
};

/** No real photography to source, so each article gets a brand-colored
 * placeholder (icon on a gradient wash) instead — consistent with the
 * illustration-box treatment already used across the solutions pages,
 * rather than standing in fake stock photography. */
function ArticleArt({ category, badge }: { category: Category; badge: string }) {
  const Icon = categoryIcon[category];
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ backgroundImage: "linear-gradient(135deg, #5B47E0 0%, #2A1C6B 100%)" }}
    >
      <Icon style={{ fontSize: 40 }} className="text-white/85" />
      <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[11px] font-semibold text-white backdrop-blur-sm">
        {badge}
      </span>
    </div>
  );
}

type Article = {
  badge: string;
  category: Category;
  readTime: string;
  title: string;
  date: string;
  status: "read" | "soon";
};

const articles: Article[] = [
  {
    badge: "01",
    category: "Inventory intelligence",
    readTime: "12 min read",
    title: "Inventory Intelligence: Definition and the Scale of the Problem",
    date: "May 14, 2026",
    status: "read",
  },
  {
    badge: "02",
    category: "Inventory intelligence",
    readTime: "10 min read",
    title: "Inventory Intelligence: Why It’s a Discipline and Where Adoption Stands",
    date: "May 21, 2026",
    status: "read",
  },
  {
    badge: "03",
    category: "Inventory intelligence",
    readTime: "11 min read",
    title: "Inventory Intelligence: Trends, Risks, and How to Build the Capability",
    date: "May 28, 2026",
    status: "read",
  },
  {
    badge: "04",
    category: "Procurement",
    readTime: "8 min read",
    title: "Procurement Intelligence: From Spend Visibility to Better Decisions",
    date: "June 06, 2026",
    status: "soon",
  },
  {
    badge: "05",
    category: "Design operations",
    readTime: "7 min read",
    title: "The Hidden Cost of Design Latency",
    date: "June 13, 2026",
    status: "soon",
  },
  {
    badge: "06",
    category: "Pharma",
    readTime: "9 min read",
    title: "Pharma Procurement Intelligence: Resilience Beyond Cost",
    date: "June 20, 2026",
    status: "soon",
  },
  {
    badge: "07",
    category: "AI adoption",
    readTime: "9 min read",
    title: "Building Trust in AI Recommendations, One Decision at a Time",
    date: "June 27, 2026",
    status: "soon",
  },
];

const featured = articles[0];
const categories: ("All research" | Category)[] = [
  "All research",
  "Inventory intelligence",
  "Procurement",
  "Design operations",
  "Pharma",
  "AI adoption",
];

function ArticleCard({ article, dark = false }: { article: Article; dark?: boolean }) {
  return (
    <article className="flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <ArticleArt category={article.category} badge={article.badge} />
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
        className={`mt-3 font-display text-xl font-semibold leading-snug tracking-tight transition-colors duration-700 ease-in-out ${
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
        <p className={`text-xs transition-colors duration-700 ease-in-out ${dark ? "text-white/50" : "text-caption"}`}>
          {article.date}
        </p>
        <p
          className={`text-xs font-medium transition-colors duration-700 ease-in-out ${
            dark ? "text-white/50" : "text-caption"
          }`}
        >
          {article.status === "read" ? "Read article ↗" : "Coming soon"}
        </p>
      </div>
    </article>
  );
}

export default function Blog() {
  const [active, setActive] = useState<(typeof categories)[number]>("All research");
  const [query, setQuery] = useState("");
  const isDark = useDarkTransition();

  const filtered = useMemo(() => {
    const byCategory =
      active === "All research" ? articles : articles.filter((a) => a.category === active);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q),
    );
  }, [active, query]);

  return (
    <>
      {/* Hero */}
      <section className="pb-[88px] pt-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <Eyebrow>Field notes for modern operators</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[58px]">
            Better decisions
            <br />
            start{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              before
            </span>{" "}
            the alert.
          </h1>
          <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-xl text-p leading-relaxed text-body">
              Clear thinking on inventory, AI, and the systems that keep products moving.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-caption">
              Issue 01 / 2026
            </p>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <section className="pb-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] border border-secondary-100 lg:grid-cols-[3fr_2fr]">
            <div className="relative min-h-[320px]">
              <ArticleArt category={featured.category} badge={featured.badge} />
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                {featured.category}
              </span>
              <div className="absolute bottom-5 right-5 max-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <p className="font-display text-[34px] font-semibold leading-none text-white">
                  $1.7T
                </p>
                <p className="mt-2 text-xs leading-snug text-white/80">
                  lost to inventory distortion each year
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 bg-page p-8 sm:p-12">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-500">
                    Research
                  </p>
                  <span className="h-px w-6 bg-accent-300" aria-hidden="true" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-500">
                    {featured.readTime}
                  </p>
                </div>
                <p className="mt-5 font-display text-[28px] font-semibold leading-tight tracking-tight text-heading sm:text-[32px]">
                  {featured.title}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-body">
                  A framework for FMCG, retail, and supply chain leaders:
                  inventory intelligence as an organizational capability, not
                  a product category.
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-3 rounded-full bg-secondary-500 px-6 py-3.5 text-sm font-medium text-white">
                  Read the article <span aria-hidden="true">&#8599;</span>
                </span>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-caption">
                  Published May 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest from the journal */}
      <section
        className={`py-[120px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow dark={isDark}>01</Eyebrow>
              <h2
                className={`mt-5 font-display text-[36px] font-semibold tracking-tight transition-colors duration-700 ease-in-out sm:text-[44px] ${
                  isDark ? "text-white" : "text-heading"
                }`}
              >
                Latest from the journal
              </h2>
            </div>
            <p
              className={`max-w-[430px] text-sm leading-relaxed transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/70" : "text-body"
              }`}
            >
              Research and practical thinking across inventory, procurement,
              design operations, and regulated supply chains.
            </p>
          </div>

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
                    isDark ? "text-white/50 hover:text-white" : "text-caption hover:text-heading"
                  }`}
                >
                  <CloseIcon style={{ fontSize: 15 }} />
                </button>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.title} article={article} dark={isDark} />
              ))}
            </div>
          ) : (
            <p
              className={`mx-auto mt-16 max-w-6xl text-center text-sm transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/60" : "text-caption"
              }`}
            >
              No articles match &ldquo;{query}&rdquo;. Try a different search or category.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
