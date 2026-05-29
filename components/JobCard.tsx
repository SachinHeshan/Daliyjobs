"use client";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { useState, useEffect } from "react";
import { Job } from "@/data/jobs";

export default function JobCard({ job, onClick }: { job: Job; onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/job/${slugify(job.title)}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <article
        className="jobcard-article"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
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

        <div className="jobcard-info-wrap" style={{ display: "flex", gap: 16, flex: 1, width: "100%", alignItems: "flex-start" }}>
          {/* Left: Logo */}
          <div
            className="jobcard-logo"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(21, 145, 220, 0.3), rgba(255, 255, 255, 0.1))",
              border: "1px solid rgba(21, 145, 220, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              <img src={`https://www.google.com/s2/favicons?domain=${job.website}&sz=128`} alt={job.company} className="jobcard-favicon" style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff", borderRadius: 16 }} />
            ) : (
              job.company.charAt(0).toUpperCase()
            )}
          </div>

          {/* Middle: Info */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Title and Company */}
            <div>
              <h3
                className="jobcard-title"
                style={{
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
                {job.website ? (
                  <a
                    href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jobcard-company jobcard-company-link"
                    style={{ color: "#1591DC", fontWeight: 600, textDecoration: "none", display: "inline-block" }}
                    onClick={(e) => e.stopPropagation()}
                    title={`Visit ${job.company} website`}
                  >
                    {job.company} <span style={{ fontSize: "0.8em" }}>↗</span>
                  </a>
                ) : (
                  <span className="jobcard-company" style={{ color: "#94a3b8", fontWeight: 600 }}>
                    {job.company}
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={infoStyle}>{job.location}</span>
                  <span style={{ color: "#475569" }}>•</span>
                  <span style={infoStyle}>{job.salary}</span>
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
              {job.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`jobcard-tag ${idx >= 2 ? "hide-on-mobile" : ""}`}
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
              {job.tags.length > 2 && (
                <span
                  className="show-on-mobile"
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
        <div className="jobcard-actions-wrap" style={{ display: "flex", flexShrink: 0, gap: 16 }}>
          <div className="jobcard-date-save" style={{ display: "flex", alignItems: "center", gap: 16 }}>
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

          <div className="jobcard-btn-wrap" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {job.urgent && (
              <span
                className="jobcard-urgent"
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
              className="jobcard-button"
              style={{
                borderRadius: 8,
                border: "none",
                background: hovered
                  ? "linear-gradient(135deg, #1591DC, #0d74b5)"
                  : "rgba(21, 145, 220, 0.1)",
                color: hovered ? "#fff" : "#1591DC",
                fontWeight: 600,
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
        <style>{`
        .jobcard-article {
          flex-direction: row;
          align-items: center;
        }
        .jobcard-info-wrap {
          flex-direction: row;
        }
        .jobcard-logo {
          width: 88px;
          height: 88px;
          font-size: 40px;
        }
        .jobcard-favicon {
          padding: 12px;
        }
        .jobcard-title {
          font-size: 22px;
        }
        .jobcard-company {
          font-size: 16px;
        }
        .jobcard-company-link:hover {
          text-decoration: underline !important;
        }
        .show-on-mobile {
          display: none !important;
        }
        .jobcard-actions-wrap {
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          width: auto;
          margin-top: 0;
          border-top: none;
          padding-top: 0;
        }
        .jobcard-date-save {
          justify-content: flex-end;
        }
        .jobcard-btn-wrap {
          justify-content: flex-end;
        }
        .jobcard-urgent {
          display: inline-block !important;
        }
        .jobcard-button {
          width: auto;
          padding: 10px 24px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .jobcard-article {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .jobcard-logo {
            width: 80px !important;
            height: 80px !important;
            font-size: 36px !important;
          }
          .jobcard-favicon {
            padding: 8px !important;
          }
          .jobcard-title {
            font-size: 20px !important;
          }
          .jobcard-company {
            font-size: 18px !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: inline-block !important;
          }
          .jobcard-actions-wrap {
            align-items: stretch !important;
            width: 100% !important;
            margin-top: 16px !important;
            border-top: 1px solid rgba(255,255,255,0.05) !important;
            padding-top: 16px !important;
          }
          .jobcard-date-save {
            justify-content: space-between !important;
          }
          .jobcard-btn-wrap {
            justify-content: center !important;
          }
          .jobcard-urgent {
            display: none !important;
          }
          .jobcard-button {
            width: 100% !important;
            padding: 12px 16px !important;
          }
        }
      `}</style>
      </article>
    </Link>
  );
}

const infoStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#94a3b8",
  display: "flex",
  alignItems: "center",
  gap: 4,
};
