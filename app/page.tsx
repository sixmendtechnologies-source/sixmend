"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ─── 3D Tubes Background for Hero ────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
      const canvas = document.getElementById("hero-3d-canvas");
      if (canvas) {
        const t = new TubesCursor(canvas, {
          colors: [0x0ea5e9, 0x2563eb, 0x60cfff, 0x1e40af],
          lightIntensity: 50,
        });
        t.start();
        window.__heroTubes = t;
      }
    `;
    document.body.appendChild(script);

    return () => {
      script.remove();
      const w = window as unknown as Record<string, { stop?: () => void }>;
      if (w.__heroTubes) {
        w.__heroTubes.stop?.();
        delete (window as unknown as Record<string, unknown>).__heroTubes;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-3d-canvas"
      className="hero-3d-canvas"
    />
  );
}

// ─── Tech particle effect ─────────────────────────────────────────────
const TECH_SYMBOLS = ["</>", "{}", "[]", "01", "#!", "=>", "&&", "||", "npm", "git", "://", "fn()", "0x", "===", ">>"];

type TechParticle = {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  symbol: string;
  size: number;
  color: string;
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<TechParticle[]>([]);
  const raf = useRef<number>(0);
  const lastEmit = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["rgba(96,165,250,", "rgba(167,139,250,", "rgba(52,211,153,", "rgba(255,255,255,"];

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmit.current < 80) return;
      lastEmit.current = now;

      particles.current.push({
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.5 + 0.8),
        alpha: 1,
        symbol: TECH_SYMBOLS[Math.floor(Math.random() * TECH_SYMBOLS.length)],
        size: Math.random() * 4 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.alpha > 0.03);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.96;
        ctx.globalAlpha = p.alpha;
        ctx.font = `bold ${p.size}px 'Geist Mono', monospace`;
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fillText(p.symbol, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}
    />
  );
}

// ─── Scroll reveal hook ──────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// Reveal wrapper
function R({ children, type = "reveal", delay = "", className = "" }: {
  children: React.ReactNode;
  type?: "reveal" | "reveal-fade" | "reveal-left" | "reveal-right" | "reveal-scale";
  delay?: string;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`${type} ${delay} ${className}`}>
      {children}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(0,0,0,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Sixmend Technology" width={32} height={32} className="rounded-sm object-contain" style={{ display: "block" }} />
          <span className="text-xl font-bold text-white tracking-widest leading-none uppercase" style={{ fontFamily: "var(--font-rajdhani)" }}>Sixmend</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#contact" className="btn-primary text-xs py-2 px-5">
            Let&apos;s talk
          </a>
        </div>

        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.08] bg-black/90 backdrop-blur-xl px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-white/60 hover:text-white" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  const [y, setY] = useState(0);
  const ticking = useRef(false);

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setY(window.scrollY * 0.22);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14 overflow-hidden">
      {/* 3D Tubes Background */}
      <HeroCanvas />

      {/* Radial glow — parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${y}px)` }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.055) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Eyebrow pill */}
        <div className="hero-in-1 inline-flex items-center gap-2.5 border border-white/[0.12] bg-white/[0.03] rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 8px #4ade80" }} />
          <span className="text-xs text-white/50 font-mono tracking-wide">Available for new projects</span>
        </div>

        {/* Main headline */}
        <h1 className="hero-in-2 text-[clamp(2.2rem,6.5vw,4.5rem)] font-semibold leading-[1.04] tracking-tight mb-6">
          <span className="hero-gradient block">We build software</span>
          <span className="hero-gradient block">that ships.</span>
        </h1>

        {/* Sub-headline */}
        <p className="hero-in-3 text-base md:text-lg text-white/35 font-light max-w-2xl mx-auto leading-relaxed mb-4">
          Software development · QA · DevOps · IT support
        </p>
        <p className="hero-in-3 text-sm text-white/25 max-w-xl mx-auto leading-relaxed mb-12">
          Sixmend Technology is a software development and IT services company. We deliver custom web and mobile apps, QA, DevOps, and 24/7 IT support for startups and enterprises.
        </p>

        {/* CTAs */}
        <div className="hero-in-4 flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <a href="#contact" className="btn-primary text-sm py-3.5 px-7">
            Start a project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a href="#services" className="btn-ghost text-sm">
            See what we do →
          </a>
        </div>

        {/* Social proof strip */}
        <div className="hero-in-5 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {["SC", "MR", "PN", "JK"].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-[9px] text-white/60 font-mono">{i}</div>
              ))}
            </div>
            <span className="text-xs text-white/30">500+ projects delivered</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/[0.08]" />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-3 h-3 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-xs text-white/30 ml-1">Trusted by 100+ teams</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/[0.08]" />
          <span className="text-xs font-mono text-white/25">99.9% uptime SLA</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "hero-in 1s ease 1.2s both" }}>
        <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────
const STACK = ["TypeScript", "React", "Next.js", "Node.js", "Python", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "AWS", "PostgreSQL", "Redis", "Playwright", "Jest", "Cypress"];

function Marquee() {
  const items = [...STACK, ...STACK];
  return (
    <div className="border-y border-white/[0.06] py-5 overflow-hidden">
      <div className="marquee-track">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="text-sm font-mono text-white/25 whitespace-nowrap hover:text-white/60 transition-colors cursor-default">{t}</span>
            <span className="text-white/10">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Services ─────────────────────────────────────────────────────────
const SERVICES = [
  {
    number: "01",
    title: "Software Development",
    body: "We architect and build production-grade web applications, APIs, and backend systems. Full-stack, from database schema to deployed product.",
    tags: ["Web apps", "APIs", "Mobile", "Microservices"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "QA & Testing",
    body: "Automated and manual testing across the full stack. We write test suites, set up CI pipelines, and give you confidence every release.",
    tags: ["Playwright", "Jest", "E2E", "Load testing"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "DevOps & Cloud",
    body: "Infrastructure as code, CI/CD pipelines, container orchestration, and cloud cost optimisation — so your team ships faster with less friction.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "IT Support",
    body: "Responsive, reliable support for your systems and teams. On-site or remote — we keep your business running around the clock.",
    tags: ["24/7", "Remote", "On-site", "SLA"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

function Services() {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-28">
      <R type="reveal" className="mb-4">
        <p className="text-xs font-mono text-white/25 tracking-widest uppercase">Services</p>
      </R>
      <R type="reveal" delay="delay-1" className="mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-lg">
          Everything you need to ship and scale.
        </h2>
      </R>

      <div className="grid md:grid-cols-2 gap-4">
        {SERVICES.map((s, i) => (
          <R key={s.number} type="reveal-scale" delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3" | "delay-4"}>
            <div className="feat-card card-glow p-8 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="text-white/30">{s.icon}</div>
                <span className="text-xs font-mono text-white/15">{s.number}</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-6">{s.body}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="text-xs font-mono text-white/30 border border-white/[0.08] rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

// ─── Feature sections (Apple-style alternating) ───────────────────────
function FeatureSection() {
  return (
    <section id="engineering" className="border-t border-white/[0.06]">
      {/* Row 1 */}
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center border-b border-white/[0.06]">
        <R type="reveal-left">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-4">How we work</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-snug mb-5">
            Code reviews. Test coverage. Real CI/CD.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            We don&apos;t just write code and hand it over. Every project ships with documented CI pipelines, automated test suites, and a handover your team can actually maintain.
          </p>
          <ul className="space-y-3">
            {["TypeScript by default", "90%+ test coverage targets", "Automated deploys on every merge", "Runbooks and docs included"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </R>

        <R type="reveal-right">
          <div className="feat-card p-6">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs font-mono text-white/20">pipeline.yml</span>
            </div>
            <pre className="text-xs font-mono leading-6 text-white/40 overflow-x-auto">
{`on: [push]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: deploy-action@v2
        if: github.ref == 'main'`}
            </pre>
          </div>
        </R>
      </div>

      {/* Row 2 */}
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <R type="reveal-left" className="order-2 md:order-1">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Build", status: "passed", color: "text-green-400" },
              { label: "Tests", status: "97% pass", color: "text-green-400" },
              { label: "Coverage", status: "94%", color: "text-green-400" },
              { label: "Deploy", status: "live", color: "text-blue-400" },
              { label: "Uptime", status: "99.9%", color: "text-green-400" },
              { label: "Incidents", status: "0 open", color: "text-white/40" },
            ].map((m) => (
              <div key={m.label} className="feat-card p-4">
                <div className={`text-xs font-mono mb-1 ${m.color}`}>{m.status}</div>
                <div className="text-xs text-white/30">{m.label}</div>
              </div>
            ))}
          </div>
        </R>

        <R type="reveal-right" className="order-1 md:order-2">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-4">QA & Ops</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-snug mb-5">
            Ship with confidence, not just speed.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-5">
            Quality isn&apos;t a phase at the end — it&apos;s baked into every sprint. Our QA engineers work alongside developers, catching issues early when they&apos;re cheap to fix.
          </p>
          <p className="text-white/40 text-sm leading-relaxed">
            And when things go sideways in prod, our DevOps and support teams are there to resolve them fast.
          </p>
        </R>
      </div>
    </section>
  );
}

// ─── Why Sixmend ──────────────────────────────────────────────────────
const WHY = [
  {
    title: "Senior engineers only",
    body: "No juniors learning on your budget. Every line is written and reviewed by experienced developers.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Transparent process",
    body: "Weekly demos, shared boards, and clear timelines. You always know exactly where your project stands.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "We build our own products",
    body: "We run live SaaS and apps in production — so we know what it takes to ship and maintain real software.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
  {
    title: "Ship in weeks, not months",
    body: "Lean teams and real CI/CD mean you see working software fast — and keep shipping every single week.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

function WhySixmend() {
  return (
    <section className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <R type="reveal" className="mb-4">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase">Why Sixmend</p>
        </R>
        <R type="reveal" delay="delay-1" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-xl">
            Why teams choose us.
          </h2>
        </R>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY.map((w, i) => (
            <R key={w.title} type="reveal-scale" delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3" | "delay-4"}>
              <div className="feat-card card-glow p-7 h-full">
                <div className="text-white/30 mb-5">{w.icon}</div>
                <h3 className="text-base font-medium text-white mb-2.5">{w.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{w.body}</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process timeline ─────────────────────────────────────────────────
const STEPS = [
  { number: "01", title: "Discovery", body: "We dig into your goals, users, and constraints — then scope the project so there are no surprises later." },
  { number: "02", title: "Design", body: "We shape the architecture and interface, agree on the plan, and lock a clear, realistic timeline." },
  { number: "03", title: "Build & test", body: "We build in short cycles with automated tests and weekly demos, so you see real progress every week." },
  { number: "04", title: "Ship & support", body: "We deploy to production with CI/CD, hand over clean docs, and keep things running with 24/7 support." },
];

function ProcessTimeline() {
  return (
    <section id="process" className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <R type="reveal" className="mb-4">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase">How a project runs</p>
        </R>
        <R type="reveal" delay="delay-1" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-xl">
            From idea to production, in four steps.
          </h2>
        </R>

        <div className="grid md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {STEPS.map((s, i) => (
            <R key={s.number} type="reveal" delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3" | "delay-4"} className="h-full">
              <div className="bg-black p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-semibold hero-gradient">{s.number}</span>
                  <span className="flex-1 h-px bg-white/[0.08]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2.5">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What services does Sixmend Technology offer?",
    a: "Sixmend Technology offers end-to-end software development, QA & testing, DevOps & cloud infrastructure, and 24/7 IT support for startups and enterprises.",
  },
  {
    q: "How do I start a project with Sixmend?",
    a: "You can reach us at info@sixmend.com or via WhatsApp. We typically respond within one business day and will schedule a discovery call to understand your project requirements.",
  },
  {
    q: "Does Sixmend offer 24/7 IT support?",
    a: "Yes. Sixmend provides round-the-clock IT support with a 99.9% uptime SLA, available both remotely and on-site.",
  },
  {
    q: "What technologies does Sixmend work with?",
    a: "We work with TypeScript, React, Next.js, Node.js, Python, Docker, Kubernetes, Terraform, AWS, PostgreSQL, Redis, and more — across the full modern stack.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-6 py-28">
        <R type="reveal" className="mb-4">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase">FAQ</p>
        </R>
        <R type="reveal" delay="delay-1" className="mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            Frequently asked.
          </h2>
        </R>

        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors">{f.q}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-white/30 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="text-sm text-white/45 leading-relaxed pb-6 pr-8">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────
function CTA() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Sixmend!%0A%0AName: ${encodeURIComponent(form.name)}%0AEmail: ${encodeURIComponent(form.email)}%0APhone: ${encodeURIComponent(form.phone)}%0AMessage: ${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/919447431543?text=${text}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — Heading + Contact Info */}
          <R type="reveal-left">
            <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-6">Get in touch</p>
            <h2 className="text-4xl md:text-5xl font-semibold hero-gradient tracking-tight leading-tight mb-6">
              Let&apos;s build
              <br />
              something great.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-md">
              Tell us about your project and we&apos;ll get back to you within one business day.
            </p>

            <div className="space-y-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919447431543"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">WhatsApp</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">+91 94474 31543</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:info@sixmend.com" className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Email</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">info@sixmend.com</p>
                </div>
              </a>
            </div>
          </R>

          {/* Right — Enquiry Form */}
          <R type="reveal-right">
            <form onSubmit={handleSubmit} className="feat-card p-8">
              <h3 className="text-lg font-medium text-white mb-6">Send us an enquiry</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">Phone</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full justify-center text-sm py-3.5"
                >
                  {submitted ? "Sent! ✓" : "Send via WhatsApp"}
                  {!submitted && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </R>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-white/60">sixmend</span>
        <nav className="flex items-center gap-6 text-xs text-white/30">
          <a href="/services" className="hover:text-white transition-colors">Services</a>
          <a href="/about" className="hover:text-white transition-colors">About</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <span className="text-xs text-white/20">© 2026 Sixmend Technology</span>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="grain">
      <ParticleCanvas />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <WhySixmend />
        <ProcessTimeline />
        <FeatureSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
