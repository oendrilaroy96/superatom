import { useState, type ReactNode } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectionHeading from "../components/ui/SectionHeading";

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "What is Superatom AI?",
    answer:
      "Superatom AI is a Data-to-Insights platform that acts like an analyst for leadership teams. It connects directly to enterprise systems such as ERPs, CRMs, databases, and operational tools to deliver real-time, actionable insights. Instead of analyzing dashboards or switching between apps, users get clear answers, explanations, and recommended actions instantly. Superatom transforms complex enterprise data into simple, decision-ready intelligence for every team.",
  },
  {
    question: "Who is Superatom AI for?",
    answer:
      "Superatom AI is designed for business leaders, operations teams, analysts, and decision-makers who work with high-volume enterprise data. It helps organizations reduce decision delays, improve visibility, and take data-driven actions easily. Whether you work in supply chain, logistics, manufacturing, sales, or finance, Superatom provides every role with the insights they need—without depending on BI teams or analysts.",
  },
  {
    question: "How is Superatom AI different from a traditional dashboard?",
    answer: (
      <>
        <p className="font-medium text-heading">
          Dashboards show data. Superatom drives decisions.
        </p>
        <p className="mt-2">
          Instead of static charts and predefined layouts, Superatom
          interprets enterprise data in real time and explains what&rsquo;s
          happening, why it&rsquo;s happening, and what to do next. Its
          adaptive UI adjusts based on questions and workflows, helping
          teams move seamlessly from data → insights → action in one
          place—without dashboard overload or context switching.
        </p>
      </>
    ),
  },
  {
    question: "Can Superatom AI integrate with our existing systems?",
    answer:
      "Yes. Superatom integrates seamlessly with ERPs, CRMs, WMS, databases, IoT systems, and internal APIs. It doesn't replace your tools—it unifies them. By pulling data into a single intelligence layer, Superatom delivers end-to-end visibility across operations without disrupting existing workflows or security policies.",
  },
  {
    question: "How does Superatom AI improve decision-making?",
    answer: (
      <>
        <p className="font-medium text-heading">
          Superatom eliminates guesswork.
        </p>
        <p className="mt-2">
          It analyzes data across all systems, identifies patterns,
          highlights anomalies, and surfaces the insights that matter
          most—instantly. Instead of digging through reports, teams
          receive ready-to-use intelligence, recommended actions, and
          workflow shortcuts, enabling faster and more confident decisions
          across supply chain, sales, operations, and finance.
        </p>
      </>
    ),
  },
  {
    question: "Do we need training to use Superatom AI?",
    answer:
      "Not at all. Superatom is built for a zero learning curve. Its conversational interface lets users ask questions in natural language and receive instant insights. With its no-code workflows and adaptive UI, anyone can explore data, generate reports, or trigger actions—just like chatting with a personal operations assistant.",
  },
  {
    question: "Is Superatom AI secure?",
    answer:
      "Yes. Superatom follows enterprise-grade security and compliance standards. All data remains within your environment, fully encrypted, and protected by role-based access controls. While the platform makes data access smarter and easier, it never compromises on security, governance, or auditability.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-secondary-100 py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-heading">{question}</span>
        <ExpandMoreIcon
          style={{ fontSize: 22 }}
          className={`shrink-0 text-caption transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* grid-template-rows 0fr -> 1fr gives a smooth height animation
          without measuring the content; the inner opacity crossfades
          separately so the text fades in/out rather than popping. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`pt-3 text-sm leading-relaxed text-body transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
              open ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          theme="light"
          eyebrow="FAQ"
          eyebrowColor="primary"
          heading="Frequently asked questions"
          className="mx-auto max-w-2xl"
        />

        <div className="mx-auto mt-14 max-w-3xl">
          {faqs.length > 0 ? (
            faqs.map((f) => (
              <FaqItem
                key={f.question}
                question={f.question}
                answer={f.answer}
                open={openQuestion === f.question}
                onToggle={() =>
                  setOpenQuestion((prev) => (prev === f.question ? null : f.question))
                }
              />
            ))
          ) : (
            <p className="text-center text-sm text-caption">
              We&rsquo;re putting together answers to the questions we hear most. Check back soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
