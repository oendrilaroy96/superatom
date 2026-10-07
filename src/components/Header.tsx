import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArticleIcon from "@mui/icons-material/Article";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { IconComponent } from "../types/icon";
import logo from "../assets/superatom-logo.png";
import logoWhite from "../assets/logo-white.png";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import DemoModal from "./DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";

const solutions: { name: string; blurb: string; Icon: IconComponent; path?: string }[] = [
  { name: "Inventory Intelligence", blurb: "Optimize, rebalance, prevent.", Icon: Inventory2Icon, path: "/solutions/inventory-intelligence" },
  { name: "Procurement Intelligence", blurb: "Source, plan, mitigate.", Icon: ShoppingCartIcon, path: "/solutions/procurement-intelligence" },
];

const resources: { name: string; blurb: string; Icon: IconComponent; path?: string }[] = [
  { name: "Blog", blurb: "Insights on decision intelligence.", Icon: ArticleIcon },
];

function ChevronDown() {
  return (
    <KeyboardArrowDownIcon
      style={{ fontSize: 16 }}
      className="transition-transform duration-200 group-hover:rotate-180"
    />
  );
}

function Logo({ isDark }: { isDark: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center">
      <img src={isDark ? logoWhite : logo} alt="Superatom AI" className="h-6 w-auto" />
    </Link>
  );
}

function DropdownNavItem({
  label,
  items,
  columns = 1,
  isDark,
}: {
  label: string;
  items: { name: string; blurb: string; Icon: IconComponent; path?: string }[];
  columns?: 1 | 2;
  isDark: boolean;
}) {
  return (
    <div className="group relative">
      <button
        className={`flex items-center gap-1 text-[13.5px] transition-colors duration-700 ease-in-out ${
          isDark ? "text-white/70 hover:text-white" : "text-body hover:text-heading"
        }`}
      >
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
          {items.map((item) => {
            const content = (
              <>
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <item.Icon style={{ fontSize: 18 }} />
                </span>
                <span>
                  <p className="font-display text-sm font-semibold text-heading">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-caption">{item.blurb}</p>
                </span>
              </>
            );
            const className =
              "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary-100/40";
            return item.path ? (
              <Link key={item.name} to={item.path} className={className}>
                {content}
              </Link>
            ) : (
              <a key={item.name} href="#" className={className}>
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const isDark = useDarkTransition();

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
      className={`sticky top-0 z-50 h-16 border-b transition-colors duration-700 ease-in-out ${
        scrolled
          ? isDark
            ? "border-white/10 bg-secondary-500/90 backdrop-blur"
            : "border-secondary-100 bg-white/90 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-10 xl:px-20">
        <Logo isDark={isDark} />

        <nav className="hidden items-center gap-[30px] lg:flex">
          <DropdownNavItem label="Solutions" items={solutions} isDark={isDark} />
          <DropdownNavItem label="Resources" items={resources} isDark={isDark} />
          <Link
            to="/about"
            className={`text-[13.5px] transition-colors duration-700 ease-in-out ${
              isDark ? "text-white/70 hover:text-white" : "text-body hover:text-heading"
            }`}
          >
            About us
          </Link>
        </nav>

        <div className="hidden lg:block">
          <Button variant="accentOutline" className="px-5 py-2.5 text-[13px] font-semibold" onClick={openDemo}>
            Book a demo
          </Button>
        </div>

        <IconButton
          icon={mobileOpen ? CloseIcon : MenuIcon}
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
              Solutions
            </a>
            <a href="#" className="text-sm font-medium text-body">
              Resources
            </a>
            <Link
              to="/about"
              className="text-sm font-medium text-body"
              onClick={() => setMobileOpen(false)}
            >
              About us
            </Link>
            <Button variant="accentOutline" className="mt-2 w-full justify-center font-semibold" onClick={openDemo}>
              Book a demo
            </Button>
          </nav>
        </div>
      )}

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </header>
  );
}
