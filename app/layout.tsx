import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/page-transition";
import { SplashScreen } from "@/components/splash-screen";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-ar",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://classicmetal.vercel.app"),
  title: {
    default: "Classic Metal — حاسبة أسعار الألوميتال",
    template: "%s | Classic Metal",
  },
  description:
    "تسعير فوري للمطابخ والشبابيك بالمتر المربع — Classic Metal للألوميتال. احسب تكلفة الألوميتال في ثواني.",
  keywords: [
    "أسعار الألوميتال",
    "حاسبة أسعار المطابخ",
    "أسعار شبابيك الألمنيوم",
    "ورشة ألوميتال",
    "مطابخ ألمنيوم",
    "Classic Metal",
  ],
  applicationName: "Classic Metal",
  authors: [{ name: "Classic Metal" }],
  creator: "Classic Metal",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Classic Metal",
    title: "Classic Metal — حاسبة أسعار الألوميتال",
    description:
      "تسعير فوري للمطابخ والشبابيك بالمتر المربع. احسب التكلفة في ثواني.",
    url: "https://classicmetal.vercel.app",
    images: [
      {
        url: "/icon.png",
        width: 192,
        height: 192,
        alt: "Classic Metal",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Classic Metal — حاسبة أسعار الألوميتال",
    description: "تسعير فوري للمطابخ والشبابيك بالمتر المربع.",
    images: ["/icon.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Classic Metal",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Classic Metal",
                  url: "https://classicmetal.vercel.app",
                  inLanguage: "ar",
                  description:
                    "حاسبة أسعار الألوميتال للمطابخ والشبابيك بالمتر المربع",
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://classicmetal.vercel.app/#business",
                  name: "Classic Metal",
                  description: "ورشة تصنيع مطابخ وشبابيك الألوميتال",
                  url: "https://classicmetal.vercel.app",
                  image: "https://classicmetal.vercel.app/icon.png",
                  priceRange: "$$",
                  areaServed: "مصر",
                },
              ],
            }),
          }}
        />
        <SplashScreen />
        <PwaRegister />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-24">
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
          <Toaster theme="system" position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}