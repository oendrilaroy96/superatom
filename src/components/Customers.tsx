import { useEffect, useRef, useState } from "react";
import bluelinx from "../assets/logos/bluelinx.png";
import mindlabs from "../assets/logos/mindlabs.png";
import seshaasai from "../assets/logos/seshaasai.png";
import { useDarkTransition } from "../context/DarkTransitionContext";

// BlueLinx's wordmark is much wider per unit height than the other two, so
// at a shared height it visually dominates the row — sized down here so its
// rendered width lines up with the others instead.
const customers: { name: string; logo: string; heightClass?: string }[] = [
  { name: "BlueLinx", logo: bluelinx, heightClass: "h-5 sm:h-6 xl:h-7" },
  { name: "mindlabs.cloud", logo: mindlabs },
  { name: "Seshaasai", logo: seshaasai },
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
  heightClass = "h-8 sm:h-9 xl:h-11",
  isDark,
}: {
  name: string;
  logo: string;
  heightClass?: string;
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
      } ${heightClass}`}
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
            className="customers-marquee-track"
            aria-hidden="true"
            style={{ animationDuration: `${duration}s` }}
          >
            {lap.map((c, i) => (
              <CustomerLogo
                key={`a-${i}-${c.name}`}
                name={c.name}
                logo={c.logo}
                heightClass={c.heightClass}
                isDark={isDark}
              />
            ))}
            {lap.map((c, i) => (
              <CustomerLogo
                key={`b-${i}-${c.name}`}
                name={c.name}
                logo={c.logo}
                heightClass={c.heightClass}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
