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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
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

const industries: { label: string; Icon: IconComponent }[] = [
  { label: "Supply Chain & Logistics", Icon: LocalShippingIcon },
  { label: "Retail & E-Commerce", Icon: StorefrontIcon },
  { label: "Financial Services", Icon: AccountBalanceIcon },
  { label: "Healthcare", Icon: LocalHospitalIcon },
  { label: "Manufacturing", Icon: PrecisionManufacturingIcon },
];

const outcomes: { label: string; dir: "up" | "down" }[] = [
  { label: "Lower Working Capital", dir: "down" },
  { label: "Higher Service Levels", dir: "up" },
  { label: "Fewer Stockouts", dir: "down" },
  { label: "Lower Inventory Write-offs", dir: "down" },
  { label: "Lower Carrying Cost", dir: "down" },
  { label: "Better Inventory Turns", dir: "up" },
];

export default function InventoryIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Two-column hero, matching the site's other left-text/right-visual
          heroes (e.g. Infrastructure.tsx) instead of SolutionPage's
          centered layout — the right side is a stat card rather than a
          dashboard mockup. */}
      <section className="py-16 sm:py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                theme="light"
                eyebrow="Inventory Intelligence"
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
                className="mt-8 shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)]"
                onClick={() => setDemoOpen(true)}
              >
                Book a demo
              </Button>
            </div>

            <div className="rounded-2xl border border-secondary-100 bg-white p-8 shadow-[0_30px_60px_-30px_rgba(13,23,56,0.15)]">
              <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-caption">
                Why Inventory Intelligence
              </p>
              <div className="mt-5 space-y-5">
                {heroStats.map(({ label, Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                      <Icon style={{ fontSize: 20 }} />
                    </span>
                    <p className="pt-2 text-sm font-medium text-heading">{label}</p>
                  </div>
                ))}
              </div>
            </div>
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

          {/* Two rows of 4 and 3 (rather than one 4-col grid, which left
              the last row's 3 cards sitting left-aligned with an empty
              slot) so the bottom row's cards spread evenly across the
              full width instead. */}
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.slice(0, 4).map((c) => (
              <div key={c.title} className="rounded-lg border border-secondary-100 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  <c.Icon style={{ fontSize: 22 }} />
                </span>
                <p className="text-h4 mt-4 font-display font-semibold text-heading">{c.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-caption">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.slice(4).map((c) => (
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

      {/* Industries */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <SectionHeading
            align="center"
            theme="light"
            eyebrow="Industries"
            eyebrowColor="primary"
            heading="Built for every inventory-driven industry"
            description="Inventory Intelligence adapts to the demands of your sector, wherever stock needs to move."
            className="mx-auto max-w-2xl"
            descriptionClassName="mx-auto"
          />

          <div className="mx-auto mt-12 flex flex-wrap justify-center gap-4">
            {industries.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-full border border-secondary-100 bg-white px-5 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                  <Icon style={{ fontSize: 16 }} />
                </span>
                <span className="text-sm font-medium text-heading">{label}</span>
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

          {/* Same bordered-card shape as the Capabilities grid above,
              rather than bare icon circles floating in a row. */}
          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((o) => (
              <div
                key={o.label}
                className="flex items-center gap-4 rounded-lg border border-secondary-100 bg-white p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  {o.dir === "up" ? (
                    <ArrowUpwardIcon style={{ fontSize: 22 }} />
                  ) : (
                    <ArrowDownwardIcon style={{ fontSize: 22 }} />
                  )}
                </span>
                <p className="font-display text-h4 font-semibold text-heading">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
