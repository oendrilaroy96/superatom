import SectionHeading from "./ui/SectionHeading";

const ecosystem = ["SAP", "Microsoft Azure", "AWS"];

export default function Customers() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          eyebrow="Customers"
          heading="Works with your existing ecosystem"
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {ecosystem.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-caption"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
