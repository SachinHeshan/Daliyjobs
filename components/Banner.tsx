"use client";
import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Banner({ banners }: { banners: any[] }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 300);
  };

  const goNext = () => goTo((active + 1) % banners.length);
  const goPrev = () => goTo((active - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, banners, animating]);

  if (!banners || banners.length === 0) return null;

  const b = banners[active];

  return (
    <section
      style={{
        marginTop: 70,
        position: "relative",
        overflow: "hidden",
        minHeight: 520,
      }}
      aria-label="Featured job banners"
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: b.gradient,
          transition: "background 0.8s ease",
          opacity: 0.2,
        }}
      />
      {/* Grid lines decoration */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow blobs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: b.accent,
          opacity: 0.15,
          filter: "blur(80px)",
          transition: "background 0.8s ease",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "60px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
          flexWrap: "wrap",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(10px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 50,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
              color: "#fff",
            }}
          >
            {b.tag}
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            {b.title}
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 520,
            }}
          >
            {b.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={b.href}
              style={{
                background: "#fff",
                color: "#000000",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 50,
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.transform = "translateY(-3px)";
                (e.target as HTMLAnchorElement).style.boxShadow = "0 12px 35px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.target as HTMLAnchorElement).style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
              }}
            >
              {b.cta} →
            </a>
            <a
              href="/about"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 50,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
              }}
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {b.stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Emoji */}
        <div
          style={{
            fontSize: "clamp(80px, 12vw, 140px)",
            animation: "float 3s ease-in-out infinite",
            userSelect: "none",
          }}
        >
          {b.emoji}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={goPrev}
          aria-label="Previous banner"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            color: "#fff",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          ‹
        </button>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Banner ${i + 1}`}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? "#fff" : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
        <button
          onClick={goNext}
          aria-label="Next banner"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            color: "#fff",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          ›
        </button>
      </div>

      {/* Marquee strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.5)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "10px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 60,
            animation: "marquee 25s linear infinite",
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {[...Array(2)].map((_, ri) =>
            ["🇱🇰 Colombo Vacancies", "💻 Software Engineer", "🎨 UI/UX Designer", "📊 QA Automation", "🔌 WSO2 Developer", "📱 Flutter Developer", "🏨 Hotel Management", "👥 HR Specialist", "📈 Marketing Manager"].map(
              (t, i) => (
                <span
                  key={`${ri}-${i}`}
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500 }}
                >
                  {t}
                </span>
              )
            )
          )}
        </div>
      </div>
    </section>
  );
}
