// Case studies shown on /case-studies and /case-studies/:slug. To add one, add an entry here
// and put its photo in public/case-studies/.

export type CaseStudy = {
  slug: string;
  /** Small label shown above the title, e.g. "Inventory intelligence". */
  category: string;
  /** Long page title. */
  title: string;
  /** Short headline used on the list card and in "Next case study". */
  headline: string;
  /** One-paragraph summary used on the list card and under the page title. */
  summary: string;
  /** Headline number, shown on the list card, over the photo and in the result section. */
  stat: { value: string; label: string };
  image: { src: string; alt: string };
  /** Colour of the round arrow button on the list card. */
  accent: string;
  customer: string;
  challenge: string[];
  /** Three short figures in the lavender strip under the challenge. */
  signals: { value: string; label: string }[];
  /** `text` is optional: some case studies list one-line solution points. */
  solution: { title: string; text?: string }[];
  quote: string;
  results: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "inventory-redistribution",
    category: "Inventory intelligence",
    title: "Inventory Optimization & Redistribution Intelligence",
    headline: "Turning trapped inventory into working capital.",
    summary:
      "A machine-learning and optimization system that identifies stranded stock, calculates the right transfers, and moves inventory only when the economics make sense.",
    stat: { value: "$50+M", label: "in dead/excess inventory identified" },
    image: {
      src: "/case-studies/distribution-center.webp",
      alt: "Aerial view of a modern distribution center filled with shipping containers",
    },
    accent: "#533afd",
    customer: "Leading building materials distributor across North America.",
    challenge: [
      "Significant dead stock sitting idle",
      "Limited visibility into inventory performance",
      "Difficulty identifying slow-moving and excess inventory",
      "Capital tied up in unsold products",
      "A highly complex, large-scale supply chain",
    ],
    signals: [
      { value: "ML", label: "inventory classification" },
      { value: "ROI", label: "transfer decisions" },
      { value: "E2E", label: "approval workflow" },
    ],
    solution: [
      {
        title: "ML-Based Inventory Classification",
        text: "Applied machine learning to identify dead stock, slow-moving SKUs, excess inventory and at-risk stock using sales velocity, inventory ageing, demand patterns and SKU-location history.",
      },
      {
        title: "Inventory Redistribution Optimization",
        text: "Used mathematical optimization to determine which products to transfer, from where, to where, in what quantity and when, subject to demand, stock availability and operational constraints.",
      },
      {
        title: "ROI-Driven Transfer Optimization",
        text: "Optimized transfer quantities and routes by balancing expected sell-through, logistics and handling costs. Recommended transfers only when the expected net benefit justifies the cost.",
      },
      {
        title: "AI-Driven Transfer Workflows",
        text: "Generated prioritized transfer recommendations, route them for approval and initiated transfer orders through existing systems, with human oversight and execution tracking.",
      },
    ],
    quote:
      "The right stock. In the right market. Only when the move creates value.",
    results: [
      "Identified $50+M in dead/excess inventory",
      "Enabled data-driven redistribution of Dead stock/Overstock",
      "AI workflows to initiate the transfer by optimizing RoI and Transfer costs.",
    ],
  },
  {
    slug: "slob-value-recovery",
    category: "Value recovery",
    title: "SLOB Inventory Optimization & Value Recovery Intelligence",
    headline: "From spreadsheet firefighting to proactive value recovery.",
    summary:
      "A centralized decision platform that gives planning and commercial teams one workflow for identifying, acting on, and learning from slow-moving and obsolete stock.",
    stat: {
      value: "7.9M",
      label: "retail outlets in the distribution network",
    },
    image: {
      src: "/case-studies/warehouse-aisles.webp",
      alt: "Tall warehouse aisles lined with blue shelves and inventory",
    },
    accent: "#ff7eb0",
    customer: "Leading FMCG Manufacturer with Nationwide Distribution Network",
    challenge: [
      "Scale: 400+ products | 1,000+ SKUs | 21 plants | 26 C&FAs | 4 mother warehouses | 7.9M retail outlets.",
      "Manual Excel-based SLOB management process.",
      "Multiple handoffs between planners and brand teams.",
      "No centralized tracking of actions, ownership, or outcomes.",
      "Limited visibility into liquidation effectiveness and decision history.",
      "Slow, reactive inventory disposition decisions.",
    ],
    signals: [
      { value: "1K+", label: "SKUs managed" },
      { value: "21", label: "plants connected" },
      { value: "26", label: "C&FAs" },
    ],
    solution: [
      { title: "Centralized SLOB Decision Intelligence Platform." },
      {
        title:
          "Workflow-driven collaboration between planning and commercial teams.",
      },
      { title: "Optimization engine recommending liquidation actions." },
      {
        title: "End-to-end traceability from identification to liquidation.",
      },
    ],
    quote:
      "Every ageing SKU became a visible decision—not a forgotten row in a spreadsheet.",
    results: [
      "Single source of truth for SLOB decisions.",
      "Reduced manual effort and process inefficiencies.",
      "Faster decision cycles and action execution.",
      "More proactive management of slow-moving and obsolete inventory.",
    ],
  },
  {
    slug: "transportation-procurement",
    category: "Transportation intelligence",
    title: "Transportation Procurement & Operations Intelligence",
    headline: "A single operating view across 140+ branches.",
    summary:
      "A connected intelligence layer across four legacy ERPs that aligns pricing, vendor procurement, margins, and live transportation operations.",
    stat: { value: "140+", label: "branches with real-time visibility" },
    image: {
      src: "/case-studies/freight-trucks.webp",
      alt: "Fleet of freight trucks parked at a logistics facility",
    },
    accent: "#ff7600",
    customer: "Diversified logistics and freight forwarding group",
    challenge: [
      "Fragmented data across 4 legacy ERPs",
      "Fluctuating vehicle hiring costs, margins impacted by pricing pressure",
      "Manual vendor learning, inconsistent price benchmarking for negotiations",
      "No real time tracking of indents, placements, bookings and loads",
    ],
    signals: [
      { value: "4", label: "legacy ERPs unified" },
      { value: "Live", label: "operations tracking" },
      { value: "ML", label: "rate benchmarks" },
    ],
    solution: [
      {
        title: "Unified Data Intelligence",
        text: "Integrated data across 4 legacy ERPs to create a consolidated view of branch-level financial and operational performance across 140+ branches.",
      },
      {
        title: "Dynamic Freight Pricing Intelligence",
        text: "Analyzed customer rates, vehicle hiring costs, lane-level pricing and target margins to identify pricing discrepancies and recommend corrected sales rates.",
      },
      {
        title: "ML-Based Vendor Rate Benchmarking",
        text: "Analyzed historical vendor quotes, hiring rates, lanes and vehicle types to establish price benchmarks, identified rate deviations and supported data-driven procurement negotiations.",
      },
      {
        title: "Transportation Procurement Optimization",
        text: "Compared vendor rates, vehicle availability and service requirements to recommend cost-effective vendor and vehicle allocation while protecting target margins.",
      },
      {
        title: "Real-Time Operations Visibility",
        text: "Tracked indents, vehicle placements, bookings and load status across branches to identify pending activities, delays and operational exceptions.",
      },
    ],
    quote: "One network view—from the price promised to the load delivered.",
    results: [
      "Real time branch-level financial and operational metrics across 140+ branches",
      "Dynamic pricing visibility with corrected rates for sales teams",
      "Vendor visibility with standard price benchmarks for procurement teams",
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((s) => s.slug === slug);

/** "01", "02"… position of a study in the list. */
export const caseNumber = (index: number) => String(index + 1).padStart(2, "0");
