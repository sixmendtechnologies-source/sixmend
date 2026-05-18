"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const PERSON = {
  name: "Amal Pradeep",
  initials: "AP",
  title: "Partner & Software Engineer",
  department: "Engineering",
  company: "Sixmend Technology",
  id: "SXM-AP-001",
  email: "sixmendtechnologies@gmail.com",
  website: "sixmend.com",
  phone: "+91 9995672270",
  issued: "Jan 2026",
  expires: "Dec 2026",
};

// ─── Barcode ──────────────────────────────────────────────────────────
function Barcode({ color = "#1e293b" }: { color?: string }) {
  const pattern = [2,1,3,1,2,1,1,2,1,3,1,1,2,1,3,2,1,2,1,1,3,1,2,1,2,1,3,1,1,2,1,3];
  let x = 0;
  return (
    <svg viewBox={`0 0 64 20`} width="100%" height={20} preserveAspectRatio="none">
      {pattern.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={20} fill={color} rx={0.2} /> : null;
        x += w;
        return rect;
      })}
    </svg>
  );
}

// ─── Front ────────────────────────────────────────────────────────────
function Front() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
      borderRadius: 20,
      background: "#fff",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Full-width photo */}
      <div style={{ position: "relative", height: 260, flexShrink: 0, overflow: "hidden" }}>
        <Image
          src="/amal.jpeg"
          alt={PERSON.name}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
        {/* Gradient fade at bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(255,255,255,0.95) 100%)",
        }} />
        {/* Header bar over image */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "linear-gradient(to bottom, rgba(15,23,42,0.85), transparent)",
          padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
              Sixmend
            </span>
          </div>
          <div style={{
            background: "rgba(99,102,241,0.5)",
            border: "1px solid rgba(165,180,252,0.5)",
            borderRadius: 5,
            padding: "3px 9px",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ color: "#e0e7ff", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", fontFamily: "monospace" }}>
              PARTNER
            </span>
          </div>
        </div>
      </div>

      {/* White body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 20px 0" }}>
        {/* Name & title */}
        <div style={{ textAlign: "center", marginBottom: 14, width: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1, fontFamily: "sans-serif", margin: 0 }}>
            {PERSON.name}
          </h2>
          <p style={{ fontSize: "0.68rem", color: "#4f46e5", fontWeight: 600, letterSpacing: "0.04em", fontFamily: "sans-serif", margin: "5px 0 2px" }}>
            {PERSON.title}
          </p>
          <p style={{ fontSize: "0.58rem", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace", margin: 0 }}>
            {PERSON.department}
          </p>
        </div>

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {[
            { icon: "✉", value: PERSON.email },
            { icon: "◎", value: PERSON.website },
            { icon: "☎", value: PERSON.phone },
          ].map((r) => (
            <div key={r.value} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#f8fafc", borderRadius: 8,
              padding: "6px 10px", border: "1px solid #f1f5f9",
            }}>
              <span style={{ fontSize: "0.68rem", color: "#94a3b8", width: 14, textAlign: "center" }}>{r.icon}</span>
              <span style={{ fontSize: "0.6rem", color: "#475569", fontFamily: "monospace" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "12px 20px 16px",
        borderTop: "1px solid #f1f5f9",
        marginTop: 14,
      }}>
        <div style={{ marginBottom: 4 }}>
          <Barcode color="#cbd5e1" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.5rem", color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.1em" }}>{PERSON.id}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: "0.5rem", color: "#b0c0d0", fontFamily: "monospace" }}>ISS {PERSON.issued}</span>
            <span style={{ fontSize: "0.5rem", color: "#b0c0d0", fontFamily: "monospace" }}>EXP {PERSON.expires}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Back ─────────────────────────────────────────────────────────────
function Back() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      borderRadius: 20,
      background: "#0f172a",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top stripe */}
      <div style={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899)", flexShrink: 0 }} />

      {/* Mag stripe */}
      <div style={{ height: 38, background: "#1e293b", margin: "16px 0 0", flexShrink: 0 }} />

      {/* QR area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 24px", gap: 16 }}>
        {/* QR box */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <QRCodeSVG
            value="https://www.sixmend.com"
            size={100}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Scan to connect
          </p>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontFamily: "monospace", marginTop: 4 }}>
            {PERSON.website}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 20px 14px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.15)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
          {PERSON.id} · {PERSON.company.toUpperCase()}
        </span>
        <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.1)", fontFamily: "monospace" }}>
          EXP {PERSON.expires}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function CardPage() {
  const [flipped, setFlipped] = useState(false);

  const W = 300;
  const H = 540;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden",
      fontFamily: "sans-serif",
    }}>
      {/* BG glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Lanyard cord */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0, zIndex: 2 }}>
        <div style={{ width: 2, height: 48, background: "linear-gradient(to bottom, #4f46e5, #7c3aed)", borderRadius: 2 }} />
        <div style={{ width: 22, height: 10, background: "#334155", borderRadius: 3, marginTop: -1, boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }} />
      </div>

      {/* Card */}
      <div style={{ perspective: 1000, zIndex: 1 }}>
        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            width: W,
            height: H,
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer",
            userSelect: "none",
            borderRadius: 20,
            boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(79,70,229,0.2)",
          }}
        >
          <Front />
          <Back />
        </div>
      </div>

      {/* Hint */}
      <p style={{ marginTop: 20, fontSize: "0.62rem", color: "rgba(255,255,255,0.15)", fontFamily: "monospace", letterSpacing: "0.14em" }}>
        {flipped ? "← CLICK TO FLIP BACK" : "CLICK TO FLIP →"}
      </p>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {[
          {
            label: "Copy Link",
            action: () => navigator.clipboard?.writeText(window.location.href),
          },
          {
            label: "Print",
            action: () => window.print(),
          },
        ].map((b) => (
          <button
            key={b.label}
            onClick={b.action}
            style={{
              padding: "8px 18px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.7rem",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
