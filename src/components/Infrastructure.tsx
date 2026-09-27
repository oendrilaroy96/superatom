const features = [
  {
    title: "Security & Compliance",
    desc: "Enterprise-grade security controls with ISO 27001:2022 and SOC 2 Type I compliance, with continuous testing and monitoring.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "End-to-End Encryption",
    desc: "Protect your data throughout its lifecycle with encryption in transit and at rest.",
    icon: (
      <>
        <rect
          x="5"
          y="11"
          width="14"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 11V8a4 4 0 018 0v3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </>
    ),
  },
  {
    title: "Data Privacy & Control",
    desc: "Maintain full control over your data, decisions and outputs with role-based access and governance controls.",
    icon: (
      <>
        <ellipse
          cx="12"
          cy="6"
          rx="7"
          ry="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </>
    ),
  },
  {
    title: "Enterprise SSO",
    desc: "SAML, OIDC and Active Directory integration for seamless and secure access across your organization.",
    icon: (
      <>
        <circle cx="8" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10.2 12.8L18 5m0 0h-4m4 0v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

const layers = ["Secure", "Governed", "Scalable", "Reliable"];
const outcomes = ["People", "Data", "Decisions", "A Stronger Tomorrow"];

function StackGraphic() {
  return (
    <div className="flex items-center justify-center gap-10">
      <div className="space-y-2">
        <div className="mb-2 flex h-14 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white shadow-lg">
          Superatom AI
        </div>
        {layers.map((layer, i) => (
          <div
            key={layer}
            className="flex h-9 items-center justify-center rounded-lg border border-primary-200 bg-secondary-500 text-xs font-medium tracking-wide text-primary-200"
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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">
              Infrastructure
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-heading sm:text-4xl">
              Enterprise-grade infrastructure for{" "}
              <span className="text-primary-500">real-world operations</span>
            </h2>
            <p className="mt-4 max-w-md text-body">
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
              className="rounded-xl border border-secondary-100 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-500">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  {f.icon}
                </svg>
              </span>
              <p className="mt-4 font-display text-sm font-semibold text-heading">
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
