"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/** Live-Kitchen: canvas ember/flame simulation of the pizza oven,
 *  with a "baking" progress ring — pure GPU-friendly visual. */
export default function LiveKitchen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  // baking timer loop (90s pizza → sped up to 12s for the demo feel)
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 120);
    return () => clearInterval(id);
  }, []);

  // ember particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
    };
    resize();
    window.addEventListener("resize", resize);

    type Ember = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      life: number;
      max: number;
    };
    const embers: Ember[] = [];

    const spawn = () => {
      const w = canvas.width;
      embers.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.55,
        y: canvas.height + 10,
        r: (Math.random() * 2.2 + 0.8) * DPR,
        vy: -(Math.random() * 1.4 + 0.6) * DPR,
        vx: (Math.random() - 0.5) * 0.6 * DPR,
        life: 0,
        max: Math.random() * 160 + 100,
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (embers.length < 70 && Math.random() > 0.4) spawn();

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(e.life * 0.05) * 0.4 * DPR;
        e.y += e.vy;
        const t = 1 - e.life / e.max;
        if (t <= 0 || e.y < -10) {
          embers.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        grad.addColorStop(0, `rgba(255, 190, 90, ${0.9 * t})`);
        grad.addColorStop(0.5, `rgba(230, 100, 40, ${0.45 * t})`);
        grad.addColorStop(1, "rgba(200, 60, 20, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const circumference = 2 * Math.PI * 44;

  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-vintage-red align-middle" />
            Dal Forno — Live
          </p>
          <h2 className="font-serif text-4xl text-cream md:text-6xl">
            Der Ofen <em className="gold-text">schläft nie</em>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto mt-14 max-w-2xl">
            {/* oven mouth */}
            <div className="heat-haze relative mx-auto aspect-[16/8] overflow-hidden rounded-t-[50%_100%] border-4 border-[#241d14] bg-gradient-to-t from-[#3a1503] via-[#1c0a02] to-ink shadow-[inset_0_-40px_80px_rgba(255,120,30,0.35),0_20px_80px_-20px_rgba(255,120,30,0.25)]">
              {/* fire glow */}
              <div className="flame-flicker absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,150,40,0.55),rgba(255,80,20,0.25)_50%,transparent_75%)]" />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                aria-hidden
              />
              {/* pizza silhouette */}
              <div
                className="absolute bottom-3 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-[#c47b3a] to-[#e8a85c] shadow-[0_0_30px_rgba(255,150,60,0.4)]"
                style={{ opacity: 0.4 + (progress / 100) * 0.6 }}
              />
            </div>

            {/* baking progress */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden>
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(201,169,97,0.15)"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#fireGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.15s linear" }}
                />
                <defs>
                  <linearGradient id="fireGrad">
                    <stop offset="0%" stopColor="#c9a961" />
                    <stop offset="100%" stopColor="#e06a2b" />
                  </linearGradient>
                </defs>
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fill="#e8ce93"
                  fontSize="18"
                  fontFamily="serif"
                >
                  {progress}%
                </text>
              </svg>
              <div className="text-left">
                <p className="font-serif text-xl italic text-cream">
                  {progress < 33
                    ? "Der Teig geht in den Ofen …"
                    : progress < 66
                      ? "Der Käse beginnt zu schmelzen …"
                      : progress < 95
                        ? "Der Rand wird goldbraun …"
                        : "Pronto! Buon appetito!"}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream-dim">
                  ~400 °C · Stein-Ofen · Handarbeit
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
