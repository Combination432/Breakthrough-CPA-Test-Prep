import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Breakthrough CPA - Pass the CPA Exam Faster",
    template: "%s | Breakthrough CPA",
  },
  description:
    "Master the CPA exam with realistic simulations, task-based simulations (TBS), and adaptive analytics. Stop overpaying for test prep. Start your free trial today.",
  keywords: [
    "CPA exam",
    "CPA test prep",
    "CPA study",
    "accounting exam",
    "AUD",
    "FAR",
    "REG",
    "BEC",
    "task-based simulations",
    "CPA practice questions",
  ],
  authors: [{ name: "Breakthrough CPA" }],
  creator: "Breakthrough CPA",
  publisher: "Breakthrough CPA",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Breakthrough CPA - Pass the CPA Exam Faster",
    description:
      "Master the CPA exam with realistic simulations and adaptive analytics. Stop overpaying for test prep.",
    siteName: "Breakthrough CPA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breakthrough CPA - Pass the CPA Exam Faster",
    description:
      "Master the CPA exam with realistic simulations and adaptive analytics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
