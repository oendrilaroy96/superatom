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
  solution: { title: string; text: string }[];
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
    stat: { value: "$50M+", label: "dead and excess inventory identified" },
    image: {
      src: "/case-studies/distribution-center.webp",
      alt: "Aerial view of a modern distribution center filled with shipping containers",
    },
    accent: "#533afd",
    customer: "Leading building materials distributor across North America",
    challenge: [
      "Significant dead stock sitting idle across a large, complex supply chain.",
      "Limited visibility into inventory performance at SKU and location level.",
      "Difficulty identifying slow-moving, excess, and at-risk inventory.",
      "Working capital tied up in products that were unlikely to sell locally.",
    ],
    signals: [
      { value: "ML", label: "inventory classification" },
      { value: "ROI", label: "transfer decisions" },
      { value: "E2E", label: "approval workflow" },
    ],
    solution: [
      {
        title: "ML-based inventory classification",
        text: "Applied machine learning to identify dead stock, slow-moving SKUs, excess inventory, and at-risk stock using sales velocity, inventory ageing, demand patterns, and SKU-location history.",
      },
      {
        title: "Inventory redistribution optimization",
        text: "Used mathematical optimization to determine which products to transfer, from where, to where, in what quantity, and when—within demand, availability, and operational constraints.",
      },
      {
        title: "ROI-driven transfer decisions",
        text: "Balanced expected sell-through against logistics and handling costs. A transfer was recommended only when its expected net benefit justified the move.",
      },
      {
        title: "AI-driven transfer workflows",
        text: "Generated prioritized recommendations, routed them for approval, and initiated transfer orders through existing systems with human oversight and execution tracking.",
      },
    ],
    quote: "The right stock. In the right market. Only when the move creates value.",
    results: [
      "Identified more than $50M in dead and excess inventory.",
      "Enabled data-driven redistribution of overstock to higher-demand locations.",
      "Automated transfer initiation while optimizing ROI and transfer costs.",
    ],
  },
  {
    slug: "slob-value-recovery",
    category: "Value recovery",
    title: "SLOB Inventory Optimization & Value Recovery Intelligence",
    headline: "From spreadsheet firefighting to proactive value recovery.",
    summary:
      "A centralized decision platform that gives planning and commercial teams one workflow for identifying, acting on, and learning from slow-moving and obsolete stock.",
    stat: { value: "7.9M", label: "retail outlets in the distribution network" },
    image: {
      src: "/case-studies/warehouse-aisles.webp",
      alt: "Tall warehouse aisles lined with blue shelves and inventory",
    },
    accent: "#ff7eb0",
    customer: "Leading FMCG manufacturer with a nationwide distribution network",
    challenge: [
      "A manual, Excel-based SLOB management process operating at national scale.",
      "Multiple handoffs between planners and brand teams slowed action.",
      "No centralized tracking of actions, ownership, outcomes, or decision history.",
      "Limited visibility into liquidation effectiveness led to reactive disposition decisions.",
    ],
    signals: [
      { value: "1K+", label: "SKUs managed" },
      { value: "21", label: "plants connected" },
      { value: "26", label: "C&F agents" },
    ],
    solution: [
      {
        title: "One decision intelligence platform",
        text: "Created a centralized operating layer for SLOB inventory spanning 400+ products, 1,000+ SKUs, 21 plants, 26 C&FAs, four mother warehouses, and 7.9 million retail outlets.",
      },
      {
        title: "Workflow-driven collaboration",
        text: "Connected planning and commercial teams in a shared workflow, with explicit ownership, status, approvals, and an accessible decision history.",
      },
      {
        title: "Optimized liquidation actions",
        text: "Introduced an optimization engine that recommends the most effective liquidation action for each inventory position instead of relying on manual review.",
      },
      {
        title: "End-to-end traceability",
        text: "Tracked every item from identification through decision and liquidation, giving teams a clear view of execution and outcomes.",
      },
    ],
    quote: "Every ageing SKU became a visible decision—not a forgotten row in a spreadsheet.",
    results: [
      "Established a single source of truth for every SLOB decision.",
      "Reduced manual effort, handoffs, and process inefficiency.",
      "Accelerated decision cycles and action execution.",
      "Shifted teams toward proactive management of slow-moving and obsolete inventory.",
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
      "Data was fragmented across four legacy ERP systems.",
      "Fluctuating vehicle hiring costs and pricing pressure put margins at risk.",
      "Vendor learning was manual, with inconsistent price benchmarks for negotiation.",
      "No real-time tracking of indents, placements, bookings, or loads.",
    ],
    signals: [
      { value: "4", label: "legacy ERPs unified" },
      { value: "Live", label: "operations tracking" },
      { value: "ML", label: "rate benchmarks" },
    ],
    solution: [
      {
        title: "Unified data intelligence",
        text: "Integrated four legacy ERPs to create one view of branch-level financial and operational performance across more than 140 branches.",
      },
      {
        title: "Dynamic freight pricing",
        text: "Analyzed customer rates, vehicle hiring costs, lane-level pricing, and target margins to expose discrepancies and recommend corrected sales rates.",
      },
      {
        title: "ML-based vendor rate benchmarking",
        text: "Used historical quotes, hiring rates, lanes, and vehicle types to establish benchmarks, flag deviations, and strengthen procurement negotiations.",
      },
      {
        title: "Procurement and operations optimization",
        text: "Recommended cost-effective vendor and vehicle allocation while protecting margins, then tracked indents, placements, bookings, loads, delays, and exceptions in real time.",
      },
    ],
    quote: "One network view—from the price promised to the load delivered.",
    results: [
      "Delivered real-time branch-level financial and operational metrics across 140+ branches.",
      "Gave sales teams dynamic pricing visibility and corrected rate recommendations.",
      "Equipped procurement teams with vendor visibility and standardized price benchmarks.",
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((s) => s.slug === slug);

/** "01", "02"… position of a study in the list. */
export const caseNumber = (index: number) => String(index + 1).padStart(2, "0");
