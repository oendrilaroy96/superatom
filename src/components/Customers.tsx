import { useEffect, useRef, useState } from "react";
import bluelinx from "../assets/logos/bluelinx.png";
import mindlabs from "../assets/logos/mindlabs.png";
import coldchain from "../assets/logos/coldchain.png";
import dabur from "../assets/logos/dabur.png";
import fusion5 from "../assets/logos/fusion5.png";
import totalgroup from "../assets/logos/totalgroup.png";
import intercont from "../assets/logos/intercont.png";
import { useDarkTransition } from "../context/DarkTransitionContext";

// Logos come in very different shapes (BlueLinx is a thin wide wordmark, Dabur
// is nearly square), so one shared height would make some look huge and others
// tiny. `height` is each logo's height in px on large screens, chosen so every
// logo covers a similar visual area (wide ones shorter, compact ones taller);
// smaller screens scale all of them together via --logo-scale.
const customers: { name: string; logo: string; height: number }[] = [
  { name: "BlueLinx", logo: bluelinx, height: 22 },
  { name: "Cold Chain Technologies", logo: coldchain, height: 46 },
  { name: "Dabur", logo: dabur, height: 62 },
  { name: "Fusion5", logo: fusion5, height: 38 },
  { name: "Total Group", logo: totalgroup, height: 38 },
  { name: "Intercont", logo: intercont, height: 34 },
  { name: "mindlabs.cloud", logo: mindlabs, height: 28 },
];

/** How fast the marquee scrolls, independent of how wide the track ends up. */
const SPEED_PX_PER_SEC = 55;
/**
 * Repeated enough times that one half of the track is always wider than the
 * widest realistic viewport, so the duplicate half picks up exactly where
 * the first one ends with no blank gap or jump when the loop resets.
 */
const LAPS = 6;
const lap = Array.from({ length: LAPS }, () => customers).flat();

function CustomerLogo({
  name,
  logo,
  height,
  isDark,
}: {
  name: string;
  logo: string;
  height: number;
  isDark: boolean;
}) {
  return (
    <img
      src={logo}
      alt={name}
      // The logos are dark marks on transparent backgrounds — grayscale at
      // 60% opacity reads fine on the light background, but the same dark
      // pixels at 60% opacity would nearly disappear against the dark
      // background, so invert them once isDark flips true.
      className={`w-auto shrink-0 object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 ${
        isDark ? "invert" : ""
      }`}
      style={{ height: `calc(${height}px * var(--logo-scale))` }}
    />
  );
}

export default function Customers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);
  const isDark = useDarkTransition();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0) setDuration(halfWidth / SPEED_PX_PER_SEC);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className={`py-[60px] transition-colors duration-700 ease-in-out ${
        isDark ? "bg-secondary-500" : "bg-[#f5f5ff]"
      }`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center gap-x-8 px-4 sm:gap-x-10 sm:px-10 xl:px-20">
        <span
          className={`inline-flex h-10 shrink-0 items-center border-r pr-8 text-xl font-semibold transition-colors duration-700 ease-in-out sm:h-12 sm:pr-10 sm:text-2xl ${
            isDark ? "border-white/15 text-white" : "border-secondary-200 text-heading"
          }`}
        >
          Trusted by
        </span>
        <div className="customers-marquee min-w-0 flex-1">
          <span className="sr-only">{customers.map((c) => c.name).join(", ")}</span>
          <div
            ref={trackRef}
            className="customers-marquee-track [--logo-scale:0.7] sm:[--logo-scale:0.85] xl:[--logo-scale:1]"
            aria-hidden="true"
            style={{ animationDuration: `${duration}s` }}
          >
            {lap.map((c, i) => (
              <CustomerLogo
                key={`a-${i}-${c.name}`}
                name={c.name}
                logo={c.logo}
                height={c.height}
                isDark={isDark}
              />
            ))}
            {lap.map((c, i) => (
              <CustomerLogo
                key={`b-${i}-${c.name}`}
                name={c.name}
                logo={c.logo}
                height={c.height}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
