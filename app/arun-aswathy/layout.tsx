import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Lato } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arun & Aswathy — Wedding",
  description: "Join us as we celebrate the union of Arun M A and Aswathy. July 7, 2026 at Guruvayoor Temple.",
};

export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${greatVibes.variable} ${playfair.variable} ${lato.variable}`}>
      {children}
    </div>
  );
}
