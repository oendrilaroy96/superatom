// Isometric block illustrations for the Inventory Intelligence capability cards. Each scene is a
// few solid blocks on a pallet, drawn with a tiny isometric projection and fitted to a 200 x 110
// box. Scenes are plain data (polygons, lines and one curve) rendered by components/IsoScene.tsx,
// and carry the animation hints (class and CSS variables) that src/index.css turns into motion.

export type IsoShape =
  | { kind: "poly"; points: string; fill: string; stroke?: string; dash?: string; cls: string; vars: Record<string, string> }
  | { kind: "line"; points: string; stroke: string; dash: string; w: number; cls: string; vars: Record<string, string> }
  | { kind: "curve"; d: string; head: string; stroke: string; dash: string; cls: string; vars: Record<string, string> };

type Point = [number, number];
type Palette = [string, string, string]; // top, left face, right face

/** Animation hint for one shape. `t` picks the keyframes, the rest feed CSS variables. */
type Anim = { t: "fade" | "drop" | "slide" | "path" | "flow"; d?: number; h?: number; dur?: number; fx?: number; fy?: number; fo?: number };

const PAL = {
  purple: ["#BDB3FF", "#8A75FF", "#5746E8"],
  deep: ["#9B8BFF", "#6F5CF0", "#4533C9"],
  pale: ["#E9E5FF", "#D5CEFC", "#C1B8F4"],
  mid: ["#CFC6FF", "#B0A3FA", "#9484EE"],
  orange: ["#FFC08F", "#FF9142", "#E26A00"],
  tile: ["#F2EFFF", "#DDD6FB", "#CBC2F5"],
} satisfies Record<string, Palette>;

const GHOST = { fill: "rgba(138,117,255,0.1)", stroke: "#7C6CEC", dash: "4 3" };

/** Grid position and height to screen position, before the fit. */
const P = (gx: number, gy: number, z: number): Point => [(gx - gy) * 0.866, (gx + gy) * 0.5 - z];
const pts = (list: [number, number, number][]): Point[] => list.map((q) => P(q[0], q[1], q[2]));

type Item = {
  depth: number;
  kind: "poly" | "line" | "curve";
  pts: Point[];
  fill?: string;
  stroke?: string;
  dash?: string;
  w?: number;
  cls: string;
  a: Anim | null;
};

type BoxOpts = { bg?: boolean; bias?: number; cls?: string; ghost?: boolean; a?: Anim };

class Scene {
  items: Item[] = [];

  box(gx: number, gy: number, w: number, d: number, h: number, z0: number, pal: Palette | null, o: BoxOpts = {}) {
    const z1 = z0 + h;
    const depth = (o.bg ? -50 : gx + w + gy + d + z0 * 0.15) + (o.bias ?? 0);
    const cls = o.cls ?? "";
    const a = o.a ?? null;
    const top = pts([[gx, gy, z1], [gx + w, gy, z1], [gx + w, gy + d, z1], [gx, gy + d, z1]]);
    const left = pts([[gx, gy + d, z0], [gx + w, gy + d, z0], [gx + w, gy + d, z1], [gx, gy + d, z1]]);
    const right = pts([[gx + w, gy, z0], [gx + w, gy + d, z0], [gx + w, gy + d, z1], [gx + w, gy, z1]]);
    const face = (p: Point[], fill: string): Item => ({ depth, kind: "poly", pts: p, fill, cls, a });
    if (o.ghost) {
      const ghost = (p: Point[]): Item => ({ ...face(p, GHOST.fill), stroke: GHOST.stroke, dash: GHOST.dash });
      this.items.push(ghost(left), ghost(right), ghost(top));
    } else if (pal) {
      this.items.push(face(left, pal[1]), face(right, pal[2]), face(top, pal[0]));
    }
  }

  /** A flat outlined square on the pallet, used for the missing slot. */
  slot(gx: number, gy: number, w: number, d: number, z: number, a: Anim) {
    this.items.push({
      depth: gx + w + gy + d + z * 0.15 + 0.02,
      kind: "poly",
      pts: pts([[gx, gy, z], [gx + w, gy, z], [gx + w, gy + d, z], [gx, gy + d, z]]),
      fill: GHOST.fill,
      stroke: GHOST.stroke,
      dash: GHOST.dash,
      cls: "",
      a,
    });
  }

  line(p: [number, number, number], q: [number, number, number], dash: string, depth: number, a: Anim) {
    this.items.push({ depth, kind: "line", pts: pts([p, q]), stroke: "#7C6CEC", dash, w: 1.4, cls: "", a });
  }

  curve(p: [number, number, number], c: [number, number, number], q: [number, number, number], depth: number, a: Anim) {
    this.items.push({ depth, kind: "curve", pts: pts([p, c, q]), stroke: "#7C6CEC", dash: "4 4", cls: "", a });
  }

  render(): IsoShape[] {
    const items = [...this.items].sort((p, q) => p.depth - q.depth);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const it of items) {
      for (const [x, y] of it.pts) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
    const margin = 3;
    const k = Math.min((200 - 2 * margin) / (maxX - minX), (110 - 2 * margin) / (maxY - minY));
    const ox = 100 - ((minX + maxX) / 2) * k;
    const oy = 55 - ((minY + maxY) / 2) * k;
    const T = (q: Point) => `${(q[0] * k + ox).toFixed(1)},${(q[1] * k + oy).toFixed(1)}`;

    const animOf = (it: Item) => {
      const vars: Record<string, string> = {};
      let cls = it.cls ? `${it.cls} ` : "";
      const a = it.a;
      if (a) {
        cls += `i-${a.t}`;
        vars["--d"] = `${a.d ?? 0}s`;
        if (a.h) vars["--h"] = String(a.h);
        if (a.dur) vars["--dur"] = `${a.dur}s`;
        if (a.fx !== undefined && a.fy !== undefined) {
          vars["--fx"] = `${(a.fx * k).toFixed(1)}px`;
          vars["--fy"] = `${(a.fy * k).toFixed(1)}px`;
        }
        if (a.fo) vars["--fo"] = String(a.fo);
      }
      return { cls: cls.trim(), vars };
    };

    return items.map((it): IsoShape => {
      const { cls, vars } = animOf(it);
      if (it.kind === "poly") {
        return { kind: "poly", points: it.pts.map(T).join(" "), fill: it.fill ?? "none", stroke: it.stroke, dash: it.dash, cls, vars };
      }
      if (it.kind === "line") {
        return { kind: "line", points: it.pts.map(T).join(" "), stroke: it.stroke ?? "#7C6CEC", dash: it.dash ?? "none", w: it.w ?? 1.6, cls, vars };
      }
      const [p, c, e] = it.pts;
      const dx = e[0] - c[0];
      const dy = e[1] - c[1];
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const hs = 0.34;
      const h1: Point = [e[0] - ux * hs - uy * hs * 0.6, e[1] - uy * hs + ux * hs * 0.6];
      const h2: Point = [e[0] - ux * hs + uy * hs * 0.6, e[1] - uy * hs - ux * hs * 0.6];
      return {
        kind: "curve",
        d: `M${T(p)} Q${T(c)} ${T(e)}`,
        head: `M${T(h1)} L${T(e)} L${T(h2)}`,
        stroke: it.stroke ?? "#7C6CEC",
        dash: it.dash ?? "none",
        cls,
        vars,
      };
    });
  }
}

const fade: Anim = { t: "fade", d: 0 };
const drop = (d: number, h = 16): Anim => ({ t: "drop", d, h });

function pallet(s: Scene, w: number, d: number) {
  s.box(0, 0, w, d, 0.2, 0, PAL.tile, { bg: true, a: fade });
}

export type IsoSceneKey = "opt" | "reb" | "age" | "pre" | "sto" | "pol" | "rep";

const builders: Record<IsoSceneKey, () => IsoShape[]> = {
  // Stacks rise toward the optimum, the orange block lands on top.
  opt: () => {
    const s = new Scene();
    pallet(s, 4.6, 2.2);
    ([[0.3, 1], [1.7, 2], [3.1, 3]] as const).forEach(([x, n], col) => {
      for (let i = 0; i < n; i++) {
        s.box(x, 0.6, 1, 1, 1, 0.2 + i, i % 2 ? PAL.purple : PAL.deep, { a: drop(0.2 + col * 0.4 + i * 0.14, 18) });
      }
    });
    s.box(3.1, 0.6, 1, 1, 1, 3.2, PAL.orange, { cls: "iso-acc", a: drop(1.7, 34) });
    return s.render();
  },
  // The orange block rests on the right pallet and travels there along the arc from the left one.
  reb: () => {
    const s = new Scene();
    s.box(0, 0, 2.6, 2.6, 0.2, 0, PAL.tile, { bg: true, a: fade });
    s.box(3.6, 0, 2.6, 2.6, 0.2, 0, PAL.tile, { bg: true, a: fade });
    s.box(0.2, 0.3, 1, 1, 1, 0.2, PAL.deep, { a: drop(0.15) });
    s.box(1.4, 0.3, 1, 1, 1, 0.2, PAL.purple, { a: drop(0.3) });
    s.box(0.2, 1.5, 1, 1, 1, 0.2, PAL.purple, { a: drop(0.45) });
    s.box(4.6, 1.5, 1, 1, 1, 0.2, PAL.deep, { a: drop(0.6) });
    const from = P(1.4, 0.3, 1.2);
    const to = P(4.0, 0.3, 0.2);
    s.box(4.0, 0.3, 1, 1, 1, 0.2, PAL.orange, {
      cls: "iso-acc",
      a: { t: "path", d: 1.0, dur: 1.3, fx: from[0] - to[0], fy: from[1] - to[1] },
    });
    s.curve([1.0, 0.8, 1.7], [2.6, 0.5, 4.6], [4.35, 0.8, 1.7], 99, { t: "flow", d: 0.8, fo: -8 });
    return s.render();
  },
  // Blocks fade with age, left to right; the oldest, in orange, is the one that needs action.
  age: () => {
    const s = new Scene();
    pallet(s, 6.6, 1.6);
    const cols = [PAL.deep, PAL.purple, PAL.mid, PAL.pale, PAL.orange];
    cols.forEach((pal, i) => {
      s.box(0.2 + i * 1.28, 0.3, 1, 1, 1, 0.2, pal, {
        cls: i === 4 ? "iso-acc" : "",
        a: drop(0.15 + i * 0.2 + (i === 4 ? 0.25 : 0), i === 4 ? 30 : 16),
      });
    });
    return s.render();
  },
  // Solid stacks rise, dashed outlines show the forecast.
  pre: () => {
    const s = new Scene();
    pallet(s, 6.4, 1.8);
    ([[0.3, 1.1, PAL.deep], [1.55, 1.8, PAL.purple], [2.8, 2.5, PAL.deep]] as const).forEach(([x, h, pal], i) => {
      s.box(x, 0.4, 1, 1, h, 0.2, pal, { a: drop(0.15 + i * 0.25, 20) });
    });
    s.box(4.05, 0.4, 1, 1, 3.1, 0.2, null, { ghost: true, a: { t: "flow", d: 0.9, fo: -7 } });
    s.box(5.3, 0.4, 1, 1, 3.8, 0.2, null, { ghost: true, a: { t: "flow", d: 1.05, fo: -7 } });
    s.box(5.4, 0.5, 0.8, 0.8, 0.8, 4.2, PAL.orange, { cls: "iso-acc", a: drop(1.5, 30) });
    return s.render();
  },
  // Stock on the pallet, an empty slot, and the orange block about to fill it.
  sto: () => {
    const s = new Scene();
    pallet(s, 5.4, 2.2);
    [0.3, 1.5, 2.7].forEach((x, i) => {
      s.box(x, 0.6, 1, 1, 1, 0.2, i === 1 ? PAL.deep : PAL.purple, { a: drop(0.15 + i * 0.18) });
    });
    s.slot(3.9, 0.6, 1, 1, 0.21, { t: "flow", d: 0.7, fo: -7 });
    s.line([4.4, 1.1, 0.3], [4.4, 1.1, 1.8], "3 3", 6.6, { t: "flow", d: 0.9, fo: -6 });
    s.box(3.9, 0.6, 1, 1, 1, 2, PAL.orange, { cls: "iso-acc", a: drop(1.2, 44) });
    return s.render();
  },
  // Three sliders: each knob slides along its track while the fill builds behind it.
  pol: () => {
    const s = new Scene();
    s.box(-0.4, -0.4, 5.2, 6.6, 0.2, 0, PAL.tile, { bg: true, a: fade });
    ([[0.2, 1.8, PAL.purple, 0.2], [2.4, 0.9, PAL.deep, 0.5], [4.6, 2.9, PAL.purple, 0.8]] as const).forEach(([gy, len, pal, d0], i) => {
      s.box(0.3, gy, 4, 0.6, 0.25, 0.2, PAL.pale, { a: { t: "fade", d: 0.1 } });
      const n = Math.ceil(len / 0.45);
      const seg = len / n;
      const step = 0.08;
      for (let j = 0; j < n; j++) s.box(0.3 + j * seg, gy, seg, 0.6, 0.25, 0.2, pal, { bias: 3, a: drop(d0 + j * step, 9) });
      s.box(0.3 + len - 0.4, gy - 0.1, 0.8, 0.8, 0.7, 0.2, i === 1 ? PAL.orange : PAL.mid, {
        cls: i === 1 ? "iso-acc" : "",
        bias: 3.2,
        a: { t: "slide", d: d0, dur: n * step + 0.35, fx: -len * 0.866, fy: -len * 0.5 },
      });
    });
    return s.render();
  },
  // A hub with four satellites and dashed links between them.
  rep: () => {
    const s = new Scene();
    pallet(s, 5, 5);
    const sats = [[0.4, 0.4, PAL.mid], [3.6, 0.4, PAL.mid], [0.4, 3.6, PAL.orange], [3.6, 3.6, PAL.mid]] as const;
    sats.forEach(([x, y]) => s.line([2.5, 2.5, 0.22], [x + 0.5, y + 0.5, 0.22], "3 3", -40, { t: "flow", d: 0.9, fo: -6 }));
    sats.forEach(([x, y, pal], i) => {
      const accent = pal === PAL.orange;
      s.box(x, y, 1, 1, 0.8, 0.2, pal, { cls: accent ? "iso-acc" : "", a: drop(0.55 + i * 0.16, accent ? 30 : 18) });
    });
    s.box(1.8, 1.8, 1.4, 1.4, 1.5, 0.2, PAL.deep, { a: drop(0.15, 26) });
    return s.render();
  },
};

/** Built once at load: the scenes never change. */
export const isoScenes: Record<IsoSceneKey, IsoShape[]> = {
  opt: builders.opt(),
  reb: builders.reb(),
  age: builders.age(),
  pre: builders.pre(),
  sto: builders.sto(),
  pol: builders.pol(),
  rep: builders.rep(),
};
