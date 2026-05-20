import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DailyJobs Sri Lanka – Find Your Dream Job Today | Sri Lanka Job Vacancies",
  description:
    "DailyJobs Sri Lanka is your #1 destination for the latest job vacancies. Search thousands of jobs from top Sri Lankan companies. Find full-time, part-time, hybrid, remote jobs and internships updated daily.",
  keywords:
    "jobs sri lanka, job vacancies sri lanka, job search sri lanka, vacancies in colombo, dialog vacancies, sysco labs careers, dynamic jobs sl, careers sri lanka, employment sri lanka",
  authors: [{ name: "DailyJobs Sri Lanka" }],
  creator: "DailyJobs Sri Lanka",
  publisher: "DailyJobs Sri Lanka",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.dailyjobs.com",
    siteName: "DailyJobs Sri Lanka",
    title: "DailyJobs Sri Lanka – Find Your Dream Job Today | Sri Lanka Job Vacancies",
    description:
      "Browse thousands of job vacancies updated daily. Find your dream job on DailyJobs Sri Lanka – the fastest growing job portal in Sri Lanka.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DailyJobs – Find Your Dream Job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyJobs Sri Lanka – Find Your Dream Job Today",
    description:
      "Browse thousands of job vacancies updated daily. Find your dream job on DailyJobs Sri Lanka.",
    images: ["/og-image.jpg"],
    creator: "@dailyjobs",
  },
  alternates: {
    canonical: "https://www.dailyjobs.com",
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://www.dailyjobs.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DailyJobs Sri Lanka",
              url: "https://www.dailyjobs.com",
              description:
                "Find the latest job vacancies and employment opportunities in Sri Lanka on DailyJobs.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.dailyjobs.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
