import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
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
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                theme="light"
                eyebrow="About Superatom AI"
                eyebrowColor="accent"
                heading={
                  <>
                    Every great outcome starts with{" "}
                    <span className="text-primary-500">a better decision.</span>
                  </>
                }
              />

              <div className="mt-6 space-y-4 text-p text-body">
                <p>
                  The world around us is built from fundamental building
                  blocks. Atoms combine to create molecules, molecules
                  combine to create more complex structures, and together
                  they create everything we see.
                </p>
                <p>We believe enterprises work the same way.</p>
                <p>
                  Behind every supply chain, every operation and every
                  business outcome are thousands of individual decisions:
                  what to buy, what to produce, where to position
                  inventory, which supplier to choose, how much to ship,
                  what price to offer and what action to take next.
                </p>
                <p className="font-semibold text-heading">
                  Superatom AI is built to make those decisions smarter.
                </p>
                <p>
                  We bring together the data, context, intelligence and
                  actions needed to make each decision better, and connect
                  thousands of those decisions into a smarter, more
                  responsive enterprise.
                </p>
              </div>

              <p className="mt-6 font-display text-h3 font-semibold text-primary-500">
                Decide Fast. Decide Right. Every Time.
              </p>
              <p className="mt-2 text-h5 font-semibold uppercase tracking-[0.5px] text-caption">
                That&rsquo;s the idea behind Superatom.
              </p>
            </div>

            {/* Placeholder for the dynamic atoms-to-enterprise diagram from
                the reference design — swap for the real illustration or
                animation once it's built. */}
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-secondary-200 bg-page">
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
                  <AccountTreeIcon style={{ fontSize: 28 }} />
                </span>
                <p className="text-sm font-medium text-caption">
                  Dynamic diagram placeholder
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-3xl sm:mt-32">
            <SectionHeading
              align="left"
              theme="light"
              eyebrow="Our Team"
              eyebrowColor="primary"
              heading={
                <>
                  Experience that understands{" "}
                  <span className="text-primary-500">enterprise.</span>
                </>
              }
            />

            <p className="mt-6 text-p font-semibold text-heading">
              We bring years of enterprise systems building expertise to
              you through Superatom AI.
            </p>

            <div className="mt-4 space-y-4 text-p text-body">
              <p>
                Superatom AI is built by people from successful, large
                scale enterprises such as Blue Yonder, Pine Labs and DHL.
                Together, we bring serial entrepreneurs, product
                innovators, industry experts and proven operators under
                one roof.
              </p>
              <p>
                Our advisory board adds further depth through experienced
                CIOs, CTOs, entrepreneurs and industry leaders.
              </p>
            </div>

            <div className="mt-6 h-0.5 w-24 bg-primary-500" />

            <p className="mt-6 font-display text-h3 font-semibold text-heading">
              Deep experience. Diverse perspectives.
            </p>
            <p className="font-display text-h3 font-semibold text-primary-500">
              One mission: faster decisions at scale.
            </p>
          </div>

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
