import { useEffect, useState } from "react";
import { finishPreloading } from "../lib/preloader";

/**
 * Superatom AI preloader.
 * Atoms converge into the wordmark, then the overlay fades out once the
 * animation has played AND the page has finished loading.
 *
 * Usage: render <Preloader /> once at the top of your app (e.g. in App.tsx).
 */

const ANIMATION_MS = 1900; // time for the logo reveal to finish, plus a short hold on the finished logo
const FADE_MS = 350; // must match the CSS transition on .sa-loader

const css = `.sa-loader{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#FFFFFF;transition:opacity .35s ease,visibility .35s ease}
.sa-loader.sa-done{opacity:0;visibility:hidden;pointer-events:none}
.sa-loader svg{width:min(320px,70vw);height:auto;overflow:visible}
.sa-dot{transform-box:fill-box;transform-origin:center;opacity:0}
.sa-dot-1{animation:sa-dot1 .7s cubic-bezier(.6,0,.2,1) forwards}
.sa-dot-2{animation:sa-dot2 .75s cubic-bezier(.6,0,.2,1) .03s forwards}
.sa-dot-3{animation:sa-dot3 .8s cubic-bezier(.6,0,.2,1) .06s forwards}
@keyframes sa-dot1{0%{opacity:0;transform:translate(228px,8px) scale(0)}20%{opacity:1;transform:translate(228px,8px) scale(1)}45%{transform:translate(228px,8px) scale(1)}85%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(0,0) scale(0)}}
@keyframes sa-dot2{0%{opacity:0;transform:translate(-120px,8px) scale(0)}20%{opacity:1;transform:translate(-120px,8px) scale(1)}45%{transform:translate(-120px,8px) scale(1)}85%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(0,0) scale(0)}}
@keyframes sa-dot3{0%{opacity:0;transform:translate(-337px,16px) scale(0)}20%{opacity:1;transform:translate(-337px,16px) scale(1)}45%{transform:translate(-337px,16px) scale(1)}85%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(0,0) scale(0)}}
.sa-word{transform-box:fill-box;transform:translateY(150px);animation:sa-rise .45s cubic-bezier(.2,.8,.2,1) forwards}
.sa-super{animation-delay:.55s}
.sa-atom{animation-delay:.68s}
@keyframes sa-rise{to{transform:translateY(0)}}
.sa-box{stroke-dasharray:246;stroke-dashoffset:246;animation:sa-draw .4s ease-out .78s forwards}
@keyframes sa-draw{to{stroke-dashoffset:0}}
.sa-ai{opacity:0;animation:sa-fade .25s ease-out 1.02s forwards}
@keyframes sa-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.sa-dot{display:none}.sa-word,.sa-box,.sa-ai{animation:none;transform:none;stroke-dashoffset:0;opacity:1}}`;

type PreloaderProps = {
  /** Called after the overlay has fully faded out. */
  onComplete?: () => void;
};

export default function Preloader({ onComplete }: PreloaderProps) {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const animationDone = new Promise<void>((resolve) =>
      window.setTimeout(resolve, ANIMATION_MS)
    );
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let fadeTimer: number | undefined;
    let cancelled = false;
    Promise.all([animationDone, pageLoaded]).then(() => {
      if (cancelled) return;
      setDone(true);
      finishPreloading();
      document.body.style.overflow = prevOverflow;
      fadeTimer = window.setTimeout(() => {
        setRemoved(true);
        onComplete?.();
      }, FADE_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div className={`sa-loader${done ? " sa-done" : ""}`} aria-hidden={done}>
      <style>{css}</style>
      <svg viewBox="0 0 750 152" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Superatom AI">
        <defs>
          <clipPath id="sa-clip"><rect x="0" y="0" width="672" height="152" /></clipPath>
        </defs>
        <circle className="sa-dot sa-dot-1" cx="135" cy="76" r="10" fill="#0D1738" />
        <circle className="sa-dot sa-dot-2" cx="507" cy="76" r="10" fill="#533AFD" />
        <circle className="sa-dot sa-dot-3" cx="712" cy="47" r="10" fill="#FF7600" />
        <g clipPath="url(#sa-clip)">
          <path className="sa-word sa-super" d="M4.48 93.28H18.88C18.88 101.28 24.96 106.08 34.88 106.08C45.44 106.08 51.52 101.76 51.52 94.56C51.52 89.28 48.96 86.08 40.8 84L27.04 80.8C13.12 77.44 6.56 70.56 6.56 59.04C6.56 44.64 18.72 35.52 36 35.52C53.12 35.52 64.32 45.12 64.64 60H50.24C49.92 52.16 44.64 47.2 35.52 47.2C26.08 47.2 20.8 51.36 20.8 58.56C20.8 63.84 24.64 67.36 32.32 69.28L46.08 72.64C59.36 75.84 65.92 81.92 65.92 93.6C65.92 108.48 53.12 117.92 34.56 117.92C16.16 117.92 4.48 108.16 4.48 93.28ZM125.479 37.76H140.359V116H126.919L125.319 104.16C120.839 112.32 110.439 117.92 98.9187 117.92C80.6787 117.92 70.4388 105.6 70.4388 86.4V37.76H85.4788V81.44C85.4788 98.24 92.6787 104.64 104.199 104.64C117.959 104.64 125.479 95.84 125.479 79.04V37.76ZM150.98 151.04V37.76H164.58L165.7 51.84C170.98 41.12 181.54 35.52 194.02 35.52C216.42 35.52 230.34 52.32 230.34 76.32C230.34 100.16 217.22 118.08 194.02 118.08C181.54 118.08 171.14 112.8 166.02 103.2V151.04H150.98ZM166.18 76.96C166.18 92.96 175.46 104.48 190.82 104.48C206.18 104.48 215.3 92.96 215.3 76.96C215.3 60.8 206.18 49.28 190.82 49.28C175.46 49.28 166.18 60.64 166.18 76.96ZM269.478 117.92C246.438 117.92 230.597 101.28 230.597 76.96C230.597 52.48 246.117 35.52 268.837 35.52C291.078 35.52 305.637 50.88 305.637 74.08V79.68L245.158 79.84C246.277 96.32 254.917 105.44 269.797 105.44C281.478 105.44 289.158 100.64 291.717 91.68H305.797C301.957 108.48 288.837 117.92 269.478 117.92ZM268.837 48.16C255.717 48.16 247.397 56 245.477 69.76H290.598C290.598 56.8 282.117 48.16 268.837 48.16ZM356.036 37.12V50.88H349.316C335.076 50.88 326.276 59.52 326.276 74.56V116H311.236V37.92H325.316L326.276 49.76C329.476 41.6 337.316 36.16 348.036 36.16C350.756 36.16 352.996 36.48 356.036 37.12Z" fill="#0D1738" />
          <path className="sa-word sa-atom" d="M381.823 117.92C365.342 117.92 355.582 108.64 355.582 95.04C355.582 80.8 366.462 71.84 384.543 70.4L410.143 68.32V65.76C410.143 50.56 401.022 45.76 389.663 45.76C376.223 45.76 368.223 51.84 368.223 62.24H358.142C358.142 46.56 370.943 36.48 389.983 36.48C407.902 36.48 421.022 45.44 421.022 65.92V116H411.742L410.302 102.4C405.503 112.16 394.943 117.92 381.823 117.92ZM384.383 108.96C400.703 108.96 410.143 97.6 410.143 80.8V76.64L387.263 78.4C372.703 79.68 366.783 86.08 366.783 94.72C366.783 104.16 373.823 108.96 384.383 108.96ZM448.33 116H437.45V47.84H421.93V38.56H437.45V14.08H448.33V38.56H463.85V47.84H448.33V116ZM460.805 77.28C460.805 53.6 477.445 36.48 500.165 36.48C522.885 36.48 539.525 53.6 539.525 77.28C539.525 100.8 522.885 117.92 500.165 117.92C477.445 117.92 460.805 100.8 460.805 77.28ZM472.005 77.12C472.005 95.36 483.525 108 500.165 108C516.645 108 528.325 95.36 528.325 77.12C528.325 59.2 516.645 46.4 500.165 46.4C483.525 46.4 472.005 59.2 472.005 77.12ZM557.023 116H545.983V38.56H555.583L556.863 49.6C560.703 41.44 569.343 36.48 580.223 36.48C592.383 36.48 601.503 42.88 605.183 52.96C608.703 42.88 618.143 36.48 630.622 36.48C647.423 36.48 658.463 47.36 658.463 65.28V116H647.743V67.52C647.743 54.24 640.383 46.4 628.543 46.4C615.583 46.4 607.903 56.16 607.903 68.16V116H597.023V67.36C597.023 54.24 589.503 46.56 577.823 46.56C564.863 46.56 557.023 56.16 557.023 68V116Z" fill="#533AFD" />
        </g>
        <rect className="sa-box" x="677" y="18" width="70" height="59" rx="7" stroke="#FF7600" strokeWidth="6" />
        <path className="sa-ai" d="M692.8 62L701.6 33.2H709.72L718.52 62H712.92L705.08 36.6H706.12L698.4 62H692.8ZM698.08 56V50.92H713.28V56H698.08ZM722.505 62V33.2H727.945V62H722.505Z" fill="#0D1738" />
      </svg>
    </div>
  );
}
