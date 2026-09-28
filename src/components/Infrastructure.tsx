import { lazy, Suspense } from "react";
import { MdShield, MdLock, MdStorage, MdVpnKey } from "react-icons/md";
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
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafd_100%)] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1100px 620px at 82% 8%, rgba(83,58,253,0.07), transparent 60%), radial-gradient(900px 520px at 18% 92%, rgba(255,118,0,0.06), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#edf1f7 1px, transparent 1px), linear-gradient(90deg, #edf1f7 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(1200px 700px at 70% 20%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(1200px 700px at 70% 20%, black 0%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-[2] mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
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
