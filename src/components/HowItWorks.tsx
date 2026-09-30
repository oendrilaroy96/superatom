import { lazy, Suspense } from "react";
import SectionHeading from "./ui/SectionHeading";

const HowItWorksDiagram = lazy(() => import("./HowItWorksDiagram"));

function DiagramPlaceholder() {
  return (
    <div className="min-h-[820px] w-full animate-pulse rounded-2xl bg-page sm:min-h-[900px] xl:min-h-[520px]" />
  );
}

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-[120px]">
      <div className="px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          eyebrow="Beyond BI Tools"
          heading={
            <>
              From enterprise data to{" "}
              <span className="text-primary-500">better decisions.</span>
            </>
          }
          description="Superatom AI brings together your enterprise data, business context, rules and AI to help teams make, execute and continuously improve thousands of decisions — every day."
        />
      </div>

      {/* Full-bleed, no width cap: the diagram sets its own responsive side
          padding, so it isn't nested inside the section's own px-* wrapper
          (that would stack both paddings and leave it confined to a narrow
          strip on wide screens). */}
      <div className="mt-12">
        <Suspense fallback={<DiagramPlaceholder />}>
          <HowItWorksDiagram />
        </Suspense>
      </div>
    </section>
  );
}
