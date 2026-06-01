"use client";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

export default function Footer() {
  return (
    <footer
      style={{
        background: "rgba(0, 0, 0, 0.98)",
        borderTop: "1px solid rgba(21, 145, 220, 0.15)",
        padding: "60px 24px 80px 24px",
        color: "#94a3b8",
        fontSize: 14,
        position: "relative",
      }}
    >
      {/* Decorative subtle background line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(21, 145, 220, 0.5), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 40,
          marginBottom: 40,
        }}
      >
        {/* Info Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg,#1591DC,#ffffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 16,
                color: "#000",
              }}
            >
              D
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px" }}>
              DailyJobs
            </span>
          </div>
          <p style={{ lineHeight: 1.6, marginBottom: 20, color: "#64748b" }}>
            DailyJobs Sri Lanka is a leading job search platform providing direct connections to local job vacancies.
            Find your next opportunity without registration or complex login forms.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Job Categories</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["Technology & IT", "Marketing & Design", "Sales & Business", "Finance & Accountancy", "Customer Service"].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/job-category/${slugify(cat)}-jobs`}
                  className="footer-link"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Types Column */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Job Types</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
              <li key={type}>
                <Link
                  href={`/${type.replace("-", "").toLowerCase()}`}
                  className="footer-link"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                >
                  {type} Jobs
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Browse Jobs", url: "/#jobs" },
              { name: "About DailyJobs", url: "/about" },
              { name: "Contact Support", url: "/contact" },
              { name: "Privacy Policy", url: "/privacy" },
              { name: "Terms of Service", url: "/terms" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  className="footer-link"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Contact Us</h4>
          <p style={{ lineHeight: 1.6, marginBottom: 12, color: "#64748b" }}>
            Have questions or want to post a job? Reach out directly.
          </p>
          <p style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>
            📧 support@dailysjobs.com
          </p>
          <p style={{ color: "#fff", fontWeight: 600 }}>
            📞 0711010575
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          paddingTop: 30,
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          color: "#475569",
        }}
      >
        <p>© {new Date().getFullYear()} DailyJobs. All rights reserved. Built for job seekers worldwide.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Facebook", "Twitter", "LinkedIn", "GitHub"].map((network) => (
            <span key={network} style={{ fontSize: 12, color: "#475569", cursor: "pointer" }}>
              {network}
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .footer-link:hover {
          color: #1591DC !important;
        }
      `}</style>
    </footer>
  );
}
