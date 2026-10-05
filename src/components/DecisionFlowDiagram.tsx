import { useEffect, useRef } from "react";
import * as THREE from "three";

type Palette = "deep" | "cyan" | "white" | "purple" | "amethyst" | "violet" | "smoke";

type LabelSpec = {
  lines: string[];
  x: number;
  y: number;
  tick?: [number, number, number];
  accent?: boolean;
};

const LABELS: LabelSpec[] = [
  { lines: ["INFORMED DECISION"], x: 348, y: 618, tick: [348, 676, 746] },
  {
    lines: ["COLLECTIVE DATA-DRIVEN", "DECISION"],
    x: 663,
    y: 354,
    tick: [663, 438, 498],
    accent: true,
  },
  { lines: ["HIGHLY SCALABLE ENTERPRISE"], x: 1100, y: 56, tick: [1100, 104, 138] },
  { lines: ["FASTER DECISIONS, EVERY TIME"], x: 1230, y: 776 },
];

// Same coordinate frame the diagram was designed in: label positions below
// are expressed in these units, converted to container-relative percentages.
const VX = 100;
const VY = 30;
const VW = 1450;
const VH = 1000;
const px = (x: number) => `${((x - VX) / VW) * 100}%`;
const py = (y: number) => `${((y - VY) / VH) * 100}%`;

// Every color below is a literal value from the brand palette (src/index.css
// @theme) — no off-brand blues/greys, so the diagram reads as the same
// system as the rest of the site rather than its own standalone palette.
const BRAND = {
  primary200: 0xc7bdff,
  primary300: 0xa899ff,
  primary400: 0x8a75ff,
  primary500: 0x533afd,
  primary600: 0x4630ca,
  secondary100: 0xdee4f7,
  secondary300: 0x8d9ec9,
  secondary600: 0x0b1330,
  accent200: 0xffcea3,
  page: 0xf8fafd,
};

const COL: Record<Palette, number> = {
  deep: BRAND.primary500,
  cyan: BRAND.primary300,
  white: BRAND.page,
  purple: BRAND.primary200,
  amethyst: BRAND.primary600,
  violet: BRAND.secondary600,
  smoke: BRAND.secondary300,
};

/**
 * Animated hero diagram: an atom ("informed decision") sends particles into
 * a cluster ("collective data-driven decision"), which builds into a
 * rotating network sphere ("highly scalable enterprise"), landing on
 * "faster decisions, every time." Runs as an ambient WebGL loop for as long
 * as the component is mounted, matching InfrastructureDiagram's pattern of
 * owning a Three.js scene for its lifetime rather than embedding an iframe.
 */
export default function DecisionFlowDiagram() {
  const sceneElRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const sceneEl = sceneElRef.current;
    if (!sceneEl) return;

    let disposed = false;
    let rafId = 0;
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    sceneEl.appendChild(renderer.domElement);

    const world = new THREE.Scene();
    // The container is locked to the same VW:VH aspect ratio, so the frustum
    // never needs recomputing on resize — only the pixel resolution does.
    const camera = new THREE.OrthographicCamera(VX, VX + VW, -VY, -(VY + VH), 1, 5000);
    camera.position.set(0, 0, 2000);

    function resize() {
      const w = sceneEl!.clientWidth;
      const h = sceneEl!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(sceneEl);
    resize();

    world.add(new THREE.HemisphereLight(0xffffff, BRAND.primary200, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.75);
    key.position.set(-0.6, 0.8, 1);
    world.add(key);
    const rim = new THREE.DirectionalLight(BRAND.primary200, 0.45);
    rim.position.set(0.8, -0.4, 0.6);
    world.add(rim);

    const sphereGeo = track(new THREE.SphereGeometry(1, 48, 32));
    const mats = {} as Record<Palette, THREE.MeshStandardMaterial>;
    const mat = (c: Palette) =>
      mats[c] ||
      (mats[c] = track(
        new THREE.MeshStandardMaterial({ color: COL[c], roughness: 0.85, metalness: 0 }),
      ));
    const ball = (c: Palette, r: number) => {
      const m = new THREE.Mesh(sphereGeo, mat(c));
      m.scale.setScalar(r);
      return m;
    };
    const P = (x: number, y: number, z = 0) => new THREE.Vector3(x, -y, z);
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
    const back = (u: number) => {
      if (u <= 0) return 0;
      if (u >= 1) return 1;
      const c = 1.70158;
      const c3 = c + 1;
      return 1 + c3 * (u - 1) ** 3 + c * (u - 1) ** 2;
    };

    // soft glow sprites
    const glowTex = track(
      (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 256;
        const g = c.getContext("2d")!;
        const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        r.addColorStop(0, "rgba(255,255,255,1)");
        r.addColorStop(0.5, "rgba(255,255,255,.4)");
        r.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(c);
      })(),
    );
    const glow = (x: number, y: number, d: number, color: number) => {
      const material = track(
        new THREE.SpriteMaterial({
          map: glowTex,
          color,
          transparent: true,
          depthWrite: false,
          opacity: 0,
        }),
      );
      const s = new THREE.Sprite(material);
      s.position.copy(P(x, y, -600));
      s.scale.set(d, d, 1);
      world.add(s);
      return s;
    };
    const gSphere = glow(1100, 415, 760, BRAND.primary200);
    // A touch of accent orange on the payoff glow, echoing the same
    // purple+orange glow pairing used behind the CTA section and footer.
    const gSphere2 = glow(1230, 520, 440, BRAND.accent200);
    const gSphere3 = glow(980, 300, 400, BRAND.primary200);
    const gCluster = glow(665, 600, 360, BRAND.primary300);
    const gAtom = glow(348, 805, 250, BRAND.primary200);

    // paths
    const main = new THREE.CurvePath<THREE.Vector3>();
    main.add(new THREE.CubicBezierCurve3(P(150, 975), P(240, 915), P(300, 850), P(350, 805)));
    main.add(new THREE.CubicBezierCurve3(P(350, 805), P(430, 735), P(560, 655), P(665, 600)));
    main.add(new THREE.CubicBezierCurve3(P(665, 600), P(740, 560), P(805, 515), P(868, 478)));
    const exitC = new THREE.QuadraticBezierCurve3(P(1295, 622), P(1360, 720), P(1445, 790));
    const L = main.getLength();
    const LE = exitC.getLength();
    const at = (s: number) => main.getPointAt(clamp(s / L));
    const nearest = (x: number, y: number) => {
      let best = 0;
      let bd = Infinity;
      for (let s = 0; s <= L; s += 2) {
        const p = at(s);
        const d = (p.x - x) ** 2 + (p.y + y) ** 2;
        if (d < bd) {
          bd = d;
          best = s;
        }
      }
      return best;
    };
    const LA = nearest(348, 805);
    const LC = nearest(665, 600);

    function faintLine(curve: THREE.Curve<THREE.Vector3>, n: number) {
      const geo = track(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(n)));
      const material = track(new THREE.LineBasicMaterial({ color: BRAND.secondary100 }));
      const line = new THREE.Line(geo, material);
      line.position.z = -300;
      world.add(line);
      return { line, n };
    }
    const mainLine = faintLine(main, 400);
    const exitLine = faintLine(exitC, 120);

    const GAP = 23;
    const ramp: [number, THREE.Color][] = [
      [0, new THREE.Color(BRAND.secondary300)],
      [0.35, new THREE.Color(BRAND.primary300)],
      [0.65, new THREE.Color(BRAND.primary500)],
      [1, new THREE.Color(BRAND.primary600)],
    ];
    const rampAt = (f: number) => {
      for (let i = 1; i < ramp.length; i++) {
        if (f <= ramp[i][0]) {
          const [a, ca] = ramp[i - 1];
          const [b, cb] = ramp[i];
          return ca.clone().lerp(cb, (f - a) / (b - a));
        }
      }
      return ramp[ramp.length - 1][1].clone();
    };
    function dotSet(n: number) {
      const geo = track(new THREE.SphereGeometry(3.6, 12, 8));
      const material = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
      const m = new THREE.InstancedMesh(geo, material, n);
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      for (let i = 0; i < n; i++) m.setColorAt(i, new THREE.Color(BRAND.primary400));
      m.position.z = -280;
      world.add(m);
      return m;
    }
    const mainDots = dotSet(Math.ceil(L / GAP) + 1);
    const exitDots = dotSet(Math.ceil(LE / GAP) + 1);
    const dummy = new THREE.Object3D();
    function layDots(
      mesh: THREE.InstancedMesh,
      curve: THREE.Curve<THREE.Vector3>,
      len: number,
      rev: number,
      off: number,
      f0: number,
      f1: number,
    ) {
      const n = mesh.count;
      for (let i = 0; i < n; i++) {
        const s = (((i * GAP + off) % len) + len) % len;
        const p = curve.getPointAt(s / len);
        dummy.position.copy(p);
        dummy.scale.setScalar(s <= rev ? 1 : 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, rampAt(f0 + (f1 - f0) * (s / len)));
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // floaters
    const floaterSpecs: [number, number, number, Palette][] = [
      [237, 763, 9, "amethyst"],
      [285, 778, 7, "cyan"],
      [510, 888, 13, "white"],
      [826, 832, 15, "violet"],
      [1293, 905, 17, "white"],
      [1182, 964, 11, "smoke"],
      [1375, 948, 9, "amethyst"],
      [930, 180, 8, "violet"],
    ];
    const floaters = floaterSpecs.map(([x, y, r, c], i) => {
      const m = ball(c, r);
      m.position.copy(P(x, y, -200));
      world.add(m);
      return { m, y, r, ph: i * 1.3 };
    });

    // atom: core, flat rings, tilted 3D orbit with an electron
    const atom = new THREE.Group();
    atom.position.copy(P(348, 805));
    world.add(atom);
    atom.add(ball("deep", 35));
    const ringMat = track(
      new THREE.MeshBasicMaterial({
        color: BRAND.primary200,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    const disc = new THREE.Mesh(
      track(new THREE.CircleGeometry(85, 64)),
      track(new THREE.MeshBasicMaterial({ color: BRAND.page, transparent: true, opacity: 0.8, depthWrite: false })),
    );
    disc.position.z = -120;
    atom.add(disc);
    const ring1 = new THREE.Mesh(track(new THREE.RingGeometry(84, 86, 96)), ringMat);
    ring1.position.z = -110;
    atom.add(ring1);
    const ring2 = new THREE.Mesh(track(new THREE.RingGeometry(48.5, 51.5, 96)), ringMat);
    ring2.position.z = -100;
    atom.add(ring2);
    const pulse = new THREE.Mesh(
      track(new THREE.RingGeometry(49, 51, 96)),
      track(new THREE.MeshBasicMaterial({ color: BRAND.primary200, transparent: true, opacity: 0, depthWrite: false })),
    );
    pulse.position.z = -100;
    atom.add(pulse);
    const orbit = new THREE.Group();
    orbit.rotation.set(1.27, 0, -0.14);
    atom.add(orbit);
    orbit.add(
      new THREE.Mesh(
        track(new THREE.TorusGeometry(72, 1.1, 8, 120)),
        track(new THREE.MeshBasicMaterial({ color: BRAND.primary200 })),
      ),
    );
    const electron = ball("amethyst", 7);
    orbit.add(electron);

    // cluster: seven spheres with real depth, slowly turning
    const cluster = new THREE.Group();
    cluster.position.copy(P(665, 600));
    world.add(cluster);
    const clusterSpec: [number, number, number, number, Palette][] = [
      [-30, -50, -20, 33, "amethyst"],
      [40, -44, -25, 33, "white"],
      [-62, -20, -10, 27, "cyan"],
      [68, 20, -5, 27, "smoke"],
      [-42, 46, 10, 30, "violet"],
      [28, 52, 15, 34, "cyan"],
      [0, 0, 30, 41, "deep"],
    ];
    const members = clusterSpec.map(([x, y, z, r, c]) => {
      const m = ball(c, r);
      m.position.set(x, -y, z);
      m.scale.setScalar(0);
      cluster.add(m);
      return { m, r };
    });

    // network sphere: nodes + edges in one rotating group
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const N = 44;
    const R = 240;
    const net = new THREE.Group();
    net.position.copy(P(1100, 415, -50));
    net.rotation.x = 0.38;
    world.add(net);
    const spin = new THREE.Group();
    net.add(spin);

    type NodeType = Palette | "ring" | "tiny";
    const BASE_BY_TYPE: Record<NodeType, number> = {
      deep: 15,
      cyan: 14,
      amethyst: 13,
      violet: 12,
      smoke: 12,
      white: 13,
      purple: 9,
      ring: 6,
      tiny: 5,
    };
    type Pt = { pos: THREE.Vector3; base: number; m: THREE.Mesh; rt: number };
    const pts: Pt[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - ((i + 0.5) / N) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = i * 2.39996;
      const roll = rnd();
      const type: NodeType =
        roll < 0.18
          ? "deep"
          : roll < 0.32
            ? "cyan"
            : roll < 0.44
              ? "amethyst"
              : roll < 0.54
                ? "violet"
                : roll < 0.63
                  ? "smoke"
                  : roll < 0.8
                    ? "white"
                    : roll < 0.88
                      ? "purple"
                      : roll < 0.94
                        ? "ring"
                        : "tiny";
      const base = BASE_BY_TYPE[type];
      const pos = new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr).multiplyScalar(R);
      let m: THREE.Mesh;
      if (type === "ring") {
        m = new THREE.Mesh(
          track(new THREE.TorusGeometry(1, 0.2, 8, 24)),
          track(new THREE.MeshBasicMaterial({ color: BRAND.primary400 })),
        );
      } else {
        m = new THREE.Mesh(sphereGeo, mat(type === "tiny" ? "purple" : type));
      }
      m.position.copy(pos);
      m.scale.setScalar(0);
      spin.add(m);
      pts.push({ pos, base, m, rt: 0 });
    }
    const edgePairs: [number, number][] = [];
    const seen = new Set<string>();
    pts.forEach((p, i) => {
      pts
        .map((q, j): [number, number] => [j, p.pos.distanceToSquared(q.pos)])
        .filter((d) => d[0] !== i)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .forEach(([j]) => {
          const k = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(k)) {
            seen.add(k);
            edgePairs.push([i, j]);
          }
        });
    });

    // ---- timing (reveal order + schedule)
    const S1 = 0.9,
      S1_GAP = 0.28,
      S1_DUR = 1.4,
      S1_N = 7;
    const S2 = 4.3,
      S2_GAP = 0.25,
      S2_DUR = 1.0,
      S2_N = 8;
    const EXIT_T = 7.1,
      BUILD_END = 8.6,
      IDLE_GAP = 1.5,
      IDLE_DUR = 3.4;
    const order = pts.map((_, i) => i).sort(() => rnd() - 0.5);
    order.forEach((idx, k) => {
      pts[idx].rt = S2 + S2_DUR + Math.floor((k * S2_N) / N) * S2_GAP;
    });
    const edges = edgePairs
      .map(([a, b]) => ({ a, b, rt: Math.max(pts[a].rt, pts[b].rt) + 0.2 }))
      .sort((x, y) => x.rt - y.rt);
    const edgePos = new Float32Array(edges.length * 6);
    edges.forEach((e, k) => {
      const a = pts[e.a].pos;
      const b = pts[e.b].pos;
      edgePos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6);
    });
    const edgeGeo = track(new THREE.BufferGeometry());
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    const edgeLines = new THREE.LineSegments(
      edgeGeo,
      track(new THREE.LineBasicMaterial({ color: BRAND.primary300, transparent: true, opacity: 0.7 })),
    );
    spin.add(edgeLines);

    // travelling particles
    const pColors: Palette[] = ["amethyst", "deep", "violet", "smoke"];
    const pool = Array.from({ length: 14 }, (_, i) => {
      const m = ball(pColors[i % 4], 6);
      m.visible = false;
      m.position.z = 60;
      world.add(m);
      return m;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(t: number) {
      atom.scale.setScalar(Math.max(0.0001, back(clamp(t / 0.6))));
      gAtom.material.opacity = clamp(t / 0.6) * 0.9;
      electron.position.set(72 * Math.cos(t * 1.6), 72 * Math.sin(t * 1.6), 0);
      const pp = ((t - 1) % 2.8) / 2.8;
      if (t > 1) {
        pulse.scale.setScalar(1 + pp * 1.2);
        pulse.material.opacity = (1 - pp) * 0.8;
      }

      const labelOpacities = [
        clamp((t - 0.4) / 0.6),
        clamp((t - 3.7) / 0.6),
        clamp((t - 6.7) / 0.6),
        clamp((t - 8.0) / 0.6),
      ];
      labelOpacities.forEach((o, i) => {
        const el = labelRefs.current[i];
        if (el) el.style.opacity = String(o);
      });

      let rev: number;
      if (t < S1) rev = LA * clamp(t / 0.6);
      else if (t < S2) rev = LA + (LC - LA) * ease(clamp((t - S1) / S1_DUR));
      else rev = LC + (L - LC) * ease(clamp((t - S2) / S2_DUR));
      const erev = LE * ease(clamp((t - EXIT_T) / 1));
      mainLine.line.geometry.setDrawRange(0, Math.round((rev / L) * mainLine.n) + 1);
      exitLine.line.geometry.setDrawRange(0, erev > 0 ? Math.round((erev / LE) * exitLine.n) + 1 : 0);
      const off = reduce ? 0 : t * 30;
      layDots(mainDots, main, L, rev, off, 0, 0.78);
      layDots(exitDots, exitC, LE, erev, off, 0.85, 1);

      const breathe = 1 + 0.025 * Math.sin(t * 1.8);
      let cCount = 0;
      members.forEach((mem, i) => {
        const u = clamp((t - (S1 + S1_DUR + i * S1_GAP)) / 0.45);
        cCount += u;
        mem.m.scale.setScalar(Math.max(0.0001, back(u) * mem.r));
      });
      cluster.scale.setScalar(breathe);
      cluster.rotation.y = Math.sin(t * 0.5) * 0.5;
      cluster.rotation.x = Math.cos(t * 0.4) * 0.25;
      gCluster.material.opacity = (cCount / members.length) * 0.9;

      spin.rotation.y = t * 0.22;
      let shown = 0;
      pts.forEach((p) => {
        const u = clamp((t - p.rt) / 0.45);
        shown += u;
        p.m.scale.setScalar(Math.max(0.0001, back(u) * p.base));
      });
      let eCount = 0;
      while (eCount < edges.length && edges[eCount].rt <= t) eCount++;
      edgeGeo.setDrawRange(0, eCount * 2);
      const sg = shown / N;
      gSphere.material.opacity = sg * 0.95;
      gSphere2.material.opacity = sg;
      gSphere3.material.opacity = sg;

      floaters.forEach((f) => {
        f.m.position.y = -(f.y + (reduce ? 0 : 8 * Math.sin(t * 0.7 + f.ph)));
        f.m.scale.setScalar(Math.max(0.0001, f.r * clamp((t - 1.5) / 1.5)));
      });

      let used = 0;
      const place = (len: number, alpha: number) => {
        if (used >= pool.length) return;
        const m = pool[used++];
        const p = at(len);
        m.visible = true;
        m.position.x = p.x;
        m.position.y = p.y;
        m.scale.setScalar(6 * alpha);
      };
      if (!reduce) {
        for (let i = 0; i < S1_N; i++) {
          const u = (t - (S1 + i * S1_GAP)) / S1_DUR;
          if (u >= 0 && u < 1) place(LA + (LC - LA) * ease(u), Math.min(1, u * 5, (1 - u) * 6));
        }
        for (let j = 0; j < S2_N; j++) {
          const u = (t - (S2 + j * S2_GAP)) / S2_DUR;
          if (u >= 0 && u < 1) place(LC + (L - LC) * ease(u), Math.min(1, u * 5, (1 - u) * 6));
        }
        if (t > BUILD_END) {
          const k = Math.floor((t - BUILD_END) / IDLE_GAP);
          for (let m = k; m >= 0 && m > k - 4; m--) {
            const u = (t - (BUILD_END + m * IDLE_GAP)) / IDLE_DUR;
            if (u >= 0 && u < 1) place(L * ease(u), Math.min(1, u * 6, (1 - u) * 8));
          }
        }
      }
      for (let i = used; i < pool.length; i++) pool[i].visible = false;

      renderer.render(world, camera);
    }

    if (reduce) {
      render(30);
    } else {
      const t0 = performance.now();
      const frame = (now: number) => {
        if (disposed) return;
        render((now - t0) / 1000);
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    // Below ~480px the single-line labels (e.g. "INFORMED DECISION") no
    // longer fit without clipping against the rounded corners, so — same
    // fallback as the original standalone version — let the diagram scroll
    // horizontally at its minimum readable width instead of truncating text.
    <div className="w-full overflow-x-auto">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-secondary-100 bg-page"
        style={{ aspectRatio: "1450 / 1000", containerType: "inline-size", minWidth: 480 }}
        role="img"
        aria-label="A 3D atom labelled Informed Decision sends particles along a dotted path into a cluster labelled Collective Data-Driven Decision, which builds a rotating network sphere labelled Highly Scalable Enterprise, leading to Faster Decisions, Every Time."
      >
        <div ref={sceneElRef} className="absolute inset-0" />
        {LABELS.map((label, i) => (
          <div
            key={label.lines.join(" ")}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute -translate-x-1/2 whitespace-nowrap text-center font-display font-bold uppercase"
              style={{
                left: px(label.x),
                top: py(label.y),
                fontSize: "clamp(10px, 1.66cqw, 20px)",
                lineHeight: 1.33,
                letterSpacing: "0.11em",
                color: label.accent ? "var(--color-primary-500)" : "var(--color-heading)",
                opacity: 0,
              }}
            >
              {label.lines.map((line, li) => (
                <span key={line}>
                  {line}
                  {li < label.lines.length - 1 && <br />}
                </span>
              ))}
            </div>
            {label.tick && (
              <div
                className="absolute w-[2px] -translate-x-px"
                style={{
                  left: px(label.tick[0]),
                  top: py(label.tick[1]),
                  height: `${((label.tick[2] - label.tick[1]) / VH) * 100}%`,
                  backgroundColor: "var(--color-secondary-400)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
