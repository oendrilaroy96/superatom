import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "../components/ui/Button";
import DemoModal from "../components/DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";
import { caseStudies, getCaseStudy } from "../lib/caseStudies";
import NotFound from "./NotFound";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

function PanelLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? "text-white/60" : "text-caption"}`}>
      {children}
    </p>
  );
}

export default function CaseStudyDetail() {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);
  const isDark = useDarkTransition();
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    if (!study) return;
    const previous = document.title;
    document.title = `${study.title} | Superatom AI`;
    return () => {
      document.title = previous;
    };
  }, [study]);

  if (!study) return <NotFound />;

  const others = caseStudies.filter((s) => s.slug !== study.slug);

  return (
    <>
      {/* Dark hero: the header reads its id to switch to its dark look while this is on screen. */}
      <header
        id="article-dark-zone"
        className="relative overflow-hidden bg-secondary-700 pb-24 pt-12 sm:pb-28"
        style={{
          backgroundImage:
            "radial-gradient(900px 400px at 80% -10%, rgba(83,58,253,0.45), transparent 60%), radial-gradient(700px 360px at 0% 110%, rgba(255,118,0,0.22), transparent 60%)",
        }}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowBackIcon style={{ fontSize: 16 }} />
              All case studies
            </Link>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                {study.industry}
              </span>
              <Link
                to={study.solution.path}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 transition-colors hover:text-white"
              >
                {study.solution.name}
                <ArrowForwardIcon style={{ fontSize: 12 }} />
              </Link>
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-[36px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[48px] lg:text-[56px]">
              {study.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary-200">
              <span className="font-semibold text-white">Customer: </span>
              {study.customer}
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-14 max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {study.figures.items.map((item) => (
              <li
                key={item.label}
                className={`rounded-[20px] border border-secondary-100 bg-white p-5 shadow-[0_12px_32px_-16px_rgba(13,23,56,0.25)] ${
                  study.figures.items.length === 1 ? "col-span-2 sm:col-span-3 lg:col-span-3" : ""
                }`}
              >
                <p
                  className="bg-clip-text font-display text-[30px] font-bold leading-none tracking-tight text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {item.value}
                </p>
                <p className="mt-2.5 text-[13px] leading-snug text-caption">{item.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-caption">
            {study.figures.kind === "Scale" ? "Scale of the operation" : "Headline result"}
          </p>
        </div>
      </div>

      <section className="pb-[96px] pt-12">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-[24px] border border-secondary-100 bg-page p-7 sm:p-8">
                <PanelLabel>The challenge</PanelLabel>
                <ul className="mt-5 space-y-3.5">
                  {study.challenge.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] bg-secondary-500 p-7 sm:p-8">
                <PanelLabel dark>Results</PanelLabel>
                <ul className="mt-5 space-y-3.5">
                  {study.results.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/90">
                      <CheckCircleIcon style={{ fontSize: 20, color: "#22d3ee" }} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[24px] border border-secondary-100 bg-white p-7 sm:p-8 lg:col-span-7">
              <PanelLabel>The solution</PanelLabel>
              <ul className="mt-5 space-y-6">
                {study.approach.map((step) => (
                  <li key={step.lead ?? step.text} className="flex gap-4">
                    <span
                      className="mt-2 h-2 w-5 shrink-0 rounded-full"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                      aria-hidden="true"
                    />
                    <div>
                      {step.lead && (
                        <p className="font-display text-lg font-semibold leading-snug tracking-tight text-heading">
                          {step.lead}
                        </p>
                      )}
                      <p className={`text-[15px] leading-relaxed ${step.lead ? "mt-1.5 text-body" : "text-heading"}`}>
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More case studies + call to action; fades to dark in step with the page's dark footer block. */}
      <section
        className={`py-[96px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-6xl">
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/60" : "text-caption"
              }`}
            >
              More case studies
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={`/case-studies/${other.slug}`}
                    className={`group flex h-full items-center gap-4 rounded-2xl border p-5 transition-colors duration-300 ${
                      isDark
                        ? "border-white/10 hover:border-white/30 hover:bg-white/5"
                        : "border-secondary-100 bg-white hover:border-primary-200 hover:bg-page"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-primary-500">
                        {other.industry}
                      </span>
                      <span
                        className={`mt-1.5 block font-display text-base font-semibold leading-snug transition-colors duration-700 ease-in-out ${
                          isDark ? "text-white" : "text-heading"
                        }`}
                      >
                        {other.title}
                      </span>
                    </span>
                    <ArrowForwardIcon style={{ fontSize: 18 }} className="shrink-0 text-primary-500" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-16 flex flex-col items-center gap-5 text-center">
              <h2
                className={`font-display text-[32px] font-semibold leading-[1.15] tracking-tight transition-colors duration-700 ease-in-out sm:text-[40px] ${
                  isDark ? "text-white" : "text-heading"
                }`}
              >
                See what Superatom AI could do for yours.
              </h2>
              <p
                className={`max-w-md text-sm leading-relaxed transition-colors duration-700 ease-in-out ${
                  isDark ? "text-white/70" : "text-body"
                }`}
              >
                Book a short demo to see how it works on inventory and procurement decisions like these.
              </p>
              <Button variant="primary" onClick={() => setDemoOpen(true)}>
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
