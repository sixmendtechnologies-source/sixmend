import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Software Development, QA, DevOps & IT Support | Sixmend Technology",
  description:
    "Sixmend Technology provides end-to-end software development, QA & testing, DevOps & cloud infrastructure, and 24/7 IT support for startups and enterprises.",
  alternates: { canonical: "https://www.sixmend.com/services" },
  openGraph: {
    title: "Services | Sixmend Technology",
    description:
      "End-to-end software development, QA, DevOps, and 24/7 IT support for startups and enterprises.",
    url: "https://www.sixmend.com/services",
    siteName: "Sixmend Technology",
    type: "website",
  },
};

const SERVICES = [
  {
    number: "01",
    title: "Software Development",
    body: "We architect and build production-grade web applications, mobile apps, APIs, and backend systems — full-stack, from database schema to deployed product. Our teams work in TypeScript, React, Next.js, Node.js, and Python across the modern stack.",
    tags: ["Web apps", "Mobile apps", "APIs", "Microservices"],
  },
  {
    number: "02",
    title: "QA & Testing",
    body: "Automated and manual testing across the full stack. We write comprehensive test suites, set up CI pipelines, and run end-to-end and load testing so you can ship every release with confidence.",
    tags: ["Playwright", "Jest", "E2E", "Load testing"],
  },
  {
    number: "03",
    title: "DevOps & Cloud",
    body: "Infrastructure as code, CI/CD pipelines, container orchestration, and cloud cost optimisation. We build reliable deployment workflows on AWS, Docker, Kubernetes, and Terraform so your team ships faster with less friction.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    number: "04",
    title: "IT Support",
    body: "Responsive, reliable support for your systems and teams, on-site or remote. We provide round-the-clock IT support with a 99.9% uptime SLA to keep your business running around the clock.",
    tags: ["24/7", "Remote", "On-site", "SLA"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-white/[0.06] px-6 h-14 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
          ← sixmend
        </Link>
        <Link href="/contact" className="text-xs text-white/30 hover:text-white transition-colors font-mono">
          Contact
        </Link>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20">
        <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-4">Services</p>
        <h1 className="text-4xl md:text-5xl font-semibold hero-gradient tracking-tight leading-tight mb-5">
          What we do.
        </h1>
        <p className="text-white/40 text-base leading-relaxed max-w-2xl mb-16">
          Sixmend Technology is a software development and IT services company. We deliver everything you need
          to build, ship, and scale software — from the first line of code to production support and beyond.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {SERVICES.map((s) => (
            <div key={s.number} className="feat-card card-glow p-8 h-full">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-lg font-medium text-white">{s.title}</h2>
                <span className="text-xs font-mono text-white/15">{s.number}</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-6">{s.body}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="text-xs font-mono text-white/30 border border-white/[0.08] rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href="/contact" className="btn-primary text-sm py-3.5 px-7 inline-flex">
            Start a project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-6 text-center">
        <span className="text-xs text-white/20">© 2026 Sixmend Technology</span>
      </footer>
    </div>
  );
}
