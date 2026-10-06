import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import DemoModal from "./DemoModal";

/** Dark CTA banner shown above the footer on every page. */
export default function CtaSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="py-[120px]">
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-[1300px] text-center">
          <SectionHeading
            align="center"
            theme="dark"
            eyebrow="Get Started"
            eyebrowColor="accent"
            className="mx-auto max-w-[820px]"
            heading={
              <>
                See how your data can drive faster,
                <br />
                smarter decisions.
              </>
            }
            description="Get a personalised walkthrough of Superatom AI built around your business, your data and the decisions that matter most to you."
            descriptionClassName="mx-auto max-w-xl"
          />

          <Button
            variant="accentOutline"
            iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
            className="mx-auto mt-8 font-semibold"
            onClick={() => setDemoOpen(true)}
          >
            Book your demo
          </Button>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
