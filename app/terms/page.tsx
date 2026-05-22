import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "Terms of Service – DailyJobs Sri Lanka",
  description: "Terms and Conditions for using DailyJobs Sri Lanka.",
};

export default function TermsOfService() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "120px 24px 80px 24px", color: "#a3a3a3", lineHeight: 1.8 }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 30 }}>
          Terms of <span style={{ color: "#1591DC" }}>Service</span>
        </h1>
        <p style={{ marginBottom: 20 }}>Last updated: May 2026</p>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>1. Agreement to Terms</h2>
          <p>
            By accessing or using DailyJobs Sri Lanka, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the website.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>2. Use of the Site</h2>
          <p>
            Our website acts as a venue for employers to post job opportunities and candidates to search for and apply to such jobs. We are not involved in the actual transaction between employers and candidates.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of DailyJobs Sri Lanka and its licensors.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>4. Disclaimer</h2>
          <p>
            DailyJobs does not guarantee the validity of any job offer posted on the platform. Users are advised to exercise caution and verify the authenticity of employers before sharing sensitive personal or financial information.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>5. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@dailyjobs.lk or call us at 0711010575.
          </p>
        </section>
      </main>
      <Footer />
      <BottomNavbar />
    </div>
  );
}
