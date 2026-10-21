import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "../components/ui/Button";
import DemoModal from "../components/DemoModal";
import { useDarkTransition } from "../context/DarkTransitionContext";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

/** Small gradient dash + label, the eyebrow treatment used across the other redesigned pages. */
function Eyebrow({
  children,
  align = "left",
  dark = false,
}: {
  children: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}>
      <span
        className="h-0.5 w-6 shrink-0 rounded-full"
        style={{ backgroundImage: "linear-gradient(90deg, #29b9bb, #533afd)" }}
        aria-hidden="true"
      />
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-700 ease-in-out ${
          dark ? "text-white/60" : "text-caption"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

type CaseStudy = {
  id: string;
  /** Short label for the jump links and the industry chip. */
  industry: string;
  solution: { name: string; path: string };
  title: string;
  customer: string;
  /** Headline numbers; `kind` says whether they describe the customer's scale or a result. */
  figures: { kind: "Scale" | "Result"; items: { value: string; label: string }[] };
  challenge: string[];
  approach: { lead?: string; text: string }[];
  results: string[];
};

const INVENTORY = { name: "Inventory Intelligence", path: "/solutions/inventory-intelligence" };
const PROCUREMENT = { name: "Procurement Intelligence", path: "/solutions/procurement-intelligence" };

const caseStudies: CaseStudy[] = [
  {
    id: "inventory-redistribution",
    industry: "Building materials",
    solution: INVENTORY,
    title: "Inventory Optimization & Redistribution Intelligence",
    customer: "Leading building materials distributor across North America.",
    figures: {
      kind: "Result",
      items: [{ value: "$50M+", label: "in dead and excess inventory identified" }],
    },
    challenge: [
      "Significant dead stock sitting idle",
      "Limited visibility into inventory performance",
      "Difficulty identifying slow-moving and excess inventory",
      "Capital tied up in unsold products",
      "A highly complex, large-scale supply chain",
    ],
    approach: [
      {
        lead: "ML-Based Inventory Classification",
        text: "Applied machine learning to identify dead stock, slow-moving SKUs, excess inventory and at-risk stock using sales velocity, inventory ageing, demand patterns and SKU-location history.",
      },
      {
        lead: "Inventory Redistribution Optimization",
        text: "Used mathematical optimization to determine which products to transfer, from where, to where, in what quantity and when, subject to demand, stock availability and operational constraints.",
      },
      {
        lead: "ROI-Driven Transfer Optimization",
        text: "Optimized transfer quantities and routes by balancing expected sell-through, logistics and handling costs. Recommended transfers only when the expected net benefit justifies the cost.",
      },
      {
        lead: "AI-Driven Transfer Workflows",
        text: "Generated prioritized transfer recommendations, routed them for approval and initiated transfer orders through existing systems, with human oversight and execution tracking.",
      },
    ],
    results: [
      "Identified $50M+ in dead and excess inventory",
      "Enabled data-driven redistribution of dead stock and overstock",
      "AI workflows to initiate transfers by optimizing ROI and transfer costs",
    ],
  },
  {
    id: "slob-value-recovery",
    industry: "FMCG manufacturing",
    solution: INVENTORY,
    title: "SLOB Inventory Optimization & Value Recovery Intelligence",
    customer: "Leading FMCG manufacturer with a nationwide distribution network.",
    figures: {
      kind: "Scale",
      items: [
        { value: "400+", label: "products" },
        { value: "1,000+", label: "SKUs" },
        { value: "21", label: "plants" },
        { value: "26", label: "C&FAs" },
        { value: "4", label: "mother warehouses" },
        { value: "7.9M", label: "retail outlets" },
      ],
    },
    challenge: [
      "Manual, Excel-based SLOB management process",
      "Multiple handoffs between planners and brand teams",
      "No centralized tracking of actions, ownership, or outcomes",
      "Limited visibility into liquidation effectiveness and decision history",
      "Slow, reactive inventory disposition decisions",
    ],
    approach: [
      { text: "Centralized SLOB decision intelligence platform." },
      { text: "Workflow-driven collaboration between planning and commercial teams." },
      { text: "Optimization engine recommending liquidation actions." },
      { text: "End-to-end traceability from identification to liquidation." },
    ],
    results: [
      "Single source of truth for SLOB decisions",
      "Reduced manual effort and process inefficiencies",
      "Faster decision cycles and action execution",
      "More proactive management of slow-moving and obsolete inventory",
    ],
  },
  {
    id: "transportation-procurement",
    industry: "Logistics & freight",
    solution: PROCUREMENT,
    title: "Transportation Procurement & Operations Intelligence",
    customer: "Diversified logistics and freight forwarding group.",
    figures: {
      kind: "Scale",
      items: [
        { value: "140+", label: "branches" },
        { value: "4", label: "legacy ERPs unified" },
      ],
    },
    challenge: [
      "Fragmented data across 4 legacy ERPs",
      "Fluctuating vehicle hiring costs, with margins hit by pricing pressure",
      "Manual vendor learning and inconsistent price benchmarking for negotiations",
      "No real-time tracking of indents, placements, bookings and loads",
    ],
    approach: [
      {
        lead: "Unified Data Intelligence",
        text: "Integrated data across 4 legacy ERPs to create a consolidated view of branch-level financial and operational performance across 140+ branches.",
      },
      {
        lead: "Dynamic Freight Pricing Intelligence",
        text: "Analyzed customer rates, vehicle hiring costs, lane-level pricing and target margins to identify pricing discrepancies and recommend corrected sales rates.",
      },
      {
        lead: "ML-Based Vendor Rate Benchmarking",
        text: "Analyzed historical vendor quotes, hiring rates, lanes and vehicle types to establish price benchmarks, identified rate deviations and supported data-driven procurement negotiations.",
      },
      {
        lead: "Transportation Procurement Optimization",
        text: "Compared vendor rates, vehicle availability and service requirements to recommend cost-effective vendor and vehicle allocation while protecting target margins.",
      },
      {
        lead: "Real-Time Operations Visibility",
        text: "Tracked indents, vehicle placements, bookings and load status across branches to identify pending activities, delays and operational exceptions.",
      },
    ],
    results: [
      "Real-time branch-level financial and operational metrics across 140+ branches",
      "Dynamic pricing visibility with corrected rates for sales teams",
      "Vendor visibility with standard price benchmarks for procurement teams",
    ],
  },
];

function PanelLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? "text-white/60" : "text-caption"}`}
    >
      {children}
    </p>
  );
}

function CaseStudySection({ study, first }: { study: CaseStudy; first: boolean }) {
  return (
    <section
      id={study.id}
      className={`scroll-mt-24 ${first ? "" : "border-t border-secondary-100 pt-[96px]"} pb-[96px]`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-primary-500">
              {study.industry}
            </span>
            <Link
              to={study.solution.path}
              className="inline-flex items-center gap-1 rounded-full border border-secondary-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-caption transition-colors hover:border-primary-200 hover:text-heading"
            >
              {study.solution.name}
              <ArrowForwardIcon style={{ fontSize: 12 }} />
            </Link>
          </div>
          <h2 className="mt-6 max-w-4xl font-display text-[32px] font-semibold leading-[1.15] tracking-tight text-heading sm:text-[44px]">
            {study.title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-body">
            <span className="font-semibold text-heading">Customer: </span>
            {study.customer}
          </p>

          <div className="mt-8">
            <PanelLabel>{study.figures.kind === "Scale" ? "Scale of the operation" : "Headline result"}</PanelLabel>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {study.figures.items.map((item) => (
                <li
                  key={item.label}
                  className={`rounded-2xl border border-secondary-100 bg-white p-5 ${
                    study.figures.items.length === 1 ? "col-span-2 sm:col-span-3 lg:col-span-3" : ""
                  }`}
                >
                  <p
                    className="bg-clip-text font-display text-[30px] font-bold leading-none tracking-tight text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    {item.value}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-snug text-caption">{item.label}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-[24px] border border-secondary-100 bg-page p-7 sm:p-8">
                <PanelLabel>The challenge</PanelLabel>
                <ul className="mt-5 space-y-3.5">
                  {study.challenge.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] bg-secondary-500 p-7 sm:p-8">
                <PanelLabel dark>Results</PanelLabel>
                <ul className="mt-5 space-y-3.5">
                  {study.results.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/90">
                      <CheckCircleIcon style={{ fontSize: 20, color: "#22d3ee" }} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[24px] border border-secondary-100 bg-white p-7 sm:p-8 lg:col-span-7">
              <PanelLabel>The solution</PanelLabel>
              <ul className="mt-5 space-y-6">
                {study.approach.map((step) => (
                  <li key={step.lead ?? step.text} className="flex gap-4">
                    <span
                      className="mt-2 h-2 w-5 shrink-0 rounded-full"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                      aria-hidden="true"
                    />
                    <div>
                      {step.lead && (
                        <p className="font-display text-lg font-semibold leading-snug tracking-tight text-heading">
                          {step.lead}
                        </p>
                      )}
                      <p
                        className={`text-[15px] leading-relaxed text-body ${
                          step.lead ? "mt-1.5" : "text-heading"
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudies() {
  const isDark = useDarkTransition();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="pb-[72px] pt-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <Eyebrow>Customer outcomes</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[58px]">
            Results,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              measured
            </span>
            . Not promised.
          </h1>
          <p className="mt-10 max-w-xl text-p leading-relaxed text-body">
            A look at how teams are putting Superatom AI to work across
            inventory, procurement, and supply chain decisions.
          </p>
          <nav aria-label="Case studies" className="mt-8 flex flex-wrap gap-2.5">
            {caseStudies.map((study) => (
              <a
                key={study.id}
                href={`#${study.id}`}
                className="rounded-full border border-secondary-100 bg-white px-4 py-2.5 text-[13px] font-medium text-heading transition-colors hover:border-primary-200 hover:bg-page"
              >
                {study.industry}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {caseStudies.map((study, i) => (
        <CaseStudySection key={study.id} study={study} first={i === 0} />
      ))}

      {/* Closing call to action; fades to dark in step with the page's dark footer block. */}
      <section
        className={`py-[120px] transition-colors duration-700 ease-in-out ${
          isDark ? "bg-secondary-500" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <Eyebrow align="center" dark={isDark}>
              Your operation
            </Eyebrow>
            <h2
              className={`font-display text-[32px] font-semibold leading-[1.15] tracking-tight transition-colors duration-700 ease-in-out sm:text-[44px] ${
                isDark ? "text-white" : "text-heading"
              }`}
            >
              See what Superatom AI could do for yours.
            </h2>
            <p
              className={`max-w-md text-sm leading-relaxed transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/70" : "text-body"
              }`}
            >
              Book a short demo to see how it works on inventory and procurement decisions like these.
            </p>
            <Button variant="primary" onClick={() => setDemoOpen(true)}>
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
