import { useState } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Slide = {
  quote: string;
  name: string;
  role: string;
  metric: string;
  metricLabel: string;
};

// Bracketed placeholder copy throughout — swap in real customer testimonials
// as they become available. Four slots to match the carousel's pagination.
const slides: Slide[] = Array.from({ length: 4 }, () => ({
  quote:
    "[Customer quote. One or two sentences about the decision Superatom helped them make, and what changed.]",
  name: "[Full name]",
  role: "[Role], [Company]",
  metric: "[X%]",
  metricLabel: "[Outcome metric]",
}));

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <section className="bg-[#f5f5ff] py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-5xl rounded-2xl border border-secondary-100 bg-[#fcfcff] p-8 shadow-[0_30px_60px_-30px_rgba(13,23,56,0.15)] sm:p-12">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-500">
              What Teams Say
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                disabled={index === 0}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-secondary-200 text-secondary-300 transition-colors enabled:hover:border-primary-300 enabled:hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeftIcon style={{ fontSize: 20 }} />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % slides.length)}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white transition-transform duration-200 hover:scale-105"
              >
                <ChevronRightIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto_260px]">
            <div>
              <FormatQuoteIcon style={{ fontSize: 44 }} className="text-primary-500" />
              <p className="mt-4 font-display text-h2 font-semibold leading-snug text-heading">
                {slide.quote}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-primary-300 bg-primary-100 text-[10px] font-semibold uppercase tracking-wide text-primary-500">
                  Photo
                </span>
                <div>
                  <p className="text-sm font-semibold text-heading">{slide.name}</p>
                  <p className="text-sm text-caption">{slide.role}</p>
                </div>
              </div>
            </div>

            <div className="hidden border-l border-dashed border-secondary-200 lg:block" />

            <div className="flex flex-col justify-center gap-5">
              <div>
                <p className="font-display text-[48px] font-bold leading-none text-primary-500">
                  {slide.metric}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-caption">
                  {slide.metricLabel}
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-secondary-200 px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-caption">
                [Company logo]
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary-500" : "w-4 bg-secondary-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
