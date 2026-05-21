"use client";
import { useState, useEffect } from "react";
import { Job } from "@/data/jobs";

export default function JobCard({ job, onClick }: { job: Job; onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <article
      suppressHydrationWarning
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        background: hovered
          ? "linear-gradient(135deg, rgba(21, 145, 220, 0.12), rgba(255, 255, 255, 0.05))"
          : "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(21, 145, 220, 0.5)"
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 24,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px rgba(21, 145, 220, 0.2)"
          : "0 2px 10px rgba(0,0,0,0.2)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        gap: 24,
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >

      <div style={{ display: "flex", flexDirection: "row", gap: 16, flex: 1, width: "100%", alignItems: "flex-start" }}>
        {/* Left: Logo */}
        <div
          style={{
            width: isMobile ? 80 : 88,
            height: isMobile ? 80 : 88,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(21, 145, 220, 0.3), rgba(255, 255, 255, 0.1))",
            border: "1px solid rgba(21, 145, 220, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? 36 : 40,
            fontWeight: 800,
            color: "#1591DC",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {job.logo && (job.logo.startsWith("http") || job.logo.startsWith("/")) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.logo} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : job.website ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://www.google.com/s2/favicons?domain=${job.website}&sz=128`} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "contain", padding: isMobile ? 8 : 12, background: "#fff", borderRadius: 16 }} />
          ) : (
            job.company.charAt(0).toUpperCase()
          )}
        </div>

        {/* Middle: Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Title and Company */}
          <div>
            <h3
              style={{
                fontSize: isMobile ? 20 : 22,
                fontWeight: 700,
                color: "#f1f5f9",
                marginBottom: 4,
                lineHeight: 1.3,
                whiteSpace: "normal",
                wordBreak: "break-word"
              }}
            >
              {job.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: isMobile ? 18 : 16, color: "#94a3b8", fontWeight: 600 }}>
                {job.company}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ ...infoStyle, fontSize: isMobile ? 15 : 15 }}>{job.location}</span>
                <span style={{ color: "#475569" }}>•</span>
                <span style={{ ...infoStyle, fontSize: isMobile ? 15 : 15 }}>{job.salary}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(21, 145, 220, 0.15)",
                border: "1px solid rgba(21, 145, 220, 0.3)",
                color: "#1591DC",
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: 50,
              }}
            >
              {job.type}
            </span>
            {job.tags.slice(0, isMobile ? 2 : job.tags.length).map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 10px",
                  borderRadius: 50,
                }}
              >
                {tag}
              </span>
            ))}
            {isMobile && job.tags.length > 2 && (
              <span
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 10px",
                  borderRadius: 50,
                }}
              >
                +{job.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "column", alignItems: isMobile ? "stretch" : "flex-end", justifyContent: "space-between", gap: 16, flexShrink: 0, width: isMobile ? "100%" : "auto", marginTop: isMobile ? 16 : 0, borderTop: isMobile ? "1px solid rgba(255,255,255,0.05)" : "none", paddingTop: isMobile ? 16 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "space-between" : "flex-end", gap: 16 }}>
          <span style={infoStyle}>{job.postedDate}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            aria-label={saved ? "Unsave job" : "Save job"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 24,
              color: saved ? "#f59e0b" : "#475569",
              transition: "all 0.2s",
              transform: saved ? "scale(1.2)" : "scale(1)",
              padding: 4,
              lineHeight: 1,
            }}
          >
            {saved ? "★" : "☆"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-end", gap: 12 }}>
          {job.urgent && (
            <span
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 50,
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                display: isMobile ? "none" : "inline-block"
              }}
            >
              URGENT
            </span>
          )}
          <button
            style={{
              width: isMobile ? "100%" : "auto",
              padding: isMobile ? "12px 16px" : "10px 24px",
              borderRadius: 8,
              border: "none",
              background: hovered
                ? "linear-gradient(135deg, #1591DC, #0d74b5)"
                : "rgba(21, 145, 220, 0.1)",
              color: hovered ? "#fff" : "#1591DC",
              fontWeight: 600,
              fontSize: isMobile ? 14 : 14,
              cursor: "pointer",
              transition: "all 0.3s",
              letterSpacing: 0.3,
              fontFamily: "inherit",
              textAlign: "center"
            }}
          >
            {hovered ? "Apply Now →" : "View Details"}
          </button>
        </div>
      </div>
    </article>
  );
}

const infoStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#94a3b8",
  display: "flex",
  alignItems: "center",
  gap: 4,
};
