const satellites = [
  { label: "Demand", sub: "Sense. Predict. Respond.", top: "6%", left: "58%" },
  { label: "Procurement", sub: "Source. Plan. Mitigate.", top: "20%", left: "86%" },
  { label: "Manufacturing", sub: "Plan. Produce. Adapt.", top: "56%", left: "90%" },
  { label: "Logistics", sub: "Move. Optimize. Deliver.", top: "82%", left: "68%" },
  { label: "Inventory", sub: "Optimize. Rebalance. Prevent.", top: "78%", left: "18%" },
];

const stats = [
  { label: "Faster decisions" },
  { label: "Lower costs" },
  { label: "Better service levels" },
  { label: "A more resilient supply chain" },
];

function HubGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="42" fill="url(#hub-glow)" />
        {satellites.map((s, i) => (
          <line
            key={s.label}
            x1="50"
            y1="50"
            x2={s.left}
            y2={s.top}
            stroke="#22d3ee"
            strokeOpacity="0.35"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-8"
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#0f2942] to-[#0a1929] text-center shadow-[0_0_60px_-10px_rgba(34,211,238,0.5)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="7" cy="7" r="2.4" fill="white" />
            <circle cx="17" cy="7" r="1.6" fill="white" fillOpacity="0.85" />
            <circle cx="7" cy="17" r="1.6" fill="white" fillOpacity="0.85" />
            <circle cx="17" cy="17" r="2.4" fill="white" />
          </svg>
        </span>
        <p className="mt-2 text-xs font-semibold text-white">Superatom AI</p>
        <p className="text-[10px] text-cyan-300">Better Decisions Every Day</p>
      </div>

      {satellites.map((s) => (
        <div
          key={s.label}
          className="absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#0f2942]/90 px-3 py-2 shadow-lg backdrop-blur"
          style={{ top: s.top, left: s.left }}
        >
          <p className="text-xs font-semibold text-white">{s.label}</p>
          <p className="text-[10px] text-slate-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a1929]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Decision Intelligence for the Supply Chain
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Decision Intelligence for the{" "}
            <span className="text-cyan-400">Supply Chain.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-300">
            Make, automate and execute thousands of better decisions across
            the supply chain.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#0a1929] transition-colors hover:bg-cyan-300"
            >
              Explore the Platform →
            </a>
            <a
              href="#"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              Book a Demo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <p key={s.label} className="text-sm font-medium text-slate-300">
                {s.label}
              </p>
            ))}
          </div>
        </div>

        <HubGraphic />
      </div>
    </section>
  );
}
