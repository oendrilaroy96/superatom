import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import type { IconComponent } from "../types/icon";
import logo from "../assets/superatom-logo.png";

const columns: { heading: string; links: string[] }[] = [
  {
    heading: "Platform",
    links: ["Tribal Knowledge", "Optimization Engine", "Generative UI", "Semantic Modeling"],
  },
  {
    heading: "Solutions",
    links: [
      "Inventory Intelligence",
      "Demand Intelligence",
      "Procurement Intelligence",
      "Logistics Intelligence",
      "Manufacturing Intelligence",
      "Pricing Intelligence",
    ],
  },
  {
    heading: "Resources",
    links: ["Blog", "Case Studies", "Docs"],
  },
  {
    heading: "Company",
    links: ["About us", "Careers", "Contact", "Privacy Policy", "Terms of Service"],
  },
];

const socials: { label: string; Icon: IconComponent }[] = [
  { label: "Email", Icon: EmailIcon },
  { label: "LinkedIn", Icon: LinkedInIcon },
  { label: "Twitter", Icon: TwitterIcon },
  { label: "YouTube", Icon: YouTubeIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-secondary-100 bg-page">
      <div className="mx-auto max-w-[1920px] px-4 pb-10 pt-16 sm:px-10 sm:pt-20 xl:px-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <img src={logo} alt="Superatom AI" className="h-6 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-caption">
              Decision intelligence for enterprises. Connect your data,
              execute the decisions.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-secondary-100 bg-white text-caption transition-colors hover:border-secondary-200 hover:text-heading"
                >
                  <Icon style={{ fontSize: 18 }} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-display text-xs font-bold uppercase tracking-wide text-heading">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-caption transition-colors hover:text-heading"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-secondary-100 pt-6">
          <p className="text-center text-sm text-caption sm:text-left">
            &copy; {new Date().getFullYear()} Superatom AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
