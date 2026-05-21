"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(0,0,0,0.95)"
          : "rgba(0,0,0,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(21,145,220,0.3)"
          : "1px solid rgba(255,255,255,0.05)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#1591DC,#ffffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(21,145,220,0.5)",
              }}
            >
              <img src="/favicon.ico" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 22,
                background: "linear-gradient(135deg,#1591DC,#ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              DailyJobs
            </span>
          </div>
        </Link>



        {/* Nav Links - Desktop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
          className="desktop-nav"
        >
          {[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/#jobs" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 14,
                padding: "8px 14px",
                borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#1591DC";
                (e.target as HTMLAnchorElement).style.background =
                  "rgba(21,145,220,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#94a3b8";
                (e.target as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#jobs"
            style={{
              background: "linear-gradient(135deg,#1591DC,#0d74b5)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              padding: "9px 20px",
              borderRadius: 50,
              boxShadow: "0 4px 15px rgba(21,145,220,0.4)",
              transition: "all 0.2s",
            }}
          >
            Browse Jobs
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#f1f5f9",
            cursor: "pointer",
            padding: 8,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <div
            style={{
              width: 24,
              height: 2,
              background: "#f1f5f9",
              marginBottom: 5,
              borderRadius: 2,
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: "#f1f5f9",
              marginBottom: 5,
              borderRadius: 2,
              transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: "#f1f5f9",
              borderRadius: 2,
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(0,0,0,0.98)",
            borderTop: "1px solid rgba(21,145,220,0.2)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/#jobs" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 15,
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
