import { useDarkTransition } from "../context/DarkTransitionContext";

const testimonial = {
  quote:
    "[Customer quote. One or two sentences about the decision Superatom helped them make.]",
  name: "[Full name]",
  role: "[Role], [Company]",
};

/** Minimal, centered pull-quote testimonial; crossfades from light to dark in sync with the shared scroll threshold. */
export default function Testimonial() {
  const isDark = useDarkTransition();

  return (
    <section
      className={`py-[140px] transition-colors duration-700 ease-in-out ${
        isDark ? "bg-secondary-500" : "bg-[#f5f5ff]"
      }`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-700 ease-in-out ${
              isDark ? "text-primary-300" : "text-primary-500"
            }`}
          >
            From Our Customers
          </p>
          <p
            className={`mt-6 font-display text-[28px] font-bold leading-[1.3] transition-colors duration-700 ease-in-out sm:text-[34px] lg:text-[40px] lg:leading-[1.25] ${
              isDark ? "text-white" : "text-heading"
            }`}
          >
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div
            className="mx-auto mt-8 h-[3px] w-24 rounded-full"
            style={{
              backgroundImage: "linear-gradient(90deg, #533afd, #873eff, #ff7eb0, #ff7600)",
            }}
            aria-hidden="true"
          />
          <p className="mt-8 text-sm">
            <span
              className={`font-semibold transition-colors duration-700 ease-in-out ${
                isDark ? "text-white" : "text-heading"
              }`}
            >
              {testimonial.name}
            </span>
            <span
              className={`mx-2 transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/30" : "text-secondary-200"
              }`}
            >
              &bull;
            </span>
            <span
              className={`transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/50" : "text-caption"
              }`}
            >
              {testimonial.role}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
