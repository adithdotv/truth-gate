import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";
import { SITE_URL } from "@/lib/share";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for invocations and verdicts — the temple inscription.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TruthGate",
  description:
    "An autonomous AI gatekeeper on Somnia. Earn your onchain Founder Passport.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground antialiased">
        <WalletProvider>{children}</WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
