import { useState } from "react";

const solutions = [
  { name: "Inventory Intelligence", blurb: "Optimize, rebalance, prevent." },
  { name: "Demand Intelligence", blurb: "Sense, predict, respond." },
  { name: "Procurement Intelligence", blurb: "Source, plan, mitigate." },
  { name: "Logistics Intelligence", blurb: "Move, optimize, deliver." },
  { name: "Manufacturing Intelligence", blurb: "Plan, produce, adapt." },
  { name: "Pricing Intelligence", blurb: "Price, position, grow." },
];

const resources = [
  { name: "Blog", blurb: "Insights on decision intelligence." },
  { name: "Case Studies", blurb: "How enterprises use Superatom." },
  { name: "Docs", blurb: "Platform & integration guides." },
];

function ChevronDown() {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className="transition-transform duration-200 group-hover:rotate-180"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center gap-2.5">
      <span className="grid h-8 w-8 grid-cols-2 gap-[3px] rounded-[9px] bg-gradient-to-br from-primary-500 to-accent-500 p-[7px]">
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
      </span>
      <span className="font-display text-[17px] font-bold tracking-tight text-heading">
        Superatom&nbsp;AI
      </span>
    </a>
  );
}

function DropdownNavItem({
  label,
  items,
}: {
  label: string;
  items: { name: string; blurb: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-[13.5px] text-body transition-colors hover:text-heading">
        {label}
        <ChevronDown />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="rounded-xl border border-secondary-100 bg-white p-2 shadow-xl shadow-secondary-900/10">
          {items.map((item) => (
            <a
              key={item.name}
              href="#"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-primary-100/40"
            >
              <p className="font-display text-sm font-semibold text-heading">
                {item.name}
              </p>
              <p className="mt-0.5 text-xs text-caption">{item.blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 bg-transparent">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-[30px] lg:flex">
          <a
            href="#"
            className="text-[13.5px] text-body transition-colors hover:text-heading"
          >
            Platform
          </a>
          <DropdownNavItem label="Solutions" items={solutions} />
          <a
            href="#"
            className="text-[13.5px] text-body transition-colors hover:text-heading"
          >
            Industries
          </a>
          <DropdownNavItem label="Resources" items={resources} />
          <a
            href="#"
            className="text-[13.5px] text-body transition-colors hover:text-heading"
          >
            About us
          </a>
        </nav>

        <div className="hidden lg:block">
          <a
            href="#"
            className="rounded-lg border border-accent-500/50 px-[17px] py-[9px] text-[13px] font-semibold text-accent-500 transition-colors hover:bg-accent-100"
          >
            Book a demo
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-heading lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-secondary-100 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-sm font-medium text-body">
              Platform
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Solutions
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Industries
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Resources
            </a>
            <a href="#" className="text-sm font-medium text-body">
              About us
            </a>
            <a
              href="#"
              className="mt-2 rounded-lg border border-accent-500/50 px-5 py-2.5 text-center text-sm font-semibold text-accent-500"
            >
              Book a demo
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
