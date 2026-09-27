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

const layers = ["Secure", "Governed", "Scalable", "Reliable"];
const outcomes = ["People", "Data", "Decisions", "A Stronger Tomorrow"];

function StackGraphic() {
  return (
    <div className="flex items-center justify-center gap-10">
      <div className="space-y-2">
        <div className="mb-2 flex h-14 w-32 items-center justify-center rounded-md bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white shadow-lg">
          Superatom AI
        </div>
        {layers.map((layer, i) => (
          <div
            key={layer}
            className="flex h-9 items-center justify-center rounded-md border border-primary-200 bg-secondary-500 text-xs font-medium tracking-wide text-primary-200"
            style={{ width: `${128 + i * 10}px`, marginLeft: `${i * 5}px` }}
          >
            {layer.toUpperCase()}
          </div>
        ))}
      </div>
      <div className="hidden flex-col gap-4 border-l border-secondary-100 pl-6 sm:flex">
        {outcomes.map((o) => (
          <p key={o} className="text-xs font-semibold text-caption">
            {o}
          </p>
        ))}
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
          <StackGraphic />
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
