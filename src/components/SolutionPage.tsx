import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { IconComponent } from "../types/icon";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import DemoModal from "./DemoModal";

export type SolutionFeature = { title: string; desc: string; Icon: IconComponent };

type SolutionPageProps = {
  Icon: IconComponent;
  eyebrow: string;
  heading: string;
  description: string;
  features: SolutionFeature[];
};

export default function SolutionPage({
  Icon,
  eyebrow,
  heading,
  description,
  features,
}: SolutionPageProps) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
              <Icon style={{ fontSize: 28 }} />
            </span>
            <SectionHeading
              align="center"
              theme="light"
              eyebrow={eyebrow}
              eyebrowColor="primary"
              heading={heading}
              description={description}
            />
            <Button
              variant="primary"
              iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
              className="mx-auto mt-8 shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)]"
              onClick={() => setDemoOpen(true)}
            >
              Book a demo
            </Button>
          </div>

          <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-6 sm:mt-20">
            {features.map((f) => (
              <div
                key={f.title}
                className="w-full rounded-lg border border-secondary-100 bg-white p-6 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <f.Icon style={{ fontSize: 22 }} />
                </span>
                <p className="text-h4 mt-4 font-display font-semibold text-heading">
                  {f.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-caption">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
