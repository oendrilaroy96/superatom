import type { ReactNode } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SectionHeading from "../components/ui/SectionHeading";
import SuperatomDiagram from "../components/SuperatomDiagram";
import { useDarkTransition } from "../context/DarkTransitionContext";
import prashanthPhoto from "../assets/SuperatomTeams/Prashanth.webp";
import sharathPhoto from "../assets/SuperatomTeams/Sharath.webp";
import ashishPhoto from "../assets/SuperatomTeams/Ashish.webp";
import chetanPhoto from "../assets/SuperatomTeams/Chetan.webp";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

type TeamMember = {
  name: string;
  role: string;
  linkedin: string;
  photo: string | null;
  /** Diagonal gradient stops for members without a photo yet. */
  avatarGradient?: [string, string];
};

const beliefs = [
  {
    title: "Listen first, build second.",
    text: "Real customer problems shape our product, not trends.",
  },
  {
    title: "Continuous learning.",
    text: "Every customer conversation makes us sharper.",
  },
  {
    title: "Disciplined execution.",
    text: "We would rather promise less and deliver more.",
  },
  {
    title: "Customer success above all.",
    text: "Outcomes our customers can measure are the only ones that count.",
  },
];

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** The three themes that kept coming up in the CIO conversations. */
const storyThemes: { text: string; icon: ReactNode }[] = [
  {
    text: "Business analytics teams are stretched thin.",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
        <path d="M16 5.5a3 3 0 0 1 0 5.6M18 14.8c2 .5 3.2 2.2 3.5 5.2" />
      </svg>
    ),
  },
  {
    text: "Dashboards multiply while answers slow down.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    text: "Leaders need to decide faster and with more confidence than their current BI setup allows.",
    icon: (
      <svg {...iconProps}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    ),
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Prashanth Dharawath",
    role: "Co-Founder & CEO",
    linkedin: "https://www.linkedin.com/in/prashanth-dharawath-a15833369/",
    photo: prashanthPhoto,
  },
  {
    name: "Ashish Tandi",
    role: "Co-Founder & CTO",
    linkedin: "https://www.linkedin.com/in/ashishblessing/",
    photo: ashishPhoto,
  },
  {
    name: "Sharath Bhat",
    role: "Co-Founder, GTM & Strategy",
    linkedin: "https://www.linkedin.com/in/sharathramakrishnabhat/",
    photo: sharathPhoto,
  },
  {
    name: "Chetan Sai",
    role: "Co-Founder & COO",
    linkedin: "https://www.linkedin.com/in/chetan-sai-1720a8174/",
    photo: chetanPhoto,
  },
];

/** Abstract head-and-shoulders silhouette for team members without a photo yet. */
function AvatarPlaceholder({ colors }: { colors: [string, string] }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      }}
    >
      <div className="absolute bottom-0 left-1/2 h-[55%] w-[85%] -translate-x-1/2 rounded-t-full bg-white/10 shadow-[inset_-12px_-10px_28px_rgba(11,22,40,0.3)]" />
      <div className="absolute left-1/2 top-[34%] h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 shadow-[inset_-10px_-8px_22px_rgba(11,22,40,0.3)]" />
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-secondary-100 bg-white"
    >
      {member.photo ? (
        <img
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <AvatarPlaceholder colors={member.avatarGradient!} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-secondary-600/95 via-secondary-600/35 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
        <div>
          <p className="font-display text-[13px] font-bold leading-tight text-white">
            {member.name}
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/60">
            {member.role}
          </p>
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition-transform duration-200 group-hover:scale-110">
          <LinkedInIcon style={{ fontSize: 15 }} />
        </span>
      </div>
    </a>
  );
}

/** Gradient-filled text that keeps its fill across line wraps. */
function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: BRAND_GRADIENT,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}

export default function About() {
  // Crossfades this section's own background from light to dark in sync
  // with the shared scroll threshold, the same pattern Testimonial uses on
  // the home page — so there's a section doing that handoff right before
  // CtaSection here too, instead of CtaSection's own crossfade being the
  // first one on the page.
  const isDark = useDarkTransition();

  return (
    <>
      {/* Hero: Our Story. Heading and diagram on top, then the story in short pieces. */}
      <section className="relative overflow-hidden py-[100px]">
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div>
              <SectionHeading
                headingAs="h1"
                eyebrow="Our Story"
                heading={
                  <>
                    Built from 60+ conversations,{" "}
                    <GradientText>not assumptions</GradientText>
                  </>
                }
              />
              <p className="mt-6 font-display text-[24px] font-semibold leading-[1.3] tracking-tight text-heading sm:text-[28px]">
                Superatom AI didn&rsquo;t start with a product. It started with
                listening.
              </p>
              <p className="mt-3 text-p text-body">
                Before writing a line of code, we spoke with more than{" "}
                <span className="font-display text-[24px] font-bold leading-none">
                  <GradientText>60+</GradientText>
                </span>{" "}
                CIOs around the globe and across industries.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[720px] lg:max-w-none">
              <SuperatomDiagram />
            </div>
          </div>

          <div className="mt-12 max-w-[820px]">
            <p className="font-display text-[20px] font-semibold leading-snug tracking-tight text-heading">
              We wanted to understand how enterprises really use business
              intelligence: what works, what breaks, and where decisions get
              stuck.
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-caption">
              The same themes kept coming up.
            </p>
          </div>

          <ul className="mt-5 grid gap-3.5 md:grid-cols-3">
            {storyThemes.map((theme) => (
              <li
                key={theme.text}
                className="rounded-[20px] border border-secondary-100 bg-white p-5 shadow-[0_4px_7px_rgba(6,27,49,0.04)] sm:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-primary-100 text-primary-500">
                  {theme.icon}
                </span>
                <p className="mt-4 font-display text-[17px] font-semibold leading-snug tracking-tight text-heading">
                  {theme.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-9 grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
            <p className="text-[18px] leading-relaxed text-body">
              Those conversations with technology and business leaders became
              our foundation, and they shaped one clear vision:
            </p>
            <div className="relative overflow-hidden rounded-[22px] border border-primary-500/10 bg-white p-7 sm:px-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-0 select-none font-display text-[90px] font-bold leading-none text-primary-500/10"
              >
                &rdquo;
              </span>
              <span
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ backgroundImage: BRAND_GRADIENT }}
                aria-hidden="true"
              />
              <p className="relative font-display text-[17px] font-semibold leading-snug tracking-tight text-heading sm:text-[19px]">
                To transform how enterprises make decisions by bridging the gap
                between enterprise data, business context, and action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team: heading on the left, the two paragraphs on the right, then the
          four portraits in a row underneath. */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-[72px]">
            <SectionHeading
              eyebrow="Our Team"
              heading={
                <>
                  Enterprise depth.
                  <br />
                  <GradientText>Builder&rsquo;s mindset.</GradientText>
                </>
              }
            />

            <div>
              <div className="space-y-4 text-p text-body">
                <p>
                  We bring together a diverse team of strategic thinkers,
                  technology experts, and customer-obsessed builders. Our
                  collective experience spans building and scaling teams across
                  geographies, developing enterprise-grade products, GTM experts
                  and building startups from the ground up.
                </p>
                <p>
                  With experience across organizations such as Blue Yonder, DHL,
                  and Pine Labs, alongside entrepreneurial experience and
                  backgrounds from prestigious institutions, including the IITs,
                  our team combines enterprise expertise with a builder&rsquo;s
                  mindset.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <span
                  className="h-0.5 w-8 shrink-0 rounded-full"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  aria-hidden="true"
                />
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-caption">
                  Four perspectives. One shared ambition.
                </p>
              </div>
            </div>
          </div>

          {/* Team directory: full-bleed photo with a bottom gradient scrim
              carrying the name/role/LinkedIn badge over the image itself.
              Kept fixed light-on-dark-scrim regardless of the page's own
              crossfade, so the cards read consistently. */}
          <div className="mt-12 grid max-w-[1120px] grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-4">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* What we believe: the last section, fading to dark in step with the
          page's dark footer block. */}
      <section
        className={`py-[100px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            theme={isDark ? "dark" : "light"}
            heading="What We Believe"
            headingClassName="text-[32px] leading-[1.15] sm:text-[40px]"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-[72px]">
            <div
              className="flex min-h-[200px] items-end rounded-[28px] p-8 sm:p-10"
              style={{
                backgroundColor: "#533afd",
                backgroundImage:
                  "radial-gradient(500px 300px at 100% 0%, rgba(255,126,176,0.45), transparent 65%), radial-gradient(500px 360px at 0% 100%, rgba(135,62,255,0.55), transparent 65%)",
              }}
            >
              <p className="font-display text-[22px] font-semibold leading-[1.25] tracking-tight text-white sm:text-[26px] lg:text-[30px]">
                We believe the future of BI isn&rsquo;t more dashboards.
                It&rsquo;s faster, better decisions.
              </p>
            </div>

            <ol className="flex flex-col gap-3">
              {beliefs.map((belief, i) => (
                <li
                  key={belief.title}
                  className={`flex flex-1 items-center gap-[18px] rounded-[18px] border px-6 py-4 transition-colors duration-700 ${
                    isDark
                      ? "border-white/10 bg-white/5"
                      : "border-secondary-100 bg-white"
                  }`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold transition-colors duration-700 ${
                      isDark
                        ? "bg-white/10 text-primary-300"
                        : "bg-primary-100 text-primary-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      className={`font-display text-[18px] font-semibold leading-snug tracking-tight transition-colors duration-700 ${
                        isDark ? "text-white" : "text-heading"
                      }`}
                    >
                      {belief.title}
                    </h3>
                    <p
                      className={`mt-0.5 text-[14px] transition-colors duration-700 ${
                        isDark ? "text-white/60" : "text-body"
                      }`}
                    >
                      {belief.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
