import { useEffect, useRef, useState } from "react";
import {
  MdForum,
  MdPsychology,
  MdBarChart,
  MdHub,
  MdRecommend,
  MdAutorenew,
  MdArrowForward,
} from "react-icons/md";
import type { IconType } from "react-icons";
import SectionHeading from "./ui/SectionHeading";

const enterpriseSystems = ["ERP", "APS", "WMS", "TMS", "MES", "CRM", "IoT", "Data Lake"];

const coreCapabilities: { name: string; Icon: IconType }[] = [
  { name: "Conversation Agents", Icon: MdForum },
  { name: "AI & Domain Intelligence", Icon: MdPsychology },
  { name: "Analytics & Optimization", Icon: MdBarChart },
  { name: "Knowledge Graph", Icon: MdHub },
  { name: "Recommendation Engine", Icon: MdRecommend },
];

const decisionMakers = [
  "Recommendations & Actions",
  "Business, Operations & IT Teams",
  "Automation Actions",
];

const steps = [
  {
    n: 1,
    title: "Enterprise Data",
    desc: "Connect data from your existing systems (ERP, APS, WMS, TMS, MES, CRM, IoT and data lakes).",
  },
  {
    n: 2,
    title: "Enterprise Context",
    desc: "Enrich with business context, rules, policies, constraints and domain knowledge.",
  },
  {
    n: 3,
    title: "Decision Engine",
    desc: "Apply AI, analytics, simulation and optimization to evaluate alternatives and identify the best course of action.",
  },
  {
    n: 4,
    title: "Recommendation",
    desc: "Generate clear, explainable recommendations — what to do, where, when and why.",
  },
  {
    n: 5,
    title: "Human Approval",
    desc: "Enable human-in-the-loop for oversight, judgment and governance.",
  },
  {
    n: 6,
    title: "Automation",
    desc: "Execute approved decisions through workflows, agents and system integrations.",
  },
];

function useScrollReveal<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const SYSTEMS_STAGGER = 55;
const SYSTEMS_END = enterpriseSystems.length * SYSTEMS_STAGGER;
const ARROW1_DELAY = SYSTEMS_END + 150;
const BOX_DELAY = SYSTEMS_END + 250;
const CAPS_STAGGER = 80;
const CAPS_START = BOX_DELAY + 150;
const CAPS_END = CAPS_START + coreCapabilities.length * CAPS_STAGGER;
const ARROW2_DELAY = CAPS_END + 100;
const MAKERS_START = CAPS_END + 200;
const MAKERS_STAGGER = 90;
const MAKERS_END = MAKERS_START + decisionMakers.length * MAKERS_STAGGER;

function FlowDiagram() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-secondary-100 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.3fr_auto_1fr] lg:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Enterprise Systems
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enterpriseSystems.map((s, i) => (
              <span
                key={s}
                className="rounded-md border border-secondary-100 bg-page px-2 py-1 text-xs font-medium text-body transition-all duration-500 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-10px)",
                  transitionDelay: `${i * SYSTEMS_STAGGER}ms`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Arrow active={visible} delay={ARROW1_DELAY} />

        <div
          className="rounded-xl bg-secondary-500 p-4 transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.94)",
            transitionDelay: `${BOX_DELAY}ms`,
          }}
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <span
              className="flex h-5 w-5 items-center justify-center rounded bg-accent-500 text-[10px] text-secondary-800"
              style={visible ? { animation: "pulse-dot 2.2s ease-in-out infinite" } : undefined}
            >
              ●
            </span>
            Superatom AI
          </p>
          <ul className="space-y-2">
            {coreCapabilities.map((c, i) => (
              <li
                key={c.name}
                className="flex items-center gap-2 text-xs text-secondary-100 transition-all duration-400 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-8px)",
                  transitionDelay: `${CAPS_START + i * CAPS_STAGGER}ms`,
                }}
              >
                <c.Icon size={14} className="shrink-0" />
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        <Arrow active={visible} delay={ARROW2_DELAY} />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Decision Makers
          </p>
          <div className="space-y-2">
            {decisionMakers.map((label, i) => (
              <div
                key={label}
                className="rounded-md border border-secondary-100 bg-page px-3 py-2 text-xs font-medium text-body transition-all duration-500 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(10px)",
                  transitionDelay: `${MAKERS_START + i * MAKERS_STAGGER}ms`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0, transitionDelay: `${MAKERS_END}ms` }}
      >
        <MdAutorenew
          size={14}
          aria-hidden="true"
          className={visible ? "animate-spin-slow" : ""}
        />
        Continuous Learning
      </p>
    </div>
  );
}

function Arrow({ active, delay = 0 }: { active: boolean; delay?: number }) {
  return (
    <svg
      className="hidden h-4 w-8 overflow-visible text-secondary-300 lg:block"
      viewBox="0 0 32 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 8h28m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: active ? 0 : 1,
          transition: `stroke-dashoffset 550ms ease-out ${delay}ms`,
        }}
      />
      {active && (
        <circle
          r="1.6"
          fill="var(--color-primary-500)"
          className="flow-dot"
          style={{ animationDelay: `${delay + 550}ms` }}
        />
      )}
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          eyebrow="How It Works"
          heading={
            <>
              From enterprise data to{" "}
              <span className="text-primary-500">better decisions.</span>
            </>
          }
          description="Superatom AI brings together your enterprise data, business context, rules and AI to help teams make, execute and continuously improve thousands of decisions — every day."
        />

        <div className="mt-12">
          <FlowDiagram />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                {step.n}
              </div>
              <p className="text-h4 mt-3 font-display font-semibold text-heading">
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-caption">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <span
                  className="absolute right-[-12px] top-4 hidden text-secondary-300 lg:block"
                  aria-hidden="true"
                >
                  <MdArrowForward size={14} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
