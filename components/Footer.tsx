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
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a
            href="https://www.facebook.com/profile.php?id=61590313618471"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon facebook-icon"
            aria-label="Facebook"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@daliyjobs7"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon tiktok-icon"
            aria-label="TikTok"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.27 6.32 6.32 6.32 0 006.26-6.3V8.89a8.1 8.1 0 004.47 1.34V6.78a5.53 5.53 0 01-2.41-.09z"/>
            </svg>
          </a>
        </div>
      </div>

      <style jsx global>{`
        .footer-link:hover {
          color: #1591DC !important;
        }
        .social-icon {
          color: #64748b;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-icon:hover {
          transform: translateY(-4px) scale(1.15);
        }
        .facebook-icon:hover {
          color: #1877F2;
          filter: drop-shadow(0 6px 16px rgba(24, 119, 242, 0.5));
        }
        .tiktok-icon:hover {
          color: #fff;
          filter: drop-shadow(0 6px 16px rgba(255, 255, 255, 0.4));
        }
      `}</style>
    </footer>
  );
}
