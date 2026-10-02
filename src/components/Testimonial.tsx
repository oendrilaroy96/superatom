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

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-lg border border-secondary-100 bg-white p-8 text-center shadow-sm"
            >
              <p className="text-lg italic text-body">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-heading">
                {t.name}
              </p>
              <p className="text-xs text-caption">{t.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
