import { lazy, Suspense } from "react";
import { MdShield, MdStorage, MdVpnKey, MdVerified } from "react-icons/md";
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

const points: { title: string; desc: string; Icon: IconType }[] = [
  {
    title: "ISO 27001 certified, SOC 2 in progress",
    desc: "Independently certified security practices, with SOC 2 Type I underway.",
    Icon: MdVerified,
  },
];

const features: { title: string; desc: string; Icon: IconType }[] = [
  {
    title: "Security & Compliance",
    desc: "ISO 27001:2022 certified, with SOC 2 Type I currently in progress, backed by continuous testing and monitoring.",
    Icon: MdShield,
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
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:gap-8">
              {points.map((point) => (
                <div key={point.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-100 text-accent-600">
                    <point.Icon size={18} />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-heading">
                      {point.title}
                    </p>
                    <p className="mt-0.5 text-xs text-caption">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Suspense fallback={<DiagramPlaceholder />}>
            <InfrastructureDiagram />
          </Suspense>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
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
