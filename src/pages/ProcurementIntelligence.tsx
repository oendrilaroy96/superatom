import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
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
import GlowCard from "../components/ui/GlowCard";
import SectionHeading from "../components/ui/SectionHeading";
import DemoModal from "../components/DemoModal";

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

const highlights: { label: string; Icon: IconComponent }[] = [
  { label: "Reduce costs and mitigate risk", Icon: SavingsIcon },
  { label: "Improve supplier performance", Icon: HandshakeIcon },
  { label: "Drive efficiency and compliance", Icon: BoltIcon },
];

// One slot per card, front to back — see InventoryIntelligence.tsx's own
// stackSlots for the full reasoning (cascades to the bottom-right, stays
// opaque at rest). Same progression, just six deep instead of seven to
// match this page's own capability count.
const stackSlots = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 63, y: 25, rotate: 4, scale: 0.95, opacity: 1 },
  { x: 120, y: 51, rotate: 8, scale: 0.9, opacity: 1 },
  { x: 170, y: 79, rotate: 11, scale: 0.85, opacity: 1 },
  { x: 215, y: 107, rotate: 14, scale: 0.8, opacity: 1 },
  { x: 252, y: 133, rotate: 16, scale: 0.75, opacity: 1 },
];

// Pose for whichever card just stepped down from front — see
// InventoryIntelligence.tsx's own EXIT_SLOT/ENTER_SLOT for the reasoning.
const EXIT_SLOT = { x: -120, y: 16, rotate: -10, scale: 0.9, opacity: 0 };
const ENTER_SLOT = { x: 450, y: 133, rotate: 16, scale: 0.75, opacity: 0 };

// A single fixed portrait size used for every card in both the hero stack
// and the capabilities grid, so a card keeps the same footprint as it
// travels from one to the other instead of resizing mid-flight.
const CARD_W = 252;
const CARD_H = 300;

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

/** Icon, title and description shared by every rendering of a capability card. */
function CapabilityCardFace({ c }: { c: (typeof capabilities)[number] }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
        <c.Icon style={{ fontSize: 22 }} />
      </span>
      <p className="mt-4 font-display text-h4 font-semibold text-heading">{c.title}</p>
      <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-caption">{c.desc}</p>
    </div>
  );
}

/** Mobile/tablet fallback: the fanned stack with no scroll-driven morph. */
function MobileCardStack({
  order,
  exitingIndex,
  enteringIndex,
  shuffling,
}: {
  order: number[];
  exitingIndex: number | null;
  enteringIndex: number | null;
  shuffling: boolean;
}) {
  return (
    <div className="relative h-[420px] w-full max-w-sm">
      {capabilities.map((c, i) => {
        const slot =
          i === exitingIndex ? EXIT_SLOT : i === enteringIndex ? ENTER_SLOT : stackSlots[order.indexOf(i)];
        const isTransitioning = i === exitingIndex || i === enteringIndex;
        return (
          <div
            key={c.title}
            className="absolute inset-x-0 top-0 rounded-2xl border border-secondary-100 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
            style={{
              transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})`,
              opacity: slot.opacity,
              zIndex: isTransitioning ? stackSlots.length + 1 : stackSlots.length - stackSlots.indexOf(slot),
              transition: shuffling ? "transform 0.7s cubic-bezier(.22,1,.36,1), opacity 0.7s ease" : "none",
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
    <section id="procurement-dark-zone" className="border-t border-white/10 bg-secondary-500">
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

const outcomes: { label: string; dir: "up" | "down" }[] = [
  { label: "Lower Procurement Cost", dir: "down" },
  { label: "Lower Working Capital", dir: "down" },
  { label: "Better Contract Utilization", dir: "up" },
  { label: "Reliable Supply", dir: "up" },
  { label: "Lower Supplier Risk", dir: "down" },
  { label: "Higher Buyer Productivity", dir: "up" },
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

/**
 * Same page shape as InventoryIntelligence.tsx (dark hero with a fanning
 * capability-card stack, dark highlights bar, scroll-morph capabilities
 * grid, business outcomes grid) so the two Solutions pages read as one
 * consistent system rather than each inventing its own layout. See that
 * file's comments for the full reasoning behind the scroll-morph math —
 * it's reproduced here rather than shared because the two pages' card
 * counts and grid shapes differ (six cards in two rows of three here,
 * versus seven in a 4+3 split there), which threads through the per-row
 * floor math enough that a shared component would need as many branches
 * as just keeping the two copies in sync by hand.
 */
export default function ProcurementIntelligence() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [order, setOrder] = useState(capabilities.map((_, i) => i));
  // The heading stays plain CSS `sticky top-20` for its whole life — see
  // InventoryIntelligence.tsx's own comment here for why that, rather than
  // JS-driven pinning, is what keeps the release seamless.
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
  const headingRef = useRef<HTMLDivElement>(null);
  const morphActiveRef = useRef(false);
  // The heading's own box height, remeasured every tick (its content never
  // resizes, so in practice this only actually changes once) — needed to
  // work out ARRANGE_FLOOR, how far below the heading the stack has to
  // rest while fanning open.
  const headingHeightRef = useRef(0);
  // The real gap between the heading's bottom edge and row one's natural
  // top, MINUS UNSTACK_PX — see InventoryIntelligence.tsx's own
  // gapBelowHeadingRef comment for why UNSTACK_PX has to be subtracted
  // back out. Measured only up through Phase A, since that's the one
  // window where the heading is reliably still in plain flow.
  const gapBelowHeadingRef = useRef(0);

  // `updateMorph` is handed to useLenis below and must keep one stable
  // identity for the life of the component — see InventoryIntelligence's
  // own comment on why a fresh closure here would infinite-loop.
  const isDesktopRef = useRef(isDesktop);
  const orderRef = useRef(order);
  const exitingIndexRef = useRef<number | null>(null);
  const enteringIndexRef = useRef<number | null>(null);
  useEffect(() => {
    isDesktopRef.current = isDesktop;
    orderRef.current = order;
  });

  // Same three-stage hero -> grid morph as InventoryIntelligence.tsx; see
  // that file's updateMorph comment for the full reasoning (why unstackEndY
  // is shared rather than per-card, why Phase B blends between two fixed
  // points, why the heading pins with CSS `sticky`).
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
      if (headingRect.top > STICKY_TOP) {
        gapBelowHeadingRef.current = cell0Top - headingRect.bottom - UNSTACK_PX;
      }
    }

    // A small catch point just under the header. Once scrolling would
    // carry the hero card above this, it simply holds there instead of
    // disappearing off the top of the screen before arranging begins.
    const NEAR_FLOOR = STICKY_TOP + 16;

    // Once pinned, the heading occupies STICKY_TOP down through its own
    // height; row one has to rest below all of that while fanning open.
    // Row two's own floor sits exactly one row further down.
    const ARRANGE_FLOOR = STICKY_TOP + headingHeightRef.current + gapBelowHeadingRef.current;

    const darkZoneEl = document.getElementById("procurement-dark-zone");
    const darkZoneRect = darkZoneEl?.getBoundingClientRect();
    const darkZoneDocBottom = darkZoneRect
      ? darkZoneRect.bottom + scrollY
      : cell0Top + scrollY;

    const morphStart = darkZoneDocBottom - (NEAR_FLOOR + CARD_H * HERO_SCALE);

    // Row one's document-space top is fixed regardless of scroll, so the
    // scroll position at which its live top would reach ARRANGE_FLOOR is a
    // constant too. Using row one as the shared reference for every card
    // keeps both rows in lockstep.
    const unstackEndY = cell0Top + scrollY - ARRANGE_FLOOR;

    morphActiveRef.current = scrollY > morphStart;

    const order = orderRef.current;
    const exitingIndex = exitingIndexRef.current;
    const enteringIndex = enteringIndexRef.current;
    const next = capabilities.map((_, i) => {
      const cellEl = cellRefs.current[i] ?? cell0;
      const cellRect = cellEl.getBoundingClientRect();
      // This card's own row floor: ARRANGE_FLOOR shifted down by however
      // far this row's cells sit below row one's, right now.
      const rowArrangeFloor = ARRANGE_FLOOR + (cellRect.top - cell0Top);
      const slot =
        i === exitingIndex ? EXIT_SLOT : i === enteringIndex ? ENTER_SLOT : stackSlots[order.indexOf(i)];
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
      const left = lerp(cellRect.left, stackPos.left, fan);

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
    // The bigger cards need more room per row than the lg (1024px) breakpoint
    // comfortably gives 3-across, so the scroll morph is gated to xl instead;
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

  // See InventoryIntelligence.tsx's own comment on this block: shuffling
  // gates the CSS transition so only these carousel windows animate, never
  // the continuous scroll-driven repositioning.
  const [shuffling, setShuffling] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (morphActiveRef.current) return;
      const frontCapability = orderRef.current[0];

      exitingIndexRef.current = frontCapability;
      setExitingIndex(frontCapability);
      setShuffling(true);
      setOrder((prev) => [...prev.slice(1), prev[0]]);

      window.setTimeout(() => {
        setShuffling(false);
        exitingIndexRef.current = null;
        setExitingIndex(null);
        enteringIndexRef.current = frontCapability;
        setEnteringIndex(frontCapability);
        updateMorph();

        requestAnimationFrame(() => {
          setShuffling(true);
          enteringIndexRef.current = null;
          setEnteringIndex(null);
          updateMorph();

          window.setTimeout(() => {
            setShuffling(false);
            updateMorph();
          }, 700);
        });
      }, 750);
    }, 2400);
    return () => clearInterval(id);
  }, [updateMorph]);

  // The full heading as it appears in its own resting spot in the
  // Capabilities section, matching Business Outcomes.
  const capabilitiesHeading = (
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
  );

  return (
    <>
      {/* Dark enterprise-style hero — same shape as InventoryIntelligence's
          own hero (diagonal warm glow over dark navy, gradient second line,
          floating capability-card stack on the right). See that file's
          hero comment for the full reasoning behind the layout sizing. */}
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
                <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-primary-300">
                  Procurement Intelligence
                </p>
                <h1 className="mt-4 font-display text-[44px] font-bold leading-[1.1] text-white sm:text-[56px] lg:text-[64px]">
                  Smarter procurement.
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)",
                    }}
                  >
                    Greater value.
                  </span>
                </h1>
                <p className="mt-6 max-w-lg text-[18px] leading-[1.55] text-white/70">
                  Superatom brings together your data, business context, rules, and policies to help you
                  make and automate better procurement decisions — from supplier selection to contracting,
                  ordering and risk management.
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

              <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto lg:max-w-xl lg:-translate-y-16">
                {isDesktop ? (
                  <div ref={heroSlotRef} style={{ width: CARD_W, height: CARD_H }} />
                ) : (
                  <MobileCardStack
                    order={order}
                    exitingIndex={exitingIndex}
                    enteringIndex={enteringIndex}
                    shuffling={shuffling}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <HighlightsBar />
      </div>

      {/* The full "Capabilities" heading sticks just below the header while
          the stack below is actively fanning out into the grid — see
          InventoryIntelligence.tsx's own comment on this block. */}
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

      {/* Fixed overlay carrying the actual visible cards on desktop — see
          InventoryIntelligence.tsx's own comment on this block. */}
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
      <section className="pb-[120px] pt-[120px] xl:pt-10">
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
            // Two rows of three (six capabilities), rather than Inventory's
            // 4+3 split over seven.
            <div className="mx-auto mt-4 max-w-6xl">
              <div className="flex flex-wrap justify-center gap-4">
                {capabilities.slice(0, 3).map((c, i) => (
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
                {capabilities.slice(3).map((c, i) => (
                  <div
                    key={c.title}
                    ref={(el) => {
                      cellRefs.current[i + 3] = el;
                    }}
                    style={{ width: CARD_W, height: CARD_H }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <GlowCard key={c.title}>
                  <CapabilityCardFace c={c} />
                </GlowCard>
              ))}
            </div>
          )}
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
