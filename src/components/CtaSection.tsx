import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import DemoModal from "./DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";

/** CTA banner shown above the footer on every page; crossfades from the testimonial section's light lavender to dark in sync with the shared scroll threshold. */
export default function CtaSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const isDark = useDarkTransition();

  return (
    <section
      className={`relative overflow-hidden py-[120px] transition-colors duration-700 ease-in-out ${
        isDark ? "bg-secondary-500" : "bg-[#f5f5ff]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(640px 420px at 15% 12%, rgba(83,58,253,0.3), transparent 55%), radial-gradient(640px 480px at 85% 48%, rgba(255,118,0,0.18), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-[1300px] text-center">
          <SectionHeading
            align="center"
            theme={isDark ? "dark" : "light"}
            eyebrow="Get Started"
            eyebrowColor="accent"
            className="mx-auto max-w-[960px]"
            heading={
              <>
                See how your data can drive
                <br />
                faster, smarter decisions.
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
