import type { ReactNode } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SuperatomDiagram from "../components/SuperatomDiagram";
import GlowCard from "../components/ui/GlowCard";
import { useDarkTransition } from "../context/DarkTransitionContext";
import prashanthPhoto from "../assets/SuperatomTeams/Prashanth.webp";
import sharathPhoto from "../assets/SuperatomTeams/Sharath.webp";
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
    photo: null,
    avatarGradient: ["#cfe3e6", "#8fb3ba"],
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

/** Small gradient dash + label, the eyebrow treatment used throughout this redesign instead of SectionHeading's own colored-text eyebrow. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-0.5 w-7 shrink-0 rounded-full"
        style={{ backgroundImage: BRAND_GRADIENT }}
        aria-hidden="true"
      />
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-caption">
        {children}
      </p>
    </div>
  );
}

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

export default function About() {
  // Crossfades this section's own background from light to dark in sync
  // with the shared scroll threshold, the same pattern Testimonial uses on
  // the home page — so there's a section doing that handoff right before
  // CtaSection here too, instead of CtaSection's own crossfade being the
  // first one on the page.
  const isDark = useDarkTransition();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-[56px] pt-[56px] sm:pt-[72px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 size-[480px] rounded-full bg-primary-500/[0.06] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.55fr_1.25fr] lg:gap-10">
            <div>
              <Eyebrow>About Superatom AI</Eyebrow>
              <h1 className="mt-7 max-w-[980px] font-display text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-heading sm:text-[56px] lg:text-[46px] xl:text-[54px]">
                <span className="block">Decisions at the</span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: BRAND_GRADIENT,
                    WebkitBoxDecorationBreak: "clone",
                    boxDecorationBreak: "clone",
                  }}
                >
                  Speed of Business.
                </span>
              </h1>
              <p className="mt-7 max-w-[640px] text-[18px] leading-[1.55] text-body sm:text-[20px]">
                Superatom AI exists to close the gap between enterprise data,
                business context, and action.
              </p>
              <a
                href="#our-journey"
                onClick={(e) => {
                  const target = document.getElementById("our-journey");
                  if (!target) return;
                  e.preventDefault();
                  target.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                    block: "start",
                  });
                }}
                className="group mt-9 inline-flex items-center gap-3 text-base font-semibold text-primary-500 transition-colors hover:text-primary-600"
              >
                Discover our story
                <ArrowForwardIcon
                  style={{ fontSize: 20 }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>

            <SuperatomDiagram />
          </div>
        </div>
      </section>

      {/* Team: right after the hero: heading and description, then the photos. */}
      <section className="pb-[72px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="text-center">
            <div className="flex justify-center">
              <Eyebrow>Our Team</Eyebrow>
            </div>
            <h2 className="mt-5 font-display text-[42px] font-semibold leading-[1.15] text-heading sm:text-[48px]">
              Enterprise depth.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: BRAND_GRADIENT,
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                Builder&rsquo;s mindset.
              </span>
            </h2>

            <div className="mx-auto mt-6 max-w-4xl space-y-4 text-p leading-relaxed text-body">
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
          </div>

          <div className="mt-12" />
          {/* Team directory: full-bleed photo with a bottom gradient scrim
              carrying the name/role/LinkedIn badge over the image itself,
              matching the redesigned portrait-card treatment. Kept fixed
              light-on-dark-scrim regardless of the section's own crossfade
              (same pattern as the previous card design), so the cards read
              consistently rather than dimming into the page background. */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] font-bold uppercase tracking-[0.1em] text-caption">
            <p>The people behind Superatom</p>
            <span aria-hidden="true">&middot;</span>
            <p>One team &middot; One mission</p>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {teamMembers.map((member) => (
              // Same card width the five-up row had: 5 columns on desktop,
              // 3 on tablet, 2 on phones, so four members sit centered.
              <div
                key={member.name}
                className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
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
      </section>

      {/* Our Journey */}
      <section
        id="our-journey"
        className="relative scroll-mt-16 overflow-hidden py-[72px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 size-[420px] rounded-full bg-[#ff7eb0]/[0.06] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-start gap-y-8 lg:grid-cols-[0.42fr_1fr] lg:gap-x-12 lg:gap-y-12">
            <Eyebrow>Our Journey</Eyebrow>

            <h2 className="font-display text-[42px] font-semibold leading-[1.15] text-heading sm:text-[48px]">
              Listening first.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: BRAND_GRADIENT,
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                Building with purpose.
              </span>
            </h2>

            <div className="relative flex h-60 flex-col items-start justify-end overflow-hidden rounded-[22px] border border-primary-500/10 bg-gradient-to-br from-white to-primary-100/50 p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full border border-dashed border-primary-500/30"
              >
                <span className="absolute -left-1 top-12 size-2 rounded-full border-2 border-white bg-primary-500 shadow-sm" />
                <span className="absolute left-20 top-[76px] size-2 rounded-full border-2 border-white bg-[#873eff] shadow-sm" />
                <span className="absolute left-6 top-0 size-2 rounded-full border-2 border-white bg-accent-500 shadow-sm" />
              </div>
              <p className="font-display text-[70px] font-semibold leading-none tracking-tight text-heading">
                60<span className="text-primary-500">+</span>
              </p>
              <p className="mt-4 font-display text-[13px] font-bold text-heading">
                CIO conversations
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-caption">
                Across the globe
              </p>
            </div>

            <div className="max-w-[780px]">
              <p className="text-p leading-relaxed text-body">
                Superatom AI began with conversations with 60+ CIOs across the
                globe, helping us deeply understand the enterprise BI landscape,
                the challenges faced by business analytics teams, and the
                growing need for faster, more effective decision-making.
              </p>

              <div
                className="my-6 flex items-center gap-1.5"
                aria-hidden="true"
              >
                <span className="size-[5px] rounded-full bg-primary-500" />
                <span className="size-[5px] rounded-full bg-[#873eff]" />
                <span className="size-[5px] rounded-full bg-accent-500" />
              </div>

              <p className="text-p leading-relaxed text-body">
                These conversations with technology and business leaders laid
                the foundation for our vision:
              </p>

              <div className="relative mt-6 overflow-hidden rounded-[22px] border border-primary-500/10 bg-white/70 p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-6 select-none font-display text-[90px] font-bold leading-none text-primary-500/10"
                >
                  &rdquo;
                </span>
                <span
                  className="absolute left-0 top-0 h-full w-[3px]"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  aria-hidden="true"
                />
                <p className="relative font-display text-[20px] font-semibold leading-snug tracking-tight text-heading sm:text-[22px]">
                  To transform how enterprises make decisions by bridging the
                  gap between enterprise data, business context, and action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we believe: the last section, fading to dark in step with the
          page's dark footer block. */}
      <section
        className={`py-[72px] transition-colors duration-700 ease-in-out ${
          isDark
            ? "bg-secondary-500"
            : "bg-gradient-to-b from-primary-100/40 to-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <GlowCard contentClassName="grid grid-cols-1 gap-4 p-8 sm:grid-cols-[370px_1fr] sm:gap-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-caption">
              What we believe
            </p>
            <p className="font-display text-[22px] font-normal leading-snug tracking-tight text-body sm:text-[26px] lg:text-[30px]">
              We believe phenomenal outcomes are built through{" "}
              <span
                className="text-heading"
                style={{ boxShadow: "inset 0 -2px 0 0 #ff7eb0" }}
              >
                continuous learning
              </span>
              , disciplined execution, and an unwavering commitment to customer
              success.
            </p>
          </GlowCard>
        </div>
      </section>
    </>
  );
}
