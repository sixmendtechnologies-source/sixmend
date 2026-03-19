"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

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

// ─── Animated counter ────────────────────────────────────────────────
function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(value.replace(/[^0-9.]/g, ""));
        const suffix = value.replace(/[0-9.]/g, "");
        const dur = 1800;
        const step = num / (dur / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, num);
          setDisplay((Number.isInteger(num) ? Math.floor(cur) : cur.toFixed(1)) + suffix);
          if (cur >= num) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="reveal">
      <div className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-1">{display}</div>
      <div className="text-sm text-white/40">{label}</div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────
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
          <Image src="/logo.png" alt="Sixmend Technology" width={28} height={28} className="rounded-sm object-contain mt-1" style={{ display: "block" }} />
          <span className="text-sm font-semibold text-white tracking-tight leading-none">sixmend</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {["Services", "Process", "About", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              {l}
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
          {["Services", "Process", "About", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-white/60 hover:text-white" onClick={() => setOpen(false)}>{l}</a>
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

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

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
          End-to-end technology delivery for startups and enterprises — from the first line of code to production and beyond.
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
    <section id="process" className="border-t border-white/[0.06]">
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

// ─── Stats ────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <R type="reveal" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Numbers that speak.
          </h2>
        </R>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            { value: "500+", label: "Projects delivered" },
            { value: "99.9%", label: "Average uptime" },
            { value: "12+", label: "Years in IT" },
            { value: "24/7", label: "Support coverage" },
          ].map((s, i) => (
            <R key={s.label} type="reveal" delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3" | "delay-4"} className="text-center md:text-left">
              <Counter value={s.value} label={s.label} />
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "They moved our entire infra to AWS in 6 weeks without a single hour of downtime. The best engineering team we've worked with.", name: "Sarah Chen", role: "CTO · NovaTrade" },
  { quote: "Their QA team caught critical regressions before they hit production. Coverage went from 40% to 91% in two months.", name: "Marcus Rivera", role: "VP Eng · FinVault" },
  { quote: "The DevOps setup they built cut our deploy times from 40 minutes to under 4. Night and day difference.", name: "Priya Nair", role: "CEO · HealthBridge" },
];

function Testimonials() {
  return (
    <section id="about" className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <R type="reveal" className="mb-4">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase">Client stories</p>
        </R>
        <R type="reveal" delay="delay-1" className="mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            What clients say.
          </h2>
        </R>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <R key={t.name} type="reveal" delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3"}>
              <div className="feat-card card-glow p-7 h-full flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-white/50 leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-white/[0.07] pt-5">
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/30 mt-0.5">{t.role}</div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section id="contact" className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">
        <R type="reveal-scale">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-6">Get in touch</p>
            <h2 className="text-5xl md:text-6xl font-semibold hero-gradient tracking-tight leading-tight mb-6">
              Let&apos;s build
              <br />
              something great.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-md mx-auto">
              Tell us about your project and we&apos;ll get back to you within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:hello@sixmend.tech" className="btn-primary text-base py-3.5 px-8">
                hello@sixmend.tech
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </R>
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
        <span className="text-xs font-mono text-white/20 text-center">
          Software · QA · DevOps · Support
        </span>
        <span className="text-xs text-white/20">© 2026 Sixmend Technology</span>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <FeatureSection />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
