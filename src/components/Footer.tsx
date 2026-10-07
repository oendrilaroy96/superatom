import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import type { IconComponent } from "../types/icon";
import logo from "../assets/logo-white.png";

const columns: { heading: string; links: { name: string; path?: string }[] }[] = [
  {
    heading: "Solutions",
    links: [
      { name: "Inventory Intelligence", path: "/solutions/inventory-intelligence" },
      { name: "Procurement Intelligence", path: "/solutions/procurement-intelligence" },
    ],
  },
  {
    heading: "Resources",
    links: [{ name: "Blog" }],
  },
  {
    heading: "Company",
    links: [
      { name: "About us", path: "/about" },
      { name: "Contact" },
    ],
  },
];

const socials: { label: string; Icon: IconComponent; href: string }[] = [
  { label: "Email", Icon: EmailIcon, href: "#" },
  { label: "LinkedIn", Icon: LinkedInIcon, href: "https://www.linkedin.com/company/superatom-0ai/posts/" },
  { label: "YouTube", Icon: YouTubeIcon, href: "https://www.youtube.com/@SuperatomAI" },
];

const offices = ["Denver", "Hyderabad"];

const legalLinks = [{ name: "Privacy" }, { name: "Terms" }];

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-[1920px] px-4 pb-10 pt-20 sm:px-10 sm:pt-[120px] xl:px-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-x-20">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <img src={logo} alt="Superatom AI" className="h-6 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Decision intelligence for enterprise supply chains.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Icon style={{ fontSize: 18 }} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-display text-xs font-bold uppercase tracking-wide text-white">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <Link
                        to={link.path}
                        className="group inline-flex items-center text-sm text-white/60 transition-colors hover:text-white"
                      >
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="group inline-flex items-center text-sm text-white/60 transition-colors hover:text-white"
                      >
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          {link.name}
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:grid sm:grid-cols-3 sm:gap-0">
          <p className="order-1 text-sm text-white/50 sm:text-left">
            &copy; {new Date().getFullYear()} Superatom AI
          </p>
          <p className="order-3 text-xs font-medium uppercase tracking-[0.2em] text-white/30 sm:order-2 sm:text-center">
            {offices.join(" · ")}
          </p>
          <div className="order-2 flex items-center gap-6 sm:order-3 sm:justify-end">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href="#"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
