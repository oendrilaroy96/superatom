import SectionHeading from "./ui/SectionHeading";

const enterpriseSystems = ["ERP", "APS", "WMS", "TMS", "MES", "CRM", "IoT", "Data Lake"];

const coreCapabilities = [
  { name: "Conversation Agents", icon: "💬" },
  { name: "AI & Domain Intelligence", icon: "🧠" },
  { name: "Analytics & Optimization", icon: "📊" },
  { name: "Knowledge Graph", icon: "🗂" },
  { name: "Recommendation Engine", icon: "✅" },
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

function FlowDiagram() {
  return (
    <div className="rounded-2xl border border-secondary-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.3fr_auto_1fr] lg:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Enterprise Systems
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enterpriseSystems.map((s) => (
              <span
                key={s}
                className="rounded-md border border-secondary-100 bg-page px-2 py-1 text-xs font-medium text-body"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Arrow />

        <div className="rounded-xl bg-secondary-500 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-accent-500 text-[10px] text-secondary-800">
              ●
            </span>
            Superatom AI
          </p>
          <ul className="space-y-2">
            {coreCapabilities.map((c) => (
              <li
                key={c.name}
                className="flex items-center gap-2 text-xs text-secondary-100"
              >
                <span className="text-sm">{c.icon}</span>
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        <Arrow />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Decision Makers
          </p>
          <div className="space-y-2">
            <div className="rounded-md border border-secondary-100 bg-page px-3 py-2 text-xs font-medium text-body">
              Recommendations &amp; Actions
            </div>
            <div className="rounded-md border border-secondary-100 bg-page px-3 py-2 text-xs font-medium text-body">
              Business, Operations &amp; IT Teams
            </div>
            <div className="rounded-md border border-secondary-100 bg-page px-3 py-2 text-xs font-medium text-body">
              Automation Actions
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted">
        <span aria-hidden="true">↻</span> Continuous Learning
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      className="hidden h-4 w-8 text-secondary-300 lg:block"
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
      />
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
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
