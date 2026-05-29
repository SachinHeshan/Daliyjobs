import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "DailyJobs Sri Lanka | Job Vacancies 2026 – Find Jobs in Colombo & Sri Lanka",
    template: "%s | DailyJobs Sri Lanka",
  },
  description:
    "Find the latest job vacancies in Sri Lanka 2026. Browse hundreds of jobs in Colombo, Kandy, Galle & remote. Full-time, part-time, internships & contract jobs updated daily. Apply directly to top Sri Lankan companies like Dialog, Sysco LABS, WSO2, 99x and more.",
  keywords:
    "airport job vacancies, bank job vacancies, banking job vacancies, brandix job vacancies, call center job vacancies, cashier job vacancies, dubai job vacancies, express job, express jobs, finance job vacancies, foreign job vacancies, galle job vacancies, government job, government job vacancies, government job vacancies 2025, government job vacancies 2026, government job vacancies in sri lanka, government job vacancy, hotel job vacancies, hr job vacancies, job bank, job in sri lanka, job search, jobs, jobs in dubai, jobs sri lanka, keells job vacancies, labour department vacancies, lanka jobs, latest job vacancies, manager job vacancies, marketing job vacancies, navy job vacancies, office assistant job vacancies, part time jobs, private job vacancies, receptionist job vacancies, sales executive job vacancies, security job vacancies, sri lanka government jobs, sri lanka job vacancies, sri lanka jobs, supermarket job vacancies, teacher job vacancies, teaching job vacancies, top jobs, topjobs, vacancies, vacancy, warehouse job vacancies, work from home jobs, airport jobs sri lanka, bank jobs sri lanka, banking careers sri lanka, call center jobs sri lanka, cashier jobs sri lanka, dubai jobs for sri lankans, hotel jobs sri lanka, it jobs sri lanka, part time jobs sri lanka, government careers sri lanka, dailyjobs, daily jobs sri lanka",
  authors: [{ name: "DailyJobs Sri Lanka", url: "https://dailysjobs.com" }],
  creator: "DailyJobs Sri Lanka",
  publisher: "DailyJobs Sri Lanka",
  category: "Jobs & Employment",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://dailysjobs.com",
    siteName: "DailyJobs Sri Lanka",
    title: "DailyJobs Sri Lanka | Job Vacancies 2026 – Find Jobs in Colombo & Sri Lanka",
    description:
      "Browse hundreds of job vacancies in Sri Lanka updated daily. Find your next full-time, part-time, remote or internship opportunity. Apply directly to top Sri Lankan companies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DailyJobs Sri Lanka – Find Your Dream Job",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dailyjobslk",
    creator: "@dailyjobslk",
    title: "DailyJobs Sri Lanka | Latest Job Vacancies 2026",
    description:
      "Find the latest jobs in Sri Lanka. Hundreds of vacancies updated daily — apply directly to top companies.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://dailysjobs.com",
    languages: {
      "en-LK": "https://dailysjobs.com",
    },
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
    <html lang="en-LK" className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <link rel="canonical" href="https://dailysjobs.com" />
        <meta name="geo.region" content="LK" />
        <meta name="geo.placename" content="Sri Lanka" />
        <meta name="geo.position" content="7.8731;80.7718" />
        <meta name="ICBM" content="7.8731, 80.7718" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "DailyJobs Sri Lanka",
                alternateName: "DailyJobs LK",
                url: "https://dailysjobs.com",
                description:
                  "Find the latest job vacancies and employment opportunities in Sri Lanka.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://dailysjobs.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "DailyJobs Sri Lanka",
                url: "https://dailysjobs.com",
                logo: "https://dailysjobs.com/icon.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  areaServed: "LK",
                  availableLanguage: "English",
                },
                sameAs: [
                  "https://www.facebook.com/dailyjobslk",
                  "https://www.linkedin.com/company/dailyjobslk",
                ],
              },
            ]),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
