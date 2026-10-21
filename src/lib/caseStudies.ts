import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import type { IconComponent } from "../types/icon";

// Case studies shown on /case-studies and /case-studies/:slug. To add one, add an entry here.

export type CaseStudy = {
  slug: string;
  /** Short industry label shown as a tag. */
  industry: string;
  solution: { name: string; path: string };
  title: string;
  customer: string;
  /** Headline numbers; `kind` says whether they describe the customer's scale or a result. */
  figures: { kind: "Scale" | "Result"; items: { value: string; label: string }[] };
  challenge: string[];
  approach: { lead?: string; text: string }[];
  results: string[];
  /** One big number for the card on the list page. */
  card: { kind: "Scale" | "Result"; value: string; label: string };
  Icon: IconComponent;
};

const INVENTORY = { name: "Inventory Intelligence", path: "/solutions/inventory-intelligence" };
const PROCUREMENT = { name: "Procurement Intelligence", path: "/solutions/procurement-intelligence" };

export const caseStudies: CaseStudy[] = [
  {
    slug: "inventory-redistribution",
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
    card: { kind: "Result", value: "$50M+", label: "in dead and excess inventory identified" },
    Icon: WarehouseIcon,
  },
  {
    slug: "slob-value-recovery",
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
    card: { kind: "Scale", value: "7.9M", label: "retail outlets" },
    Icon: Inventory2Icon,
  },
  {
    slug: "transportation-procurement",
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
    card: { kind: "Scale", value: "140+", label: "branches on one consolidated view" },
    Icon: LocalShippingIcon,
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((s) => s.slug === slug);
