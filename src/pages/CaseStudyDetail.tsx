import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CaseStudyPhoto from "../components/CaseStudyPhoto";
import { useDarkTransition } from "../context/DarkTransitionContext";
import SectionHeading from "../components/ui/SectionHeading";
import { caseNumber, caseStudies, getCaseStudy } from "../lib/caseStudies";
import NotFound from "./NotFound";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";
/** Page container: the site's side padding, content capped at 1360px like the design. */
function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20 ${className}`}
    >
      <div className="mx-auto max-w-[1360px]">{children}</div>
    </div>
  );
}

/** Two-column section: small "01 / The challenge" label on the left, content on the right. */
function Chapter({
  number,
  label,
  heading,
  dark = false,
  children,
}: {
  number: string;
  label: string;
  heading: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <SectionHeading
        theme={dark ? "dark" : "light"}
        eyebrow={`${number} · ${label}`}
        heading={heading}
        className="max-w-[850px]"
      />
      <div className="mt-12">{children}</div>
    </div>
  );
}

export default function CaseStudyDetail() {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);
  const isDark = useDarkTransition();

  useEffect(() => {
    if (!study) return;
    const previous = document.title;
    document.title = `${study.title} | Superatom AI`;
    return () => {
      document.title = previous;
    };
  }, [study]);

  if (!study) return <NotFound />;

  const index = caseStudies.findIndex((s) => s.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextIndex = (index + 1) % caseStudies.length;
  const count = String(caseStudies.length).padStart(2, "0");

  return (
    <article>
      {/* Hero */}
      <header
        className="pt-10"
        style={{
          backgroundImage:
            "radial-gradient(520px 360px at 12% 5%, rgba(83,58,253,0.09), transparent 70%)",
        }}
      >
        <Container>
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-body transition-colors hover:text-heading"
          >
            <ArrowBackIcon style={{ fontSize: 18 }} />
            All case studies
          </Link>

          <div className="mt-9 flex items-start justify-between border-t border-secondary-100 pt-[22px] text-[11px] font-medium uppercase tracking-[0.12em] text-caption">
            <p>{study.category}</p>
            <p>
              {caseNumber(index)} / {count}
            </p>
          </div>

          <div className="pb-8 pt-12 lg:pt-[54px]">
            <SectionHeading
              headingAs="h1"
              heading={study.title}
              className="max-w-[1180px]"
            />
          </div>

          <div className="mt-8 lg:mt-10">
            <CaseStudyPhoto
              src={study.image.src}
              alt={study.image.alt}
              className="h-[240px] rounded-[24px] border-[6px] border-white shadow-[0_24px_60px_-30px_rgba(13,23,56,0.35)] sm:h-[300px] lg:h-[360px]"
            >
              <span className="absolute inset-0 bg-gradient-to-t from-secondary-500/85 to-secondary-500/0 to-[60%]" />
              <div className="absolute bottom-5 left-5 right-5 sm:left-8 lg:bottom-7 lg:left-10">
                <p className="font-display text-[48px] font-semibold leading-[0.85] tracking-[-0.06em] text-white sm:text-[64px] lg:text-[80px]">
                  {study.stat.value}
                </p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                  {study.stat.label}
                </p>
              </div>
            </CaseStudyPhoto>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[22px] border border-primary-500/15 bg-primary-100/60 py-6 pl-7 pr-6 sm:py-7 sm:pl-9 sm:pr-8 lg:mt-10">
            <span
              className="absolute left-0 top-0 h-full w-1.5"
              style={{ backgroundImage: BRAND_GRADIENT }}
              aria-hidden="true"
            />
            <dl className="grid items-center gap-2 sm:grid-cols-[225px_1fr] sm:gap-6">
              <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary-500">
                Customer profile
              </dt>
              <dd className="font-display text-[22px] font-semibold leading-snug tracking-tight text-heading sm:text-[28px]">
                {study.customer}
              </dd>
            </dl>
          </div>
          <div className="pb-10 lg:pb-12" />
        </Container>
      </header>

      {/* 01 The challenge */}
      <section className="py-16 lg:py-[100px]">
        <Container>
          <Chapter
            number="01"
            label="The challenge"
            heading="The signals were there. The system to act wasn’t."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {study.challenge.map((item, i) => (
                <li
                  key={item}
                  className={`grid grid-cols-[34px_1fr] items-start gap-3.5 rounded-2xl border border-secondary-100 bg-white p-5 shadow-[0_4px_7px_rgba(6,27,49,0.04)] sm:px-6 ${
                    study.challenge.length % 2 === 1 &&
                    i === study.challenge.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <span className="pt-1 text-[10px] font-medium leading-[15px] text-primary-500">
                    {caseNumber(i)}
                  </span>
                  <p className="text-base leading-[1.6] text-body">{item}</p>
                </li>
              ))}
            </ul>
          </Chapter>
        </Container>
      </section>

      {/* 02 The solution */}
      <section
        className="relative bg-secondary-500 py-20 lg:py-[145px]"
        style={{
          backgroundImage:
            "radial-gradient(700px 520px at 12% 12%, rgba(83,58,253,0.4), transparent 62%), radial-gradient(640px 480px at 90% 90%, rgba(255,118,0,0.2), transparent 60%)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ backgroundImage: BRAND_GRADIENT }}
          aria-hidden="true"
        />
        <Container>
          <Chapter
            number="02"
            label="The solution"
            heading="From fragmented data to a decision engine."
            dark
          >
            <ol className="flex flex-col gap-3.5">
              {study.solution.map((step, i) => (
                <li
                  key={step.title}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-[42px_1fr] sm:items-start sm:gap-5 sm:p-7"
                >
                  <span className="text-[10px] font-medium leading-[15px] text-primary-300">
                    {caseNumber(i)}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-[1.3] tracking-tight text-white sm:text-[24px]">
                      {step.title}
                    </h3>
                    {step.text && (
                      <p className="mt-3 max-w-[780px] text-base leading-[1.75] text-white/60">
                        {step.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>
        </Container>
      </section>

      {/* Quote */}
      <Container className="pt-20 lg:pt-[110px]">
        <CaseStudyPhoto src={study.image.src} alt="" className="rounded-[24px]">
          <span
            className="absolute inset-0 opacity-[0.8]"
            style={{ backgroundImage: BRAND_GRADIENT }}
            aria-hidden="true"
          />
          <figure className="relative grid gap-4 p-8 sm:p-14 lg:grid-cols-[110px_1fr] lg:gap-[35px] lg:p-[105px]">
            <span
              className="font-display text-[80px] font-semibold leading-[0.7] text-white lg:text-[100px]"
              aria-hidden="true"
            >
              “
            </span>
            <blockquote className="max-w-[1000px] font-display text-[26px] font-semibold leading-[1.2] tracking-tight text-white sm:text-[34px] lg:text-[44px]">
              {study.quote}
            </blockquote>
          </figure>
        </CaseStudyPhoto>
      </Container>

      {/* The last two sections (result, next case study) fade to dark in step with the page's dark footer block. */}
      <div
        className={`transition-colors duration-700 ease-in-out ${isDark ? "bg-secondary-500" : "bg-transparent"}`}
      >
        {/* 03 The result */}
        <section className="py-16 lg:py-[145px]">
          <Container>
            <Chapter
              number="03"
              label="The result"
              heading="Clarity that compounds into action."
              dark={isDark}
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,411fr)_minmax(0,617fr)]">
                <div className="rounded-[18px] bg-primary-100 p-8 sm:p-10">
                  <p className="font-display text-[64px] font-semibold leading-[0.9] tracking-[-0.06em] text-heading sm:text-[88px] lg:text-[105px]">
                    {study.stat.value}
                  </p>
                  <p className="mt-6 max-w-[250px] text-base leading-[1.55] text-body">
                    {study.stat.label}
                  </p>
                </div>
                <ul className="flex flex-col gap-3">
                  {study.results.map((result) => (
                    <li
                      key={result}
                      className="flex flex-1 gap-4 rounded-[14px] border border-secondary-100 bg-white p-[22px] text-[15px] leading-[1.65] text-body"
                    >
                      <span
                        className="shrink-0 text-base leading-6 text-primary-500"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </Chapter>
          </Container>
        </section>

        {/* Next case study */}
        <Container className="pb-20 lg:pb-[100px]">
          <Link
            to={`/case-studies/${next.slug}`}
            className="group block rounded-[18px] border border-secondary-100 bg-white p-4 shadow-[0_4px_7px_rgba(6,27,49,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgba(6,27,49,0.25)] sm:p-5 lg:px-6 lg:py-5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary-500">
              Next case study / {caseNumber(nextIndex)}
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-6">
              <p className="max-w-[850px] font-display text-[16px] font-semibold leading-[1.25] tracking-tight text-heading sm:text-[18px] lg:text-[20px]">
                {next.headline}
              </p>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowForwardIcon style={{ fontSize: 16 }} />
              </span>
            </div>
          </Link>
        </Container>
      </div>
    </article>
  );
}
