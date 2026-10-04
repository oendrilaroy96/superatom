import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import DemoModal from "./DemoModal";

/** Dark CTA banner shown above the footer on every page. */
export default function CtaSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-secondary-500 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(640px 420px at 15% 20%, rgba(83,58,253,0.3), transparent 60%), radial-gradient(560px 420px at 85% 85%, rgba(255,118,0,0.18), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            theme="dark"
            heading="See how your data can drive faster, smarter decisions."
            description="Get a personalised walkthrough of Superatom AI built around your business, your data and the decisions that matter most to you."
          />

          <Button
            variant="accent"
            iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
            className="mx-auto mt-8"
            onClick={() => setDemoOpen(true)}
          >
            Book your demo
          </Button>

          <p className="mt-6 text-sm text-white/50">
            Decide Fast. Decide Right. Every Time.
          </p>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
