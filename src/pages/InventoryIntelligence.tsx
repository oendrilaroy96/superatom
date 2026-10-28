import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import type { IconComponent } from "../types/icon";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";
import IsoScene from "../components/IsoScene";
import type { IsoSceneKey } from "../lib/isoScenes";
import { useDarkTransition } from "../context/DarkTransitionContext";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)";

/** Small gradient dash + label, the eyebrow treatment used throughout this page's Figma redesign instead of SectionHeading's own colored-text eyebrow. */
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
        className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-700 ease-in-out ${dark ? "text-white/60" : "text-caption"
          }`}
      >
        {children}
      </p>
    </div>
  );
}

const capabilities: {
  title: string;
  desc: string;
  scene: IsoSceneKey;
}[] = [
  {
    title: "Inventory Optimization",
    desc: "Recommends optimal inventory levels by evaluating demand patterns, lead times and supply variability.",
    scene: "opt",
  },
  {
    title: "Inventory Rebalancing",
    desc: "Identifies when, where and how much inventory to transfer across plants, warehouses and distribution centers.",
    scene: "reb",
  },
  {
    title: "Aging Inventory Intelligence",
    desc: "Surfaces aging and slow-moving inventory early, then recommends the right corrective action.",
    scene: "age",
  },
  {
    title: "Predictive Excess Inventory Intelligence",
    desc: "Anticipates future excess from demand trends, production plans, procurement schedules and inventory policies.",
    scene: "pre",
  },
  {
    title: "Stockout Prevention",
    desc: "Predicts stockout risk and recommends replenishment, transfers, or production changes to protect service levels.",
    scene: "sto",
  },
  {
    title: "Dynamic Inventory Policy Optimization",
    desc: "Continuously optimizes safety stock, reorder points and inventory norms as conditions change.",
    scene: "pol",
  },
  {
    title: "Replenishment Decision Intelligence",
    desc: "Recommends what to replenish, when to replenish, where to deploy inventory and the optimal quantity.",
    scene: "rep",
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
// "revealed" from the left, never peeking out past it. Every card stays
// fully opaque at rest; only position, rotation and scale carry the sense
// of depth (opacity is reserved for the exit-fade pose below).
const stackSlots = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 63, y: 25, rotate: 4, scale: 0.95, opacity: 1 },
  { x: 120, y: 51, rotate: 8, scale: 0.9, opacity: 1 },
  { x: 170, y: 79, rotate: 11, scale: 0.85, opacity: 1 },
  { x: 215, y: 107, rotate: 14, scale: 0.8, opacity: 1 },
  { x: 252, y: 133, rotate: 16, scale: 0.75, opacity: 1 },
  { x: 284, y: 158, rotate: 18, scale: 0.7, opacity: 1 },
];

// Pose for whichever card just stepped down from front: instead of easing
// into the back of the stack like every other card does, it slides out to
// the left and fades away, clearing the front slot for the next card to
// rise into. Used only for the ~750ms right after it loses the front spot.
const EXIT_SLOT = { x: -120, y: 16, rotate: -10, scale: 0.9, opacity: 0 };

// Mirror image of EXIT_SLOT, off to the right instead of the left: the
// momentary, invisible starting point a card is snapped to right after its
// exit finishes, so its re-entry into the back of the stack animates in
// from the right (sliding left, fading in) rather than popping into place.
// Same rotate/scale as the back slot it's heading for, so only x and
// opacity actually animate during the visible part of the re-entry.
const ENTER_SLOT = { x: 450, y: 158, rotate: 18, scale: 0.7, opacity: 0 };

// A single fixed portrait size used for every card in both the hero stack
// and the capabilities grid, so a card keeps the same footprint as it
// travels from one to the other instead of resizing mid-flight.
const CARD_W = 252;
const CARD_H = 315;

// How much bigger than its true (grid) size the stack renders while it
// still sits in the hero; lerps back down to 1 as the cards unstack into
// the grid, so there's nothing to pop between the two.
const HERO_SCALE = 1.3;

// CSS `top` offset for the sticky "Capabilities" heading (a little below
// the h-16 = 64px main header).
const STICKY_TOP = 80;

// Spacer (px) reserved right after the heading, which is what gives the CSS
// `sticky` heading's own container room to stay stuck for roughly as long
// as the stack below takes to fan open (see ARRANGE_FLOOR's comment in
// updateMorph for how that duration is derived) — too small and `sticky`
// would un-stick while the cards are still visibly mid-fan.
const UNSTACK_PX = 200;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Illustration, title and description shared by every rendering of a capability card. The title
 * and description each reserve a fixed height (two and four lines) so every card lines up, and the
 * illustration takes whatever is left of the 4:5 card. */
function CapabilityCardFace({ c, playKey }: { c: (typeof capabilities)[number]; playKey: number }) {
  return (
    <div className="relative flex h-full flex-col gap-2.5">
      <div className="flex min-h-14 flex-1 items-center justify-center px-1 pt-1.5">
        <IsoScene key={playKey} scene={c.scene} animate={playKey > 0} />
      </div>
      <div className="flex flex-col gap-1.5 px-1 pb-1">
        <span
          className="h-0.5 w-6 shrink-0 rounded-full"
          style={{ backgroundImage: "linear-gradient(90deg, #486FFD, #873EFF)" }}
        />
        <p className="line-clamp-2 min-h-[36px] font-display text-[15px] font-semibold leading-[1.2] tracking-tight text-heading">
          {c.title}
        </p>
        <p className="line-clamp-4 min-h-[60px] text-xs leading-[1.25] text-body">{c.desc}</p>
      </div>
    </div>
  );
}

/** The soft glow card: lavender fading to white, a faint purple glow behind the art and a thin
 * brand-gradient edge along the top. The caller sets position (absolute or relative) and any transform. */
function CapabilityCard({
  c,
  playKey,
  className = "",
  style,
  onMouseEnter,
}: {
  c: (typeof capabilities)[number];
  /** 0 shows the finished scene; each increase replays the build-up animation. */
  playKey: number;
  className?: string;
  style?: CSSProperties;
  onMouseEnter?: () => void;
}) {
  return (
    <div
      className={`iso-card overflow-hidden rounded-[14px] border border-secondary-100 bg-gradient-to-b from-[#f1eeff] from-0% to-white to-[78%] p-3.5 shadow-[0_12px_24px_-12px_rgba(13,23,56,0.18)] ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(170px 140px at 50% 26%, rgba(83,58,253,0.08), transparent 72%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, #533afd 30%, #ff7eb0 65%, #ff7600 85%, transparent)",
        }}
        aria-hidden="true"
      />
      <CapabilityCardFace c={c} playKey={playKey} />
    </div>
  );
}

/** A card in the plain (non-scrolling) grid: its illustration builds up when the card scrolls into view and on hover. */
function GridCapabilityCard({ c }: { c: (typeof capabilities)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [playKey, setPlayKey] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlayKey((k) => k + 1);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: CARD_W, height: CARD_H }}>
      <CapabilityCard
        c={c}
        playKey={playKey}
        className="relative"
        style={{ width: CARD_W, height: CARD_H }}
        onMouseEnter={() => setPlayKey((k) => k + 1)}
      />
    </div>
  );
}

/** Mobile/tablet fallback: the fanned stack with no scroll-driven morph. */
function MobileCardStack({
  order,
  exitingIndex,
  enteringIndex,
  shuffling,
  playKeys,
}: {
  order: number[];
  exitingIndex: number | null;
  enteringIndex: number | null;
  shuffling: boolean;
  playKeys: number[];
}) {
  return (
    <div className="relative h-[420px] w-full max-w-sm">
      {capabilities.map((c, i) => {
        const slot =
          i === exitingIndex ? EXIT_SLOT : i === enteringIndex ? ENTER_SLOT : stackSlots[order.indexOf(i)];
        const isTransitioning = i === exitingIndex || i === enteringIndex;
        return (
          <CapabilityCard
            key={c.title}
            c={c}
            playKey={playKeys[i]}
            className="absolute left-0 top-0"
            style={{
              width: CARD_W,
              height: CARD_H,
              transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})`,
              opacity: slot.opacity,
              zIndex: isTransitioning ? stackSlots.length + 1 : stackSlots.length - stackSlots.indexOf(slot),
              transition: shuffling ? "transform 0.7s cubic-bezier(.22,1,.36,1), opacity 0.7s ease" : "none",
            }}
          />
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

const distortionStats: { prefix?: string; value: string; label: string }[] = [
  { value: "US$1.7tn", label: "lost every year to stockouts and overstock worldwide" },
  { value: "65.6%", label: "of that loss comes from empty shelves, not excess stock" },
  { prefix: "Under", value: "25%", label: "of retailers use AI in their inventory decisions today" },
  { value: "2.3x", label: "higher sales growth for the retailers that do" },
];

const industries: { label: string; desc: string; Icon: IconComponent }[] = [
  {
    label: "Supply Chain & Logistics",
    desc: "End-to-end visibility across locations, partners and inventory flows.",
    Icon: LocalShippingIcon,
  },
  {
    label: "Retail & E-Commerce",
    desc: "Accurate availability and intelligent allocation at every channel.",
    Icon: StorefrontIcon,
  },
  {
    label: "Pharma",
    desc: "Controlled, compliant inventory operations for critical supply networks.",
    Icon: LocalHospitalIcon,
  },
  {
    label: "Manufacturing",
    desc: "Production-ready materials planning across sites, teams and suppliers.",
    Icon: PrecisionManufacturingIcon,
  },
];

const outcomeGroups: {
  eyebrow: string;
  title: string;
  accent: string;
  items: { label: string; dir: "up" | "down" }[];
}[] = [
  {
    eyebrow: "Efficiency",
    title: "Reduce operational drag",
    accent: "linear-gradient(90deg, #29b9bb 0%, #486ffd 50%, rgba(72,111,253,0) 100%)",
    items: [
      { label: "Lower Working Capital", dir: "down" },
      { label: "Fewer Stockouts", dir: "down" },
      { label: "Lower Inventory Write-offs", dir: "down" },
      { label: "Lower Carrying Cost", dir: "down" },
    ],
  },
  {
    eyebrow: "Performance",
    title: "Increase inventory productivity",
    accent: "linear-gradient(90deg, #873eff 0%, #ff7600 50%, rgba(255,118,0,0) 100%)",
    items: [
      { label: "Higher Service Levels", dir: "up" },
      { label: "Better Inventory Turns", dir: "up" },
    ],
  },
];

type CardStyle = {
  top: number;
  left: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
  ready: boolean;
  /** True once the card has landed in its grid cell, so its illustration can play. */
  settled: boolean;
};

export default function InventoryIntelligence() {
  // Crossfades the Business Outcomes section's background from light to
  // dark in sync with the shared scroll threshold (same pattern as About's
  // Our Team section), so there's a handoff right before CtaSection here
  // too, instead of CtaSection's own crossfade being the first one on the
  // page.
  const isDark = useDarkTransition();
  const [demoOpen, setDemoOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [order, setOrder] = useState(capabilities.map((_, i) => i));
  // The heading stays plain CSS `sticky top-20` for its whole life, with no
  // JS involved in pinning or releasing it (see the render below). Two
  // other approaches were tried and reverted: toggling the class off once
  // `sticky` had already run out of room on its own snapped it to a stale
  // flow position instead of continuing from where it was pinned; and
  // correcting that with a manually computed `translateY` kept
  // double-counting, because `sticky`'s own release kept re-triggering on
  // its own at an unpredictable point no matter how big UNSTACK_PX was
  // made, stacking a second release on top of the deliberate one. `sticky`
  // releasing a little later than the cards land (UNSTACK_PX's comment) —
  // never earlier — reads as the heading staying put a beat longer, not as
  // a bug and sidesteps all of that.
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
        settled: false,
      };
    })
  );

  // Which cards replay their illustration, and when. A key of 0 shows the finished scene; each increase
  // remounts the svg with the build-up animation. A card plays when it becomes the front card of the
  // stack, and every card plays (staggered) as the grid settles. Hovering a settled card replays it.
  const [playKeys, setPlayKeys] = useState<number[]>(() => capabilities.map(() => 0));
  const wasActive = useRef<boolean[]>(capabilities.map(() => false));
  const bump = useCallback((i: number) => {
    setPlayKeys((prev) => prev.map((k, j) => (j === i ? k + 1 : k)));
  }, []);

  const heroSlotRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const morphActiveRef = useRef(false);
  // The heading's own box height, remeasured every tick (its content never
  // resizes, so in practice this only actually changes once) — needed to
  // work out ARRANGE_FLOOR, how far below the heading the stack has to
  // rest while fanning open.
  const headingHeightRef = useRef(0);
  // The real gap between the heading's bottom edge and row one's natural
  // top, MINUS UNSTACK_PX — the Capabilities section's own py-[120px] plus
  // the grid's own mt-16, not a number worth hardcoding here and not
  // UNSTACK_PX's own spacer div, which also sits in that stretch of
  // document: that part needs subtracting back out, or retuning UNSTACK_PX
  // for sticky's timing would also silently push the stack's landing spot
  // lower every time. Measured only up through Phase A, since that's the
  // one window where the heading is reliably still in plain flow — once
  // it's pinned, its own rect no longer reflects that (see ARRANGE_FLOOR's
  // comment in updateMorph).
  const gapBelowHeadingRef = useRef(0);

  // `updateMorph` is handed to useLenis below and must keep one stable
  // identity for the life of the component: useLenis re-subscribes whenever
  // the function reference it's given changes and setCardStyles always
  // produces a brand-new array, so a fresh closure here on every render
  // would re-subscribe -> re-run -> setState -> re-render in an infinite
  // loop. Reading isDesktop/order/exitingIndex through refs (synced
  // post-render below) instead of closing over them directly keeps the
  // callback itself frozen.
  const isDesktopRef = useRef(isDesktop);
  const orderRef = useRef(order);
  const exitingIndexRef = useRef<number | null>(null);
  const enteringIndexRef = useRef<number | null>(null);
  useEffect(() => {
    isDesktopRef.current = isDesktop;
    orderRef.current = order;
  });

  // Reads the hero slot's and each grid cell's live position and recomputes
  // every card's current spot along the hero -> grid journey, in three
  // stages driven purely by scroll position:
  //   A  scrollY <= morphStart        embedded in the hero, tracking 1:1
  //   B  through unstackEndY          pinned, fanning open below the
  //                                    (also pinned) heading — "arranged"
  //                                    already means "final", there's no
  //                                    separate preview spot and no second
  //                                    move afterward
  //   C  beyond unstackEndY           embedded in the grid, tracking 1:1
  // unstackEndY is shared by every card, not computed per card: each card's
  // Phase B target is its OWN row's floor (ARRANGE_FLOOR, offset down by
  // that row's real gap below row one) and since the two rows sit a fixed
  // distance apart in the document no matter how far the page has
  // scrolled, targeting each row's true position rather than one shared
  // point means both rows naturally finish fanning at the very same
  // instant — so the whole block (heading, row one, row two) arrives and
  // then scrolls on together, instead of row one finishing early and
  // drifting off while row two and the heading are still catching up.
  // Phase B's top is a plain blend between two fixed points — NEAR_FLOOR
  // (where Phase A leaves it) and that row's ARRANGE_FLOOR, where Phase C
  // picks it up — rather than chasing a target that's still moving. Both
  // ends are fixed numbers, so the blend is a straight line: linear and
  // continuous at both seams by construction, with no risk of a dip/bump
  // or of overshooting off-screen partway through. See the headingPinned
  // render below for why the heading itself pins with `fixed` rather than
  // CSS `sticky`.
  const updateMorph = useCallback(() => {
    if (!isDesktopRef.current) return;
    const heroEl = heroSlotRef.current;
    const cell0 = cellRefs.current[0];
    if (!heroEl || !cell0) return;

    const scrollY = window.scrollY;
    const heroRect = heroEl.getBoundingClientRect();
    const heroLeft = heroRect.left;
    const cell0Top = cell0.getBoundingClientRect().top;

    if (headingRef.current) {
      const headingRect = headingRef.current.getBoundingClientRect();
      headingHeightRef.current = headingRect.height;
      // Only valid reading this while the heading is still in plain flow
      // (rect.top > STICKY_TOP means `sticky` hasn't clamped it yet) — once
      // pinned, rect.bottom reflects the pinned position, not the real gap.
      if (headingRect.top > STICKY_TOP) {
        gapBelowHeadingRef.current = cell0Top - headingRect.bottom - UNSTACK_PX;
      }
    }

    // A small catch point just under the header. Once scrolling would
    // carry the hero card above this, it simply holds there instead of
    // disappearing off the top of the screen before arranging begins.
    const NEAR_FLOOR = STICKY_TOP + 16;

    // Once pinned, the heading occupies STICKY_TOP down through its own
    // height; row one has to rest below all of that while fanning open, or
    // it ends up sitting on top of the heading's own text instead of
    // beside/under it — and, for timing, landing it anywhere other than
    // exactly where it already naturally sits in the page (STICKY_TOP +
    // headingHeight + the section's own real padding below the heading,
    // not a guessed gap) is what let this drift out of sync with the
    // heading's own release in the first place. Row two's own floor sits
    // exactly one row further down — see the updateMorph comment above for
    // why that, not a single shared floor, is what makes both rows land at
    // the same instant.
    const ARRANGE_FLOOR = STICKY_TOP + headingHeightRef.current + gapBelowHeadingRef.current;

    // Arranging starts once a card held at NEAR_FLOOR would otherwise just
    // start touching the (still descending, not yet stuck) heading's top
    // edge — not earlier. A card at NEAR_FLOOR has a visual footprint of
    // CARD_H * HERO_SCALE, so that's the threshold used.
    const darkZoneEl = document.getElementById("inventory-dark-zone");
    const darkZoneRect = darkZoneEl?.getBoundingClientRect();
    const darkZoneDocBottom = darkZoneRect
      ? darkZoneRect.bottom + scrollY
      : cell0Top + scrollY;

    const morphStart = darkZoneDocBottom - (NEAR_FLOOR + CARD_H * HERO_SCALE);

    // Row one's document-space top is fixed regardless of scroll, so the
    // scroll position at which its live top would reach ARRANGE_FLOOR is a
    // constant too. Using row one as the shared reference for every card
    // (rather than each card's own row) is what keeps both rows in lockstep
    // — see the updateMorph comment above.
    const unstackEndY = cell0Top + scrollY - ARRANGE_FLOOR;

    morphActiveRef.current = scrollY > morphStart;

    const order = orderRef.current;
    const exitingIndex = exitingIndexRef.current;
    const enteringIndex = enteringIndexRef.current;
    const next = capabilities.map((_, i) => {
      const cellEl = cellRefs.current[i] ?? cell0;
      const cellRect = cellEl.getBoundingClientRect();
      // This card's own row floor: ARRANGE_FLOOR shifted down by however
      // far this row's cells sit below row one's, right now — a gap that
      // never actually changes with scroll, so reading it live each tick
      // is just a cheap way to avoid hardcoding the grid's row height.
      const rowArrangeFloor = ARRANGE_FLOOR + (cellRect.top - cell0Top);
      const slot =
        i === exitingIndex ? EXIT_SLOT : i === enteringIndex ? ENTER_SLOT : stackSlots[order.indexOf(i)];
      // Tracks the hero card live while it's still naturally below
      // NEAR_FLOOR; once scrolling would carry it above that, it simply
      // holds there instead of disappearing above the viewport before the
      // official unstack begins.
      const stackPos = { top: Math.max(heroRect.top + slot.y, NEAR_FLOOR), left: heroLeft + slot.x };

      let fan: number;
      let top: number;

      if (scrollY <= morphStart) {
        fan = 1;
        top = stackPos.top;
      } else if (scrollY <= unstackEndY) {
        fan = 1 - clamp((scrollY - morphStart) / (unstackEndY - morphStart), 0, 1);
        top = lerp(rowArrangeFloor, NEAR_FLOOR, fan);
      } else {
        fan = 0;
        top = cellRect.top;
      }
      // Scroll-invariant on both ends (neither the hero slot nor a grid
      // cell moves horizontally as the page scrolls vertically), so a
      // plain blend never fights a moving target the way top would.
      const left = lerp(cellRect.left, stackPos.left, fan);

      return {
        top,
        left,
        rotate: slot.rotate * fan,
        scale: lerp(1, slot.scale * HERO_SCALE, fan),
        opacity: lerp(1, slot.opacity, fan),
        zIndex: stackSlots.length - stackSlots.indexOf(slot),
        ready: true,
        settled: fan === 0,
      };
    });
    setCardStyles(next);
  }, []);

  useEffect(() => {
    // The bigger cards need more room per row than the lg (1024px) breakpoint
    // comfortably gives 4-across, so the scroll morph is gated to xl instead;
    // narrower desktop/tablet widths fall back to the static stack/grid.
    const mq = window.matchMedia("(min-width: 1280px)");
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

  // Pending staggered plays live in a ref, not in the effect's own cleanup: the effect re-runs on every
  // scroll tick, and clearing them there would cancel plays that were just scheduled.
  const playTimers = useRef<number[]>([]);
  useEffect(() => {
    const timers = playTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  useEffect(() => {
    const active = capabilities.map((_, i) =>
      isDesktop && cardStyles[i].ready && cardStyles[i].settled ? true : !morphActiveRef.current && order[0] === i,
    );
    active.forEach((on, i) => {
      if (on && !wasActive.current[i]) playTimers.current.push(window.setTimeout(() => bump(i), isDesktop ? i * 110 : 0));
    });
    wasActive.current = active;
  }, [cardStyles, order, isDesktop, bump]);

  const replay = (i: number) => {
    if (cardStyles[i].settled) bump(i);
  };

  // While true, the overlay cards get a CSS transition so each step of the
  // carousel reads as motion (the retiring card sliding out, the next one
  // rising in) rather than snapping there. It's only ever turned on for
  // these transition windows: the continuous scroll-driven repositioning
  // above must stay untransitioned (instant) or it would lag behind the
  // actual scroll position.
  const [shuffling, setShuffling] = useState(false);
  // Which capability just stepped down from front and is mid-exit (slides
  // left, fades to 0); which one is mid-entry (slides in from the right,
  // fades in, into the back of the stack) — read by MobileCardStack
  // directly, the desktop overlay reads the ref mirrors instead (see
  // updateMorph above).
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (morphActiveRef.current) return;
      // The front card steps down and every other card moves up one slot
      // (so whichever was 2nd becomes the new front) — an endless loop
      // through all 7, rather than pulling the back card forward.
      const frontCapability = orderRef.current[0];

      // Phase 1 (0-750ms): slide left and fade out.
      exitingIndexRef.current = frontCapability;
      setExitingIndex(frontCapability);
      setShuffling(true);
      setOrder((prev) => [...prev.slice(1), prev[0]]);

      window.setTimeout(() => {
        // Snap it (invisible at opacity 0, so the jump itself is never
        // seen) to a starting point off to the right, by committing this
        // with the transition briefly switched off.
        setShuffling(false);
        exitingIndexRef.current = null;
        setExitingIndex(null);
        enteringIndexRef.current = frontCapability;
        setEnteringIndex(frontCapability);
        updateMorph();

        requestAnimationFrame(() => {
          // Phase 2 (+700ms): now animate from that right-hand starting
          // point into its real spot at the back of the stack, fading in
          // as it arrives — the mirror image of phase 1.
          setShuffling(true);
          enteringIndexRef.current = null;
          setEnteringIndex(null);
          updateMorph();

          window.setTimeout(() => {
            setShuffling(false);
            // Without this, nothing would recompute cardStyles again until
            // the next shuffle or scroll tick, so the card would stay
            // frozen mid-entry for the remaining time between shuffles
            // instead of settling at the back of the stack right away.
            updateMorph();
          }, 700);
        });
      }, 750);
    }, 2400);
    return () => clearInterval(id);
  }, [updateMorph]);

  // The full heading as it appears in its own resting spot in the
  // Capabilities section, matching Industries/Business Outcomes exactly.
  const capabilitiesHeading = (
    <div className="mx-auto max-w-2xl text-center">
      <Eyebrow align="center">Capabilities</Eyebrow>
      <SectionHeading
        align="center"
        theme="light"
        heading={
          <>
            Seven capabilities.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              One decision layer.
            </span>
          </>
        }
        description="From planning to execution, turn fragmented inventory signals into coordinated decisions across your network."
        descriptionClassName="mx-auto"
      />
    </div>
  );

  return (
    <>
      {/* Dark enterprise-style hero (Stripe's /enterprise page look): a
          diagonal warm glow over a dark navy section, bold white heading
          with the last line in the brand's existing purple-to-orange
          gradient (same one Hero3 uses) and a floating stack of capability
          cards on the right instead of a dashboard screenshot. On desktop,
          hero and the highlights bar right under it together fill exactly
          one viewport height, so both are visible without scrolling on
          load. calc(100vh - 4rem) rather than h-screen: the sticky header
          (h-16) still reserves its own 64px of normal document flow above
          this, so a flat h-screen would push the total past one viewport.
          Left as natural/auto height below lg: the hero's text, button and
          card stack need more room than one mobile screen without feeling
          cramped, so forcing the same 100vh there would only overflow. */}
      <div className="flex flex-col lg:h-[calc(100vh-4rem)]">
        <section className="relative flex flex-1 items-center overflow-hidden bg-secondary-500 py-16 lg:py-0">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(1400px 900px at 100% 110%, rgba(255,118,0,0.3), transparent 60%), radial-gradient(1000px 800px at 75% 40%, rgba(255,126,176,0.18), transparent 55%), radial-gradient(1200px 900px at 0% -10%, rgba(83,58,253,0.3), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-10 xl:px-20">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div>
                <Reveal as="p" className="text-h5 font-semibold uppercase tracking-[0.5px] text-primary-300">
                  Inventory Intelligence
                </Reveal>
                <Reveal as="h1" delay={0.1} className="mt-4 font-display text-[44px] font-bold leading-[1.1] text-white sm:text-[56px] lg:text-[64px]">
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
                </Reveal>
                <Reveal as="p" delay={0.2} className="mt-6 max-w-lg text-[18px] leading-[1.55] text-white/70">
                  Superatom brings together your data, business context, rules
                  and policies to help you optimize, rebalance and proactively
                  manage inventory across your entire supply chain.
                </Reveal>
                <Reveal delay={0.3}>
                <Button
                  variant="accentOutline"
                  iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
                  className="mt-8 font-semibold"
                  onClick={() => setDemoOpen(true)}
                >
                  Book a demo
                </Button>
                </Reveal>
              </div>

              <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto lg:max-w-xl lg:-translate-y-16">
                {isDesktop ? (
                  <div ref={heroSlotRef} style={{ width: CARD_W, height: CARD_H }} />
                ) : (
                  <MobileCardStack
                    order={order}
                    exitingIndex={exitingIndex}
                    enteringIndex={enteringIndex}
                    shuffling={shuffling}
                    playKeys={playKeys}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <HighlightsBar />
      </div>

      {/* The full "Capabilities" heading sticks just below the header while
          the stack below is actively fanning out into the grid, so its
          context stays visible instead of being scrolled past before the
          cards ever come into view. Plain CSS `sticky`, applied
          permanently — see its comment above for why this is left to
          release on its own rather than driven from updateMorph. */}
      {isDesktop && (
        <div>
          <div ref={headingRef} className="z-[45] pb-16 pt-[120px] sticky top-20">
            <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
              {capabilitiesHeading}
            </div>
          </div>
          <div aria-hidden="true" style={{ height: UNSTACK_PX }} />
        </div>
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
              <CapabilityCard
                key={c.title}
                c={c}
                playKey={playKeys[i]}
                className="absolute"
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
              />
            );
          })}
        </div>
      )}

      {/* Capabilities */}
      {/* xl:pt-10 shrinks the gap above the grid specifically on desktop
          (where that space sits below the pinned heading rather than above
          an in-flow one, so it reads as empty rather than as breathing
          room) — pb stays the full 120px so spacing below the grid, before
          the next section, is unaffected. */}
      <section className="pb-[80px] pt-[120px] xl:pt-10">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          {/* On desktop this heading already lives in the sticky block
              above; rendering it again here would duplicate it right as it
              un-sticks. Mobile/tablet has no sticky heading, so it still
              needs its own copy. */}
          {!isDesktop && capabilitiesHeading}

          {isDesktop ? (
            // Invisible placeholders only: they reserve the grid's layout
            // space and give updateMorph a live rect per card to land on.
            // The actual card UI is painted by the fixed overlay above.
            <div className="mx-auto mt-4 max-w-6xl">
              <div className="flex flex-wrap justify-center gap-4">
                {capabilities.slice(0, 4).map((c, i) => (
                  <div
                    key={c.title}
                    ref={(el) => {
                      cellRefs.current[i] = el;
                    }}
                    style={{ width: CARD_W, height: CARD_H }}
                    onMouseEnter={() => replay(i)}
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
                    onMouseEnter={() => replay(i + 4)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-4">
                {capabilities.map((c) => (
                  <GridCapabilityCard key={c.title} c={c} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* The inventory gap */}
      <section className="pb-[80px] pt-0">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-secondary-100 bg-white shadow-[0_30px_90px_-30px_rgba(20,34,60,0.14)]">
            <span
              className="absolute left-12 top-0 h-[3px] w-[148px]"
              style={{ backgroundImage: "linear-gradient(90deg, #29b9bb 0%, #486ffd 33%, #873eff 67%, #ff7600 100%)" }}
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 gap-8 px-8 pb-10 pt-12 sm:px-12 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div>
                <Eyebrow>The inventory gap</Eyebrow>
                <h2 className="mt-5 font-display text-[36px] font-semibold leading-[1.1] tracking-tight text-heading sm:text-[44px]">
                  The cost of running
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                    inventory on guesswork.
                  </span>
                </h2>
              </div>
              <div className="border-t border-secondary-100 pt-6 lg:border-t-0 lg:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-500">
                  The enterprise reality
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-body">
                  Small inventory gaps compound across locations, channels
                  and teams. The result is trapped capital, missed demand
                  and slower growth.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-secondary-100 lg:grid-cols-4">
              {distortionStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-8 py-9 ${i % 2 === 1 ? "border-l border-secondary-100" : ""} ${i >= 2 ? "border-t border-secondary-100" : ""
                    } ${i >= 1 ? "lg:border-l" : ""} ${i === 0 ? "lg:pl-12" : ""} lg:border-t-0 lg:first:border-l-0`}
                >
                  <p className="font-display text-[32px] font-semibold tracking-tight text-heading sm:text-[40px]">
                    {stat.prefix && (
                      <span className="mr-2 text-base font-medium tracking-normal text-caption sm:text-lg">
                        {stat.prefix}
                      </span>
                    )}
                    {stat.value}
                  </p>
                  <p className="mt-3 max-w-[220px] text-sm leading-snug text-body">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-secondary-100 px-8 py-5 sm:px-12">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-caption">
                Research benchmark
              </p>
              <span className="h-px w-6 bg-secondary-100" aria-hidden="true" />
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-caption">
                IHL Group, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="pb-[80px] pt-0">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow align="center">Industries</Eyebrow>
            <SectionHeading
              align="center"
              theme="light"
              heading={
                <span className="lg:whitespace-nowrap">
                  Built for complex inventory.
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                    Ready for enterprise scale.
                  </span>
                </span>
              }
              description="Inventory Intelligence adapts to the demands of your sector, connecting every site, system and team on one secure platform."
              descriptionClassName="mx-auto max-w-2xl"
            />
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-secondary-100 bg-secondary-100 shadow-[0_28px_90px_-30px_rgba(20,34,60,0.15)] sm:grid-cols-2 lg:grid-cols-4">
            {industries.map(({ label, desc, Icon }) => (
              <div key={label} className="flex flex-col bg-white p-8">
                <div>
                  <span className="relative flex size-[52px] shrink-0 items-center justify-center rounded-2xl border border-secondary-100 bg-page text-heading">
                    <Icon style={{ fontSize: 24 }} />
                    <span
                      className="absolute -bottom-1.5 left-3.5 h-[3px] w-[22px] rounded-full"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                    />
                  </span>
                </div>
                <p className="mt-8 font-display text-xl font-semibold tracking-tight text-heading">
                  {label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-body">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business outcomes */}
      <section
        className={`pb-[120px] pt-0 transition-colors duration-700 ease-in-out ${isDark ? "bg-secondary-500" : "bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow align="center" dark={isDark}>Business outcomes</Eyebrow>
            <SectionHeading
              align="center"
              theme={isDark ? "dark" : "light"}
              heading={
                <span className="lg:whitespace-nowrap">
                  Better inventory decisions.
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                    Tangible business impact.
                  </span>
                </span>
              }
              description="Turn inventory from a cost center into a competitive advantage."
              descriptionClassName="mx-auto max-w-2xl"
            />
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
            {outcomeGroups.map((group) => (
              <div
                key={group.eyebrow}
                className="relative flex flex-col overflow-hidden rounded-[20px] border border-secondary-100 bg-white p-8 shadow-[0_26px_80px_-30px_rgba(20,34,60,0.15)]"
              >
                <span
                  className="absolute left-0 top-0 h-[2px] w-full"
                  style={{ backgroundImage: group.accent }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-caption">
                    {group.eyebrow}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight text-heading">
                    {group.title}
                  </p>
                </div>
                <div
                  className={`mt-8 grid flex-1 auto-rows-fr grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-secondary-100 bg-secondary-100 ${group.items.length > 2 ? "sm:grid-cols-2" : ""
                    }`}
                >
                  {group.items.map((o) => (
                    <div key={o.label} className="flex items-center gap-4 bg-white p-5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
                        {o.dir === "up" ? (
                          <ArrowUpwardIcon style={{ fontSize: 20 }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: 20 }} />
                        )}
                      </span>
                      <p className="font-display text-[15px] font-semibold text-heading">{o.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
