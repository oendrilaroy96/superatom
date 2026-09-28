import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Layer = { name: string; outcome: string; side: "left" | "right" };

const LAYERS: Layer[] = [
  { name: "Secure", outcome: "People", side: "right" },
  { name: "Governed", outcome: "Data", side: "left" },
  { name: "Scalable", outcome: "Decisions", side: "right" },
  { name: "Reliable", outcome: "A stronger tomorrow", side: "left" },
];

const LAYER_COLORS = [
  { top: 0xffb066, left: 0xff7600, right: 0xcc5e00, opacity: 0.92 },
  { top: 0xc7bdff, left: 0x8a75ff, right: 0x4630ca, opacity: 0.92 },
  { top: 0xc7bdff, left: 0x8a75ff, right: 0x4630ca, opacity: 0.78 },
  { top: 0xc7bdff, left: 0x8a75ff, right: 0x4630ca, opacity: 0.62 },
];

// Reveal order runs bottom-to-top: the last layer animates in first. Each
// layer's entrance finishes before the next one starts.
const LAYER_STAGGER = 0.4;
const START_DELAY = 0.5;
const ENTER_DURATION = 0.4;
function revealDelay(i: number) {
  return START_DELAY + LAYER_STAGGER * (LAYERS.length - 1 - i);
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const BOX_W = 2.6;
const BOX_D = 2.6;
const BOX_H = 0.62;
const DOT_OFFSET_PCT = 9.4;
const LABEL_GAP = 12;
const LABEL_W = 148;

type Anchor = { x: number; y: number };

/**
 * WebGL rendering of the infrastructure stack (real extruded boxes under an
 * isometric orthographic camera) for a smoother, GPU-driven reveal than the
 * flat SVG polygon version. Lazy-loaded from Infrastructure.tsx so three.js
 * only loads for visitors who scroll this far.
 */
export default function InfrastructureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<Anchor[] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let disposed = false;
    let rafId = 0;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const scene = new THREE.Scene();
    const viewSize = 5.6;
    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 100);
    const stackHeight = BOX_H * LAYERS.length;
    const center = new THREE.Vector3(0, stackHeight / 2, 0);
    const dir = new THREE.Vector3(1, 1, 1).normalize();
    camera.position.copy(center.clone().add(dir.multiplyScalar(10)));
    camera.up.set(0, 1, 0);

    function setFrustum(w: number, h: number) {
      const aspect = w / h || 1;
      camera.left = (-viewSize * aspect) / 2;
      camera.right = (viewSize * aspect) / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }
    setFrustum(W, H);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    el.appendChild(renderer.domElement);

    type Box = {
      materials: THREE.MeshBasicMaterial[];
      mesh: THREE.Mesh;
      restY: number;
      targetOpacity: number;
    };
    const geo = new THREE.BoxGeometry(BOX_W, BOX_H, BOX_D);
    const boxes: Box[] = LAYERS.map((_layer, i) => {
      const c = LAYER_COLORS[i];
      const mk = (color: number) =>
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
      const materials = [
        mk(c.left), // +x
        mk(c.right), // -x
        mk(c.top), // +y
        mk(c.right), // -y
        mk(c.right), // +z
        mk(c.left), // -z
      ];
      const mesh = new THREE.Mesh(geo, materials);
      const restY = (LAYERS.length - 1 - i) * BOX_H + BOX_H / 2;
      mesh.position.set(0, restY - 0.3, 0);
      scene.add(mesh);
      return { materials, mesh, restY, targetOpacity: c.opacity };
    });

    function computeAnchors() {
      const pts = LAYERS.map((layer, i) => {
        const x = layer.side === "right" ? BOX_W / 2 : -BOX_W / 2;
        const p = new THREE.Vector3(x, boxes[i].restY, BOX_D / 2);
        p.project(camera);
        return { x: ((p.x + 1) / 2) * 100, y: ((1 - p.y) / 2) * 100 };
      });
      setAnchors(pts);
    }
    computeAnchors();

    function onResize() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      setFrustum(w, h);
      renderer.setSize(w, h);
      computeAnchors();
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    let triggerTime: number | null = null;
    let io: IntersectionObserver | null = null;

    if (reduceMotion) {
      boxes.forEach((b) => {
        b.mesh.position.y = b.restY;
        b.materials.forEach((m) => (m.opacity = b.targetOpacity));
      });
      setVisible(true);
      renderer.render(scene, camera);
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            triggerTime = performance.now();
            setVisible(true);
            io?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);

      const frame = (now: number) => {
        if (disposed) return;
        if (triggerTime !== null) {
          boxes.forEach((b, i) => {
            const elapsed = (now - triggerTime!) / 1000 - revealDelay(i);
            const t = easeOutCubic(
              Math.max(0, Math.min(1, elapsed / ENTER_DURATION)),
            );
            b.mesh.position.y = b.restY - 0.3 * (1 - t);
            const op = b.targetOpacity * t;
            b.materials.forEach((m) => (m.opacity = op));
          });
        }
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      io?.disconnect();
      ro.disconnect();
      geo.dispose();
      boxes.forEach((b) => b.materials.forEach((m) => m.dispose()));
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-secondary-100 bg-page"
      style={{ aspectRatio: "640 / 400" }}
    >
      <div ref={containerRef} className="absolute inset-4 sm:inset-6">
        {anchors &&
          LAYERS.map((layer, i) => {
            const isRight = layer.side === "right";
            const a = anchors[i];
            const dotX = isRight ? a.x + DOT_OFFSET_PCT : a.x - DOT_OFFSET_PCT;
            return (
              <div key={`${layer.name}-line`} aria-hidden="true">
                <div
                  className="absolute h-px bg-secondary-300"
                  style={{
                    top: `${a.y}%`,
                    left: `${isRight ? a.x : dotX}%`,
                    width: `${DOT_OFFSET_PCT}%`,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.3s ease ${revealDelay(i) + 0.08}s`,
                  }}
                />
                <div
                  className="absolute h-[7px] w-[7px] rounded-full bg-primary-500"
                  style={{
                    top: `${a.y}%`,
                    left: `${dotX}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.25s ease ${revealDelay(i) + 0.2}s`,
                  }}
                />
              </div>
            );
          })}

        {anchors &&
          LAYERS.map((layer, i) => {
            const isRight = layer.side === "right";
            const a = anchors[i];
            const dotX = isRight ? a.x + DOT_OFFSET_PCT : a.x - DOT_OFFSET_PCT;
            return (
              <div
                key={`${layer.name}-label`}
                className="absolute"
                style={{
                  top: `calc(${a.y}% - 26px)`,
                  left: isRight ? `calc(${dotX}% + ${LABEL_GAP}px)` : undefined,
                  right: !isRight
                    ? `calc(${100 - dotX}% + ${LABEL_GAP}px)`
                    : undefined,
                  width: `min(${LABEL_W}px, ${(isRight ? 100 - dotX : dotX).toFixed(2)}%)`,
                  textAlign: isRight ? "left" : "right",
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "translateX(0)"
                    : `translateX(${isRight ? 8 : -8}px)`,
                  transition: `opacity 0.3s ease ${revealDelay(i) + 0.12}s, transform 0.3s ease ${revealDelay(i) + 0.12}s`,
                }}
              >
                <p className="font-display text-[15px] font-bold text-heading">
                  {layer.name}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug text-caption">
                  {layer.outcome}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
