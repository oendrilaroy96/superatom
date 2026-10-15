import { useEffect, useState, type ReactNode } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import DnsIcon from "@mui/icons-material/Dns";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GlowCard from "./ui/GlowCard";
import superatomMark from "../assets/Superatom Logo/LogoMark1.png";

/** Lift + shadow a card gets on hover, shared by every tile in the grid below. */
const HOVER_LIFT =
  "transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(13,23,56,0.25)]";

/** Dashed-border mockup box with a faint dot-grid background, used inside the feature cards below for their mini illustrations. */
function DashedBox({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-secondary-200 ${className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(13,23,56,0.12) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      {children}
    </div>
  );
}

function FlowStep({
  tag,
  tagClassName,
  label,
  active = false,
}: {
  tag: string;
  tagClassName: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-500 ${
        active
          ? "scale-[1.03] border-secondary-500 bg-secondary-500 shadow-[0_10px_24px_-10px_rgba(13,23,56,0.4)]"
          : "border-secondary-100 bg-white"
      }`}
    >
      <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${tagClassName}`}>
        {tag}
      </span>
      <span className={`text-xs font-medium ${active ? "text-white" : "text-heading"}`}>
        {label}
      </span>
    </div>
  );
}

const WORKFLOW_STEPS = [
  { tag: "RUN", label: "Repeatable analysis" },
  { tag: "ACT", label: "Automated actions" },
  { tag: "SEND", label: "Right people, right time" },
];

const GENERATIVE_BAR_COUNT = 5;

// Semantic Modeling card: mirrors the "How It Works" diagram from
// Superatom's own semantic-modeling writeup — scattered enterprise data
// sources run through a five-stage analysis pipeline and resolve into one
// semantic model, rather than an arbitrary made-up example.
const SEMANTIC_SOURCES = ["ERP", "databases", "warehouses", "files", "APIs"];
const SEMANTIC_STAGES: { label: string }[] = [
  { label: "Schema analysis" },
  { label: "Sample extraction" },
  { label: "Statistical profiling" },
  { label: "Domain classification" },
  { label: "Query generation" },
];
// Drives the build-up animation: -1 = idle, 0-4 = that pipeline stage
// running (and the matching source "being read"), 5 (held) = the pipeline
// has finished and the semantic model output is resolved, before the cycle
// resets and runs again.
const SEMANTIC_PHASES = [-1, 0, 1, 2, 3, 4, 5, 5, 5] as const;

// The Generative UI card cycles through a few different kinds of output
// (bar chart, pie chart, plain text) to show that the UI can render whatever
// shape fits the question, not just charts.
const GENERATIVE_MODES = ["bars", "pie", "text"] as const;
type GenerativeMode = (typeof GENERATIVE_MODES)[number];
const GENERATIVE_MODE_LABEL: Record<GenerativeMode, string> = {
  bars: "Bar chart",
  pie: "Pie chart",
  text: "Generated summary",
};
const PIE_SEGMENTS: { label: string; className: string }[] = [
  { label: "Retail", className: "bg-white" },
  { label: "Pharma", className: "bg-white/55" },
  { label: "Logistics", className: "bg-white/25" },
];

/**
 * Bento-style feature grid (moved out of HowItWorks.tsx into its own
 * homepage section). Column/row spans + source order are chosen so CSS
 * Grid's default auto-placement lands every card in the right cell without
 * explicit grid-column/row-start values: SOC2 (2x1) + On-Premise (1x1) +
 * Tribal (1x1) fill row 1; Semantic Modeling (2x2) starts row 2 and
 * reserves cols 1-2 through row 3; Workflows (2x1) then auto-fills cols
 * 3-4 of row 2; Optimization Engine and Generative UI (1x1 each) fill
 * cols 3-4 of row 3.
 */
export default function Features() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeBar, setActiveBar] = useState(3);
  const [generativeModeIndex, setGenerativeModeIndex] = useState(0);
  const generativeMode = GENERATIVE_MODES[generativeModeIndex];
  const [semanticTick, setSemanticTick] = useState(0);
  const semanticPhase = SEMANTIC_PHASES[semanticTick];
  const semanticOutputResolved = semanticPhase >= SEMANTIC_STAGES.length;
  const semanticProgress = semanticPhase < 0
    ? 0
    : semanticOutputResolved
      ? 1
      : semanticPhase / (SEMANTIC_STAGES.length - 1);

  // Cycle which workflow step is "running", which generated-UI panel bar is
  // "active", which kind of output the Generative UI card is showing, and
  // how far the Semantic Modeling pipeline has progressed, so the
  // cards that literally describe automation and dynamic generation
  // visibly demonstrate it rather than sitting static.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stepTimer = setInterval(() => {
      setActiveStep((s) => (s + 1) % WORKFLOW_STEPS.length);
    }, 1600);
    const barTimer = setInterval(() => {
      setActiveBar((b) => (b + 1) % GENERATIVE_BAR_COUNT);
    }, 1100);
    const modeTimer = setInterval(() => {
      setGenerativeModeIndex((m) => (m + 1) % GENERATIVE_MODES.length);
    }, 2800);
    const semanticTimer = setInterval(() => {
      setSemanticTick((t) => (t + 1) % SEMANTIC_PHASES.length);
    }, 700);
    return () => {
      clearInterval(stepTimer);
      clearInterval(barTimer);
      clearInterval(modeTimer);
      clearInterval(semanticTimer);
    };
  }, []);

  return (
    // Transparent through the first 70% (so the page-wide decorative grid
    // from Layout.tsx stays visible behind the cards), then transitions to
    // the Customers section's background color by the bottom, so the grid
    // fades out gradually instead of being hard-covered.
    <section
      className="relative overflow-hidden py-[120px]"
      style={{
        backgroundImage: "linear-gradient(to bottom, transparent 70%, #f5f5ff 100%)",
      }}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. SOC 2 & ISO Ready — dark hero card */}
          <div
            className={`group relative overflow-hidden rounded-2xl bg-secondary-500 p-8 sm:col-span-2 lg:col-span-2 ${HOVER_LIFT}`}
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-[length:200%_100%] transition-[background-position] duration-700 group-hover:bg-right"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #ff7600 0%, #533afd 35%, #873eff 55%, #ff7eb0 75%, #ff7600 100%)",
                backgroundPosition: "left",
              }}
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-400">
                  <ShieldIcon style={{ fontSize: 20 }} className="text-accent-400" />
                </span>
                <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-400">
                  Enterprise &amp; Compliance
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#29b9bb] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#29b9bb]" />
                  </span>
                  <span className="text-xs font-medium text-white/80">
                    Continuous testing &amp; monitoring
                  </span>
                </div>
                <p className="mt-4 font-display text-h3 font-semibold text-white">
                  SOC 2 &amp; ISO Ready
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Built with rigorous security architecture that combines
                  automated controls and monitoring with independent
                  third-party verification.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-6 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <div className="transition-transform duration-300 group-hover:translate-x-1">
                  <p className="font-display text-[44px] font-bold leading-none text-white lg:text-[36px] xl:text-[56px]">
                    SOC 2
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                    Type II Compliant
                  </p>
                </div>
                <div className="transition-transform delay-75 duration-300 group-hover:translate-x-1">
                  <p className="font-display text-[44px] font-bold leading-none text-white lg:text-[36px] xl:text-[56px]">
                    27001
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/40">
                    ISO 27001
                    <br />
                    2022 certified
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. On-Premise Deployment — a dot continuously travels from the
              Superatom mark to the client's system, landing with a small
              pulse, to depict Superatom deploying into their environment. */}
          <GlowCard className={HOVER_LIFT} contentClassName="p-6">
            <DashedBox className="relative h-[132px]">
              <p className="absolute left-3 top-3 text-[9px] font-bold uppercase tracking-[0.1em] text-caption">
                Your infrastructure
              </p>
              <div className="flex h-full items-center justify-center gap-4 px-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-secondary-100 bg-white p-2 shadow-sm">
                    <img src={superatomMark} alt="" className="h-full w-full object-contain" />
                  </span>
                  <span className="text-[10px] font-semibold text-heading">Superatom</span>
                </div>
                <div className="relative h-px w-14 shrink-0 bg-secondary-200 sm:w-20">
                  <span className="hiw-deploy-dot" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="hiw-deploy-land flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 text-white shadow-sm">
                    <DnsIcon style={{ fontSize: 20 }} />
                  </span>
                  <span className="text-[10px] font-semibold text-heading">Your systems</span>
                </div>
              </div>
            </DashedBox>
            <p className="mt-5 font-display text-h3 font-semibold text-heading">
              On-Premise Deployment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Superatom is built to work within your infrastructure with
              access control to your data &amp; systems.
            </p>
          </GlowCard>

          {/* 3. Tribal Knowledge — each row highlights on its own hover */}
          <GlowCard className={HOVER_LIFT}>
            <div className="flex items-start justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-500">
                Captured Context
              </p>
              <AutoStoriesIcon style={{ fontSize: 20 }} className="text-primary-500" />
            </div>
            <p className="mt-2 font-display text-h3 font-semibold text-heading">
              Tribal Knowledge
            </p>
            <div className="mt-4 divide-y divide-secondary-100 rounded-lg border border-secondary-100">
              {[
                { n: "01", label: "Unwritten rules" },
                { n: "02", label: "Past lessons" },
                { n: "03", label: "Operational realities" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors duration-200 hover:bg-primary-100"
                >
                  <span className="font-display text-[11px] font-semibold text-primary-400">
                    {item.n}
                  </span>
                  <span className="text-sm font-medium text-heading">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-caption">
              Answers that reflect how the business truly works.
            </p>
          </GlowCard>

          {/* 4. Semantic Modeling — spans 2 cols, 2 rows. Mirrors Superatom's
              own "How It Works" diagram for this capability: scattered
              enterprise data sources run through a five-stage analysis
              pipeline and resolve into one semantic model. */}
          <GlowCard className={`sm:col-span-2 lg:col-span-2 lg:row-span-2 ${HOVER_LIFT}`}>
            <DashedBox className="relative h-auto overflow-hidden sm:h-[230px] lg:h-[260px]">
              <div className="flex h-full flex-col justify-center gap-8 p-6 sm:p-8">
                {/* Input / output bookends */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-secondary-300 bg-white text-caption">
                      <DnsIcon style={{ fontSize: 16 }} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-heading">5 source types</p>
                      <p className="text-[10px] text-caption">{SEMANTIC_SOURCES.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p
                        className={`text-xs font-semibold transition-colors duration-500 ${
                          semanticOutputResolved ? "text-heading" : "text-caption"
                        }`}
                      >
                        Semantic Model
                      </p>
                      <p className="text-[10px] text-caption">Unified understanding</p>
                    </div>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${
                        semanticOutputResolved
                          ? "scale-105 bg-primary-500 text-white shadow-[0_10px_24px_-8px_rgba(83,58,253,0.6)]"
                          : "bg-secondary-100 text-caption"
                      }`}
                    >
                      <HubIcon style={{ fontSize: 16 }} />
                    </span>
                  </div>
                </div>

                {/* Five-stage progress stepper */}
                <div>
                  <div className="relative flex items-center justify-between px-1">
                    <div className="absolute left-1 right-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-secondary-100" />
                    <div
                      className="absolute left-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${semanticProgress * 100}%` }}
                    />
                    {SEMANTIC_STAGES.map((stage, i) => {
                      const done = i <= semanticPhase || semanticOutputResolved;
                      const active = i === semanticPhase && !semanticOutputResolved;
                      return (
                        <span
                          key={stage.label}
                          className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-500 ${
                            done
                              ? "border-primary-500 bg-primary-500 text-white"
                              : "border-secondary-200 bg-white text-caption"
                          } ${active ? "scale-125" : ""}`}
                        >
                          {i + 1}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold text-heading transition-opacity duration-300">
                    {semanticPhase < 0
                      ? "Awaiting data…"
                      : semanticOutputResolved
                        ? "Pipeline complete"
                        : SEMANTIC_STAGES[semanticPhase].label}
                  </p>
                </div>
              </div>
            </DashedBox>
            <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-500">
              Five-Stage Pipeline
            </p>
            <p className="mt-2 font-display text-h3 font-semibold text-heading">
              Semantic Modeling
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Schema analysis, sampling, statistical profiling, domain
              classification, and query generation turn ERPs, databases,
              warehouses, files, and APIs into one queryable semantic model.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary-500/15 bg-primary-100/50 px-3 py-1.5">
              <span className="text-[11px] font-medium text-caption line-through decoration-secondary-300">
                3–6 months
              </span>
              <span className="text-[11px] text-primary-400" aria-hidden="true">
                &rarr;
              </span>
              <span className="text-[11px] font-bold text-primary-600">
                ~2 days to model
              </span>
            </div>
          </GlowCard>

          {/* 5. Workflows — spans 2 cols. Steps auto-cycle to show the
              pipeline actually running. */}
          <GlowCard
            className={`sm:col-span-2 lg:col-span-2 ${HOVER_LIFT}`}
            contentClassName="flex flex-col gap-6 p-6 sm:flex-row sm:items-center"
          >
            <div className="sm:flex-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <TimelineIcon style={{ fontSize: 22 }} />
              </span>
              <p className="mt-4 font-display text-h3 font-semibold text-heading">
                Workflows
              </p>
              <p className="mt-2 text-sm leading-relaxed text-caption">
                Automate repeatable analysis and actions to deliver the right
                insights to the right people at the right time.
              </p>
            </div>
            <DashedBox className="p-4 sm:w-[260px]">
              <div className="flex flex-col gap-3">
                {WORKFLOW_STEPS.map((step, i) => (
                  <FlowStep
                    key={step.tag}
                    tag={step.tag}
                    label={step.label}
                    active={i === activeStep}
                    tagClassName={
                      i === activeStep
                        ? "bg-accent-500 text-white"
                        : "bg-primary-100 text-primary-500"
                    }
                  />
                ))}
              </div>
            </DashedBox>
          </GlowCard>

          {/* 6. Optimization Engine — recommended path wins over two
              considered-and-rejected branches, with a live pulsing check. */}
          <GlowCard className={HOVER_LIFT}>
            <DashedBox className="relative h-[150px]">
              <div className="absolute bottom-[20px] left-[44px] right-[84px] top-[20px] rounded-md border border-dashed border-secondary-200" />
              <div className="absolute left-[16px] right-[44px] top-1/2 h-0.5 -translate-y-1/2 bg-primary-500" />
              <span className="absolute left-[10px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-secondary-500" />
              <span className="absolute right-[84px] top-[20px] flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-300">
                <CloseIcon style={{ fontSize: 10 }} />
              </span>
              <span className="absolute bottom-[20px] right-[84px] flex h-4 w-4 translate-x-[-50%] translate-y-1/2 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-300">
                <CloseIcon style={{ fontSize: 10 }} />
              </span>
              <span className="absolute right-[10px] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-40" />
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-[0_0_0_6px_rgba(83,58,253,0.15)]">
                  <CheckIcon style={{ fontSize: 16 }} />
                </span>
              </span>
              <span className="absolute left-1/2 top-[64%] -translate-x-1/2 whitespace-nowrap rounded-full border border-secondary-100 bg-white px-3 py-1 text-xs font-semibold text-primary-500 shadow-sm">
                Recommended
              </span>
            </DashedBox>
            <p className="mt-5 font-display text-h3 font-semibold text-heading">
              Optimization Engine
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              The engine recommends the best course of action for complex
              business decisions, within real-world constraints.
            </p>
          </GlowCard>

          {/* 7. Generative UI — gradient card. The mini panel cycles through
              a few different output shapes (bars, a pie, plain text) to show
              the UI renders whatever fits the question, not just charts. */}
          <div
            className={`group relative overflow-hidden rounded-2xl p-6 ${HOVER_LIFT}`}
            style={{
              background:
                "linear-gradient(135deg, #533afd 0%, #873eff 40%, #ff7eb0 75%, #ff7600 100%)",
            }}
          >
            <button
              type="button"
              aria-label="Expand"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:rotate-90"
            >
              <AddIcon style={{ fontSize: 18 }} />
            </button>
            <div className="relative h-[120px] overflow-hidden rounded-xl border border-dashed border-white/30 bg-white/10 p-3">
              <span className="absolute right-3 top-2 text-[9px] font-bold uppercase tracking-[0.08em] text-white/50">
                {GENERATIVE_MODE_LABEL[generativeMode]}
              </span>

              {generativeMode === "bars" && (
                <div className="flex h-full items-end gap-2">
                  {Array.from({ length: GENERATIVE_BAR_COUNT }).map((_, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-md transition-all duration-500 ${
                        i === activeBar ? "h-9 bg-white" : "h-7 bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              )}

              {generativeMode === "pie" && (
                <div className="flex h-full items-center gap-4">
                  <span
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-white/30"
                    style={{
                      background:
                        "conic-gradient(#fff 0% 45%, rgba(255,255,255,0.55) 45% 75%, rgba(255,255,255,0.25) 75% 100%)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1.5">
                    {PIE_SEGMENTS.map((seg) => (
                      <div key={seg.label} className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${seg.className}`} />
                        <span className="text-[11px] font-medium text-white/80">{seg.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generativeMode === "text" && (
                <div className="flex h-full flex-col justify-center gap-2.5">
                  <span className="h-2 w-11/12 rounded-full bg-white/80" />
                  <span className="h-2 w-full rounded-full bg-white/50" />
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-1/2 rounded-full bg-white/80" />
                    <span className="hiw-caret" style={{ background: "#fff" }} />
                  </div>
                </div>
              )}
            </div>
            <p className="mt-5 font-display text-h3 font-semibold text-white">
              Generative UI
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              User interfaces are dynamically generated based on context,
              significantly reducing cognitive overhead when exploring complex
              data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
