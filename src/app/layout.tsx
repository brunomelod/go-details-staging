import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import { PublicChatLoader } from "@/components/integrations/PublicChatLoader";
import { SiteVisitorBridge } from "@/components/site/SiteVisitorBridge";
import { siteImages } from "@/data/site-images";
import { ThemeInitScript } from "@/app/theme-init";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Go Details | Premium Cleaning & Auto Detailing",
  description:
    "Top-rated home cleaning and auto detailing in Fort Collins, CO. Book online in minutes.",
  icons: { icon: siteImages.favicon },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-page text-foreground">
        <ThemeInitScript />
        <Providers>
          {children}
          <SiteVisitorBridge />
          <PublicChatLoader />
        </Providers>
      </body>
    </html>
  );
}
