import SectionHeading from "./ui/SectionHeading";

export default function Testimonial() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          theme="light"
          eyebrow="Testimonial"
          eyebrowColor="accent"
          heading="Trusted by enterprise supply chain teams"
        />

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-secondary-100 bg-white p-8 text-center shadow-sm">
          <p className="text-lg italic text-body">
            "[Customer testimonial placeholder — replace with a real quote
            once available.]"
          </p>
          <p className="mt-4 text-sm font-semibold text-heading">
            Customer name, Title
          </p>
          <p className="text-xs text-caption">Company placeholder</p>
        </div>
      </div>
    </section>
  );
}
