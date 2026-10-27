import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CaseStudyPhoto from "../components/CaseStudyPhoto";
import SectionHeading from "../components/ui/SectionHeading";
import { useDarkTransition } from "../context/DarkTransitionContext";
import { caseStudies, type CaseStudy } from "../lib/caseStudies";

function ArrowButton({ color }: { color: string }) {
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1"
      style={{ backgroundColor: color }}
    >
      <ArrowForwardIcon style={{ fontSize: 18 }} />
    </span>
  );
}

/** Photo with a soft navy fade at the bottom. */
function CardPhoto({
  study,
  className,
}: {
  study: CaseStudy;
  className: string;
}) {
  return (
    <CaseStudyPhoto
      src={study.image.src}
      alt={study.image.alt}
      className={`rounded-[17px] ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-t from-secondary-500/75 to-secondary-500/0 to-[65%]" />
    </CaseStudyPhoto>
  );
}

function CardLabels({ category }: { category: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[11px] font-medium uppercase tracking-[0.12em] text-caption">
      <p>{category}</p>
      <p className="shrink-0">Case study</p>
    </div>
  );
}

function StatBlock({ study, large }: { study: CaseStudy; large: boolean }) {
  return (
    <div>
      <p
        className={`font-display font-semibold leading-none tracking-tight text-heading ${
          large ? "text-[30px]" : "text-[25px]"
        }`}
      >
        {study.stat.value}
      </p>
      <p className="mt-2 max-w-[190px] text-[10px] leading-[14px] text-caption">
        {study.stat.label}
      </p>
    </div>
  );
}

const cardShell =
  "group block overflow-hidden rounded-[24px] border border-secondary-100 bg-white shadow-[0_4px_14px_rgba(6,27,49,0.05)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgba(6,27,49,0.25)]";

/** The first, wide card: photo on the left, text on the right. */
function FeaturedCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      to={`/case-studies/${study.slug}`}
      className={`${cardShell} grid lg:min-h-[510px] lg:grid-cols-[1.105fr_1fr]`}
    >
      <div className="p-2.5">
        <CardPhoto
          study={study}
          className="h-[280px] sm:h-[380px] lg:h-full lg:min-h-[490px]"
        />
      </div>
      <div className="flex flex-col p-6 sm:p-10 lg:p-[46px]">
        <CardLabels category={study.category} />
        <div className="flex flex-1 items-end pb-8 pt-10">
          <h2 className="font-display text-[28px] font-semibold leading-[1.18] tracking-tight text-heading sm:text-[34px] lg:text-[38px]">
            {study.headline}
          </h2>
        </div>
        <div className="flex items-end justify-between border-t border-secondary-100 pt-5">
          <StatBlock study={study} large />
          <ArrowButton color={study.accent} />
        </div>
      </div>
    </Link>
  );
}

/** The two smaller cards: photo on top, text underneath. */
function StandardCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      to={`/case-studies/${study.slug}`}
      className={`${cardShell} flex flex-col`}
    >
      <div className="p-2.5">
        <CardPhoto study={study} className="h-[240px] sm:h-[280px]" />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-7 pt-5 sm:px-[26px]">
        <CardLabels category={study.category} />
        <h2 className="mb-8 mt-8 font-display text-[24px] font-semibold leading-[1.2] tracking-tight text-heading sm:text-[28px]">
          {study.headline}
        </h2>
        <div className="mt-auto flex items-end justify-between border-t border-secondary-100 pt-5">
          <StatBlock study={study} large={false} />
          <ArrowButton color={study.accent} />
        </div>
      </div>
    </Link>
  );
}

export default function CaseStudies() {
  const [first, ...rest] = caseStudies;
  const isDark = useDarkTransition();

  return (
    <section
      className={`pb-[120px] pt-[120px] transition-colors duration-700 ease-in-out lg:pt-[150px] ${
        isDark ? "bg-secondary-500" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-[1360px]">
          <SectionHeading
            headingAs="h1"
            animate
            theme={isDark ? "dark" : "light"}
            eyebrow="Case Studies"
            heading="See fast decisions in action."
            description="How enterprises turn fragmented inventory and procurement data into faster, more confident decisions with Superatom AI."
            descriptionClassName="max-w-xl"
          />

          <div className="mt-12 flex flex-col gap-6">
            {first && <FeaturedCard study={first} />}
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {rest.map((study) => (
                  <StandardCard key={study.slug} study={study} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
