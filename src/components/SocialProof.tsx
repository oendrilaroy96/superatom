const ecosystem = ["SAP", "Microsoft Azure", "AWS"];

export default function SocialProof() {
  return (
    <section className="bg-secondary-500 py-16 sm:py-20">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-accent-400">
            Customers
          </p>
          <h2 className="mt-3 font-display text-[22px] font-bold text-white sm:text-h2">
            Trusted by enterprise supply chain teams
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-white/10 bg-secondary-600 p-8 text-center">
          <p className="text-lg italic text-white/75">
            "[Customer testimonial placeholder — replace with a real quote
            once available.]"
          </p>
          <p className="mt-4 text-sm font-semibold text-white">
            Customer name, Title
          </p>
          <p className="text-xs text-white/60">Company placeholder</p>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="text-h5 text-center font-semibold uppercase tracking-[0.5px] text-white/60">
            Works with your existing ecosystem
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {ecosystem.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold tracking-tight text-white/75"
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
