import { useEffect, useRef, useState } from "react";
import { MdShield, MdLock, MdStorage, MdVpnKey } from "react-icons/md";
import type { IconType } from "react-icons";

const features: { title: string; desc: string; Icon: IconType }[] = [
  {
    title: "Security & Compliance",
    desc: "Enterprise-grade security controls with ISO 27001:2022 and SOC 2 Type I compliance, with continuous testing and monitoring.",
    Icon: MdShield,
  },
  {
    title: "End-to-End Encryption",
    desc: "Protect your data throughout its lifecycle with encryption in transit and at rest.",
    Icon: MdLock,
  },
  {
    title: "Data Privacy & Control",
    desc: "Maintain full control over your data, decisions and outputs with role-based access and governance controls.",
    Icon: MdStorage,
  },
  {
    title: "Enterprise SSO",
    desc: "SAML, OIDC and Active Directory integration for seamless and secure access across your organization.",
    Icon: MdVpnKey,
  },
];

const LAYERS = ["Secure", "Governed", "Scalable", "Reliable"];
const OUTCOMES = ["People", "Data", "Decisions", "A stronger tomorrow"];

const VB_W = 600;
const VB_H = 300;
const STACK_TOP = 20;
const STACK_W = 250;
const CAP_H = 46;
const LAYER_H = 44;
const LAYER_GAP = 9;
const STACK_RIGHT = STACK_W;
const STACK_CENTER_Y =
  STACK_TOP + (CAP_H + LAYER_GAP + LAYERS.length * (LAYER_H + LAYER_GAP)) / 2;
const OUTCOME_X = VB_W - 14;
const OUTCOME_YS = [40, 112, 184, 262];

function InfrastructureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[560px]"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {OUTCOMES.map((o, i) => {
          const y = OUTCOME_YS[i];
          const midX = (STACK_RIGHT + OUTCOME_X) / 2;
          const d = `M${STACK_RIGHT} ${STACK_CENTER_Y} C ${midX} ${STACK_CENTER_Y}, ${midX} ${y}, ${OUTCOME_X - 10} ${y}`;
          return (
            <path
              key={o}
              d={d}
              fill="none"
              stroke="var(--color-secondary-200)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              pathLength={1}
              style={{
                strokeDashoffset: visible ? 0 : 1,
                transition: `stroke-dashoffset 0.9s ease ${0.15 * i + 0.25}s`,
              }}
            />
          );
        })}
        {OUTCOMES.map((o, i) => (
          <circle
            key={o}
            cx={OUTCOME_X - 10}
            cy={OUTCOME_YS[i]}
            r={4}
            fill="var(--color-primary-400)"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.4s ease ${0.15 * i + 0.9}s`,
            }}
          />
        ))}
      </svg>

      <div
        className="absolute flex flex-col justify-between text-right"
        style={{ top: STACK_TOP + 2, right: 0, height: 264, width: 175 }}
      >
        {OUTCOMES.map((o, i) => (
          <span
            key={o}
            className="whitespace-nowrap text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-caption"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(8px)",
              transition: `opacity 0.5s ease ${0.15 * i + 0.9}s, transform 0.5s ease ${0.15 * i + 0.9}s`,
            }}
          >
            {o}
          </span>
        ))}
      </div>

      <div
        className="absolute left-0 flex flex-col items-stretch"
        style={{ top: STACK_TOP, width: STACK_W, gap: LAYER_GAP }}
      >
        <div
          className="rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-center text-[13px] font-bold text-white shadow-[0_16px_30px_-14px_rgba(83,58,253,0.5)]"
          style={{ height: CAP_H, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          Superatom AI
        </div>
        {LAYERS.map((layer, i) => (
          <div
            key={layer}
            className="infra-layer relative flex items-center justify-center rounded-md border border-primary-200/50 bg-secondary-500 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-100"
            style={{
              height: LAYER_H,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.5s ease ${0.1 * i}s, transform 0.5s ease ${0.1 * i}s`,
              animationDelay: `${i * 1.1}s`,
            }}
          >
            {layer}
          </div>
        ))}
        <div className="absolute -bottom-4 -right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary-500 shadow-[0_10px_24px_-10px_rgba(16,24,40,0.3)] ring-1 ring-secondary-100">
          <MdShield size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Infrastructure() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-primary-500">
              Infrastructure
            </p>
            <h2 className="mt-3 font-display text-[22px] font-bold text-heading sm:text-h2">
              Enterprise-grade infrastructure for{" "}
              <span className="text-primary-500">real-world operations</span>
            </h2>
            <p className="text-p mt-4 max-w-md text-body">
              A secure, governed foundation built for the demands of modern
              enterprise supply chains.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-caption">
              <li>• Superatom AI sits inside your infrastructure</li>
              <li>• ISO 27001 and SOC 2 aligned</li>
              <li>• Enterprise SSO out of the box</li>
            </ul>
          </div>
          <InfrastructureDiagram />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-secondary-100 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <f.Icon size={22} />
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
  );
}
