"use client";

import { useRef, useEffect } from "react";

export default function WaveCanvas() {
  const ref    = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef   = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;
    const pref   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      if (pref && active.current) drawFrame();
    };
    resize();
    window.addEventListener("resize", resize);

    // Four layers with tiny Y offsets — same sine frequency creates one coherent band.
    // Phase differences are small so layers barely separate; they add depth, not strands.
    const LAYERS = [
      { dy: -26, amp: 20, thickness: 52, alpha: 0.46, phase: 0.00 },
      { dy:  -8, amp: 24, thickness: 60, alpha: 0.60, phase: 0.18 },
      { dy:   8, amp: 24, thickness: 60, alpha: 0.60, phase: 0.36 },
      { dy:  26, amp: 20, thickness: 52, alpha: 0.46, phase: 0.54 },
    ];

    const drawFrame = () => {
      const W = canvas.width, H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);
      const t   = tRef.current;
      const end = W * 0.84;
      const cy  = H * 0.52;

      // One shared gradient — colour at any X position is identical across all layers.
      const g = ctx.createLinearGradient(0, 0, end, 0);
      g.addColorStop(0,    "rgba(0,0,0,0)");
      g.addColorStop(0.05, "rgba(224,68,122,1)");
      g.addColorStop(0.28, "rgba(150,70,200,1)");
      g.addColorStop(0.54, "rgba(59,130,246,1)");
      g.addColorStop(0.70, "rgba(245,155,10,1)");
      g.addColorStop(0.83, "rgba(251,146,60,0.28)");
      g.addColorStop(1,    "rgba(0,0,0,0)");

      LAYERS.forEach(layer => {
        ctx.save();
        ctx.globalAlpha = layer.alpha;
        ctx.beginPath();
        for (let x = 0; x <= end; x += 2) {
          const sine = Math.sin(x * 0.010 + t * 0.42 + layer.phase) * layer.amp * dpr;
          const y    = cy + layer.dy * dpr + sine;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = g;
        ctx.lineWidth   = layer.thickness * dpr;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.stroke();
        ctx.restore();
      });
    };

    const loop = () => {
      drawFrame();
      tRef.current += 0.008;
      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (active.current) return;
      active.current = true;
      pref ? drawFrame() : loop();
    };
    const stop = () => {
      active.current = false;
      cancelAnimationFrame(rafRef.current);
    };

    const obs = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? start() : stop(); },
      { threshold: 0.01 }
    );
    obs.observe(canvas);

    return () => { stop(); window.removeEventListener("resize", resize); obs.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
