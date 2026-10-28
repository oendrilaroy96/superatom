import type { CSSProperties } from "react";
import { isoScenes, type IsoSceneKey } from "../lib/isoScenes";

/**
 * One isometric illustration. At rest it shows the finished scene; when `animate` is true the
 * blocks build up (see the `.iso-anim` rules in index.css). Remount it with a new `key` to replay.
 */
export default function IsoScene({ scene, animate }: { scene: IsoSceneKey; animate: boolean }) {
  return (
    <svg
      viewBox="0 0 200 110"
      className={`h-full w-full overflow-visible ${animate ? "iso-anim" : ""}`}
      aria-hidden="true"
    >
      {isoScenes[scene].map((s, i) => {
        const style = s.vars as CSSProperties;
        if (s.kind === "poly") {
          return (
            <polygon
              key={i}
              className={s.cls || undefined}
              style={style}
              points={s.points}
              fill={s.fill}
              stroke={s.stroke ?? s.fill}
              strokeWidth={s.stroke ? 1.6 : 0.6}
              strokeDasharray={s.dash}
              strokeLinejoin="round"
            />
          );
        }
        if (s.kind === "line") {
          return (
            <polyline
              key={i}
              className={s.cls || undefined}
              style={style}
              points={s.points}
              fill="none"
              stroke={s.stroke}
              strokeWidth={s.w}
              strokeDasharray={s.dash}
              strokeLinecap="round"
            />
          );
        }
        return (
          <g key={i} className={s.cls || undefined} style={style} fill="none" stroke={s.stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={s.d} strokeDasharray={s.dash} />
            <path d={s.head} />
          </g>
        );
      })}
    </svg>
  );
}
