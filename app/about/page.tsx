import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Software Development & IT Services Company | Sixmend Technology",
  description:
    "Sixmend Technology is a software development and IT services company building custom web and mobile apps, QA, DevOps, and 24/7 IT support for startups and enterprises.",
  alternates: { canonical: "https://www.sixmend.com/about" },
  openGraph: {
    title: "About | Sixmend Technology",
    description:
      "A software development and IT services company building custom software for startups and enterprises.",
    url: "https://www.sixmend.com/about",
    siteName: "Sixmend Technology",
    type: "website",
  },
};

const PRODUCTS = [
  {
    name: "CookBy",
    tag: "Meal subscription platform",
    note: "A meal-subscription app for local mess kitchens.",
    logo: "/cookby-logo.png",
    href: "https://cookby.sixmend.com/",
    square: false,
  },
  {
    name: "MechBook",
    tag: "Workshop billing SaaS",
    note: "Billing and job-card software for automobile service centers.",
    logo: "/mechbook-logo.png",
    href: "https://mechbook.sixmend.com/",
    square: true,
  },
  {
    name: "Stepney",
    tag: "Roadside assistance app",
    note: "A live-map roadside-assistance app for drivers.",
    logo: "/stepney-logo.png",
    href: "https://stepney.sixmend.com/",
    square: false,
  },
];

export default function AboutPage() {
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-20">
        <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-4">About</p>
        <h1 className="text-4xl md:text-5xl font-semibold hero-gradient tracking-tight leading-tight mb-8">
          A software company<br />that ships.
        </h1>

        <div className="space-y-5 text-white/50 text-base leading-relaxed">
          <p>
            <strong className="text-white/80">Sixmend Technology</strong> is a software development and IT
            services company. We help startups and enterprises design, build, and scale software — from the
            first line of code to production and ongoing support.
          </p>
          <p>
            Our core services are software development, QA &amp; testing, DevOps &amp; cloud infrastructure,
            and 24/7 IT support. We work across the full modern stack — TypeScript, React, Next.js, Node.js,
            Python, Docker, Kubernetes, Terraform, and AWS — with code reviews, test coverage, and real CI/CD
            baked into every project.
          </p>
          <p>
            Alongside client work, we build and operate our own products — proof of what we can deliver:
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="feat-card p-5 flex flex-col hover:border-white/20 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                {p.square ? (
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={36}
                    height={36}
                    className="rounded-lg object-contain"
                    style={{ width: 36, height: 36 }}
                  />
                ) : (
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={110}
                    height={28}
                    className="object-contain"
                    style={{ maxHeight: 24, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85 }}
                  />
                )}
                <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-white/85 mb-1">{p.name}</div>
              <div className="text-xs text-white/30 mb-3">{p.tag}</div>
              <p className="text-xs text-white/40 leading-relaxed">{p.note}</p>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/services" className="btn-ghost text-sm">
            See our services →
          </Link>
          <Link href="/contact" className="btn-primary text-sm py-3.5 px-7 inline-flex">
            Get in touch
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
