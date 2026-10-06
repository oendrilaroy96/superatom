import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InsightsIcon from "@mui/icons-material/Insights";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
import TuneIcon from "@mui/icons-material/Tune";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

const heroStats: { label: string; Icon: IconComponent }[] = [
  { label: "Make faster, smarter decisions", Icon: InsightsIcon },
  { label: "Reduce working capital and write-offs", Icon: AccountBalanceWalletIcon },
  { label: "Improve service levels and inventory turns", Icon: TuneIcon },
];

const capabilities: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "Inventory Optimization",
    desc: "Recommends optimal inventory levels by evaluating demand patterns, lead times and supply variability.",
    Icon: InsightsIcon,
  },
  {
    title: "Inventory Rebalancing",
    desc: "Recommends when, where and how much inventory to transfer across plants, warehouses and distribution centres to maximize availability and minimize carrying costs.",
    Icon: SwapHorizIcon,
  },
  {
    title: "Aging Inventory Intelligence",
    desc: "Identifies aging and slow-moving inventory early and recommends transfer, deployment, liquidation or production adjustments to reduce write-offs.",
    Icon: AccessTimeIcon,
  },
  {
    title: "Predictive Excess Inventory Intelligence",
    desc: "Predicts future excess inventory by evaluating demand trends, production plans, procurement schedules and inventory policies, enabling proactive actions before losses occur.",
    Icon: TrendingUpIcon,
  },
  {
    title: "Stockout Prevention",
    desc: "Predicts stockout risks and recommends replenishment, inventory transfers, production changes or expedited procurement to maintain service levels.",
    Icon: ShieldIcon,
  },
  {
    title: "Dynamic Inventory Policy Optimization",
    desc: "Continuously optimizes safety stock, reorder points and inventory norms based on changing demand, lead times and supply uncertainty.",
    Icon: TuneIcon,
  },
  {
    title: "Replenishment Decision Intelligence",
    desc: "Recommends what to replenish, when to replenish, where to deploy inventory and the optimal quantity across the network.",
    Icon: Inventory2Icon,
  },
];

const outcomes: { label: string; dir: "up" | "down" }[] = [
  { label: "Lower Working Capital", dir: "down" },
  { label: "Higher Service Levels", dir: "up" },
  { label: "Fewer Stockouts", dir: "down" },
  { label: "Lower Inventory Write-offs", dir: "down" },
  { label: "Lower Carrying Cost", dir: "down" },
  { label: "Better Inventory Turns", dir: "up" },
];

/**
 * Same hero/feature-card shape as SolutionPage.tsx (icon tile, centered
 * SectionHeading, single primary CTA, white bordered cards) so this page
 * reads as the same site as Procurement's, rather than its own one-off
 * design — it just carries more content (a stat row, then a second
 * Business Outcomes section) than the shared template does.
 */
export default function InventoryIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
              <Inventory2Icon style={{ fontSize: 28 }} />
            </span>
            <SectionHeading
              align="center"
              theme="light"
              eyebrow="Solutions"
              eyebrowColor="primary"
              heading={
                <>
                  End-to-End{" "}
                  <span
                    className="text-primary-500"
                    style={{ overflowWrap: "break-word", hyphens: "auto" }}
                  >
                    Inventory Intelligence.
                  </span>
                </>
              }
              description="Superatom brings together your data, business context, rules and policies to help you optimize, rebalance and proactively manage inventory across your entire supply chain."
            />
            <Button
              variant="primary"
              iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
              className="mx-auto mt-8 shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)]"
              onClick={() => setDemoOpen(true)}
            >
              Book a demo
            </Button>
          </div>

          <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-6 border-t border-secondary-100 pt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-4">
            {heroStats.map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <Icon style={{ fontSize: 18 }} />
                </span>
                <span className="text-sm font-medium text-heading">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            align="center"
            theme="light"
            eyebrow="Capabilities"
            eyebrowColor="primary"
            heading="End-to-end inventory intelligence"
            description="From planning to execution, Superatom helps you make and automate better inventory decisions across your network."
            className="mx-auto max-w-2xl"
            descriptionClassName="mx-auto"
          />

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-lg border border-secondary-100 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <c.Icon style={{ fontSize: 22 }} />
                </span>
                <p className="text-h4 mt-4 font-display font-semibold text-heading">{c.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-caption">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business outcomes */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            align="center"
            theme="light"
            eyebrow="Business Outcomes"
            eyebrowColor="primary"
            heading={
              <>
                Better inventory decisions.
                <br />
                Tangible business impact.
              </>
            }
            description="Turn inventory from a cost center into a competitive advantage."
            descriptionClassName="mx-auto max-w-xl"
          />

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {outcomes.map((o) => (
              <div key={o.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                  {o.dir === "up" ? (
                    <ArrowUpwardIcon style={{ fontSize: 18 }} />
                  ) : (
                    <ArrowDownwardIcon style={{ fontSize: 18 }} />
                  )}
                </span>
                <p className="text-xs font-semibold text-heading">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
