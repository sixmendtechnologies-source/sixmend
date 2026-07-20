"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import FeatureCard from "./FeatureCard";

// ─── Scroll reveal ────────────────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    title: "Strategize",
    desc: "Understand the product vision, perform in-depth market & user research, design, and define the product roadmap.",
    icon: (
      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="10.5" strokeOpacity={0.4} />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    title: "Build",
    desc: "Designing product/platform architecture, implementing agile software development, DevOps, quality assurance & security testing.",
    icon: (
      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
      </svg>
    ),
  },
  {
    title: "Maintain",
    desc: "Product stabilization and continuous improvements assures a successful roadmap for outsourced product development.",
    icon: (
      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

/*
  Labels are positioned as % of the left grid cell (width ≈ 628px at 1440px viewport).
  The wave PNG is at section level anchored to bottom-left, so it naturally sits in the
  lower half of the cell; labels in the upper half float above the wave with lines
  pointing down into it — matching the referenceMarquee design.
*/
const ROCKET_LABELS = [
  { text: "Expertise",  cls: "label-float-1", top: "8%",  left: "18%", lineH: "h-32", mobileHide: false },
  { text: "Experience", cls: "label-float-2", top: "22%", left: "42%", lineH: "h-24", mobileHide: false },
  { text: "Teamwork",   cls: "label-float-3", top: "42%", left: "32%", lineH: "h-10", mobileHide: true  },
  { text: "Culture",    cls: "label-float-4", top: "42%", left: "60%", lineH: "h-5",  mobileHide: true  },
];

// ─── Component ────────────────────────────────────────────────────────
export default function FeatureSection() {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-t border-white/[0.06]"
      style={{ background: "var(--background)" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.09,
        }}
      />

      {/* Ambient teal glow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[55%] h-[65%] pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom left, rgba(8,47,73,0.38) 0%, transparent 55%)" }}
      />

      {/*
        Rocket PNG — section-level absolute, anchored bottom-left.
        width: 62vw makes the wave fill ~60% of the viewport regardless of container.
        The PNG aspect ratio (1060×480 ≈ 2.2:1) keeps the rocket proportional.
        z:1 keeps it behind the content (z:10) and the left-fade overlay (z:3).
      */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ left: 0, bottom: "14%", zIndex: 1, width: "62vw", maxWidth: "860px" }}
      >
        <Image
          src="/rocket.png"
          alt=""
          aria-hidden="true"
          width={1060}
          height={480}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>

      {/* Left-edge fade — z:3, above wave (z:1), below content (z:10) */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "16%",
          zIndex: 3,
          background: "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.7) 45%, transparent 100%)",
        }}
      />

      {/* Content — max-w-6xl matching all other sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-28">

        {/* Heading */}
        <R type="reveal" className="mb-16">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-5">How we work</p>
          <h2
            className="font-semibold text-white tracking-tight leading-tight mb-3"
            style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", maxWidth: "680px" }}
          >
            End-to-end product development
          </h2>
          <p
            className="text-base font-light leading-relaxed text-white"
            style={{ maxWidth: "600px" }}
          >
            Our product engineering team turns revolutionary ideas into world-class products and platforms.
          </p>
        </R>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:items-center gap-8 lg:gap-14">

          {/*
            LEFT — labels only. The wave PNG is behind at section level (z:1).
            Cell height controls how much vertical space the labels span;
            the wave fills the lower portion naturally due to bottom:0 anchoring.
          */}
          <div className="relative h-[320px] lg:h-[440px]">
            {ROCKET_LABELS.map((l) => (
              <div
                key={l.text}
                className={`absolute ${l.cls} flex flex-col items-center pointer-events-none${l.mobileHide ? " hidden lg:flex" : ""}`}
                style={{ top: l.top, left: l.left }}
              >
                <div className="bg-white text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow-xl whitespace-nowrap">
                  {l.text}
                </div>
                <div className={`w-px ${l.lineH} bg-white/30 mt-1`} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            ))}
          </div>

          {/* RIGHT — cards */}
          <div className="space-y-3">
            {FEATURE_CARDS.map((card, i) => (
              <R
                key={card.title}
                type="reveal-scale"
                delay={`delay-${i + 1}` as "delay-1" | "delay-2" | "delay-3"}
              >
                <FeatureCard icon={card.icon} title={card.title} desc={card.desc} />
              </R>
            ))}

            <R type="reveal-scale" delay="delay-4">
              <div className="pt-2 flex justify-end">
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2 border border-white/[0.08] rounded-full px-5 py-2 text-sm font-medium text-white/45 hover:text-white hover:border-white/20 transition-all duration-150"
                >
                  View more
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </R>
          </div>

        </div>
      </div>
    </section>
  );
}
