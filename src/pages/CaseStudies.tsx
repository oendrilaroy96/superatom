import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { caseStudies, type CaseStudy } from "../lib/caseStudies";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

/** Small gradient dash + label, the eyebrow treatment used across the other redesigned pages. */
function Eyebrow({
  children,
  align = "left",
  dark = false,
}: {
  children: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}>
      <span
        className="h-0.5 w-6 shrink-0 rounded-full"
        style={{ backgroundImage: "linear-gradient(90deg, #29b9bb, #533afd)" }}
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

/** Dark card art: the study's one big number on a brand-colored glow, with its industry icon. */
function CardArt({ study, index }: { study: CaseStudy; index: number }) {
  const glows = [
    "radial-gradient(420px 260px at 85% 0%, rgba(83,58,253,0.5), transparent 65%), radial-gradient(360px 220px at 0% 100%, rgba(255,118,0,0.25), transparent 65%)",
    "radial-gradient(420px 260px at 15% 0%, rgba(135,62,255,0.5), transparent 65%), radial-gradient(360px 220px at 100% 100%, rgba(255,126,176,0.22), transparent 65%)",
    "radial-gradient(420px 260px at 85% 100%, rgba(83,58,253,0.5), transparent 65%), radial-gradient(360px 220px at 0% 0%, rgba(34,211,238,0.18), transparent 65%)",
  ];
  const { Icon, card } = study;
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-secondary-700 p-6"
      style={{ backgroundImage: glows[index % glows.length] }}
    >
      <div className="flex items-start justify-between">
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {study.industry}
        </span>
        <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white">
          <Icon style={{ fontSize: 22 }} />
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          {card.kind === "Result" ? "Result" : "Scale"}
        </p>
        <p
          className="mt-2 bg-clip-text font-display text-[52px] font-bold leading-none tracking-tight text-transparent"
          style={{ backgroundImage: "linear-gradient(90deg, #a899ff 0%, #ff7eb0 60%, #ffaf6b 100%)" }}
        >
          {card.value}
        </p>
        <p className="mt-2.5 max-w-[240px] text-sm leading-snug text-white/70">{card.label}</p>
      </div>
    </div>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <Link to={`/case-studies/${study.slug}`} className="block h-full rounded-2xl">
      <article className="group flex h-full flex-col">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
            <CardArt study={study} index={index} />
          </div>
        </div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          {study.solution.name}
        </p>
        <div className="flex-1">
          <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-heading">
            {study.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-caption">{study.customer}</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-secondary-100 pt-4">
          <p className="text-xs text-caption">Customer story</p>
          <p className="inline-flex items-center gap-1 text-xs font-medium text-heading transition-colors group-hover:text-primary-500">
            Read case study
            <ArrowForwardIcon style={{ fontSize: 14 }} />
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function CaseStudies() {
  return (
    <>
      {/* Hero */}
      <section className="pb-[72px] pt-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <Eyebrow>Customer outcomes</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[58px]">
            Real results, from{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              real operations.
            </span>
          </h1>
          <p className="mt-10 max-w-xl text-p leading-relaxed text-body">
            A look at how teams are putting Superatom AI to work across
            inventory, procurement, and supply chain decisions.
          </p>
        </div>
      </section>

      {/* Case study cards */}
      <section className="pb-[96px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
