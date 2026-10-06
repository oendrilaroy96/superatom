import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SavingsIcon from "@mui/icons-material/Savings";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BoltIcon from "@mui/icons-material/Bolt";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ShieldIcon from "@mui/icons-material/Shield";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

const heroStats: { label: string; Icon: IconComponent }[] = [
  { label: "Reduce costs and mitigate risk", Icon: SavingsIcon },
  { label: "Improve supplier performance", Icon: HandshakeIcon },
  { label: "Drive efficiency and compliance", Icon: BoltIcon },
];

const capabilities: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "Supplier Selection Intelligence",
    desc: "Recommends the optimal supplier by evaluating cost, quality, lead time, capacity, contracts, ESG, and supply risk.",
    Icon: GroupsIcon,
  },
  {
    title: "Procurement Planning",
    desc: "Determines whether procurement is required by evaluating inventory, demand forecasts, production plans, and existing purchase commitments.",
    Icon: CalendarMonthIcon,
  },
  {
    title: "Contract Intelligence",
    desc: "Recommends the most beneficial contract by evaluating pricing, commercial terms, commitments, expiry, and negotiated agreements.",
    Icon: DescriptionIcon,
  },
  {
    title: "Order Quantity Optimization",
    desc: "Recommends the optimal purchase quantity by balancing demand, inventory, MOQ, lead time, and working capital objectives.",
    Icon: Inventory2Icon,
  },
  {
    title: "Procurement Workflow Intelligence",
    desc: "Identifies routine procurement decisions that can be automated, while routing exceptions and high-impact trade-offs to the right teams with recommendations and explainable reasoning.",
    Icon: AccountTreeIcon,
  },
  {
    title: "Procurement Risk Intelligence",
    desc: "Continuously monitors supplier, geopolitical, logistics, and compliance risks and recommends proactive sourcing actions.",
    Icon: ShieldIcon,
  },
];

const outcomes: { label: string; dir: "up" | "down" }[] = [
  { label: "Lower Procurement Cost", dir: "down" },
  { label: "Lower Working Capital", dir: "down" },
  { label: "Better Contract Utilization", dir: "up" },
  { label: "Reliable Supply", dir: "up" },
  { label: "Lower Supplier Risk", dir: "down" },
  { label: "Higher Buyer Productivity", dir: "up" },
];

/**
 * Same page shape as InventoryIntelligence.tsx (two-column hero with a
 * stat card, capability grid, outcomes card grid) so the two Solutions
 * pages read as one consistent system rather than each inventing its own
 * layout.
 */
export default function ProcurementIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                theme="light"
                eyebrow="Procurement Intelligence"
                eyebrowColor="primary"
                heading={
                  <>
                    <span style={{ overflowWrap: "break-word", hyphens: "auto" }}>
                      Smarter procurement decisions.
                    </span>{" "}
                    <span
                      className="text-primary-500"
                      style={{ overflowWrap: "break-word", hyphens: "auto" }}
                    >
                      Greater value.
                    </span>
                  </>
                }
                description="Superatom brings together your data, business context, rules, and policies to help you make and automate better procurement decisions — from supplier selection to contracting, ordering and risk management."
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
                Why Procurement Intelligence
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
            heading={
              <span style={{ overflowWrap: "break-word", hyphens: "auto" }}>
                End-to-end procurement decision intelligence
              </span>
            }
            description="From sourcing to payment, Superatom helps you make and automate better procurement decisions across your entire supply chain."
            className="mx-auto max-w-2xl"
            descriptionClassName="mx-auto"
          />

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <span style={{ overflowWrap: "break-word", hyphens: "auto" }}>
                Lower costs. Greater resilience.
                <br />
                A more efficient procurement function.
              </span>
            }
            description="Turn procurement decisions into measurable business impact."
            descriptionClassName="mx-auto max-w-xl"
          />

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
