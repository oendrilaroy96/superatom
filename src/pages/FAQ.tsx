import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectionHeading from "../components/ui/SectionHeading";

// TODO: replace with the real questions/answers once they're provided.
const faqs: { question: string; answer: string }[] = [];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-secondary-100 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-heading">{question}</span>
        <ExpandMoreIcon
          style={{ fontSize: 22 }}
          className={`shrink-0 text-caption transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-body">{answer}</p>}
    </div>
  );
}

export default function FAQ() {
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
            faqs.map((f) => <FaqItem key={f.question} {...f} />)
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
