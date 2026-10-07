import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import DemoModal from "./DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";

/**
 * CTA banner shown above the footer on every page; crossfades from the
 * testimonial section's light lavender to dark in sync with the shared
 * scroll threshold. In the dark state this section turns transparent rather
 * than painting its own bg-secondary-500, so the dark fill behind it and the
 * footer's is the same single paint — two independently painted instances
 * of the "same" flat color can render a couple of RGB units apart (visible
 * as a faint seam) due to how the browser composites and dithers separate
 * layers, even though both declare the identical Tailwind color.
 */
export default function CtaSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const isDark = useDarkTransition();

  return (
    <section
      className={`relative overflow-hidden py-[120px] transition-colors duration-700 ease-in-out ${
        isDark ? "bg-transparent" : "bg-[#f5f5ff]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(1300px 860px at 15% 12%, rgba(83,58,253,0.3), transparent 55%), radial-gradient(1100px 760px at 88% 92%, rgba(255,118,0,0.22), transparent 55%)",
          // Fade the glow in from the top and back out at the bottom so it
          // doesn't start or stop abruptly at the seams with the flat dark
          // fills of the testimonial section above and the footer below.
          // Both radial gradients share this one mask, so the new
          // bottom-right glow gets the same seamless fade for free.
          maskImage:
            "linear-gradient(180deg, transparent 0, white 200px, white calc(100% - 200px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0, white 200px, white calc(100% - 200px), transparent 100%)",
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
