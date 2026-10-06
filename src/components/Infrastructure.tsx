import { lazy, Suspense } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import StorageIcon from "@mui/icons-material/Storage";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VerifiedIcon from "@mui/icons-material/Verified";
import type { IconComponent } from "../types/icon";
import GlowCard from "./ui/GlowCard";
import SectionHeading from "./ui/SectionHeading";

const InfrastructureDiagram = lazy(() => import("./InfrastructureDiagram"));

function DiagramPlaceholder() {
  return (
    <div
      className="mx-auto w-full max-w-[640px] animate-pulse rounded-2xl border border-secondary-100 bg-page"
      style={{ aspectRatio: "640 / 400" }}
    />
  );
}

const points: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "ISO 27001 certified, SOC 2 in progress",
    desc: "Independently certified security practices, with SOC 2 Type I underway.",
    Icon: VerifiedIcon,
  },
];

const features: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "Security & Compliance",
    desc: "ISO 27001:2022 certified, with SOC 2 Type I currently in progress, backed by continuous testing and monitoring.",
    Icon: ShieldIcon,
  },
  {
    title: "Data Privacy & Control",
    desc: "Maintain full control over your data, decisions and outputs with role-based access and governance controls.",
    Icon: StorageIcon,
  },
  {
    title: "Enterprise SSO",
    desc: "SAML, OIDC and Active Directory integration for seamless and secure access across your organization.",
    Icon: VpnKeyIcon,
  },
];

export default function Infrastructure() {
  return (
    <section className="relative overflow-hidden py-[120px]">
      <div className="relative z-[2] mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Infrastructure"
              eyebrowColor="accent"
              size="lg"
              heading={
                <>
                  Enterprise-grade infrastructure
                  <br />
                  for{" "}
                  <span className="text-primary-500">
                    real-world operations
                  </span>
                </>
              }
              description="A secure, governed foundation built for the demands of modern enterprise supply chains."
              descriptionClassName="max-w-md"
            />
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:gap-8">
              {points.map((point) => (
                <div key={point.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-100 text-accent-600">
                    <point.Icon style={{ fontSize: 18 }} />
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
            <GlowCard key={f.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <f.Icon style={{ fontSize: 22 }} />
              </span>
              <p className="text-h4 mt-4 font-display font-semibold text-heading">
                {f.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-caption">
                {f.desc}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
