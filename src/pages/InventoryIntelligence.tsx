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
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

const heroPreview: { label: string; Icon: IconComponent }[] = [
  { label: "Predict excess", Icon: TrendingUpIcon },
  { label: "Rebalance inventory", Icon: SwapHorizIcon },
  { label: "Prevent stockouts", Icon: ShieldIcon },
  { label: "Optimize replenishment", Icon: AutorenewIcon },
];

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

function InventoryHealthCard() {
  return (
    <div className="w-full max-w-[260px] rounded-xl border border-secondary-100 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(13,23,56,0.35)]">
      <p className="text-xs font-semibold text-caption">Inventory Health</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-success-500" aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-heading">On Track</span>
      </div>
      <svg viewBox="0 0 160 40" className="mt-3 h-10 w-full" fill="none" aria-hidden="true">
        <polyline
          points="0,28 20,24 40,30 60,18 80,22 100,10 120,16 140,6 160,12"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PreviewListCard() {
  return (
    <div className="w-full max-w-[240px] rounded-xl border border-secondary-100 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(13,23,56,0.35)]">
      <ul className="space-y-3">
        {heroPreview.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
              <Icon style={{ fontSize: 15 }} />
            </span>
            <span className="text-xs font-medium text-heading">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InventoryIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Hero: same dark gradient + grid-pattern treatment used by Hero3's
          video card, in place of the reference's warehouse photograph. */}
      <section className="relative overflow-hidden bg-secondary-500 py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(900px 560px at 12% 8%, rgba(83,58,253,0.4), transparent 60%), radial-gradient(700px 520px at 90% 95%, rgba(255,118,0,0.22), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                theme="dark"
                eyebrow="Inventory Intelligence"
                eyebrowColor="accent"
                heading={
                  <>
                    End-to-End
                    <br />
                    <span
                      className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent"
                      style={{ overflowWrap: "break-word", hyphens: "auto" }}
                    >
                      Inventory Intelligence.
                    </span>
                  </>
                }
                description="Superatom brings together your data, business context, rules, policies to help you optimize, rebalance and proactively manage inventory across your entire supply chain."
                descriptionClassName="max-w-xl"
              />

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="accent"
                  iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
                  onClick={() => setDemoOpen(true)}
                >
                  Book a Demo
                </Button>
                <Button
                  href="#"
                  variant="secondary"
                  className="!border-white/30 !bg-transparent !text-white hover:!border-white/60 hover:!bg-white/10"
                >
                  Explore the Platform
                </Button>
              </div>

              <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/10">
                {heroStats.map(({ label, Icon }) => (
                  <div key={label} className="flex items-center gap-3 sm:flex-1 sm:px-6 sm:first:pl-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-accent-400">
                      <Icon style={{ fontSize: 18 }} />
                    </span>
                    <span className="text-sm font-medium text-white/85">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-5 lg:items-end">
              <InventoryHealthCard />
              <PreviewListCard />
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
      <section className="bg-primary-100/40 py-16 sm:py-24">
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
            className="mx-auto max-w-2xl"
            descriptionClassName="mx-auto"
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
