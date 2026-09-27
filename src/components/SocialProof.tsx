const ecosystem = ["SAP", "Microsoft Azure", "AWS"];

export default function SocialProof() {
  return (
    <section className="bg-secondary-500 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">
            Customers
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Trusted by enterprise supply chain teams
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-secondary-600 p-8 text-center">
          <p className="text-lg italic text-secondary-100">
            "[Customer testimonial placeholder — replace with a real quote
            once available.]"
          </p>
          <p className="mt-4 text-sm font-semibold text-white">
            Customer name, Title
          </p>
          <p className="text-xs text-secondary-300">Company placeholder</p>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-secondary-300">
            Works with your existing ecosystem
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {ecosystem.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold tracking-tight text-secondary-200"
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
