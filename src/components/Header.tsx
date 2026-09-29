import { useEffect, useState } from "react";
import {
  MdClose,
  MdMenu,
  MdInventory2,
  MdShowChart,
  MdShoppingCart,
  MdLocalShipping,
  MdPrecisionManufacturing,
  MdSell,
  MdArticle,
  MdInsights,
  MdMenuBook,
} from "react-icons/md";
import type { IconType } from "react-icons";
import logo from "../assets/superatom-logo.png";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import DemoModal from "./DemoModal";

const solutions: { name: string; blurb: string; Icon: IconType }[] = [
  { name: "Inventory Intelligence", blurb: "Optimize, rebalance, prevent.", Icon: MdInventory2 },
  { name: "Demand Intelligence", blurb: "Sense, predict, respond.", Icon: MdShowChart },
  { name: "Procurement Intelligence", blurb: "Source, plan, mitigate.", Icon: MdShoppingCart },
  { name: "Logistics Intelligence", blurb: "Move, optimize, deliver.", Icon: MdLocalShipping },
  { name: "Manufacturing Intelligence", blurb: "Plan, produce, adapt.", Icon: MdPrecisionManufacturing },
  { name: "Pricing Intelligence", blurb: "Price, position, grow.", Icon: MdSell },
];

const resources: { name: string; blurb: string; Icon: IconType }[] = [
  { name: "Blog", blurb: "Insights on decision intelligence.", Icon: MdArticle },
  { name: "Case Studies", blurb: "How enterprises use Superatom.", Icon: MdInsights },
  { name: "Docs", blurb: "Platform & integration guides.", Icon: MdMenuBook },
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
    <a href="/" className="flex shrink-0 items-center">
      <img src={logo} alt="Superatom AI" className="h-6 w-auto" />
    </a>
  );
}

function DropdownNavItem({
  label,
  items,
  columns = 1,
}: {
  label: string;
  items: { name: string; blurb: string; Icon: IconType }[];
  columns?: 1 | 2;
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-[13.5px] text-body transition-colors hover:text-heading">
        {label}
        <ChevronDown />
      </button>
      <div
        className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 ${
          columns === 2 ? "w-[620px]" : "w-80"
        }`}
      >
        <div
          className={`rounded-xl border border-secondary-100 bg-white p-3 shadow-xl shadow-secondary-900/10 ${
            columns === 2 ? "grid grid-cols-2 gap-1" : "space-y-0.5"
          }`}
        >
          {items.map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary-100/40"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <item.Icon size={18} />
              </span>
              <span>
                <p className="font-display text-sm font-semibold text-heading">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-caption">{item.blurb}</p>
              </span>
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
  const [demoOpen, setDemoOpen] = useState(false);

  function openDemo() {
    setMobileOpen(false);
    setDemoOpen(true);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 border-b transition-colors duration-200 ${
        scrolled
          ? "border-secondary-100 bg-white/90 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-10 xl:px-20">
        <Logo />

        <nav className="hidden items-center gap-[30px] lg:flex">
          <a
            href="#"
            className="text-[13.5px] text-body transition-colors hover:text-heading"
          >
            Platform
          </a>
          <DropdownNavItem label="Solutions" items={solutions} columns={2} />
          <DropdownNavItem label="Resources" items={resources} />
          <a
            href="#"
            className="text-[13.5px] text-body transition-colors hover:text-heading"
          >
            About us
          </a>
        </nav>

        <div className="hidden lg:block">
          <Button variant="secondary" className="px-5 py-2.5 text-[13px]" onClick={openDemo}>
            Book a demo
          </Button>
        </div>

        <IconButton
          icon={mobileOpen ? MdClose : MdMenu}
          aria-label="Toggle menu"
          variant="subtle"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden"
        />
      </div>

      {mobileOpen && (
        <div className="border-t border-secondary-100 bg-white px-4 py-4 sm:px-10 lg:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-sm font-medium text-body">
              Platform
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Solutions
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Resources
            </a>
            <a href="#" className="text-sm font-medium text-body">
              About us
            </a>
            <Button variant="secondary" className="mt-2 w-full justify-center" onClick={openDemo}>
              Book a demo
            </Button>
          </nav>
        </div>
      )}

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </header>
  );
}
