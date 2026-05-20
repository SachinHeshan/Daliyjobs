"use client";
import { useState, useEffect } from "react";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  postedTime: string;
  type: string;
  salary: string;
  logo: string;
  tags: string[];
  urgent?: boolean;
}

export default function JobCard({ job }: { job: Job }) {
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
      }}
    >

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24, flex: 1, width: "100%", alignItems: isMobile ? "flex-start" : "center" }}>
        {/* Left: Logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(21, 145, 220, 0.3), rgba(255, 255, 255, 0.1))",
            border: "1px solid rgba(21, 145, 220, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            flexShrink: 0,
            marginTop: job.urgent && isMobile ? 16 : 0,
          }}
        >
          {job.logo}
        </div>

        {/* Middle: Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Title and Company */}
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#f1f5f9",
                marginBottom: 6,
                lineHeight: 1.3,
                whiteSpace: isMobile ? "normal" : "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.title}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, color: "#94a3b8", fontWeight: 600 }}>
                {job.company}
              </span>
              <span style={{ color: "#475569", display: isMobile ? "none" : "inline" }}>•</span>
              <span style={infoStyle}>📍 {job.location}</span>
              <span style={{ color: "#475569", display: isMobile ? "none" : "inline" }}>•</span>
              <span style={infoStyle}>💰 {job.salary}</span>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(21, 145, 220, 0.15)",
                border: "1px solid rgba(21, 145, 220, 0.3)",
                color: "#1591DC",
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 50,
              }}
            >
              {job.type}
            </span>
            {job.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: 50,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", justifyContent: "space-between", gap: 16, flexShrink: 0, width: isMobile ? "100%" : "auto", marginTop: isMobile ? 16 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "space-between" : "flex-end" }}>
          <span style={infoStyle}>⏰ {job.postedTime}</span>
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

        <div style={{ display: "flex", alignItems: "center", gap: 12, width: isMobile ? "50%" : "auto", justifyContent: isMobile ? "flex-end" : "flex-start" }}>
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
              }}
            >
              URGENT
            </span>
          )}
          <button
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: hovered
                ? "linear-gradient(135deg, #1591DC, #0d74b5)"
                : "rgba(21, 145, 220, 0.1)",
              color: hovered ? "#fff" : "#1591DC",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.3s",
              letterSpacing: 0.3,
              fontFamily: "inherit",
              width: isMobile ? "100%" : "auto",
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
  fontSize: 13,
  color: "#94a3b8",
  display: "flex",
  alignItems: "center",
  gap: 4,
};
