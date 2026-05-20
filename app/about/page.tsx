import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "About Us – DailyJobs Sri Lanka | Direct Job Connections Without Registration",
  description:
    "Learn how DailyJobs Sri Lanka connects candidates directly to Sri Lankan hiring managers without sign-up, registration, or login barriers. Free job search dashboard.",
  keywords: "about dailyjobs, about dailyjobs sri lanka, no login job site, free job search platform, job search engine, direct hire",
  alternates: {
    canonical: "https://www.dailyjobs.com/about",
  },
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.dailyjobs.com",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": "https://www.dailyjobs.com/about",
              },
            ],
          }),
        }}
      />

      <Navbar />

      <main style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
        
        {/* Title */}
        <section style={{ textAlign: "center", marginBottom: 50 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 20, letterSpacing: "-1px" }}>
            About <span style={{ background: "linear-gradient(135deg,#1591DC,#ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DailyJobs Sri Lanka</span>
          </h1>
          <p style={{ color: "#a3a3a3", fontSize: 18, lineHeight: 1.6 }}>
            The direct-connection job board designed to eliminate sign-up fatigue.
          </p>
        </section>

        {/* Story */}
        <section style={{ display: "flex", flexDirection: "column", gap: 32, color: "#cbd5e1", lineHeight: 1.8, fontSize: 16 }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(21, 145, 220, 0.2)", borderRadius: 20, padding: 30 }} className="glass">
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Our Core Mission</h2>
            <p style={{ marginBottom: 16 }}>
              Most job search platforms make you fill out endless signup forms, upload resumes to custom builders, and confirm email addresses before you can even see who is hiring.
            </p>
            <p style={{ fontWeight: 600, color: "#1591DC" }}>
              At DailyJobs, we believe job hunting in Sri Lanka should be direct, fast, and simple.
            </p>
          </div>

          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>How It Works</h2>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <li>
                <strong style={{ color: "#fff" }}>1. Browse Vacancies:</strong> Use our advanced search engine filters to find job listings matched to your skillset.
              </li>
              <li>
                <strong style={{ color: "#fff" }}>2. Zero Signup:</strong> No passwords, login steps, verification codes or user dashboards.
              </li>
              <li>
                <strong style={{ color: "#fff" }}>3. Direct Access:</strong> Click "Apply Now" to connect directly with the hiring manager, company portal, or email contact listed in the posting.
              </li>
            </ul>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(21, 145, 220, 0.1), rgba(255, 255, 255, 0.05))", border: "1px solid rgba(21, 145, 220, 0.2)", borderRadius: 20, padding: 30 }}>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Google Jobs Search Indexing</h2>
            <p>
              DailyJobs Sri Lanka is built to be crawlable by Google Search. Every single vacancy listed on our site generates clean JobPosting JSON-LD structured schemas, allowing your job listings to appear in Google Search Job widgets in Sri Lanka and globally, driving top visibility for job hunters and advertisers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavbar />
    </div>
  );
}
