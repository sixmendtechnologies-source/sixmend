import type { Metadata } from "next";
import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Sixmend Technology",
  description: "Software development, QA, DevOps, and IT support — built to scale.",
  metadataBase: new URL("https://www.sixmend.com"),
  alternates: {
    canonical: "https://www.sixmend.com",
  },
  openGraph: {
    title: "Sixmend Technology",
    description: "Software development, QA, DevOps, and IT support — built to scale.",
    url: "https://www.sixmend.com",
    siteName: "Sixmend Technology",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sixmend Technology",
  url: "https://www.sixmend.com",
  logo: "https://www.sixmend.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "sixmendtechnologies@gmail.com",
    contactType: "customer support",
  },
  sameAs: [],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does Sixmend Technology offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sixmend Technology offers end-to-end software development, QA & testing, DevOps & cloud infrastructure, and 24/7 IT support for startups and enterprises.",
      },
    },
    {
      "@type": "Question",
      name: "How do I start a project with Sixmend?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can reach us at sixmendtechnologies@gmail.com. We typically respond within one business day and will schedule a discovery call to understand your project requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does Sixmend offer 24/7 IT support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sixmend provides round-the-clock IT support with a 99.9% uptime SLA, available both remotely and on-site.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies does Sixmend work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with TypeScript, React, Next.js, Node.js, Python, Docker, Kubernetes, Terraform, AWS, PostgreSQL, Redis, and more — across the full modern stack.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </head>
      <body className="min-h-full bg-black text-[#ededed]">{children}</body>
    </html>
  );
}
