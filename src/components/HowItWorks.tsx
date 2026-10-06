import { lazy, Suspense } from "react";
import DnsIcon from "@mui/icons-material/Dns";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import TuneIcon from "@mui/icons-material/Tune";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { IconComponent } from "../types/icon";
import SectionHeading from "./ui/SectionHeading";

const HowItWorksDiagram = lazy(() => import("./HowItWorksDiagram"));

const points: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "On-Premise Deployment",
    desc: "Deploy the platform within existing infrastructure to keep data in-house and retain complete control over access and security.",
    Icon: DnsIcon,
  },
  {
    title: "SOC 2 & ISO Ready",
    desc: "Enterprise-grade security controls with ISO 27001:2022 and SOC 2 Type I compliance, with continuous testing and monitoring.",
    Icon: ShieldIcon,
  },
  {
    title: "Tribal Knowledge",
    desc: "Capture unwritten rules, past lessons and operational realities to deliver answers that reflect how the business truly works.",
    Icon: AutoStoriesIcon,
  },
  {
    title: "Semantic Modeling",
    desc: "Automatically connects and models relationships across multiple enterprise data systems, creating a unified graph of your business.",
    Icon: HubIcon,
  },
  {
    title: "Workflows",
    desc: "Automate repeatable analysis and actions to deliver the right insights to the right people at the right time.",
    Icon: TimelineIcon,
  },
  {
    title: "Optimization Engine",
    desc: "The engine recommends the best course of action for complex business decisions, within real-world constraints.",
    Icon: TuneIcon,
  },
  {
    title: "Generative UI",
    desc: "User interfaces are dynamically generated based on context, significantly reducing cognitive overhead when exploring complex data.",
    Icon: AutoAwesomeIcon,
  },
];

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
          heading={
            <>
              Beyond BI Tools to{" "}
              <span className="text-primary-500">Super Intelligence.</span>
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

      <div className="mx-auto mt-20 max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="flex flex-wrap justify-center gap-6">
          {points.map((p) => (
            <div
              key={p.title}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
              }}
              className="group relative w-full rounded-lg border border-secondary-100 bg-white p-6 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              {/* Gradient spotlight that follows the cursor, masked down to
                  just the 1px border ring (not a fill) via the padding +
                  mask-composite:exclude trick, so only the outline glows. */}
              <div
                className="pointer-events-none absolute -inset-px z-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  padding: 1,
                  background:
                    "radial-gradient(110px circle at var(--x, 50%) var(--y, 50%), #29b9bb 0%, #486ffd 20%, #533afd 40%, #873eff 60%, #ff7eb0 80%, #ff7600 100%, transparent 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <div className="relative z-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <p.Icon style={{ fontSize: 22 }} />
                </span>
                <p className="text-h4 mt-4 font-display font-semibold text-heading">
                  {p.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-caption">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
