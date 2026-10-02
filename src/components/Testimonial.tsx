import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import SectionHeading from "./ui/SectionHeading";

const testimonials: { quote: string; name: string; title: string }[] = [
  {
    quote:
      "[Customer testimonial placeholder — replace with a real quote once available.]",
    name: "Customer A",
    title: "VP of Supply Chain",
  },
  {
    quote:
      "[Customer testimonial placeholder — replace with a real quote once available.]",
    name: "Customer B",
    title: "Director of Operations",
  },
  {
    quote:
      "[Customer testimonial placeholder — replace with a real quote once available.]",
    name: "Customer C",
    title: "Head of Procurement",
  },
];

/** Initials-based placeholder avatar — no real customer photo exists yet. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
      {initials}
    </span>
  );
}

function TestimonialCard({
  t,
  featured = false,
}: {
  t: (typeof testimonials)[number];
  featured?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-white p-7 ${
        featured
          ? "shadow-[0_24px_60px_-20px_rgba(13,23,56,0.25)]"
          : "border border-secondary-100 shadow-sm"
      }`}
    >
      <FormatQuoteRoundedIcon
        className="text-primary-200"
        style={{ fontSize: 40 }}
      />
      <p className="mt-2 flex-1 text-lg font-semibold leading-snug text-heading">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Avatar name={t.name} />
        <div>
          <p className="text-sm font-bold text-heading">{t.name}</p>
          <p className="text-xs text-caption">{t.title}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonial() {
  return (
    <section className="py-16 sm:py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          theme="light"
          eyebrow="Testimonial"
          eyebrowColor="accent"
          heading="Trusted by enterprise supply chain teams"
        />

        {/* Desktop: overlapping stack — the featured card sits in front,
            centered; the other two peek out faded and scaled down behind
            it on either side. */}
        <div className="relative mx-auto mt-20 hidden max-w-5xl sm:block">
          <div className="absolute inset-0 flex items-center justify-between">
            <div className="w-[360px] -translate-y-5 scale-[0.92] opacity-50">
              <TestimonialCard t={testimonials[0]} />
            </div>
            <div className="w-[360px] translate-y-5 scale-[0.92] opacity-50">
              <TestimonialCard t={testimonials[2]} />
            </div>
          </div>
          <div className="relative z-10 mx-auto w-[400px]">
            <TestimonialCard t={testimonials[1]} featured />
          </div>
        </div>

        {/* Mobile: plain stacked cards, no overlap. */}
        <div className="mx-auto mt-10 grid max-w-md gap-6 sm:hidden">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
