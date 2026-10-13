import { useState, type ReactNode } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SectionHeading from "../components/ui/SectionHeading";
import GlowCard from "../components/ui/GlowCard";
import Button from "../components/ui/Button";
import DemoModal from "../components/DemoModal";
import type { IconComponent } from "../types/icon";
import { useDarkTransition } from "../context/DarkTransitionContext";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

/** Small gradient dash + label, the eyebrow treatment used across the other redesigned pages. */
function Eyebrow({
  children,
  align = "left",
  dark = false,
}: {
  children: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}>
      <span
        className="h-0.5 w-6 shrink-0 rounded-full"
        style={{ backgroundImage: "linear-gradient(90deg, #29b9bb, #533afd)" }}
        aria-hidden="true"
      />
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-700 ease-in-out ${
          dark ? "text-white/60" : "text-caption"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

const industries: { label: string; desc: string; Icon: IconComponent }[] = [
  {
    label: "Retail & CPG",
    desc: "Multi-region distributors rebalancing inventory across stores, DCs, and e-commerce.",
    Icon: StorefrontIcon,
  },
  {
    label: "Logistics & distribution",
    desc: "Network operators cutting stockouts and excess across complex, multi-site footprints.",
    Icon: LocalShippingIcon,
  },
  {
    label: "Pharma & healthcare",
    desc: "Regulated supply chains balancing shelf-life, compliance, and continuity of supply.",
    Icon: LocalHospitalIcon,
  },
  {
    label: "Manufacturing",
    desc: "Production planners aligning raw material, WIP, and finished-goods inventory in real time.",
    Icon: PrecisionManufacturingIcon,
  },
];

export default function CaseStudies() {
  const isDark = useDarkTransition();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="pb-[88px] pt-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <Eyebrow>Customer outcomes</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[58px]">
            Results,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              measured
            </span>
            . Not promised.
          </h1>
          <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-xl text-p leading-relaxed text-body">
              A look at how teams are putting Superatom AI to work across
              inventory, procurement, and supply chain decisions.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-caption">
              In partnership with design partners
            </p>
          </div>
        </div>
      </section>

      {/* In progress notice */}
      <section className="pb-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 rounded-[28px] border border-secondary-100 bg-page p-8 sm:flex-row sm:items-center sm:p-12">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary-500/20 bg-white text-primary-500">
              <ScheduleIcon style={{ fontSize: 26 }} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                We&rsquo;re documenting real engagements as they complete.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
                Superatom AI is live with design partners across retail,
                logistics, pharma, and manufacturing. Published case studies
                follow once results are verified with each partner — we
                won&rsquo;t publish a number we can&rsquo;t stand behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By industry */}
      <section
        className={`py-[120px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow align="center" dark={isDark}>
              Coming soon
            </Eyebrow>
            <SectionHeading
              align="center"
              theme={isDark ? "dark" : "light"}
              heading={
                <span className="lg:whitespace-nowrap">
                  Case studies by industry,
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                    published as they land.
                  </span>
                </span>
              }
              description="Each slot below will link to a published case study as engagements with design partners in that sector complete."
              descriptionClassName="mx-auto max-w-2xl"
            />
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
            {industries.map(({ label, desc, Icon }) => (
              <GlowCard key={label} contentClassName="flex items-start gap-5 p-7">
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-secondary-100 bg-page text-heading">
                  <Icon style={{ fontSize: 22 }} />
                  <span
                    className="absolute -bottom-1.5 left-3 h-[3px] w-[20px] rounded-full"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  />
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-semibold tracking-tight text-heading">
                      {label}
                    </p>
                    <span className="rounded-full bg-primary-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-500">
                      Coming soon
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-caption">{desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>

          <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-5 text-center">
            <p
              className={`max-w-md text-sm leading-relaxed transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/70" : "text-body"
              }`}
            >
              Want to see what Superatom AI could do for your operation before
              the case studies publish?
            </p>
            <Button variant="primary" onClick={() => setDemoOpen(true)}>
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
