import type { ReactNode } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GlowCard from "../components/ui/GlowCard";
import SectionHeading from "../components/ui/SectionHeading";
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
          <p className="font-display text-[16px] font-semibold leading-tight text-white">
            {member.name}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
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
      {/* Hero: centered like the home page, sized to its content instead of the full screen. */}
      <section className="relative overflow-hidden pb-14 pt-[72px] sm:pt-[88px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 size-[480px] rounded-full bg-primary-500/[0.06] blur-3xl"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
          <p className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary-300">
            About us
          </p>
          <h1 className="m-0 mb-4 font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-heading sm:text-[56px] lg:text-[72px]">
            <span className="block">Decisions at the</span>
            <GradientText>Speed of Business.</GradientText>
          </h1>
          <p className="max-w-3xl text-[18px] leading-[1.55] text-body">
            Superatom AI exists to close the gap between enterprise data, business context, and action.
          </p>
        </div>
      </section>

      {/* Our Story: the "60+" is the hook, the story sits beside it. */}
      <section className="py-[72px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            align="center"
            className="max-w-5xl"
            eyebrow="Our Story"
            heading={
              <>
                Built from 60+ conversations, <GradientText>not assumptions</GradientText>
              </>
            }
          />

          <div className="mx-auto mt-8 grid max-w-[1280px] grid-cols-1 overflow-hidden rounded-[28px] border border-secondary-100 bg-white lg:grid-cols-[0.8fr_1.2fr]">
            <div
              className="relative flex flex-col justify-between gap-10 overflow-hidden bg-secondary-500 p-8 sm:p-10"
              style={{
                backgroundImage:
                  "radial-gradient(520px 340px at 90% 0%, rgba(83,58,253,0.5), transparent 65%), radial-gradient(420px 300px at 0% 100%, rgba(255,118,0,0.22), transparent 65%)",
              }}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/60">
                Before writing a line of code
              </p>
              <div>
                <p
                  className="bg-clip-text font-display text-[88px] font-semibold leading-none tracking-[-0.04em] text-transparent sm:text-[112px]"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  60+
                </p>
                <p className="mt-4 max-w-[280px] text-[18px] leading-[1.45] text-white/80">
                  CIOs around the globe and across industries
                </p>
              </div>
            </div>

            <div className="space-y-4 p-8 text-p leading-relaxed text-body sm:p-10">
              <p className="font-display text-h3 font-semibold text-heading">
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
              <div className="relative !mt-6 overflow-hidden rounded-2xl border border-primary-500/10 bg-primary-100/40 p-6">
                <span
                  className="absolute left-0 top-0 h-full w-[3px]"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                  aria-hidden="true"
                />
                <p className="relative font-display text-h3 font-semibold leading-snug tracking-tight text-heading">
                  To transform how enterprises make decisions by bridging the gap between enterprise data,
                  business context, and action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team: copy beside the heading, photos in one row underneath. */}
      <section className="py-[72px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading
              eyebrow="Our Team"
              heading={
                <>
                  Enterprise depth. <GradientText>Builder’s mindset.</GradientText>
                </>
              }
            />
            <div className="space-y-4 text-p leading-relaxed text-body lg:pb-2">
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

          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* What We Believe: the last section, fading to dark in step with the
          page's dark footer block. */}
      <section
        className={`py-[72px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading theme={isDark ? "dark" : "light"} heading="What We Believe" />

          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beliefs.map((belief, i) => (
              <li key={belief.lead}>
                <GlowCard className="h-full" contentClassName="flex h-full flex-col gap-4 p-6">
                  <span
                    className="bg-clip-text font-display text-[40px] font-semibold leading-none tracking-tight text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-h3 font-semibold text-heading">{belief.lead}</p>
                  <p className="text-p leading-relaxed text-body">{belief.text}</p>
                </GlowCard>
              </li>
            ))}
          </ol>

          <p
            className={`mt-14 max-w-[1100px] font-display text-[34px] font-semibold leading-[1.15] tracking-tight transition-colors duration-700 ease-in-out sm:text-[46px] lg:text-[58px] ${
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
