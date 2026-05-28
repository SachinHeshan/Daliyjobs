import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "Contact Us – DailyJobs Sri Lanka | Direct Recruitment Support",
  description:
    "Have questions, support requests, or advertising ideas? Contact DailyJobs Sri Lanka. Send us a message directly and our team will reply within 24 hours.",
  keywords: "contact dailyjobs sri lanka, support, hire, post job vacancy sri lanka, support contact details",
  alternates: {
    canonical: "https://dailysjobs.com/contact",
  },
};

export default function ContactPage() {
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
                "item": "https://dailysjobs.com",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact",
                "item": "https://dailysjobs.com/contact",
              },
            ],
          }),
        }}
      />

      <Navbar />

      <main style={{ flex: 1, maxWidth: 900, width: "100%", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
        
        {/* Title */}
        <section style={{ textAlign: "center", marginBottom: 50 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 20, letterSpacing: "-1px" }}>
            Get in <span style={{ background: "linear-gradient(135deg,#1591DC,#ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
          </h1>
          <p style={{ color: "#a3a3a3", fontSize: 18, lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
            Have questions about posting a vacancy or need technical assistance in Sri Lanka? Fill out the form or reach out directly.
          </p>
        </section>

        {/* Contact Form and Details */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(21, 145, 220, 0.15)", borderRadius: 20, padding: 30 }} className="glass">
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>DailyJobs Sri Lanka Support</h2>
              <p style={{ color: "#a3a3a3", lineHeight: 1.6, marginBottom: 20 }}>
                We try to respond to all candidates and recruiters within 24 hours of receiving messages.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ color: "#1591DC", fontSize: 14, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Email Support</h3>
                  <p style={{ color: "#fff", fontWeight: 600 }}>support@dailyjobs.lk</p>
                </div>
                <div>
                  <h3 style={{ color: "#1591DC", fontSize: 14, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Phone Inquiry</h3>
                  <p style={{ color: "#fff", fontWeight: 600 }}>0711010575</p>
                </div>
                <div>
                  <h3 style={{ color: "#1591DC", fontSize: 14, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Colombo HQ</h3>
                  <p style={{ color: "#fff", fontWeight: 600 }}>Level 26, East Tower, World Trade Center, Colombo 01, Sri Lanka</p>
                </div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(21, 145, 220, 0.08), rgba(255, 255, 255, 0.05))", border: "1px solid rgba(21, 145, 220, 0.15)", borderRadius: 20, padding: 30 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Advertising Inquiries</h2>
              <p style={{ color: "#a3a3a3", fontSize: 14, lineHeight: 1.6 }}>
                Interested in featuring a job banner or sponsoring a category? Reach out to <strong style={{ color: "#fff" }}>ads@dailyjobs.lk</strong>.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(21, 145, 220, 0.2)",
              borderRadius: 20,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            className="glass"
          >
            <div>
              <label htmlFor="name" style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="subject" style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Job Inquiry / Business Proposal"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="message" style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Message</label>
              <textarea
                id="message"
                placeholder="How can we help you today?"
                rows={5}
                required
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(21, 145, 220, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      <Footer />
      <BottomNavbar />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  padding: "14px 20px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  transition: "all 0.2s ease",
};
