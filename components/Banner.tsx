"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

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

  if (!banners || banners.length === 0) {
    return (
      <section
        style={{
          marginTop: 70,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "clamp(300px, 40vw, 500px)",
          background: "rgba(255,255,255,0.02)",
        }}
        className="shimmer"
      />
    );
  }

  const b = banners[active];

  return (
    <section
      style={{
        marginTop: 70,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        // 16:9 or 21:9 aspect ratio usually works best for banners. We'll use a fixed height for consistency.
        height: "clamp(300px, 40vw, 500px)",
      }}
      aria-label="Featured job banners"
    >
      {/* Background Image */}
      {b.image ? (
        <Image
          src={b.image}
          alt={b.title || "Banner"}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", zIndex: 0, transition: "opacity 0.8s ease" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: b.gradient || "linear-gradient(135deg, #1591DC 0%, #0d74b5 50%, #000000 100%)",
            transition: "background 0.8s ease",
            zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          opacity: animating ? 0 : 1,
          transition: "opacity 0.3s ease",
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "60px 24px",
        }}
      >
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {(b.title || b.description || b.subtitle) && (
            <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: 32, borderRadius: 20, display: "inline-block", maxWidth: 600 }}>
              {b.title && (
                <h1
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    marginBottom: (b.description || b.subtitle) ? 16 : 0,
                    color: "#fff",
                    letterSpacing: "-1px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  {b.title}
                </h1>
              )}
              {(b.description || b.subtitle) && (
                <p
                  style={{
                    fontSize: 17,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.7,
                    margin: 0,
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  {b.description || b.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
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
