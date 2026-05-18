"use client";

import { useEffect, useRef, useState } from "react";

// ─── Floating Petals Canvas ───────────────────────────────────────────
type Petal = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  alpha: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
};

function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petals = useRef<Petal[]>([]);
  const raf = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(212,160,160,",
      "rgba(230,180,190,",
      "rgba(255,192,200,",
      "rgba(220,170,175,",
      "rgba(240,200,205,",
    ];

    const spawn = (x?: number, y?: number): Petal => ({
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? -20,
      vx: (Math.random() - 0.5) * 0.7,
      vy: Math.random() * 0.9 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      size: Math.random() * 10 + 7,
      alpha: Math.random() * 0.45 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
    });

    // seed
    for (let i = 0; i < 30; i++) {
      const p = spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
      petals.current.push(p);
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      t.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new petal occasionally
      if (t.current % 60 === 0 && petals.current.length < 45) {
        petals.current.push(spawn());
      }

      petals.current = petals.current.filter(p => p.y < canvas.height + 30);

      for (const p of petals.current) {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        drawPetal(p);
      }

      raf.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  );
}

// ─── Scroll Reveal ────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("wr-visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function WR({
  children,
  delay = 0,
  from = "bottom",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "right" | "scale" | "fade";
  className?: string;
}) {
  const ref = useReveal();
  const cls =
    from === "left" ? "wr-left"
    : from === "right" ? "wr-right"
    : from === "scale" ? "wr-scale"
    : from === "fade" ? "wr-fade"
    : "wr-bottom";

  return (
    <div
      ref={ref}
      className={`${cls} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-07-07T10:00:00");

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const update = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Shared Divider ───────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <div className="h-px w-14" style={{ background: "linear-gradient(to right, transparent, #D4A0A0)" }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A0A0">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
      </svg>
      <div className="h-px w-14" style={{ background: "linear-gradient(to left, transparent, #D4A0A0)" }} />
    </div>
  );
}

// ─── Section Heading ─────────────────────────────────────────────────
function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <WR className="text-center mb-16">
      <p
        className="text-xs tracking-[0.32em] uppercase mb-3"
        style={{ color: "#B76E79", fontFamily: "var(--font-lato)" }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontFamily: "var(--font-great-vibes)",
          fontSize: "clamp(2.4rem, 7vw, 4rem)",
          color: "#2C2C2C",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      <Divider />
    </WR>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Story", "Events", "Gallery", "RSVP"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(253,246,240,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,160,160,0.18)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.9rem", color: "#B76E79", lineHeight: 1 }}>
          A &amp; A
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-xs tracking-[0.18em] uppercase transition-colors duration-200 hover:text-[#B76E79]"
              style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
            >
              {l}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden"
          style={{ color: "#8C7B75", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 py-6 flex flex-col gap-5"
          style={{ background: "rgba(253,246,240,0.97)", borderTop: "1px solid rgba(212,160,160,0.18)" }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-xs tracking-[0.18em] uppercase"
              style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background: "linear-gradient(155deg, #FDF6F0 0%, #FAF0F0 45%, #F4E3E6 100%)",
      }}
    >
      {/* Soft radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 90vw)", height: "min(720px, 90vw)",
          background: "radial-gradient(circle, rgba(212,160,160,0.18) 0%, transparent 68%)",
          borderRadius: "50%",
        }}
      />

      {/* Decorative ring */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(580px, 85vw)", height: "min(580px, 85vw)",
          border: "1px solid rgba(212,160,160,0.18)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(480px, 75vw)", height: "min(480px, 75vw)",
          border: "1px solid rgba(212,160,160,0.12)",
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Eyebrow */}
        <div
          className="hero-in-1 inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full"
          style={{ border: "1px solid rgba(212,160,160,0.35)", background: "rgba(255,255,255,0.5)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#D4A0A0">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
          <span
            className="text-xs tracking-[0.28em] uppercase"
            style={{ color: "#B76E79", fontFamily: "var(--font-lato)" }}
          >
            We&apos;re Getting Married
          </span>
        </div>

        {/* Names */}
        <h1
          className="hero-in-2"
          style={{
            fontFamily: "var(--font-great-vibes)",
            fontSize: "clamp(5rem, 16vw, 10rem)",
            color: "#2C2C2C",
            lineHeight: 0.95,
          }}
        >
          Arun
        </h1>

        {/* Ampersand row */}
        <div className="hero-in-3 flex items-center justify-center gap-5 my-3">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #D4A0A0)" }} />
          <span
            style={{
              fontFamily: "var(--font-great-vibes)",
              fontSize: "clamp(2rem, 6vw, 3.8rem)",
              color: "#B76E79",
            }}
          >
            &amp;
          </span>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #D4A0A0)" }} />
        </div>

        <h1
          className="hero-in-2"
          style={{
            fontFamily: "var(--font-great-vibes)",
            fontSize: "clamp(5rem, 16vw, 10rem)",
            color: "#2C2C2C",
            lineHeight: 0.95,
          }}
        >
          Aswathy
        </h1>

        {/* Divider */}
        <div className="hero-in-4 flex items-center justify-center gap-4 my-8">
          <div className="h-px w-16" style={{ background: "#D4A0A0" }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#B76E79" opacity={0.75}>
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
          <div className="h-px w-16" style={{ background: "#D4A0A0" }} />
        </div>

        {/* Date + Save the Date */}
        <div className="hero-in-5">
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
              color: "#8C7B75",
              letterSpacing: "0.05em",
            }}
          >
            7 July 2026
          </p>
          <p
            className="mt-2 tracking-[0.32em] uppercase text-xs"
            style={{ color: "#B76E79", fontFamily: "var(--font-lato)", fontWeight: 700 }}
          >
            Save the Date
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: "#B0928F", fontFamily: "var(--font-lato)" }}
          >
            Guruvayoor, Kerala
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "w-hero-in 1s ease 1.6s both" }}
      >
        <span
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{ color: "#C4A8A8", fontFamily: "var(--font-lato)" }}
        >
          Scroll
        </span>
        <div className="scroll-dots">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="scroll-dot"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────
function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <section style={{ background: "#B76E79", padding: "5rem 1.5rem" }}>
      <div className="max-w-4xl mx-auto text-center">
        <WR>
          <p
            className="text-xs tracking-[0.32em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-lato)" }}
          >
            Counting Down To
          </p>
          <h2
            style={{
              fontFamily: "var(--font-great-vibes)",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              color: "#fff",
              marginBottom: "2.5rem",
            }}
          >
            Our Special Day
          </h2>
        </WR>
        <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-xl mx-auto">
          {units.map(({ value, label }, i) => (
            <WR key={label} delay={i * 80} from="scale">
              <div
                className="rounded-2xl py-5 px-2 flex flex-col items-center"
                style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(12px)" }}
              >
                <span
                  className="font-semibold leading-none mb-1.5"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.8rem, 6vw, 3rem)",
                    color: "#fff",
                  }}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span
                  className="text-[9px] tracking-[0.22em] uppercase"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-lato)" }}
                >
                  {label}
                </span>
              </div>
            </WR>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Love Story ───────────────────────────────────────────────────────
const STORY = [
  {
    year: "2019",
    title: "First Meeting",
    body: "Two souls crossed paths and something shifted. The world felt a little brighter, a little warmer — and neither of them knew why.",
    icon: "✦",
  },
  {
    year: "2021",
    title: "First Date",
    body: "A simple evening turned unforgettable. They talked for hours, laughed until their sides hurt, and knew without a doubt this was something rare.",
    icon: "♡",
  },
  {
    year: "2023",
    title: "The Proposal",
    body: "Under a sky full of stars, with his heart in his hands, Arun asked. And with tears of joy, Aswathy said yes.",
    icon: "◇",
  },
  {
    year: "2026",
    title: "Forever Begins",
    body: "Two families, one breathtaking celebration. The official start of their forever — surrounded by everyone they love.",
    icon: "♔",
  },
];

function LoveStory() {
  return (
    <section id="story" style={{ background: "#FAF7F2", padding: "6rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHead eyebrow="Our Journey" title="Our Love Story" />

        <div className="relative">
          {/* Timeline center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, #D4A0A0 15%, #D4A0A0 85%, transparent 100%)",
            }}
          />

          <div className="flex flex-col gap-14">
            {STORY.map((item, i) => (
              <WR key={item.year} delay={i * 80} from={i % 2 === 0 ? "left" : "right"}>
                <div
                  className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text card */}
                  <div className="md:w-5/12">
                    <div
                      className="p-7 rounded-2xl"
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(212,160,160,0.25)",
                        boxShadow: "0 6px 32px rgba(183,110,121,0.07)",
                        textAlign: i % 2 === 0 ? "right" : "left",
                      }}
                    >
                      <span
                        className="text-xs tracking-[0.25em] uppercase block mb-2"
                        style={{ color: "#B76E79", fontFamily: "var(--font-lato)" }}
                      >
                        {item.year}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "1.25rem",
                          color: "#2C2C2C",
                          marginBottom: "0.6rem",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>

                  {/* Center icon */}
                  <div className="md:w-2/12 flex justify-center z-10">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl select-none"
                      style={{
                        background: "#FDF0F0",
                        border: "2px solid #D4A0A0",
                        color: "#B76E79",
                        fontFamily: "var(--font-playfair)",
                        boxShadow: "0 0 0 5px rgba(212,160,160,0.12)",
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="md:w-5/12 hidden md:block" />
                </div>
              </WR>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Events ───────────────────────────────────────────────────────────
const EVENTS = [
  {
    type: "Ceremony",
    time: "10:00 AM",
    venue: "Guruvayoor Temple",
    address: "Guruvayoor, Kerala",
    note: "Kindly be seated by 9:45 AM",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: "#B76E79" }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    type: "Reception",
    time: "6:00 PM",
    venue: "Royal Garden Palace",
    address: "Guruvayoor, Kerala",
    note: "Dinner & celebration to follow",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: "#B76E79" }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    ),
  },
];

function Events() {
  return (
    <section
      id="events"
      style={{
        background: "linear-gradient(155deg, #F5E6E8 0%, #FAF0F0 60%, #FDF8F0 100%)",
        padding: "6rem 1.5rem",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHead eyebrow="Join Us" title="Wedding Events" />

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {EVENTS.map((ev, i) => (
            <WR key={ev.type} delay={i * 150} from="scale">
              <div
                className="p-10 rounded-3xl text-center flex flex-col items-center h-full"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(212,160,160,0.28)",
                  boxShadow: "0 10px 50px rgba(183,110,121,0.09)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "#FDF0F0", border: "1px solid rgba(212,160,160,0.3)" }}
                >
                  {ev.icon}
                </div>
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: "#B76E79", fontFamily: "var(--font-lato)" }}
                >
                  {ev.type}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "1.5rem",
                    color: "#2C2C2C",
                    margin: "0.6rem 0 0.4rem",
                  }}
                >
                  {ev.venue}
                </h3>
                <p className="text-sm" style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}>
                  {ev.address}
                </p>

                <div className="h-px w-14 my-6" style={{ background: "#D4A0A0" }} />

                <p style={{ fontFamily: "var(--font-playfair)", color: "#B76E79", fontSize: "1.05rem" }}>
                  July 7, 2026
                </p>
                <p className="text-sm mt-1 font-semibold" style={{ color: "#2C2C2C", fontFamily: "var(--font-lato)" }}>
                  {ev.time}
                </p>
                <p
                  className="text-xs mt-3 italic"
                  style={{ color: "#C4A8A8", fontFamily: "var(--font-lato)" }}
                >
                  {ev.note}
                </p>
              </div>
            </WR>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────
const GALLERY_SWATCHES = [
  "#F5D5DA", "#EBC5CC", "#F0DDD8", "#E8C5C0",
  "#F2E0E5", "#DEC5CC", "#EAD5E0", "#E5C0C8",
  "#F0D8D5", "#F5D8E0",
];

function Gallery() {
  return (
    <section id="gallery" style={{ background: "#FAF7F2", padding: "6rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHead eyebrow="Memories" title="Our Gallery" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
          {GALLERY_SWATCHES.map((color, i) => {
            const tall = i === 0 || i === 6;
            return (
              <WR key={i} delay={i * 45} from={i % 3 === 0 ? "bottom" : i % 3 === 1 ? "left" : "scale"}>
                <div
                  className={`rounded-2xl overflow-hidden flex items-center justify-center ${tall ? "md:row-span-2" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    aspectRatio: tall ? "4/5" : "3/4",
                    border: "1px solid rgba(212,160,160,0.2)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(183,110,121,0.35)">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                  </svg>
                </div>
              </WR>
            );
          })}
        </div>

        <WR className="text-center mt-10">
          <p
            className="text-sm italic"
            style={{ color: "#C4A8A8", fontFamily: "var(--font-lato)" }}
          >
            Photos coming soon ♡
          </p>
        </WR>
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  borderRadius: "0.75rem",
  background: "#FAF7F2",
  border: "1px solid rgba(212,160,160,0.4)",
  color: "#2C2C2C",
  fontFamily: "var(--font-lato)",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
};

function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    attendance: "yes",
    guests: "1",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="rsvp"
      style={{
        background: "linear-gradient(155deg, #F5E6E8 0%, #FAF0F0 60%, #FDF8F0 100%)",
        padding: "6rem 1.5rem",
      }}
    >
      <div className="max-w-xl mx-auto">
        <SectionHead eyebrow="Your Presence Matters" title="RSVP" />
        <WR>
          <p
            className="text-sm text-center mb-10"
            style={{ color: "#8C7B75", fontFamily: "var(--font-lato)", marginTop: "-2rem" }}
          >
            Please respond by June 20, 2026
          </p>
        </WR>

        <WR>
          {submitted ? (
            <div
              className="text-center py-16 px-8 rounded-3xl"
              style={{
                background: "#fff",
                border: "1px solid rgba(212,160,160,0.28)",
                boxShadow: "0 10px 50px rgba(183,110,121,0.09)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-great-vibes)",
                  fontSize: "4rem",
                  color: "#B76E79",
                  lineHeight: 1,
                  marginBottom: "1rem",
                }}
              >
                Thank You!
              </div>
              <p style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}>
                We&apos;ve received your RSVP — we can&apos;t wait to celebrate with you!
              </p>
              <div className="mt-6">
                <Divider />
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-8 md:p-10 flex flex-col gap-6"
              style={{
                background: "#fff",
                border: "1px solid rgba(212,160,160,0.28)",
                boxShadow: "0 10px 50px rgba(183,110,121,0.09)",
              }}
            >
              {/* Name */}
              <div>
                <label
                  className="block text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B76E79")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212,160,160,0.4)")}
                />
              </div>

              {/* Attendance */}
              <div>
                <label
                  className="block text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
                >
                  Will you attend?
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "yes", label: "Joyfully Accepts" },
                    { value: "no", label: "Regretfully Declines" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, attendance: opt.value })}
                      className="flex-1 py-3 px-3 rounded-xl text-xs tracking-wide transition-all duration-200"
                      style={{
                        background: form.attendance === opt.value ? "#B76E79" : "#FAF7F2",
                        color: form.attendance === opt.value ? "#fff" : "#8C7B75",
                        border: `1px solid ${form.attendance === opt.value ? "#B76E79" : "rgba(212,160,160,0.4)"}`,
                        fontFamily: "var(--font-lato)",
                        cursor: "pointer",
                        fontWeight: form.attendance === opt.value ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              {form.attendance === "yes" && (
                <div>
                  <label
                    className="block text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
                  >
                    Number of Guests
                  </label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    style={inputStyle}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <label
                  className="block text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#8C7B75", fontFamily: "var(--font-lato)" }}
                >
                  A Message for the Couple{" "}
                  <span style={{ color: "#C4A8A8", textTransform: "none" }}>(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share your wishes..."
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B76E79")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212,160,160,0.4)")}
                />
              </div>

              <button
                type="submit"
                className="py-4 rounded-xl text-sm tracking-[0.18em] uppercase font-semibold transition-all duration-200"
                style={{
                  background: "#B76E79",
                  color: "#fff",
                  fontFamily: "var(--font-lato)",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A05F6A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#B76E79")}
              >
                Send RSVP ♡
              </button>
            </form>
          )}
        </WR>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="text-center py-16 px-6" style={{ background: "#2C2C2C" }}>
      <div
        style={{
          fontFamily: "var(--font-great-vibes)",
          fontSize: "clamp(2.8rem, 9vw, 5rem)",
          color: "#D4A0A0",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        Arun &amp; Aswathy
      </div>
      <p
        className="text-xs tracking-[0.32em] uppercase"
        style={{ color: "rgba(212,160,160,0.55)", fontFamily: "var(--font-lato)" }}
      >
        7 July 2026 · Forever &amp; Always
      </p>
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-px w-16" style={{ background: "rgba(212,160,160,0.25)" }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(212,160,160,0.45)">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </svg>
        <div className="h-px w-16" style={{ background: "rgba(212,160,160,0.25)" }} />
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function WeddingPage() {
  return (
    <div style={{ background: "#FAF7F2", color: "#2C2C2C", minHeight: "100vh" }}>
      {/* Inline styles for wedding animations */}
      <style>{`
        /* Wedding reveal animations */
        .wr-bottom {
          opacity: 0;
          transform: translateY(44px);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                      transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .wr-bottom.wr-visible { opacity: 1; transform: translateY(0); }

        .wr-left {
          opacity: 0;
          transform: translateX(-36px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .wr-left.wr-visible { opacity: 1; transform: translateX(0); }

        .wr-right {
          opacity: 0;
          transform: translateX(36px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .wr-right.wr-visible { opacity: 1; transform: translateX(0); }

        .wr-scale {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .wr-scale.wr-visible { opacity: 1; transform: scale(1); }

        .wr-fade {
          opacity: 0;
          transition: opacity 1s ease;
        }
        .wr-fade.wr-visible { opacity: 1; }

        /* Hero entrance */
        @keyframes w-hero-in {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-in-1 { animation: w-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-in-2 { animation: w-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .hero-in-3 { animation: w-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.38s both; }
        .hero-in-4 { animation: w-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.52s both; }
        .hero-in-5 { animation: w-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.66s both; }

        /* Scroll dots */
        .scroll-dots { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .scroll-dot {
          width: 4px; height: 4px; border-radius: 9999px;
          background: #D4A0A0;
          animation: w-bounce 1.5s ease infinite;
        }
        @keyframes w-bounce {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(4px); }
        }

        /* Mobile reveal fallback */
        @media (max-width: 767px) {
          .wr-left, .wr-right {
            transform: translateY(28px);
          }
          .wr-left.wr-visible, .wr-right.wr-visible {
            transform: translateY(0);
          }
        }
      `}</style>

      <PetalCanvas />
      <Nav />
      <main>
        <Hero />
        <Countdown />
        <LoveStory />
        <Events />
        <Gallery />
        <RSVP />
      </main>
      <Footer />
    </div>
  );
}
