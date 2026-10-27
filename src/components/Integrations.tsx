import sap from "../assets/integrations/sap.png";
import oracle from "../assets/integrations/oracle.png";
import microsoftFabric from "../assets/integrations/microsoft-fabric.png";
import databricks from "../assets/integrations/databricks.png";
import dmsi from "../assets/integrations/dmsi.png";
import SectionHeading from "./ui/SectionHeading";
import { useDarkTransition } from "../context/DarkTransitionContext";

// Heights are in px on large screens and chosen per logo so they look about
// equally big (Oracle is a thin wide wordmark, SAP is chunky); smaller screens
// scale them together via --logo-scale. Databricks' image is only 22px tall,
// so it is never shown larger than its real size.
const systems: { name: string; logo: string; height: number }[] = [
  { name: "SAP", logo: sap, height: 48 },
  { name: "Oracle", logo: oracle, height: 20 },
  { name: "Microsoft Fabric", logo: microsoftFabric, height: 40 },
  { name: "Databricks", logo: databricks, height: 22 },
  { name: "DMSI", logo: dmsi, height: 30 },
];

/**
 * Systems Superatom AI connects to. Each logo sits on a white chip so its brand
 * colours stay true on both the light and the dark (scroll-crossfaded) background.
 */
export default function Integrations() {
  const isDark = useDarkTransition();

  return (
    <section
      className={`py-[100px] transition-colors duration-700 ease-in-out ${
        isDark ? "bg-secondary-500" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          theme={isDark ? "dark" : "light"}
          heading="Trusted to connect with"
          headingClassName="text-[28px] leading-[1.15] sm:text-[40px]"
        />
        <ul className="mx-auto mt-12 flex max-w-[1240px] flex-wrap items-stretch justify-center gap-3 [--logo-scale:0.7] sm:gap-4 sm:[--logo-scale:0.85] xl:[--logo-scale:1]">
          {systems.map((s) => (
            <li
              key={s.name}
              className="flex h-[72px] min-w-[132px] items-center justify-center rounded-2xl border border-secondary-100 bg-white px-6 shadow-[0_4px_14px_rgba(6,27,49,0.05)] sm:h-[88px] sm:min-w-[168px] sm:px-8 xl:h-[104px] xl:min-w-[200px]"
            >
              <img
                src={s.logo}
                alt={s.name}
                className="w-auto max-w-full object-contain"
                style={{ height: `calc(${s.height}px * var(--logo-scale))` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
