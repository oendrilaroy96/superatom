import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GlowCard from "./ui/GlowCard";

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

/** A labeled dot chip, absolutely positioned around DashedBox's hub in the Semantic Modeling card. Scales up slightly on hover. */
function Node({
  className,
  color,
  label,
}: {
  className: string;
  color: string;
  label: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-1.5 rounded-full border border-secondary-100 bg-white px-2.5 py-1.5 shadow-sm transition-transform duration-300 hover:z-10 hover:scale-110 hover:shadow-md ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-xs font-medium text-heading">{label}</span>
    </div>
  );
}

/** A dot traveling from the hub to a node along a given direction; purely CSS-driven (see .hiw-node-pulse in index.css) so it animates continuously without JS. */
function PulseDot({ tx, ty, delay }: { tx: string; ty: string; delay: string }) {
  return (
    <span
      className="hiw-node-pulse"
      style={{ "--tx": tx, "--ty": ty, "--delay": delay } as CSSProperties}
    />
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

  // Cycle which workflow step is "running" and which generated-UI panel is
  // "active", so the two cards that literally describe automation and
  // dynamic generation visibly demonstrate it rather than sitting static.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stepTimer = setInterval(() => {
      setActiveStep((s) => (s + 1) % WORKFLOW_STEPS.length);
    }, 1600);
    const barTimer = setInterval(() => {
      setActiveBar((b) => (b + 1) % GENERATIVE_BAR_COUNT);
    }, 1100);
    return () => {
      clearInterval(stepTimer);
      clearInterval(barTimer);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-[120px]">
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
                  Security &amp; Compliance
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
                  Enterprise-grade security controls with ISO 27001:2022 and SOC 2
                  Type I compliance, with continuous testing and monitoring.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-6 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <div className="transition-transform duration-300 group-hover:translate-x-1">
                  <p className="font-display text-[34px] font-bold leading-none text-white">
                    SOC 2
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                    Type I Compliance
                  </p>
                </div>
                <div className="transition-transform delay-75 duration-300 group-hover:translate-x-1">
                  <p className="font-display text-[34px] font-bold leading-none text-white">
                    27001
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                    ISO 27001:2022
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. On-Premise Deployment — placeholder rows fill in automatically on a loop */}
          <GlowCard className={HOVER_LIFT} contentClassName="group/card p-6">
            <DashedBox className="h-[132px]">
              <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-accent-500 text-white shadow-sm transition-transform duration-300 group-hover/card:-rotate-6 group-hover/card:scale-110">
                <LockIcon style={{ fontSize: 15 }} />
              </span>
              <div className="mx-auto flex h-full max-w-[220px] flex-col justify-center gap-2.5 px-4">
                {[
                  { color: "#29b9bb", w: "w-3/4" },
                  { color: "#29b9bb", w: "w-2/3" },
                  { color: "#b9c4e8", w: "w-4/5" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: row.color }}
                    />
                    <span
                      className={`hiw-bar-fill h-2 rounded-full bg-secondary-100 ${row.w}`}
                      style={{ "--delay": `${i * 0.35}s` } as CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </DashedBox>
            <p className="mt-5 font-display text-h3 font-semibold text-heading">
              On-Premise Deployment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Deploy the platform within existing infrastructure to keep data
              in-house and retain complete control over access and security.
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

          {/* 4. Semantic Modeling — spans 2 cols, 2 rows. Dots continuously
              travel from the hub to each node to suggest live data flow. */}
          <GlowCard className={`sm:col-span-2 lg:col-span-2 lg:row-span-2 ${HOVER_LIFT}`}>
            <DashedBox className="group/diagram relative h-[260px] lg:h-[300px]">
              <div className="absolute left-1/2 top-[48px] h-[calc(100%-96px)] w-px -translate-x-1/2 border-l border-dashed border-secondary-300" />
              <div className="absolute left-[90px] right-[90px] top-1/2 h-px -translate-y-1/2 border-t border-dashed border-secondary-300" />
              <PulseDot tx="0px" ty="-76px" delay="0s" />
              <PulseDot tx="-130px" ty="0px" delay="0.6s" />
              <PulseDot tx="130px" ty="0px" delay="1.2s" />
              <PulseDot tx="0px" ty="76px" delay="1.8s" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-primary-500 text-white shadow-[0_12px_30px_-8px_rgba(83,58,253,0.6)] transition-transform duration-500 group-hover/diagram:scale-110 group-hover/diagram:rotate-12">
                <HubIcon style={{ fontSize: 24 }} />
              </span>
              <Node className="left-1/2 top-[22px] -translate-x-1/2" color="#29b9bb" label="CRM" />
              <Node className="left-[14px] top-1/2 -translate-y-1/2" color="#ff7600" label="ERP" />
              <Node
                className="right-[14px] top-1/2 -translate-y-1/2"
                color="#ff7eb0"
                label="Warehouse"
              />
              <Node
                className="bottom-[22px] left-1/2 -translate-x-1/2"
                color="#873eff"
                label="Spreadsheets"
              />
            </DashedBox>
            <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-500">
              One Unified Graph
            </p>
            <p className="mt-2 font-display text-h3 font-semibold text-heading">
              Semantic Modeling
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Automatically connects and models relationships across multiple
              enterprise data systems, creating a unified graph of your business.
            </p>
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

          {/* 7. Generative UI — gradient card, one panel cycles "active" to
              demonstrate the UI regenerating itself */}
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
            <div className="flex h-[88px] items-end gap-2 rounded-xl border border-dashed border-white/30 bg-white/10 p-3">
              {Array.from({ length: GENERATIVE_BAR_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-md transition-all duration-500 ${
                    i === activeBar ? "h-9 bg-white" : "h-7 bg-white/25"
                  }`}
                />
              ))}
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
