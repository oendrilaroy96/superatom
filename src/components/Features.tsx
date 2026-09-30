import { useEffect, useRef, useState } from "react";
import DnsIcon from "@mui/icons-material/Dns";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import TuneIcon from "@mui/icons-material/Tune";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { IconComponent } from "../types/icon";

const features: { title: string; desc: string; Icon: IconComponent }[] = [
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

/**
 * The section's own background eases from the page's light background to
 * the site's dark navy as it scrolls into view (and back on the way out),
 * so the theme change reads as automatic rather than a hard cut at the
 * section boundary.
 */
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden py-24 transition-colors duration-700 ease-out sm:py-28 ${
        inView ? "bg-secondary-500" : "bg-page"
      }`}
    >
      <div className="relative z-[2] mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-accent-400">
            Features
          </p>
          <h2 className="mt-3 font-display text-[28px] font-semibold text-white sm:text-h2">
            Everything the platform brings together
          </h2>
          <p className="text-p mt-4 text-white/65">
            From secure, on-premise deployment to the AI modules that turn
            enterprise data into decisions — all built in.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-white/10 bg-secondary-600 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-400/20 text-primary-300">
                <f.Icon style={{ fontSize: 22 }} />
              </span>
              <p className="text-h4 mt-4 font-display font-semibold text-white">
                {f.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
