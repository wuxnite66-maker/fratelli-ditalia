"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SITE } from "@/data/site";
import { useOpenStatus } from "@/lib/useOpenStatus";

/**
 * Three.js Scroll-Stage (Hero):
 * - Pinned über 300vh; Scroll-Fortschritt steuert die Szene deterministisch —
 *   runterscrollen = vorwärts, hochscrollen = rückwärts.
 * - Liegt /videos/hero.mp4 vor, wird das Video als Textur Frame-genau
 *   gescrubbt (video.currentTime = progress · duration), wie bei Apple.
 * - Ohne Video: Kamerafahrt auf das Pizza-Still + goldene Partikel.
 */
export default function ScrollStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textARef = useRef<HTMLDivElement>(null);
  const textBRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const status = useOpenStatus();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.z = 1.6;

    // ---- media plane (video if available, else still image) ----
    // Seitenverhältnis des Mediums; wird nach dem Laden aktualisiert,
    // damit auch quadratische Videos unverzerrt cover-gefittet werden.
    let mediaAspect = 1.5;

    const loader = new THREE.TextureLoader();
    let texture: THREE.Texture = loader.load(
      "/images/hero-pizza.jpg",
      (t) => {
        mediaAspect = t.image.width / t.image.height;
        resize();
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    let video: HTMLVideoElement | null = null;
    let videoDuration = 0;

    fetch("/videos/hero.mp4", { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (!r.ok || !type.startsWith("video")) return;
        video = document.createElement("video");
        video.src = "/videos/hero.mp4";
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.addEventListener("loadedmetadata", () => {
          if (!video) return;
          videoDuration = video.duration;
          mediaAspect = video.videoWidth / video.videoHeight;
          const vt = new THREE.VideoTexture(video);
          vt.colorSpace = THREE.SRGBColorSpace;
          material.map = vt;
          material.needsUpdate = true;
          texture = vt;
          resize();
        });
        video.load();
      })
      .catch(() => {});

    // leicht abgedunkelt, damit Headline & CTAs auch auf hellem
    // Videomaterial lesbar bleiben (multipliziert die Textur)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x9a9a9a,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(plane);

    // ---- gold ember particles ----
    const COUNT = 260;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      positions[i * 3 + 2] = Math.random() * 0.9;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd9b877,
      size: 0.014,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ---- sizing ----
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // cover-fit the plane to the viewport, respecting media aspect;
      // Basis ist die weiteste Kameraposition (z=1.6), dort ist der
      // sichtbare Ausschnitt am größten — so sind nie Ränder sichtbar.
      const dist = 1.6;
      const vh = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const vw = vh * camera.aspect;
      const s = Math.max(vw / mediaAspect, vh) * 1.12;
      plane.scale.set(s * mediaAspect, s, 1);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- scroll progress (deterministic → reversible) ----
    let progress = 0;
    let smooth = 0;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      progress = Math.min(1, Math.max(0, -rect.top / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- render loop ----
    const clock = new THREE.Clock();
    let raf = 0;
    let lastSeek = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      // inertia — butter-smooth follow
      smooth += (progress - smooth) * 0.08;

      // camera dolly-in + slight drift
      camera.position.z = 1.6 - smooth * 0.55;
      camera.position.x = Math.sin(smooth * Math.PI) * 0.06;
      camera.rotation.z = smooth * -0.03;

      // video scrub: forward on scroll down, backward on scroll up
      if (video && videoDuration > 0) {
        const target = smooth * Math.max(0, videoDuration - 0.05);
        if (Math.abs(target - lastSeek) > 1 / 30) {
          video.currentTime = target;
          lastSeek = target;
        }
      } else {
        // still image: subtle living motion
        plane.position.y = Math.sin(t * 0.3) * 0.01 - smooth * 0.12;
      }

      // particles rise with scroll, drift with time
      points.rotation.y = t * 0.02;
      points.position.y = smooth * 0.5;
      pMat.opacity = 0.5 + smooth * 0.4;

      // text crossfade (A: intro → B: reservation prompt)
      if (textARef.current && textBRef.current) {
        const a = Math.max(0, 1 - smooth * 2.4);
        const b = Math.max(0, Math.min(1, (smooth - 0.55) * 3.2));
        textARef.current.style.opacity = String(a);
        textARef.current.style.transform = `translateY(${smooth * -70}px)`;
        // Parallax: Headline driftet etwas schneller als der restliche
        // Textblock nach oben — subtiler Tiefeneffekt beim Scrollen.
        if (headlineRef.current) {
          headlineRef.current.style.transform = `translateY(${
            smooth * -48
          }px)`;
        }
        textARef.current.style.pointerEvents = a > 0.3 ? "auto" : "none";
        textBRef.current.style.opacity = String(b);
        textBRef.current.style.transform = `translateY(${(1 - b) * 40}px)`;
        textBRef.current.style.pointerEvents = b > 0.5 ? "auto" : "none";
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      pGeo.dispose();
      pMat.dispose();
      plane.geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className="relative h-[435vh]">
      {/* sticky stage */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* clean gradient background */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050506_0%,#0d0d12_40%,#12101a_65%,#050506_100%)]" />

        {reduced ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/images/hero-pizza.jpg"
            alt="Frisch gebackene Pizza im Fratelli d'Italia"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden
          />
        )}

        {/* vignette + scrim for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-ink/35" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(11,10,8,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        {/* ---- text state A: intro + conversion CTAs ---- */}
        <div
          ref={textARef}
          className="absolute inset-0 z-10 flex flex-col items-start justify-center px-6 text-left md:px-16 lg:px-24"
        >
          {status && (
            <span
              className={`mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide ${
                status.open
                  ? "bg-teal/25 text-teal-light"
                  : "bg-ink/60 text-gold-light"
              }`}
              role="status"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status.open ? "animate-pulse bg-teal-light" : "bg-gold"
                }`}
              />
              {status.label}
            </span>
          )}

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold-light">
            ★ 4,8 bei Google · 512 Bewertungen
          </p>

          <h1
            ref={headlineRef}
            className="max-w-4xl font-serif text-4xl leading-[1.08] text-cream will-change-transform md:text-6xl lg:text-7xl"
          >
            Echte italienische Pizza —{" "}
            <em className="gold-text">frisch aus dem Ofen.</em>
          </h1>

          <p className="mt-6 max-w-xl text-base text-cream-dim md:text-lg">
            Dünner, knuspriger Teig, großzügig belegt — vom Chef persönlich
            zubereitet. Vor Ort genießen oder mitnehmen.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#reservieren"
              className="btn-gold rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest"
            >
              Tisch reservieren
            </a>
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="btn-ghost rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest"
            >
              ☎ {SITE.phone}
            </a>
            <a
              href="#speisekarte"
              className="btn-ghost rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest"
            >
              Speisekarte
            </a>
          </div>

          <p className="mt-6 text-xs text-cream-dim/70">
            {SITE.address} · Speisen vor Ort &amp; zum Mitnehmen
          </p>

          {/* scroll hint */}
          <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2"
            aria-hidden
          >
            <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold/50 p-2">
              <div className="scroll-dot h-2 w-1 rounded-full bg-gold" />
            </div>
          </div>
        </div>

        {/* ---- text state B: reservation prompt (end of scroll) ---- */}
        <div
          ref={textBRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center opacity-0"
        >
          <h2 className="max-w-3xl font-serif text-4xl leading-tight text-cream md:text-6xl">
            Gusto bekommen?{" "}
            <em className="gold-text">Ihr Tisch wartet schon.</em>
          </h2>
          <p className="mt-5 max-w-md text-cream-dim">
            Reservieren dauert 30 Sekunden — kostenlos und unverbindlich.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#reservieren"
              className="btn-gold rounded-full px-10 py-4 text-sm font-bold uppercase tracking-widest"
            >
              Jetzt Tisch reservieren
            </a>
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="btn-ghost rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest"
            >
              Lieber anrufen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
