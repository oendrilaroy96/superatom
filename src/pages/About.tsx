import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HubIcon from "@mui/icons-material/Hub";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

const values: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "Decisions over dashboards",
    desc: "We build tools that help teams act on their data, not just look at it.",
    Icon: AutoAwesomeMotionIcon,
  },
  {
    title: "Context is everything",
    desc: "A good decision depends on the context behind it — the tribal knowledge, rules and relationships that live outside the ERP.",
    Icon: PsychologyIcon,
  },
  {
    title: "Built for real complexity",
    desc: "Enterprise supply chains aren't generic. We connect to the systems of record you already run, not a simplified version of them.",
    Icon: HubIcon,
  },
  {
    title: "People stay in the loop",
    desc: "The platform recommends and automates — your team still decides. We design for trust, not black boxes.",
    Icon: GroupsIcon,
  },
];

export default function About() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            align="center"
            className="mx-auto max-w-2xl"
            theme="light"
            eyebrow="About us"
            eyebrowColor="accent"
            heading="Decision intelligence for enterprise supply chains"
            description="Superatom AI connects and synchronizes data across enterprise systems of record and data systems, to create a unified intelligence layer — turning data into decisions your team can actually execute."
          />

          <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-6 sm:mt-20">
            {values.map((v) => (
              <div
                key={v.title}
                className="w-full rounded-lg border border-secondary-100 bg-white p-6 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <v.Icon style={{ fontSize: 22 }} />
                </span>
                <p className="text-h4 mt-4 font-display font-semibold text-heading">
                  {v.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-caption">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-secondary-100 bg-white p-10 text-center shadow-sm sm:mt-20">
            <p className="font-display text-h3 font-semibold text-heading">
              See it on your own data
            </p>
            <p className="mt-2 text-sm text-body">
              Book a demo and we&rsquo;ll walk through how Superatom AI fits
              into your existing systems.
            </p>
            <Button
              variant="primary"
              iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
              className="mx-auto mt-6"
              onClick={() => setDemoOpen(true)}
            >
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
