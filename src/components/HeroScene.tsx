import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

type NodeKey =
  | "demand"
  | "procurement"
  | "manufacturing"
  | "logistics"
  | "inventory";

const order: NodeKey[] = [
  "demand",
  "procurement",
  "manufacturing",
  "logistics",
  "inventory",
];

const data: Record<NodeKey, { name: string; tag: string }> = {
  demand: { name: "Demand", tag: "Sense. Predict. Respond." },
  procurement: { name: "Procurement", tag: "Source. Plan. Mitigate." },
  manufacturing: { name: "Manufacturing", tag: "Plan. Produce. Adapt." },
  logistics: { name: "Logistics", tag: "Move. Optimize. Deliver." },
  inventory: { name: "Inventory", tag: "Optimize. Rebalance. Prevent." },
};

// Hand-placed depth positions (three.js units, camera-space) — alternating
// near/far for an orbiting-shell read.
const positions: Record<NodeKey, { x: number; y: number; z: number }> = {
  demand: { x: -255, y: 60, z: 42 },
  procurement: { x: 80, y: 130, z: -32 },
  manufacturing: { x: 270, y: 24, z: 58 },
  logistics: { x: 212, y: -98, z: -38 },
  inventory: { x: -240, y: -96, z: 18 },
};

const hubPos = { x: 0, y: 14, z: 96 };

const icons: Record<NodeKey, string> = {
  demand:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>',
  procurement:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 3h2.4l2.2 11.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20.5 7H6"/></svg>',
  manufacturing:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V11l6 4v-4l6 4V6l6 5v9H3Z"/></svg>',
  logistics:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="8" width="12" height="9"/><path d="M13.5 11h4l4 3.4V17h-8z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>',
  inventory:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z"/><path d="M3 7.5V16l9 4.5 9-4.5V7.5M12 12v8.5"/></svg>',
};

function buildNodeEl(key: NodeKey): HTMLButtonElement {
  const d = data[key];
  const el = document.createElement("button");
  el.className = "node3d";
  el.type = "button";
  el.dataset.node = key;
  el.innerHTML =
    '<span class="ic">' +
    icons[key] +
    '</span><span class="lbl"><span class="name" style="display:block;">' +
    d.name +
    '</span><span class="tag" style="display:block;">' +
    d.tag +
    "</span></span>";
  return el;
}

/**
 * The interactive three.js depth graphic. Split out from Hero so the
 * three.js/CSS3DRenderer code (largest dependency in the bundle) only
 * loads via a lazy import, instead of blocking the hero's initial paint.
 */
export default function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stageRef.current;
    const mobileListEl = mobileListRef.current;
    if (!stageEl || !mobileListEl) return;

    order.forEach((key) => mobileListEl.appendChild(buildNodeEl(key)));

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    let webglReady = false;
    try {
      webglReady =
        !!window.WebGLRenderingContext &&
        !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webglReady = false;
    }

    if (!webglReady) {
      stageEl.style.display = "none";
      mobileListEl.style.display = "flex";
      return;
    }

    let disposed = false;
    let rafId = 0;
    let autoTimer: ReturnType<typeof setInterval> | null = null;

    const W = stageEl.clientWidth;
    const H = stageEl.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 1, 3000);
    const camDist = H / 2 / Math.tan((50 * Math.PI) / 180 / 2);
    const camBase = new THREE.Vector3(0, 0, camDist);
    camera.position.copy(camBase);
    camera.lookAt(0, 0, 0);

    const glRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    glRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    glRenderer.setSize(W, H);
    glRenderer.domElement.style.position = "absolute";
    glRenderer.domElement.style.inset = "0";
    glRenderer.domElement.style.zIndex = "1";
    stageEl.appendChild(glRenderer.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(W, H);
    cssRenderer.domElement.className = "css3d-layer";
    cssRenderer.domElement.style.zIndex = "2";
    stageEl.appendChild(cssRenderer.domElement);

    // ---------- floor grid (procedural texture, radial fade baked in) ----------
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const g = floorCanvas.getContext("2d")!;
    g.clearRect(0, 0, 512, 512);
    g.strokeStyle = "rgba(94,109,149,0.25)";
    g.lineWidth = 1;
    for (let i = 0; i <= 512; i += 32) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 512);
      g.stroke();
      g.beginPath();
      g.moveTo(0, i);
      g.lineTo(512, i);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(floorCanvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);

    const alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = 512;
    alphaCanvas.height = 512;
    const ag = alphaCanvas.getContext("2d")!;
    const grad = ag.createRadialGradient(256, 256, 40, 256, 256, 256);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ag.fillStyle = grad;
    ag.fillRect(0, 0, 512, 512);
    const alphaTex = new THREE.CanvasTexture(alphaCanvas);

    const floorGeo = new THREE.PlaneGeometry(2200, 2200, 1, 1);
    const floorMat = new THREE.MeshBasicMaterial({
      map: tex,
      alphaMap: alphaTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2.55;
    floor.position.set(0, -260, -260);
    scene.add(floor);

    function animateFloor() {
      if (disposed) return;
      tex.offset.y += 0.00035;
      tex.offset.x += 0.00018;
      requestAnimationFrame(animateFloor);
    }
    if (!reduceMotion) animateFloor();

    // ---------- ambient depth particles ----------
    const particleCount = reduceMotion ? 0 : 90;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const primaryColor = new THREE.Color(0x533afd);
    const accentColor = new THREE.Color(0xff7600);
    const particleBase: { x: number; y: number; phase: number; speed: number }[] =
      [];
    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() * 2 - 1) * 420;
      const py = (Math.random() * 2 - 1) * 230;
      const pz = (Math.random() * 2 - 1) * 180;
      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;
      particleBase.push({
        x: px,
        y: py,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5,
      });
      const c = Math.random() > 0.55 ? primaryColor : accentColor;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    particleGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      size: 6,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---------- connecting beams (hub -> each pillar) ----------
    type Beam = {
      curve: THREE.QuadraticBezierCurve3;
      tubeMat: THREE.MeshBasicMaterial;
      bead: THREE.Mesh | null;
      beadMat: THREE.MeshBasicMaterial | null;
      t: number;
      speed: number;
    };
    const beams = {} as Record<NodeKey, Beam>;
    order.forEach((key) => {
      const p = positions[key];
      const mid = new THREE.Vector3(
        (hubPos.x + p.x) / 2,
        (hubPos.y + p.y) / 2 + 46,
        (hubPos.z + p.z) / 2,
      );
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(hubPos.x, hubPos.y, hubPos.z),
        mid,
        new THREE.Vector3(p.x, p.y, p.z),
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 40, 1.4, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x533afd,
        transparent: true,
        opacity: 0.32,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      let bead: THREE.Mesh | null = null;
      if (!reduceMotion) {
        const beadGeo = new THREE.SphereGeometry(3.4, 12, 12);
        const beadMat = new THREE.MeshBasicMaterial({
          color: 0xff7600,
          transparent: true,
          opacity: 0.95,
        });
        bead = new THREE.Mesh(beadGeo, beadMat);
        scene.add(bead);
      }

      beams[key] = {
        curve,
        tubeMat,
        bead,
        beadMat: bead ? (bead.material as THREE.MeshBasicMaterial) : null,
        t: Math.random(),
        speed: 0.09 + Math.random() * 0.03,
      };
    });

    // ---------- CSS3D hub + pillar cards ----------
    const hubEl = document.createElement("div");
    hubEl.className = "hub3d";
    hubEl.innerHTML =
      '<div class="mark"><span></span><span></span><span></span><span></span></div>' +
      '<div class="name">SUPERATOM&nbsp;AI</div>' +
      '<div class="tag">Better decisions,<br>every day</div>';
    const hubObj = new CSS3DObject(hubEl);
    hubObj.position.set(hubPos.x, hubPos.y, hubPos.z);
    scene.add(hubObj);

    const nodeObjs = {} as Record<
      NodeKey,
      { obj: CSS3DObject; el: HTMLButtonElement }
    >;
    order.forEach((key) => {
      const el = buildNodeEl(key);
      const obj = new CSS3DObject(el);
      const p = positions[key];
      obj.position.set(p.x, p.y, p.z);
      scene.add(obj);
      nodeObjs[key] = { obj, el };
    });

    // ---------- interaction ----------
    let pinned: NodeKey | null = null;
    let autoIndex = 0;

    function setActive(key: NodeKey) {
      order.forEach((k) => {
        const active = k === key;
        nodeObjs[k].el.classList.toggle("active", active);
        const mob = mobileListEl!.querySelector<HTMLElement>(
          `.node3d[data-node="${k}"]`,
        );
        if (mob) mob.classList.toggle("active", active);
        beams[k].tubeMat.color.set(active ? 0xff7600 : 0x533afd);
        beams[k].tubeMat.opacity = active ? 0.85 : 0.28;
        if (beams[k].beadMat) beams[k].beadMat.opacity = active ? 1 : 0.6;
      });
    }
    function autoAdvance() {
      if (pinned) return;
      setActive(order[autoIndex]);
      autoIndex = (autoIndex + 1) % order.length;
    }
    function startAuto() {
      autoAdvance();
      autoTimer = setInterval(autoAdvance, 3300);
    }

    function wire(el: HTMLElement, key: NodeKey) {
      el.addEventListener("mouseenter", () => {
        if (!pinned) setActive(key);
      });
      el.addEventListener("mouseleave", () => {
        if (!pinned) autoAdvance();
      });
      el.addEventListener("click", () => {
        pinned = pinned === key ? null : key;
        setActive(pinned || order[autoIndex]);
      });
    }
    order.forEach((key) => {
      wire(nodeObjs[key].el, key);
      const mob = mobileListEl!.querySelector<HTMLElement>(
        `.node3d[data-node="${key}"]`,
      );
      if (mob) wire(mob, key);
    });
    startAuto();

    // ---------- camera parallax ----------
    let targetX = 0;
    let targetY = 0;
    function onMouseMove(e: MouseEvent) {
      const rect = stageEl!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = nx * 95;
      targetY = -ny * 65;
    }
    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }
    stageEl.addEventListener("mousemove", onMouseMove);
    stageEl.addEventListener("mouseleave", onMouseLeave);

    let idleAngle = 0;

    // ---------- resize ----------
    function onResize() {
      const w = stageEl!.clientWidth;
      const h = stageEl!.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      const dist = h / 2 / Math.tan((camera.fov * Math.PI) / 180 / 2);
      camBase.set(0, 0, dist);
      camera.updateProjectionMatrix();
      glRenderer.setSize(w, h);
      cssRenderer.setSize(w, h);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(stageEl);

    // ---------- render loop ----------
    const clock = new THREE.Clock();
    function animate() {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reduceMotion && particleCount) {
        const pos = particleGeo.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const b = particleBase[i];
          pos.array[i * 3 + 1] = b.y + Math.sin(t * b.speed + b.phase) * 10;
        }
        pos.needsUpdate = true;
      }

      order.forEach((key) => {
        const beam = beams[key];
        if (!beam.bead) return;
        beam.t += 0.0034 * (60 * beam.speed);
        if (beam.t > 1) beam.t -= 1;
        const pt = beam.curve.getPointAt(beam.t);
        beam.bead.position.copy(pt);
      });

      if (canHover && !reduceMotion) {
        camera.position.x += (camBase.x + targetX - camera.position.x) * 0.06;
        camera.position.y += (camBase.y + targetY - camera.position.y) * 0.06;
        camera.position.z += (camBase.z - camera.position.z) * 0.06;
      } else if (!reduceMotion) {
        idleAngle += 0.0028;
        camera.position.x = camBase.x + Math.sin(idleAngle) * 60;
        camera.position.y = camBase.y + Math.sin(idleAngle * 0.6) * 30;
        camera.position.z = camBase.z;
      } else {
        camera.position.copy(camBase);
      }
      camera.lookAt(0, 0, 0);

      glRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (autoTimer) clearInterval(autoTimer);
      ro.disconnect();
      stageEl.removeEventListener("mousemove", onMouseMove);
      stageEl.removeEventListener("mouseleave", onMouseLeave);
      particleGeo.dispose();
      particleMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      tex.dispose();
      alphaTex.dispose();
      Object.values(beams).forEach((beam) => {
        beam.tubeMat.dispose();
        beam.beadMat?.dispose();
      });
      glRenderer.dispose();
      glRenderer.domElement.remove();
      cssRenderer.domElement.remove();
      mobileListEl.innerHTML = "";
    };
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        className="hero-gl-stage relative aspect-[16/11.6] max-h-[500px] w-full overflow-hidden rounded-[18px] max-lg:hidden"
      >
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-[6] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap font-display text-[10.5px] uppercase tracking-[0.08em] text-muted">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7" />
          </svg>
          Move your cursor
        </div>
      </div>

      <div
        ref={mobileListRef}
        className="hero-mobile-list hidden flex-col gap-2.5 lg:hidden"
      />
    </div>
  );
}
