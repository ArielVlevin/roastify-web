import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

// Configure Geist Sans font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves performance and prevents layout shift
});

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata for the application
export const metadata: Metadata = {
  title: {
    default: "Roastify",
    template: "%s | Roastify", // Allows dynamic page titles
  },
  description: "A fun and witty roasting platform",
  openGraph: {
    title: "Roastify",
    description: "A fun and witty roasting platform",
    type: "website",
    // Add your og:image path when available
    // images: [{ url: '/og-image.png' }],
  },
  icons: {
    icon: "/favicon.ico", // Update with your actual favicon path
  },
  themeColor: "#ffffff", // Light mode color, adjust as needed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
