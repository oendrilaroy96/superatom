type Stat = {
  label: string;
  value: string;
  desc: string;
};

const stats: Stat[] = [
  {
    label: "Cut application onboarding time by",
    value: "75",
    desc: "Imagine reducing the time required to onboard applications— from 4 weeks to just 1 week for the average application.",
  },
  {
    label: "Reduce professional services cost by",
    value: "97",
    desc: "Free up budget by cutting professional services costs from an average of $15,000 to just $500 per application.",
  },
  {
    label: "Increase compliance with regulations by",
    value: "275",
    desc: "Imagine reducing the time required to onboard applications— from 4 weeks to just 1 week for the average application.",
  },
];

function StatCard({ label, value, desc, className = "" }: Stat & { className?: string }) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-8 ${className}`}
    >
      <div>
        <p className="text-base text-white/80">{label}</p>
        <p className="mt-4 font-display text-[72px] font-medium leading-none sm:text-[92px]">
          <span className="text-white/70">{value}</span>
          <span className="text-primary-300">%</span>
        </p>
      </div>
      <p className="mt-10 text-sm leading-relaxed text-white/60">{desc}</p>
    </div>
  );
}

export default function Achievements() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary-700 via-secondary-800 to-secondary-700 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(900px 600px at 15% 10%, rgba(83,58,253,0.35), transparent 60%), radial-gradient(700px 500px at 90% 90%, rgba(83,58,253,0.25), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-[1] mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <span className="inline-flex rounded-full border border-primary-400/40 bg-primary-900/40 px-5 py-2 text-sm font-medium text-white/90">
          What Customers Achieve
        </span>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:grid-rows-2">
          <StatCard className="lg:row-span-2" {...stats[0]} />
          <StatCard {...stats[1]} />
          <StatCard {...stats[2]} />
        </div>
      </div>
    </section>
  );
}
