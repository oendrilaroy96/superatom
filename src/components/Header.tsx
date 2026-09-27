import { useEffect, useState } from "react";

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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform duration-200 group-hover:rotate-180"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="7" r="2.4" fill="white" />
          <circle cx="17" cy="7" r="1.6" fill="white" fillOpacity="0.85" />
          <circle cx="7" cy="17" r="1.6" fill="white" fillOpacity="0.85" />
          <circle cx="17" cy="17" r="2.4" fill="white" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">
        Superatom <span className="text-cyan-400">AI</span>
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
      <button className="flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-white">
        {label}
        <ChevronDown />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="rounded-xl border border-white/10 bg-[#0f2942] p-2 shadow-2xl shadow-black/40">
          {items.map((item) => (
            <a
              key={item.name}
              href="#"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
            >
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{item.blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-white/10 bg-[#0a1929]/95 backdrop-blur"
          : "border-transparent bg-[#0a1929]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href="#"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Platform
          </a>
          <DropdownNavItem label="Solutions" items={solutions} />
          <a
            href="#"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Industries
          </a>
          <DropdownNavItem label="Resources" items={resources} />
          <a
            href="#"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            About us
          </a>
        </nav>

        <div className="hidden lg:block">
          <a
            href="#"
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#0a1929] transition-colors hover:bg-cyan-300"
          >
            Book a Demo →
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
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
        <div className="border-t border-white/10 bg-[#0a1929] px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-sm font-medium text-slate-300">
              Platform
            </a>
            <a href="#" className="text-sm font-medium text-slate-300">
              Solutions
            </a>
            <a href="#" className="text-sm font-medium text-slate-300">
              Industries
            </a>
            <a href="#" className="text-sm font-medium text-slate-300">
              Resources
            </a>
            <a href="#" className="text-sm font-medium text-slate-300">
              About us
            </a>
            <a
              href="#"
              className="mt-2 rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-semibold text-[#0a1929]"
            >
              Book a Demo →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
