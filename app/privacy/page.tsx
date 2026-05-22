import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "Privacy Policy – DailyJobs Sri Lanka",
  description: "Privacy Policy for DailyJobs Sri Lanka detailing how we handle user data and advertising cookies.",
};

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "120px 24px 80px 24px", color: "#a3a3a3", lineHeight: 1.8 }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 30 }}>
          Privacy <span style={{ color: "#1591DC" }}>Policy</span>
        </h1>
        <p style={{ marginBottom: 20 }}>Last updated: May 2026</p>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>1. Introduction</h2>
          <p>
            Welcome to DailyJobs Sri Lanka. This Privacy Policy explains how we collect, use, and share information about you when you visit our website (www.dailyjobs.com).
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>2. Google AdSense and Cookies</h2>
          <p style={{ marginBottom: 15 }}>
            We use Google AdSense to display advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads on our site.
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: 20, marginBottom: 15 }}>
            <li style={{ marginBottom: 10 }}>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
            <li style={{ marginBottom: 10 }}>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#1591DC", textDecoration: "underline" }}>Ads Settings</a>.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>3. Information We Collect</h2>
          <p>
            When you visit DailyJobs, we may automatically log certain information, including your IP address, browser type, and interaction with our website. If you submit a contact form or apply for a job, we collect the personal information you voluntarily provide, such as your name, email address, and resume details.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>4. How We Use Information</h2>
          <p>
            We use the information we collect to operate, maintain, and improve our website. Information submitted via job applications is routed to the respective employers.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 15 }}>5. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@dailyjobs.lk or call us at 0711010575.
          </p>
        </section>
      </main>
      <Footer />
      <BottomNavbar />
    </div>
  );
}
