import { lazy, Suspense } from "react";
import SectionHeading from "./ui/SectionHeading";

const HowItWorksDiagram = lazy(() => import("./HowItWorksDiagram"));

function DiagramPlaceholder() {
  return (
    <div
      className="mx-auto w-full max-w-[1230px] animate-pulse rounded-2xl border border-secondary-100 bg-white"
      style={{ aspectRatio: "1230 / 350" }}
    />
  );
}

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
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

        <div className="mt-12">
          <Suspense fallback={<DiagramPlaceholder />}>
            <HowItWorksDiagram />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
