import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Sixmend Technology",
  description: "Get in touch with Sixmend Technology. Tell us about your project and we'll respond within one business day.",
  alternates: { canonical: "https://www.sixmend.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-white/[0.06] px-6 h-14 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
          ← sixmend
        </Link>
        <a href="mailto:info@sixmend.com" className="text-xs text-white/30 hover:text-white transition-colors font-mono">
          info@sixmend.com
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl">
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-semibold hero-gradient tracking-tight leading-tight mb-4">
            Let&apos;s build<br />something great.
          </h1>
          <p className="text-white/40 text-base leading-relaxed mb-10">
            Tell us about your project and we&apos;ll get back to you within one business day.
          </p>

          <form
            action="mailto:info@sixmend.com"
            method="GET"
            encType="text/plain"
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono text-white/30 mb-2 tracking-widest uppercase">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/30 mb-2 tracking-widest uppercase">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/30 mb-2 tracking-widest uppercase">What do you need?</label>
              <textarea
                name="body"
                required
                rows={5}
                placeholder="Tell us about your project — what you're building, your timeline, and how we can help."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center text-sm py-3.5"
            >
              Send message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          <p className="text-xs text-white/20 text-center mt-6">
            Prefer email?{" "}
            <a href="mailto:info@sixmend.com" className="text-white/40 hover:text-white transition-colors underline">
              info@sixmend.com
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-6 text-center">
        <span className="text-xs text-white/20">© 2026 Sixmend Technology</span>
      </footer>
    </div>
  );
}
