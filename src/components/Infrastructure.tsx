import { lazy, Suspense } from "react";
import {
  MdShield,
  MdLock,
  MdStorage,
  MdVpnKey,
  MdCheck,
} from "react-icons/md";
import type { IconType } from "react-icons";

const InfrastructureDiagram = lazy(() => import("./InfrastructureDiagram"));

function DiagramPlaceholder() {
  return (
    <div
      className="mx-auto w-full max-w-[640px] animate-pulse rounded-2xl border border-secondary-100 bg-page"
      style={{ aspectRatio: "640 / 400" }}
    />
  );
}

const points = [
  "Superatom AI sits inside your infrastructure",
  "ISO 27001 and SOC 2 aligned",
  "Enterprise SSO out of the box",
];

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

export default function Infrastructure() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="relative z-[2] mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-100 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-accent-600">
                Infrastructure
              </p>
            </div>
            <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.15] text-heading sm:text-[32px]">
              Enterprise-grade infrastructure
              <br />
              for <span className="text-primary-500">real-world operations</span>
            </h2>
            <p className="text-p mt-4 max-w-md text-body">
              A secure, governed foundation built for the demands of modern
              enterprise supply chains.
            </p>
            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-100 text-accent-600">
                    <MdCheck size={16} />
                  </span>
                  <span className="text-sm font-medium text-body">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Suspense fallback={<DiagramPlaceholder />}>
            <InfrastructureDiagram />
          </Suspense>
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
