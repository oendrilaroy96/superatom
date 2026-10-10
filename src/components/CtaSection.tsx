import { useState } from "react";
import { useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DemoModal from "./DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";

type Office = {
  country: string;
  city: string;
  address: string[];
};

const offices: Office[] = [
  {
    country: "USA",
    city: "Denver, Colorado",
    address: ["12873 W Harvard Ave", "Denver, CO 80228, US"],
  },
  {
    country: "India",
    city: "Hyderabad, Telangana",
    address: [
      "Trendz Inspire, Kavuri Hills Rd, CBI Colony",
      "Madhapur, Hyderabad, Telangana 500033",
    ],
  },
];

function OfficeCard({ office }: { office: Office }) {
  return (
    // Fixed dark bg (not a translucent white overlay) so this card and its
    // light text stay legible even while the section itself is in its light
    // (pre-scroll) crossfade state.
    <div className="rounded-2xl border border-white/10 bg-secondary-600 p-7">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-300">
          {office.country}
        </p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-primary-300">
          <LocationOnIcon style={{ fontSize: 18 }} />
        </span>
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-white">{office.city}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/50">
        {office.address.map((line, i) => (
          <span key={i}>
            {line}
            {i < office.address.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * CTA banner shown above the footer on every page: a dark gradient card with
 * the demo CTA, paired with the company's office locations. The section's
 * own background crossfades from light to dark in sync with the shared
 * scroll threshold, while the dark card and office cards keep their fixed
 * styling throughout — the same pattern as the testimonial's quote card
 * staying light regardless of its section background. The light stage
 * matches whatever section sits right above it on that page: the
 * testimonial section's lavender on the home page, but the About page's
 * team section instead crossfades through its own plain page background,
 * so this follows suit there rather than introducing a mismatched tint.
 */
export default function CtaSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const isDark = useDarkTransition();
  const isAboutPage = useLocation().pathname === "/about";

  return (
    <section
      id="cta-section"
      className={`transition-colors duration-700 ease-in-out py-[120px] ${
        isDark ? "bg-transparent" : isAboutPage ? "bg-page" : "bg-[#f5f5ff]"
      }`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 p-10 sm:p-12">
            {/* No z-index here (relies on DOM order, painted before the
                content below): a negative z-index on a child of this
                position:relative div, which itself doesn't establish its own
                stacking context, escapes to the nearest ancestor that does —
                rendering behind the section's own background instead of
                staying within this card. That was invisible while the
                section was always dark, but shows as a transparent card once
                the section gets an opaque light background in its own
                crossfade. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(900px 560px at 10% 0%, rgba(83,58,253,0.45), transparent 60%)",
                backgroundColor: "var(--color-secondary-600)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 top-0 h-[3px] blur-[1px]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, #533afd 20%, #873eff 40%, #ff7eb0 60%, #ff7600 80%, transparent)",
              }}
              aria-hidden="true"
            />

            {/* relative z-10: plain static in-flow content (no position set)
                always paints *below* positioned siblings with z-index:auto —
                like the two absolute glow/line divs above — regardless of
                DOM order. Without its own stacking layer, this content would
                render but be completely covered by the opaque glow div. */}
            <div className="relative z-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Decision Intelligence
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[28px] font-semibold leading-[1.2] text-white sm:text-[34px] lg:text-[40px] lg:leading-[1.15]">
                See how your data can drive faster, smarter decisions.
              </h2>
              <p className="mt-4 max-w-lg text-p text-white/60">
                Get a personalised walkthrough of Superatom AI built around your business, your data
                and the decisions that matter most to you.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Book a demo
                  <ArrowForwardIcon style={{ fontSize: 18 }} />
                </button>
                <a
                  href="mailto:contact@superatom.ai"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
                >
                  contact@superatom.ai
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {offices.map((office) => (
              <OfficeCard key={office.country} office={office} />
            ))}
          </div>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
