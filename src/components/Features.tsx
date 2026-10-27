import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TimelineIcon from "@mui/icons-material/Timeline";
import DnsIcon from "@mui/icons-material/Dns";
import PersonIcon from "@mui/icons-material/Person";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GlowCard from "./ui/GlowCard";
import superatomMark from "../assets/superatom-mark.png";

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

// Workflows card: one decision followed from start to finish. It is raised,
// routed to the right person, reviewed and approved, then carried out in the
// customer's existing enterprise systems. `activeStep` cycles through the four
// stages; earlier stages stay lit so the whole path reads left to right.
const WORKFLOW_STEPS = [
  { title: "Decision raised", Icon: null },
  { title: "Routed to the right person", Icon: PersonIcon },
  { title: "Review & approval", Icon: FactCheckIcon },
  { title: "Runs in your systems", Icon: DnsIcon },
] as const;

function WorkflowDetail({ step, reached }: { step: number; reached: boolean }) {
  const base = `transition-opacity duration-500 ${reached ? "opacity-100" : "opacity-40"}`;
  if (step === 0) {
    return (
      <span className={`${base} rounded-md bg-primary-100 px-2 py-1 text-[11px] font-semibold text-primary-600`}>
        Reorder recommended
      </span>
    );
  }
  if (step === 1) return null;
  if (step === 2) {
    return (
      <span className={`${base} inline-flex items-center gap-1.5`}>
        <span className="rounded-md border border-secondary-200 px-2 py-1 text-[10px] font-semibold text-caption">
          Reject
        </span>
        <span className="rounded-md bg-primary-500 px-2 py-1 text-[10px] font-semibold text-white">Approve</span>
      </span>
    );
  }
  return (
    <span className={`${base} inline-flex flex-col items-start gap-1 @min-[460px]:items-center`}>
      <span className="flex gap-1">
        {["ERP", "WMS"].map((system) => (
          <span key={system} className="rounded border border-secondary-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-caption">
            {system}
          </span>
        ))}
      </span>
      <span className="text-[11px] font-medium text-heading">Order created</span>
    </span>
  );
}

function WorkflowDiagram({ activeStep }: { activeStep: number }) {
  return (
    <ol className="grid gap-5 @min-[460px]:grid-cols-4 @min-[460px]:gap-3">
      {WORKFLOW_STEPS.map((step, i) => {
        const active = i === activeStep;
        const done = i < activeStep;
        const last = i === WORKFLOW_STEPS.length - 1;
        return (
          <li
            key={step.title}
            className="relative flex gap-3 @min-[460px]:flex-col @min-[460px]:items-center @min-[460px]:text-center"
          >
            {!last && (
              <>
                {/* vertical connector (stacked layout) */}
                <span
                  className={`absolute left-[17px] top-10 -bottom-5 w-0.5 rounded-full transition-colors duration-500 @min-[460px]:hidden ${
                    done ? "bg-primary-500" : "bg-secondary-100"
                  }`}
                  aria-hidden="true"
                />
                {/* horizontal connector, from this node to the next */}
                <span
                  className={`absolute top-[17px] hidden h-0.5 rounded-full transition-colors duration-500 @min-[460px]:block ${
                    done ? "bg-primary-500" : "bg-secondary-100"
                  }`}
                  style={{ left: "calc(50% + 26px)", right: "calc(26px - 50% - 0.75rem)" }}
                  aria-hidden="true"
                />
              </>
            )}
            <span
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                active
                  ? "scale-110 border-secondary-500 bg-secondary-500 shadow-[0_10px_24px_-10px_rgba(13,23,56,0.5)]"
                  : done
                    ? "border-primary-500 bg-primary-500"
                    : "border-secondary-100 bg-white"
              }`}
            >
              {done ? (
                <CheckIcon style={{ fontSize: 18 }} className="text-white" />
              ) : step.Icon ? (
                <step.Icon style={{ fontSize: 18 }} className={active ? "text-white" : "text-secondary-300"} />
              ) : (
                <img src={superatomMark} alt="" className={`h-5 w-5 object-contain ${active ? "" : "opacity-60"}`} />
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-2 @min-[460px]:items-center">
              <span
                className={`text-xs font-semibold leading-snug transition-colors duration-500 ${
                  active || done ? "text-heading" : "text-caption"
                }`}
              >
                {step.title}
              </span>
              <WorkflowDetail step={i} reached={active || done} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// Optimization Engine card: a handful of options are checked against the
// real-world constraints one by one; the ones that break a constraint are
// ruled out and the best remaining option is recommended.
const OPTIMIZATION_CONSTRAINTS = ["Budget", "Capacity", "Lead time"];
const OPTIMIZATION_OPTIONS = [
  { name: "Option A", note: "Over budget", ok: false },
  { name: "Option B", note: "Best value", ok: true },
  { name: "Option C", note: "Over capacity", ok: false },
];
/** Ticks: 0 idle, 1-3 checking A/B/C, 4 recommendation shown, 5 hold. */
const OPTIMIZATION_TICKS = 6;
const OPTIMIZATION_DONE = 4;

function OptimizationDiagram({ tick }: { tick: number }) {
  const finished = tick >= OPTIMIZATION_DONE;
  return (
    <div className="@container flex flex-col gap-3">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-caption">Real-world constraints</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {OPTIMIZATION_CONSTRAINTS.map((constraint) => (
            <span
              key={constraint}
              className="rounded-full border border-secondary-100 bg-white px-2 py-0.5 text-[10px] font-medium text-heading"
            >
              {constraint}
            </span>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-1.5">
        {OPTIMIZATION_OPTIONS.map((option, i) => {
          const checked = tick >= i + 1;
          const winner = option.ok && finished;
          return (
            <li
              key={option.name}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] transition-all duration-500 ${
                winner
                  ? "border-primary-500 bg-primary-500 text-white shadow-[0_10px_22px_-12px_rgba(83,58,253,0.7)]"
                  : checked && !option.ok
                    ? "border-secondary-100 bg-white/60 text-caption"
                    : "border-secondary-100 bg-white text-heading"
              }`}
            >
              <span
                className={`whitespace-nowrap font-semibold ${
                  checked && !option.ok ? "line-through decoration-secondary-300" : ""
                }`}
              >
                {option.name}
              </span>
              <span className={`ml-auto hidden truncate @min-[200px]:block ${winner ? "text-white/80" : "text-caption"}`}>
                {checked ? option.note : "Checking…"}
              </span>
              <span
                className={`ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-opacity duration-500 @min-[200px]:ml-0 ${
                  checked ? "opacity-100" : "opacity-0"
                } ${winner ? "bg-white text-primary-500" : option.ok ? "bg-primary-100 text-primary-500" : "bg-secondary-100 text-secondary-400"}`}
              >
                {option.ok ? <CheckIcon style={{ fontSize: 11 }} /> : <CloseIcon style={{ fontSize: 10 }} />}
              </span>
            </li>
          );
        })}
      </ul>
      <p
        className={`self-start rounded-full border border-primary-500/20 bg-white px-3 py-1 text-[11px] font-semibold text-primary-500 shadow-sm transition-opacity duration-500 ${
          finished ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!finished}
      >
        Recommended action
      </p>
    </div>
  );
}

// Semantic Modeling card: enterprise data sources stream into the semantic
// model while a ring around it fills one segment per analysis stage (the five
// stages from Superatom's own semantic-modeling writeup). When the ring
// closes, the model is ready to query.
const SEMANTIC_SOURCES = [
  { label: "ERP", color: "#29b9bb" },
  { label: "Databases", color: "#ff7600" },
  { label: "Data lakes", color: "#533afd" },
  { label: "Files", color: "#ff7eb0" },
  { label: "APIs", color: "#873eff" },
];
const SEMANTIC_RING = { cx: 300, cy: 128, r: 58 };
const SEMANTIC_RING_CIRCUMFERENCE = 2 * Math.PI * SEMANTIC_RING.r;
const SEMANTIC_RING_SEGMENT = SEMANTIC_RING_CIRCUMFERENCE / 5;
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

// Generative UI card: a plain-language question is "typed", then the
// component Superatom would pick for that data pattern renders under it,
// following the selection logic from Superatom's own Generative UI writeup
// (categorical → bar, time series → line, part-to-whole → donut, single
// value → KPI card).
const GENERATIVE_EXAMPLES = [
  { question: "Top products by revenue", component: "Bar chart", pattern: "categorical + values" },
  { question: "Revenue trend this year", component: "Line chart", pattern: "time series" },
  { question: "Sales split by channel", component: "Donut chart", pattern: "part-to-whole" },
  { question: "Revenue this quarter", component: "KPI card", pattern: "single value" },
] as const;
const KNOWLEDGE_LEVELS = [
  { n: "01", title: "Institutional Knowledge", text: "Unwritten rules and business definitions." },
  { n: "02", title: "Experiential Knowledge", text: "Lessons from past decisions." },
  { n: "03", title: "Operational Knowledge", text: "How work gets done day to day." },
] as const;
const GENERATIVE_BAR_HEIGHTS = [100, 80, 64, 50, 38, 28];
const GENERATIVE_DONUT = [
  { label: "Online", share: 48, stroke: "stroke-white", dot: "bg-white" },
  { label: "Retail", share: 32, stroke: "stroke-white/60", dot: "bg-white/60" },
  { label: "Partners", share: 20, stroke: "stroke-white/30", dot: "bg-white/30" },
];

/**
 * Bento-style feature grid (moved out of HowItWorks.tsx into its own
 * homepage section). Column/row spans + source order are chosen so CSS
 * Grid's default auto-placement lands every card in the right cell without
 * explicit grid-column/row-start values (4 columns, 4 rows): SOC2 (2x1) +
 * On-Premise (1x1) + Optimization Engine (1x1) fill row 1; Semantic Modeling
 * (2x2) and Enterprise Knowledge (2x2) share rows 2-3; Workflows (2x1) and
 * Generative UI (2x1) fill row 4.
 */
export default function Features() {
  const [activeStep, setActiveStep] = useState(0);
  const [optimizationTick, setOptimizationTick] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? OPTIMIZATION_DONE : 0,
  );
  const [generativeIndex, setGenerativeIndex] = useState(0);
  const generativeExample = GENERATIVE_EXAMPLES[generativeIndex];
  // Reduced-motion users never get the timer below, so start them on the
  // finished state rather than an empty ring.
  const [semanticTick, setSemanticTick] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? SEMANTIC_PHASES.length - 1
      : 0,
  );
  const semanticPhase = SEMANTIC_PHASES[semanticTick];
  const semanticOutputResolved = semanticPhase >= SEMANTIC_STAGES.length;

  // Cycle which workflow step is "running", which question the Generative UI
  // card is answering, and how far the Semantic Modeling pipeline has
  // progressed, so the cards that literally describe automation and dynamic
  // generation visibly demonstrate it rather than sitting static.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stepTimer = setInterval(() => {
      setActiveStep((s) => (s + 1) % WORKFLOW_STEPS.length);
    }, 1800);
    const optimizationTimer = setInterval(() => {
      setOptimizationTick((t) => (t + 1) % OPTIMIZATION_TICKS);
    }, 1000);
    const generativeTimer = setInterval(() => {
      setGenerativeIndex((g) => (g + 1) % GENERATIVE_EXAMPLES.length);
    }, 3600);
    const semanticTimer = setInterval(() => {
      setSemanticTick((t) => (t + 1) % SEMANTIC_PHASES.length);
    }, 700);
    return () => {
      clearInterval(stepTimer);
      clearInterval(optimizationTimer);
      clearInterval(generativeTimer);
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
            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-secondary-500 p-8 sm:col-span-2 lg:col-span-2 ${HOVER_LIFT}`}
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-[length:200%_100%] transition-[background-position] duration-700 group-hover:bg-right"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #ff7600 0%, #533afd 35%, #873eff 55%, #ff7eb0 75%, #ff7600 100%)",
                backgroundPosition: "left",
              }}
            />
            <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col justify-center">
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

          {/* 2. On-Premise Deployment — the Superatom logo continuously travels
              from the left into the client's system, which pulses as it
              lands, to depict Superatom deploying into their environment. */}
          <GlowCard className={HOVER_LIFT} contentClassName="flex h-full flex-col p-6">
            <DashedBox className="relative min-h-[132px] flex-1">
              <p className="absolute left-3 top-3 text-[9px] font-bold uppercase tracking-[0.1em] text-caption">
                Your infrastructure
              </p>
              <div className="relative h-full">
                {/* Where the logo starts: an empty slot that stays put */}
                <div className="absolute left-3 top-1/2 -mt-8 flex w-16 flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-secondary-200" />
                  <span className="text-[10px] font-semibold text-heading">Superatom</span>
                </div>
                <span
                  className="absolute left-[76px] right-[76px] top-1/2 -mt-2.5 h-px bg-secondary-200"
                  aria-hidden="true"
                />
                <div className="absolute right-3 top-1/2 -mt-8 flex w-16 flex-col items-center gap-2">
                  <span className="hiw-deploy-land flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 text-white shadow-sm">
                    <DnsIcon style={{ fontSize: 20 }} />
                  </span>
                  <span className="text-[10px] font-semibold text-heading">Your systems</span>
                </div>
                <span className="hiw-deploy-logo flex h-11 w-11 items-center justify-center rounded-xl border border-secondary-100 bg-white p-2 shadow-sm">
                  <img src={superatomMark} alt="" className="h-full w-full object-contain" />
                </span>
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

          {/* 3. Optimization Engine — options are checked against the
              constraints one by one, then the best feasible one is
              recommended. */}
          <GlowCard className={HOVER_LIFT}>
            <DashedBox className="p-3.5">
              <OptimizationDiagram tick={optimizationTick} />
            </DashedBox>
            <p className="mt-5 font-display text-h3 font-semibold text-heading">
              Optimization Engine
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              The engine recommends the best course of action for complex
              business decisions, within real-world constraints.
            </p>
          </GlowCard>

          {/* 4. Semantic Modeling — spans 2 cols, 2 rows. Sources stream into
              the model while its ring fills one segment per analysis stage;
              once closed, a sample question shows the model is queryable.
              Uses a container query because the card is narrow at some
              desktop widths too, not just on mobile. */}
          <GlowCard className={`sm:col-span-2 lg:col-span-2 lg:row-span-2 ${HOVER_LIFT}`}>
            <DashedBox className="@container">
              <div className="flex flex-col items-center gap-4 p-4 @min-[520px]:flex-row @min-[520px]:gap-0 @min-[520px]:py-6 @min-[520px]:pl-3 @min-[520px]:pr-6">
                <svg
                  viewBox="0 0 380 256"
                  className="w-full max-w-[400px] @min-[520px]:w-[68%] @min-[520px]:max-w-none"
                  aria-hidden="true"
                >
                  {SEMANTIC_SOURCES.map((source, i) => {
                    const y = 32 + i * 48;
                    const width = 20 + source.label.length * 7.6;
                    const pathId = `semantic-src-${i}`;
                    return (
                      <g key={source.label}>
                        <path
                          id={pathId}
                          d={`M ${width + 12} ${y} C 190 ${y}, 200 ${SEMANTIC_RING.cy}, 234 ${SEMANTIC_RING.cy}`}
                          fill="none"
                          strokeWidth={1.2}
                          strokeDasharray="3 5"
                          className="stroke-secondary-300"
                        />
                        <rect
                          x={8}
                          y={y - 14}
                          width={width}
                          height={28}
                          rx={7}
                          strokeDasharray="3 3"
                          className="fill-white stroke-secondary-300"
                        />
                        <text x={18} y={y + 4} className="fill-caption font-mono text-[12px]">
                          {source.label}
                        </text>
                        <circle r={4} fill={source.color} className="motion-reduce:hidden">
                          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`-${i * 0.4}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                        </circle>
                      </g>
                    );
                  })}

                  <g transform={`rotate(-90 ${SEMANTIC_RING.cx} ${SEMANTIC_RING.cy})`}>
                    {SEMANTIC_STAGES.map((stage, i) => (
                      <circle
                        key={stage.label}
                        cx={SEMANTIC_RING.cx}
                        cy={SEMANTIC_RING.cy}
                        r={SEMANTIC_RING.r}
                        fill="none"
                        strokeWidth={7}
                        strokeLinecap="round"
                        strokeDasharray={`${SEMANTIC_RING_SEGMENT - 6} ${SEMANTIC_RING_CIRCUMFERENCE - SEMANTIC_RING_SEGMENT + 6}`}
                        strokeDashoffset={-i * SEMANTIC_RING_SEGMENT}
                        className={`transition-colors duration-500 ${
                          i <= semanticPhase ? "stroke-primary-500" : "stroke-secondary-100"
                        }`}
                      />
                    ))}
                  </g>
                  <circle
                    cx={SEMANTIC_RING.cx}
                    cy={SEMANTIC_RING.cy}
                    r={46}
                    className={`fill-white transition-colors duration-500 ${
                      semanticOutputResolved ? "stroke-primary-500" : "stroke-secondary-100"
                    }`}
                    style={{
                      filter: semanticOutputResolved
                        ? "drop-shadow(0 8px 18px rgba(83,58,253,0.35))"
                        : "none",
                    }}
                  />
                  <text
                    x={SEMANTIC_RING.cx}
                    y={SEMANTIC_RING.cy - 3}
                    textAnchor="middle"
                    className="fill-heading font-display text-[13px] font-bold"
                  >
                    Semantic
                  </text>
                  <text
                    x={SEMANTIC_RING.cx}
                    y={SEMANTIC_RING.cy + 13}
                    textAnchor="middle"
                    className="fill-heading font-display text-[13px] font-bold"
                  >
                    Model
                  </text>
                  <text
                    x={SEMANTIC_RING.cx}
                    y={SEMANTIC_RING.cy + SEMANTIC_RING.r + 28}
                    textAnchor="middle"
                    className="fill-primary-500 text-[11px] font-semibold"
                  >
                    {semanticPhase < 0
                      ? "Connecting sources…"
                      : semanticOutputResolved
                        ? "Model ready"
                        : `${semanticPhase + 1} · ${SEMANTIC_STAGES[semanticPhase].label}`}
                  </text>
                </svg>

                <span
                  className={`hidden h-px w-5 shrink-0 transition-colors duration-500 @min-[520px]:block ${
                    semanticOutputResolved ? "bg-primary-500" : "bg-secondary-200"
                  }`}
                />
                <div
                  className={`w-full max-w-[260px] rounded-xl border bg-white p-3.5 transition-all duration-500 @min-[520px]:w-[32%] @min-[520px]:max-w-none ${
                    semanticOutputResolved
                      ? "border-primary-500 shadow-[0_12px_28px_-14px_rgba(83,58,253,0.45)]"
                      : "border-dashed border-secondary-200 opacity-60"
                  }`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-caption">
                    {semanticOutputResolved ? "Ready to query" : "Building model…"}
                  </p>
                  <p className="mt-2 font-display text-[13px] font-semibold leading-snug text-heading">
                    &ldquo;Which warehouses are low on stock?&rdquo;
                  </p>
                  <p
                    className={`mt-2 text-[11px] font-semibold transition-colors duration-500 ${
                      semanticOutputResolved ? "text-primary-600" : "text-caption"
                    }`}
                  >
                    Ask in plain language &rarr;
                  </p>
                </div>
              </div>
            </DashedBox>
            <p className="mt-5 font-display text-h3 font-semibold text-heading">
              Semantic Modelling
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Superatom unifies data from your ERPs, databases, data
              lakes, files, and APIs. It analyzes structures,
              relationships, patterns, and business context to build a unified
              semantic model of your business in 3 days instead of 3–6 months.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary-500/15 bg-primary-100/50 px-3 py-1.5">
              <span className="text-[11px] font-medium text-caption line-through decoration-secondary-300">
                3–6 months
              </span>
              <span className="text-[11px] text-primary-400" aria-hidden="true">
                &rarr;
              </span>
              <span className="text-[11px] font-bold text-primary-600">
                3 days to model
              </span>
            </div>
          </GlowCard>

          {/* Enterprise Knowledge — spans 2 cols, 2 rows. The three levels of
              knowledge Superatom captures sit in their own rows so the
              longer copy has room instead of being squeezed into one cell. */}
          <GlowCard className={`sm:col-span-2 lg:col-span-2 lg:row-span-2 ${HOVER_LIFT}`} contentClassName="flex h-full flex-col p-6 sm:p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
              <AutoStoriesIcon style={{ fontSize: 22 }} />
            </span>
            <p className="mt-4 font-display text-h3 font-semibold text-heading">
              Enterprise Knowledge
            </p>
            <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-caption">
              Every business has knowledge built over years of experience, much
              of it held by people who understand its processes, exceptions, and
              ways of working. Superatom captures and operationalizes this
              knowledge across three levels:
            </p>
            <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
              {KNOWLEDGE_LEVELS.map((level) => (
                <div
                  key={level.n}
                  className="flex items-start gap-4 rounded-xl border border-secondary-100 bg-white px-4 py-4 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-100/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 font-display text-[12px] font-bold text-primary-500">
                    {level.n}
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-heading">{level.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-caption">{level.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* 6. Workflows — spans 2 cols. Steps auto-cycle to show the
              pipeline actually running. */}
          <GlowCard
            className={`sm:col-span-2 lg:col-span-2 ${HOVER_LIFT}`}
            contentClassName="flex h-full flex-col gap-6 p-6"
          >
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <TimelineIcon style={{ fontSize: 22 }} />
              </span>
              <p className="mt-4 font-display text-h3 font-semibold text-heading">
                Workflows
              </p>
              <p className="mt-2 text-sm leading-relaxed text-caption">
                Superatom turns decisions into action through your existing
                enterprise systems, routing each decision to the right person
                for review and approval.
              </p>
            </div>
            <DashedBox className="@container px-4 py-5">
              <WorkflowDiagram activeStep={activeStep} />
            </DashedBox>
          </GlowCard>

          {/* 7. Generative UI — spans 2 cols, gradient card. A question is typed, then the
              component suited to its data pattern renders beneath it. Each
              example remounts via `key`, replaying the CSS entrance
              animations (see .genui-* in index.css). */}
          <div
            className={`group relative overflow-hidden rounded-2xl p-6 sm:col-span-2 lg:col-span-2 ${HOVER_LIFT}`}
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
            <div
              key={generativeIndex}
              className="@container flex h-[176px] flex-col rounded-xl border border-dashed border-white/30 bg-white/10 p-3"
            >
              {/* Question input. mr-8 keeps it clear of the + button. */}
              <div className="mr-8 flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5">
                <span className="genui-type line-clamp-2 text-[11px] font-medium leading-snug text-white">
                  {generativeExample.question}
                </span>
                <span className="hiw-caret shrink-0" style={{ background: "#fff", height: 12 }} />
              </div>

              <div className="mt-3 min-h-0 flex-1" aria-hidden="true">
                {generativeExample.component === "Bar chart" && (
                  <div className="flex h-full items-end gap-1.5">
                    {GENERATIVE_BAR_HEIGHTS.map((h, i) => (
                      <span
                        key={h}
                        className="genui-grow flex-1 rounded-t-md bg-white"
                        style={{ height: `${h}%`, opacity: 1 - i * 0.12, "--d": `${0.7 + i * 0.06}s` } as CSSProperties}
                      />
                    ))}
                  </div>
                )}

                {generativeExample.component === "Line chart" && (
                  <svg viewBox="-4 -4 208 78" preserveAspectRatio="none" className="h-full w-full">
                    <polygon
                      points="0,58 33,50 66,54 100,36 133,30 166,18 200,10 200,70 0,70"
                      className="genui-fade-up fill-white/15"
                      style={{ "--d": "1s" } as CSSProperties}
                    />
                    <polyline
                      points="0,58 33,50 66,54 100,36 133,30 166,18 200,10"
                      pathLength={1}
                      fill="none"
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="genui-draw stroke-white"
                      style={{ "--d": "0.7s" } as CSSProperties}
                    />
                  </svg>
                )}

                {generativeExample.component === "Donut chart" && (
                  <div className="flex h-full items-center gap-3 @min-[220px]:gap-4">
                    <svg viewBox="0 0 60 60" className="genui-fade-up h-full max-h-[76px] shrink-0" style={{ "--d": "0.7s" } as CSSProperties}>
                      <g transform="rotate(-90 30 30)">
                        {GENERATIVE_DONUT.reduce<{ start: number; els: ReactNode[] }>(
                          (acc, seg) => {
                            acc.els.push(
                              <circle
                                key={seg.label}
                                cx={30}
                                cy={30}
                                r={22}
                                fill="none"
                                strokeWidth={9}
                                pathLength={100}
                                strokeDasharray={`${seg.share - 3} ${100 - seg.share + 3}`}
                                strokeDashoffset={-acc.start}
                                className={seg.stroke}
                              />,
                            );
                            acc.start += seg.share;
                            return acc;
                          },
                          { start: 0, els: [] },
                        ).els}
                      </g>
                    </svg>
                    <div className="flex flex-col gap-1.5">
                      {GENERATIVE_DONUT.map((seg, i) => (
                        <div
                          key={seg.label}
                          className="genui-fade-up flex items-center gap-1.5"
                          style={{ "--d": `${0.9 + i * 0.1}s` } as CSSProperties}
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${seg.dot}`} />
                          <span className="text-[11px] font-medium text-white/85">{seg.label}</span>
                          <span className="hidden text-[11px] text-white/60 @min-[220px]:inline">
                            {seg.share}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generativeExample.component === "KPI card" && (
                  <div
                    className="genui-fade-up flex h-full flex-col justify-center rounded-lg bg-white/15 px-3"
                    style={{ "--d": "0.7s" } as CSSProperties}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/70">
                      Revenue
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-[28px] font-bold leading-none text-white">$2.4M</span>
                      <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        +12%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p
                className="genui-fade-up mt-2.5 text-[10px] text-white/75"
                style={{ "--d": "1.1s" } as CSSProperties}
              >
                <span className="font-semibold text-white">&rarr; {generativeExample.component}</span>
                <span className="hidden @min-[220px]:inline"> · {generativeExample.pattern}</span>
              </p>
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
