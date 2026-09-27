const ecosystem = ["SAP", "Microsoft Azure", "AWS"];

export default function SocialProof() {
  return (
    <section className="bg-[#0a1929] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Customers
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Trusted by enterprise supply chain teams
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-[#0f2942] p-8 text-center">
          <p className="text-lg italic text-slate-300">
            "[Customer testimonial placeholder — replace with a real quote
            once available.]"
          </p>
          <p className="mt-4 text-sm font-semibold text-white">
            Customer name, Title
          </p>
          <p className="text-xs text-slate-400">Company placeholder</p>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Works with your existing ecosystem
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {ecosystem.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold tracking-tight text-slate-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
