import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import GlowCard from "../components/ui/GlowCard";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

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

const highlights: { label: string; Icon: IconComponent }[] = [
  { label: "Make faster, smarter decisions", Icon: QueryStatsIcon },
  { label: "Reduce working capital and write-offs", Icon: LayersIcon },
  { label: "Improve service levels and inventory turns", Icon: SettingsSuggestIcon },
];

// One slot per card, front to back. Every offset is positive (right and
// down only) and rotation only ever tilts clockwise, so the stack cascades
// away to the bottom-right and the front card's left edge stays the clean,
// unobstructed side the eye lands on first — the stack is only ever
// "revealed" from the left, never peeking out past it.
const stackSlots = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 40, y: 28, rotate: 4, scale: 0.95, opacity: 0.95 },
  { x: 76, y: 58, rotate: 8, scale: 0.9, opacity: 0.85 },
  { x: 108, y: 90, rotate: 11, scale: 0.85, opacity: 0.7 },
  { x: 136, y: 122, rotate: 14, scale: 0.8, opacity: 0.55 },
  { x: 160, y: 152, rotate: 16, scale: 0.75, opacity: 0.4 },
  { x: 180, y: 180, rotate: 18, scale: 0.7, opacity: 0.25 },
];

// Pose for whichever card just stepped down from front: instead of easing
// into the back of the stack like every other card does, it slides out to
// the left and fades away, clearing the front slot for the next card to
// rise into. Used only for the ~750ms right after it loses the front spot.
const EXIT_SLOT = { x: -120, y: 16, rotate: -10, scale: 0.9, opacity: 0 };

// A single fixed portrait size used for every card in both the hero stack
// and the capabilities grid, so a card keeps the same footprint as it
// travels from one to the other instead of resizing mid-flight.
const CARD_W = 216;
const CARD_H = 288;

// How much bigger than its true (grid) size the stack renders while it
// still sits in the hero; lerps back down to 1 as the cards unstack into
// the grid, so there's nothing to pop between the two.
const HERO_SCALE = 1.3;

// How far below the sticky header (h-16 = 64px) the stack pins while the
// cards are unstacking into the grid below. The cards render above the
// header (see the overlay's z-index) so this is just a comfortable resting
// spot, not a boundary that has to avoid overlapping anything.
const PIN_TOP = 96;

// Scroll distance (px) spent fanning the stack open into a flat row while
// pinned in place, then the extra distance it just sits there, fully
// arranged and still, so there's a moment to actually read the cards
// before they continue down into the grid.
const UNSTACK_PX = 420;
const HOLD_PX = 480;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Icon, title and description shared by every rendering of a capability card. */
function CapabilityCardFace({ c }: { c: (typeof capabilities)[number] }) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
        <c.Icon style={{ fontSize: 22 }} />
      </span>
      <p className="mt-4 font-display text-h4 font-semibold text-heading">{c.title}</p>
      <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-caption">{c.desc}</p>
    </>
  );
}

/** Mobile/tablet fallback: the fanned stack with no scroll-driven morph. */
function MobileCardStack({ order, exitingIndex }: { order: number[]; exitingIndex: number | null }) {
  return (
    <div className="relative h-[420px] w-full max-w-sm">
      {capabilities.map((c, i) => {
        const slot = i === exitingIndex ? EXIT_SLOT : stackSlots[order.indexOf(i)];
        return (
          <div
            key={c.title}
            className="absolute inset-x-0 top-0 rounded-2xl border border-secondary-100 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})`,
              opacity: slot.opacity,
              zIndex: i === exitingIndex ? stackSlots.length + 1 : stackSlots.length - stackSlots.indexOf(slot),
            }}
          >
            <CapabilityCardFace c={c} />
          </div>
        );
      })}
    </div>
  );
}

/** Dark highlights bar (replaces the logo row right under the hero). */
function HighlightsBar() {
  return (
    <section id="inventory-dark-zone" className="border-t border-white/10 bg-secondary-500">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="flex flex-col divide-y divide-white/10 sm:flex-row sm:divide-x sm:divide-y-0">
          {highlights.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex flex-1 items-center justify-center gap-3 py-8 text-center sm:px-8"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(34,211,238,0.12)", color: "#22d3ee" }}
              >
                <Icon style={{ fontSize: 20 }} />
              </span>
              <p className="text-sm font-semibold text-white sm:text-base">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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

type CardStyle = {
  top: number;
  left: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
  ready: boolean;
};

export default function InventoryIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [order, setOrder] = useState(capabilities.map((_, i) => i));
  const [cardStyles, setCardStyles] = useState<CardStyle[]>(() =>
    capabilities.map((_, i) => {
      const slot = stackSlots[i];
      return {
        top: 0,
        left: 0,
        rotate: slot.rotate,
        scale: slot.scale,
        opacity: slot.opacity,
        zIndex: stackSlots.length - i,
        ready: false,
      };
    })
  );

  const heroSlotRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const morphActiveRef = useRef(false);

  // `updateMorph` is handed to useLenis below and must keep one stable
  // identity for the life of the component: useLenis re-subscribes whenever
  // the function reference it's given changes, and setCardStyles always
  // produces a brand-new array, so a fresh closure here on every render
  // would re-subscribe -> re-run -> setState -> re-render in an infinite
  // loop. Reading isDesktop/order/exitingIndex through refs (synced
  // post-render below) instead of closing over them directly keeps the
  // callback itself frozen.
  const isDesktopRef = useRef(isDesktop);
  const orderRef = useRef(order);
  const exitingIndexRef = useRef<number | null>(null);
  useEffect(() => {
    isDesktopRef.current = isDesktop;
    orderRef.current = order;
  });

  // Reads the hero slot's and each grid cell's live position and recomputes
  // every card's current spot along the hero -> grid journey, in four
  // stages driven purely by scroll position:
  //   A  scrollY <= morphStart       embedded in the hero, tracking 1:1
  //   B1 through unstackEndY         pinned, fanning out into a flat
  //                                  preview of the grid (each card gets
  //                                  its own spread-out spot, not a single
  //                                  shared point)
  //   B2 through holdEndY            pinned, holding that flat preview
  //                                  still so there's time to read it
  //   C-entry through morphEnd       glides from the preview into this
  //                                  card's own live grid-cell position
  //   C  beyond morphEnd             embedded in the grid, tracking 1:1
  // Each boundary is defined so the two formulas on either side agree
  // exactly at that scrollY (see the derivation in the project notes), so
  // there's nothing to pop between any two stages.
  const updateMorph = useCallback(() => {
    if (!isDesktopRef.current) return;
    const heroEl = heroSlotRef.current;
    const cell0 = cellRefs.current[0];
    if (!heroEl || !cell0) return;

    const scrollY = window.scrollY;
    const heroRect = heroEl.getBoundingClientRect();
    const cell0Rect = cell0.getBoundingClientRect();
    const heroLeft = heroRect.left;
    const heroDocTop = heroRect.top + scrollY;
    const cell0DocTop = cell0Rect.top + scrollY;

    const morphStart = heroDocTop - PIN_TOP;
    const morphEnd = cell0DocTop - PIN_TOP;
    const rawSpan = Math.max(1, morphEnd - morphStart);

    const unstackSpan = Math.max(60, Math.min(UNSTACK_PX, rawSpan * 0.4));
    const afterUnstack = Math.max(1, rawSpan - unstackSpan);
    const holdSpan = Math.max(0, Math.min(HOLD_PX, afterUnstack * 0.6));
    const glideSpan = Math.max(1, rawSpan - unstackSpan - holdSpan);

    const unstackEndY = morphStart + unstackSpan;
    const holdEndY = unstackEndY + holdSpan;

    morphActiveRef.current = scrollY > morphStart;

    // Fixed viewport-space preview of the final 4-then-3 grid, used while
    // pinned (B1/B2) so each card has its own spread-out reading spot
    // instead of all 7 collapsing onto one point as the fan closes.
    const READ_GAP = 16;
    const row1Width = 4 * CARD_W + 3 * READ_GAP;
    const row2Width = 3 * CARD_W + 2 * READ_GAP;
    const centerX = window.innerWidth / 2;
    const row1Left = centerX - row1Width / 2;
    const row2Left = centerX - row2Width / 2;
    const readPosFor = (i: number) =>
      i < 4
        ? { top: PIN_TOP, left: row1Left + i * (CARD_W + READ_GAP) }
        : { top: PIN_TOP + CARD_H + READ_GAP, left: row2Left + (i - 4) * (CARD_W + READ_GAP) };

    const order = orderRef.current;
    const exitingIndex = exitingIndexRef.current;
    const next = capabilities.map((_, i) => {
      const cellEl = cellRefs.current[i] ?? cell0;
      const cellRect = cellEl.getBoundingClientRect();
      const slot = i === exitingIndex ? EXIT_SLOT : stackSlots[order.indexOf(i)];
      const stackPos = { top: heroRect.top + slot.y, left: heroLeft + slot.x };
      const readPos = readPosFor(i);

      let fan: number;
      let top: number;
      let left: number;

      if (scrollY <= morphStart) {
        fan = 1;
        top = stackPos.top;
        left = stackPos.left;
      } else if (scrollY <= unstackEndY) {
        const localT = clamp((scrollY - morphStart) / unstackSpan, 0, 1);
        fan = 1 - localT;
        top = lerp(stackPos.top, readPos.top, localT);
        left = lerp(stackPos.left, readPos.left, localT);
      } else if (scrollY <= holdEndY) {
        fan = 0;
        top = readPos.top;
        left = readPos.left;
      } else if (scrollY <= morphEnd) {
        fan = 0;
        const localT = clamp((scrollY - holdEndY) / glideSpan, 0, 1);
        top = lerp(readPos.top, cellRect.top, localT);
        left = lerp(readPos.left, cellRect.left, localT);
      } else {
        fan = 0;
        top = cellRect.top;
        left = cellRect.left;
      }

      return {
        top,
        left,
        rotate: slot.rotate * fan,
        scale: lerp(1, slot.scale * HERO_SCALE, fan),
        opacity: lerp(1, slot.opacity, fan),
        zIndex: stackSlots.length - stackSlots.indexOf(slot),
        ready: true,
      };
    });
    setCardStyles(next);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    updateMorph();
    window.addEventListener("resize", updateMorph);
    return () => window.removeEventListener("resize", updateMorph);
  }, [updateMorph, isDesktop, order]);

  useLenis(updateMorph);

  // While true, the overlay cards get a CSS transition so each step of the
  // carousel reads as motion (the retiring card sliding out, the next one
  // rising in) rather than snapping there. It's only ever turned on for
  // that 700ms window: the continuous scroll-driven repositioning above
  // must stay untransitioned (instant) or it would lag behind the actual
  // scroll position.
  const [shuffling, setShuffling] = useState(false);
  // Which capability just stepped down from front and is mid-exit (slides
  // left, fades to 0) — read by MobileCardStack directly; the desktop
  // overlay reads the ref mirror of this instead (see updateMorph above).
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (morphActiveRef.current) return;
      // The front card steps down and every other card moves up one slot
      // (so whichever was 2nd becomes the new front) — an endless loop
      // through all 7, rather than pulling the back card forward.
      const frontCapability = orderRef.current[0];
      exitingIndexRef.current = frontCapability;
      setExitingIndex(frontCapability);
      setShuffling(true);
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      window.setTimeout(() => {
        setShuffling(false);
        exitingIndexRef.current = null;
        setExitingIndex(null);
        // Without this, nothing would recompute cardStyles again until the
        // next shuffle or scroll tick, so the just-exited card would stay
        // frozen in its exit pose for the ~1.65s in between instead of
        // settling at the back of the stack right away.
        updateMorph();
      }, 750);
    }, 2400);
    return () => clearInterval(id);
  }, [updateMorph]);

  // Shared between the sticky (desktop) and in-flow (mobile) placements
  // below so the two don't drift out of sync.
  const capabilitiesHeading = (
    <SectionHeading
      align="center"
      theme="light"
      eyebrow="Capabilities"
      eyebrowColor="primary"
      heading={
        <span style={{ overflowWrap: "break-word", hyphens: "auto" }}>
          End-to-end inventory intelligence
        </span>
      }
      description="From planning to execution, Superatom helps you make and automate better inventory decisions across your network."
      className="mx-auto max-w-2xl"
      descriptionClassName="mx-auto"
    />
  );

  return (
    <>
      {/* Dark enterprise-style hero (Stripe's /enterprise page look): a
          diagonal warm glow over a dark navy section, bold white heading
          with the last line in the brand's existing purple-to-orange
          gradient (same one Hero3 uses), and a floating stack of capability
          cards on the right instead of a dashboard screenshot. */}
      <section className="relative overflow-hidden bg-secondary-500 py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1400px 900px at 100% 110%, rgba(255,118,0,0.3), transparent 60%), radial-gradient(1000px 800px at 75% 40%, rgba(255,126,176,0.18), transparent 55%), radial-gradient(1200px 900px at 0% -10%, rgba(83,58,253,0.3), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-primary-300">
                Inventory Intelligence
              </p>
              <h1 className="mt-4 font-display text-[44px] font-bold leading-[1.1] text-white sm:text-[56px] lg:text-[64px]">
                End-to-end
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)",
                  }}
                >
                  inventory intelligence
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-[18px] leading-[1.55] text-white/70">
                Superatom brings together your data, business context, rules
                and policies to help you optimize, rebalance and proactively
                manage inventory across your entire supply chain.
              </p>
              <Button
                variant="accentOutline"
                iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
                className="mt-8 font-semibold"
                onClick={() => setDemoOpen(true)}
              >
                Book a demo
              </Button>
            </div>

            <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto lg:max-w-md">
              {isDesktop ? (
                <div ref={heroSlotRef} style={{ width: CARD_W, height: CARD_H }} />
              ) : (
                <MobileCardStack order={order} exitingIndex={exitingIndex} />
              )}
            </div>
          </div>
        </div>
      </section>

      <HighlightsBar />

      {/* Dedicated scroll room for the unstack -> hold -> glide sequence
          below, independent of how tall the hero itself is. The cards
          arrange here while the Capabilities heading and grid still sit
          below, untouched, in normal document flow. */}
      {isDesktop && (
        <div aria-hidden="true" style={{ height: UNSTACK_PX + HOLD_PX + 260 }} />
      )}

      {/* Fixed overlay carrying the actual visible cards on desktop: their
          position is computed every scroll tick (see updateMorph) against
          the hero slot above and the grid-cell placeholders below, so they
          visually travel from one to the other as the page scrolls. Sits
          above the header (z-50) so the cards pass in front of it rather
          than disappearing behind it while pinned near the top. */}
      {isDesktop && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
          {capabilities.map((c, i) => {
            const s = cardStyles[i];
            return (
              <div
                key={c.title}
                className="absolute rounded-2xl border border-secondary-100 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
                style={{
                  top: s.top,
                  left: s.left,
                  width: CARD_W,
                  height: CARD_H,
                  transform: `rotate(${s.rotate}deg) scale(${s.scale})`,
                  transformOrigin: "top left",
                  transition: shuffling
                    ? "top 0.7s cubic-bezier(.22,1,.36,1), left 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1), opacity 0.7s ease"
                    : "none",
                  opacity: s.ready ? s.opacity : 0,
                  zIndex: s.zIndex,
                }}
              >
                <CapabilityCardFace c={c} />
              </div>
            );
          })}
        </div>
      )}

      {/* Capabilities */}
      <section className="py-[120px]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          {capabilitiesHeading}

          {isDesktop ? (
            // Invisible placeholders only: they reserve the grid's layout
            // space and give updateMorph a live rect per card to land on.
            // The actual card UI is painted by the fixed overlay above.
            <div className="mx-auto mt-16 max-w-6xl">
              <div className="flex flex-wrap justify-center gap-4">
                {capabilities.slice(0, 4).map((c, i) => (
                  <div
                    key={c.title}
                    ref={(el) => {
                      cellRefs.current[i] = el;
                    }}
                    style={{ width: CARD_W, height: CARD_H }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {capabilities.slice(4).map((c, i) => (
                  <div
                    key={c.title}
                    ref={(el) => {
                      cellRefs.current[i + 4] = el;
                    }}
                    style={{ width: CARD_W, height: CARD_H }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {capabilities.slice(0, 4).map((c) => (
                  <GlowCard key={c.title}>
                    <CapabilityCardFace c={c} />
                  </GlowCard>
                ))}
              </div>
              <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {capabilities.slice(4).map((c) => (
                  <GlowCard key={c.title}>
                    <CapabilityCardFace c={c} />
                  </GlowCard>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Industries */}
      <section className="py-[120px]">
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
      <section className="py-[120px]">
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
              <GlowCard key={o.label} contentClassName="flex items-center gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                  {o.dir === "up" ? (
                    <ArrowUpwardIcon style={{ fontSize: 22 }} />
                  ) : (
                    <ArrowDownwardIcon style={{ fontSize: 22 }} />
                  )}
                </span>
                <p className="font-display text-h4 font-semibold text-heading">{o.label}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
