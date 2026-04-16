import type { Metadata } from "next";
import localFont from "next/font/local";

import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PantherGuessr",
  description: "Can you find these locations on and around Chapman University?",
  icons: {
    icon: [
      {
        url: "/pantherguessr_logo.svg",
        href: "/pantherguessr_logo.svg",
      },
    ],
  },
  metadataBase: new URL("https://pantherguessr.com"),
  openGraph: {
    images: "/social-images/opengraph-image.png?v=1",
  },
  twitter: {
    images: "/social-images/opengraph-image.png?v=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="pantherguessr-theme"
          >
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
