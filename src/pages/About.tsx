import type { ReactNode } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
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
  {
    name: "Gopinadh Boppudi",
    role: "Head of Engineering",
    linkedin: "https://www.linkedin.com/in/gopinadh-boppudi-8730751b0/",
    photo: null,
    avatarGradient: ["#d6d9f0", "#9ba3d4"],
  },
];

/** Small gradient dash + label, the eyebrow treatment used throughout this redesign instead of SectionHeading's own colored-text eyebrow. */
function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-0.5 w-7 shrink-0 rounded-full"
        style={{ backgroundImage: BRAND_GRADIENT }}
        aria-hidden="true"
      />
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-700 ease-in-out ${
          dark ? "text-white/60" : "text-caption"
        }`}
      >
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
      style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
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

const beliefs = [
  { lead: "Listen first, build second.", text: "Real customer problems shape our product, not trends." },
  { lead: "Continuous learning.", text: "Every customer conversation makes us sharper." },
  { lead: "Disciplined execution.", text: "We would rather promise less and deliver more." },
  { lead: "Customer success above all.", text: "Outcomes our customers can measure are the only ones that count." },
];

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
  // The last section crossfades its own background from light to dark in
  // sync with the shared scroll threshold, the same pattern Testimonial uses
  // on the home page, so there's a section doing that handoff right before
  // CtaSection here too.
  const isDark = useDarkTransition();

  return (
    <>
      {/* Hero, with the team photos directly underneath so they come into
          view after a single scroll. */}
      <section className="relative overflow-hidden pb-14 pt-[110px] lg:pb-[72px] lg:pt-[130px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 size-[480px] rounded-full bg-primary-500/[0.06] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
            <h1 className="max-w-[760px] font-display text-[44px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[58px] lg:text-[64px]">
              Decisions at the <GradientText>Speed of Business.</GradientText>
            </h1>
            <p className="max-w-[400px] text-p leading-relaxed text-body lg:pb-2">
              Superatom AI exists to close the gap between enterprise data, business context, and action.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative overflow-hidden py-[100px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 size-[420px] rounded-full bg-[#ff7eb0]/[0.06] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>Our Story</Eyebrow>
              <h2 className="mt-5 font-display text-[36px] font-semibold leading-[1.15] tracking-tight text-heading sm:text-[44px]">
                Built from 60+ conversations, <GradientText>not assumptions</GradientText>
              </h2>
            </div>

            <div className="max-w-[780px] space-y-5 text-p leading-relaxed text-body">
              <p>
                Superatom AI didn’t start with a product. It started with listening.
              </p>
              <p>
                Before writing a line of code, we spoke with more than 60+ CIOs around the globe and across
                industries.
              </p>
              <p>
                We wanted to understand how enterprises really use business intelligence: what works, what breaks,
                and where decisions get stuck. The same themes kept coming up. Business analytics teams are
                stretched thin. Dashboards multiply while answers slow down. Leaders need to decide faster and
                with more confidence than their current BI setup allows. Those conversations with technology and
                business leaders became our foundation, and they shaped one clear vision:
              </p>

              <div className="relative !mt-7 overflow-hidden rounded-[22px] border border-primary-500/10 bg-white/70 p-7">
                <span
                  className="absolute left-0 top-0 h-full w-[3px]"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  aria-hidden="true"
                />
                <p className="relative font-display text-[20px] font-semibold leading-snug tracking-tight text-heading sm:text-[22px]">
                  To transform how enterprises make decisions by bridging the gap between enterprise data,
                  business context, and action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>Our Team</Eyebrow>
              <h2 className="mt-5 font-display text-[36px] font-semibold leading-[1.15] tracking-tight text-heading sm:text-[44px]">
                Enterprise depth. <GradientText>Builder’s mindset.</GradientText>
              </h2>
            </div>

            <div className="max-w-[780px] space-y-5 text-p leading-relaxed text-body">
              <p>
                We bring together a diverse team of strategic thinkers, technology experts, and
                customer-obsessed builders. Our collective experience spans building and scaling teams across
                geographies, developing enterprise-grade products, GTM experts and building startups from the
                ground up.
              </p>
              <p>
                With experience across organizations such as Blue Yonder, DHL, and Pine Labs, alongside
                entrepreneurial experience and backgrounds from prestigious institutions, including the IITs,
                our team combines enterprise expertise with a builder's mindset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe: the last section, fading to dark in step with the
          page's dark footer block. */}
      <section
        className={`py-[100px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-gradient-to-b from-primary-100/40 to-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <Eyebrow dark={isDark}>What We Believe</Eyebrow>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {beliefs.map((belief) => (
              <li key={belief.lead}>
                <GlowCard className="h-full" contentClassName="flex h-full gap-5 p-7">
                  <span
                    className="mt-1.5 h-1 w-6 shrink-0 rounded-full"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                    aria-hidden="true"
                  />
                  <p className="text-p leading-relaxed text-body">
                    <span className="font-display text-[19px] font-semibold text-heading">{belief.lead}</span>{" "}
                    {belief.text}
                  </p>
                </GlowCard>
              </li>
            ))}
          </ul>

          <p
            className={`mt-16 max-w-[980px] font-display text-[30px] font-semibold leading-[1.2] tracking-tight transition-colors duration-700 ease-in-out sm:text-[40px] lg:text-[48px] ${
              isDark ? "text-white" : "text-heading"
            }`}
          >
            We believe the future of BI isn’t more dashboards. <GradientText>It’s faster, better decisions.</GradientText>
          </p>
        </div>
      </section>
    </>
  );
}
