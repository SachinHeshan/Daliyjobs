"use client";
import { useState, useRef, useEffect } from "react";
import { Job } from "@/data/jobs";
import ShareMenu from "@/components/ShareMenu";
import { formatJobTime } from "../lib/formatJobTime";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

interface MobileJobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply: () => void;
  showApplyForm: boolean;
  setShowApplyForm: (v: boolean) => void;
  applicantName: string;
  setApplicantName: (v: string) => void;
  applicantEmail: string;
  setApplicantEmail: (v: string) => void;
  applicantPhone: string;
  setApplicantPhone: (v: string) => void;
  applicantCV: File | null;
  setApplicantCV: (v: File | null) => void;
  applicantCoverLetter: string;
  setApplicantCoverLetter: (v: string) => void;
  emailCopy: boolean;
  setEmailCopy: (v: boolean) => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  handleApply: (e: React.FormEvent) => void;
}

export default function MobileJobDetails({
  job,
  onClose,
  showApplyForm,
  setShowApplyForm,
  applicantName,
  setApplicantName,
  applicantEmail,
  setApplicantEmail,
  applicantPhone,
  setApplicantPhone,
  applicantCV,
  setApplicantCV,
  applicantCoverLetter,
  setApplicantCoverLetter,
  emailCopy,
  setEmailCopy,
  isSubmitting,
  submitSuccess,
  handleApply,
}: MobileJobDetailsProps) {
  const [saved, setSaved] = useState(false);
  const [viewCount, setViewCount] = useState<number>(0);
  const applyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!job) return;

    const trackView = async () => {
      const sessionKey = `viewed_${job.id}`;
      const hasViewedInSession = sessionStorage.getItem(sessionKey);

      try {
        const jobRef = doc(db, "job-vacancies", String(job.id));
        const jobSnap = await getDoc(jobRef);

        let currentViews = 0;

        if (!hasViewedInSession) {
          // Increment view
          if (jobSnap.exists()) {
            await updateDoc(jobRef, { views: increment(1) });
            currentViews = (jobSnap.data().views || 0) + 1;
          } else {
            // Document doesn't exist (e.g. mock job), initialize it
            currentViews = (job.views || Math.floor(Math.random() * 500) + 100) + 1;
            await setDoc(jobRef, { views: currentViews }, { merge: true });
          }
          sessionStorage.setItem(sessionKey, "true");
        } else {
          // Already viewed, just fetch latest
          if (jobSnap.exists()) {
            currentViews = jobSnap.data().views || 0;
          } else {
            currentViews = job.views || Math.floor(Math.random() * 500) + 100;
          }
        }
        
        setViewCount(currentViews);
      } catch (error) {
        console.error("Failed to update view count in DB:", error);
        const fallbackViews = job.views || Math.floor(Math.random() * 500) + 100;
        setViewCount(hasViewedInSession ? fallbackViews : fallbackViews + 1);
        if (!hasViewedInSession) sessionStorage.setItem(sessionKey, "true");
      }
    };

    trackView();
  }, [job]);

  const handleApplyNowClick = () => {
    setShowApplyForm(true);
    // Scroll to apply section after state update
    setTimeout(() => {
      applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <>
      {/* Full-screen mobile job details page */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#080c12",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          animation: "mobileSlideUp 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        }}
      >
        {/* ── Home Page Navigation Bar ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(8,12,18,0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "0 18px",
          }}
        >
          {/* Breadcrumb row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 0 6px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#1591DC",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1591DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </button>
            <span style={{ color: "#334155", fontSize: 13 }}>›</span>
            <span
              style={{
                fontSize: 13,
                color: "#94a3b8",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "calc(100vw - 160px)",
              }}
            >
              Job Details
            </span>
          </div>

          {/* Title + Save row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 0",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#e2e8f0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {job.title}
            </span>
            <button
              onClick={() => setSaved(!saved)}
              aria-label={saved ? "Unsave job" : "Save job"}
              style={{
                background: saved ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${saved ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10,
                padding: "6px 12px",
                color: saved ? "#f59e0b" : "#64748b",
                fontSize: 17,
                cursor: "pointer",
                transition: "all 0.2s",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {saved ? "★" : "☆"}
            </button>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <div
          style={{
            background: "linear-gradient(160deg, rgba(21,145,220,0.12) 0%, rgba(8,12,18,0) 60%)",
            padding: "28px 20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo + Company */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, rgba(21,145,220,0.25), rgba(255,255,255,0.06))",
                border: "1.5px solid rgba(21,145,220,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
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
                <img
                  src={`https://www.google.com/s2/favicons?domain=${job.website}&sz=128`}
                  alt={job.company}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10, background: "#fff", borderRadius: 18 }}
                />
              ) : (
                job.company.charAt(0).toUpperCase()
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {job.website ? (
                <a
                  href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 16,
                    color: "#1591DC",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {job.company} <span style={{ fontSize: "0.75em" }}>↗</span>
                </a>
              ) : (
                <span style={{ fontSize: 16, color: "#1591DC", fontWeight: 700 }}>{job.company}</span>
              )}

              {/* Badges row */}
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "rgba(21,145,220,0.15)",
                    border: "1px solid rgba(21,145,220,0.35)",
                    color: "#1591DC",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 50,
                  }}
                >
                  {job.type}
                </span>
                {job.urgent && (
                  <span
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #f97316)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 50,
                      letterSpacing: 0.5,
                    }}
                  >
                    URGENT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Job Title */}
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.25,
              marginBottom: 0,
              letterSpacing: "-0.3px",
            }}
          >
            {job.title}
          </h1>
        </div>

        {/* ── Key Info Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Location */}
          <div
            style={{
              background: "rgba(21,145,220,0.07)",
              border: "1px solid rgba(21,145,220,0.18)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1591DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: 10, color: "#1591DC", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Location</span>
            </div>
            <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.3 }}>{job.location}</span>
          </div>

          {/* Salary */}
          <div
            style={{
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Salary</span>
            </div>
            <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.3 }}>{job.salary}</span>
          </div>

          {/* Posted */}
          <div
            style={{
              background: "rgba(245,158,11,0.07)",
              border: "1px solid rgba(245,158,11,0.18)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Posted</span>
            </div>
            <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{formatJobTime(job.postedDate, job.postedTime, job.createdAt).label}</span>
          </div>
        </div>

        {/* ── Skills Tags ── */}
        <div style={{ padding: "20px 20px 0" }}>
          <p style={{ fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Required Skills
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {job.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: 50,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Job Description ── */}
        <div style={{ padding: "24px 20px", flex: 1, paddingBottom: showApplyForm ? 24 : 100 }}>
          <p style={{ fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            Job Description
          </p>

          <div
            className="job-description-content"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 600, marginTop: 20 }}>
            💡 It would be better if you apply using your own email address.
          </p>

          {/* Post image if any */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(job as any).postImage && (
            <div style={{ marginTop: 20, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              {(job as any).postImage.toLowerCase().includes('.pdf') ? (
                <div style={{ padding: 30, textAlign: "center", background: "rgba(21, 145, 220, 0.05)" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1591DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Job Post Document (PDF)</h3>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexDirection: "column" }}>
                    <a href={(job as any).postImage} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      View PDF
                    </a>
                    <a href={(job as any).postImage} download target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Download PDF
                    </a>
                  </div>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={(job as any).postImage} alt="Job Post Details" style={{ width: "100%", height: "auto", display: "block" }} />
              )}
            </div>
          )}

          {/* Share, Views, Time Bar */}
          <div style={{ marginTop: 24, padding: "16px 12px", borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.05)", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", color: "#94a3b8", fontSize: "12px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ justifySelf: "start" }}>
              <ShareMenu jobUrl={typeof window !== "undefined" ? window.location.href : `https://dailysjobs.com/job/${job.id}`} jobTitle={job.title} />
            </div>
            
            <div style={{ justifySelf: "center", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
              <span style={{ fontSize: "14px" }}>👁</span> Viewed: {viewCount > 0 ? viewCount.toLocaleString() : "..."}
            </div>
            
            <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
              <span style={{ fontSize: "14px" }}>{formatJobTime(job.postedDate, job.postedTime, job.createdAt).icon}</span> {formatJobTime(job.postedDate, job.postedTime, job.createdAt).label}
            </div>
          </div>

          {/* ── Apply Form (inline, not modal) ── */}
          <div ref={applyRef} />
          {showApplyForm && (
            <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {submitSuccess ? (
                <div
                  style={{
                    padding: 28,
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 44, display: "block", marginBottom: 12 }}>✅</span>
                  <h4 style={{ color: "#22c55e", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                    Application Submitted!
                  </h4>
                  <p style={{ color: "#a3a3a3", fontSize: 14, marginBottom: 20 }}>
                    Your details have been delivered directly to the employer.
                  </p>
                  <button
                    onClick={onClose}
                    style={{
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "13px 32px",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      fontSize: 15,
                      fontFamily: "inherit",
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                    Apply for this position
                  </h4>

                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    style={mobileInputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    style={mobileInputStyle}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    style={mobileInputStyle}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Upload CV (PDF/DOCX) *</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => setApplicantCV(e.target.files?.[0] || null)}
                      style={{ ...mobileInputStyle, padding: "12px" }}
                    />
                  </div>

                  <textarea
                    placeholder="Cover Letter (Optional)"
                    value={applicantCoverLetter}
                    onChange={(e) => setApplicantCoverLetter(e.target.value)}
                    style={{ ...mobileInputStyle, minHeight: 100, resize: "vertical" }}
                  />

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#a3a3a3",
                      fontSize: 13.5,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={emailCopy}
                      onChange={(e) => setEmailCopy(e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    Email me a copy of my application
                  </label>

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        color: "#94a3b8",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        padding: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 15,
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        flex: 2,
                        background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "14px",
                        fontWeight: 700,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                        fontSize: 15,
                        fontFamily: "inherit",
                        boxShadow: "0 4px 16px rgba(21,145,220,0.35)",
                      }}
                    >
                      {isSubmitting ? "Submitting…" : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky Bottom CTA (only when form not open) ── */}
        {!showApplyForm && !submitSuccess && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: "rgba(8,12,18,0.96)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
              display: "flex",
              gap: 10,
              zIndex: 10,
            }}
          >
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "15px",
                color: "#94a3b8",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 15,
                fontFamily: "inherit",
              }}
            >
              Close
            </button>
            <button
              onClick={handleApplyNowClick}
              style={{
                flex: 2,
                background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                border: "none",
                borderRadius: 14,
                padding: "15px",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
                fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(21,145,220,0.4)",
              }}
            >
              Apply Now →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes mobileSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .job-description-content {
          text-align: left !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          width: 100%;
          line-height: 1.7 !important;
          color: #a3a3a3;
          font-size: 15px;
        }
        .job-description-content * { max-width: 100%; }
        .job-description-content p {
          margin-top: 0 !important; margin-bottom: 1em !important;
          text-align: left !important; line-height: 1.7 !important;
        }
        .job-description-content ul {
          list-style-type: disc !important; margin-top: 0.5em !important;
          margin-bottom: 1em !important; padding-left: 22px !important; display: block !important;
        }
        .job-description-content ol {
          list-style-type: decimal !important; margin-top: 0.5em !important;
          margin-bottom: 1em !important; padding-left: 22px !important; display: block !important;
        }
        .job-description-content li {
          margin-bottom: 0.5em !important; display: list-item !important;
          list-style: inherit !important; text-align: left !important; line-height: 1.7 !important;
        }
        .job-description-content h1,
        .job-description-content h2,
        .job-description-content h3,
        .job-description-content h4 {
          color: #fff !important; font-weight: 700 !important;
          margin-top: 1.6em !important; margin-bottom: 0.7em !important;
          text-align: left !important; display: block !important;
        }
        .job-description-content h1 { font-size: 1.6em !important; }
        .job-description-content h2 { font-size: 1.35em !important; }
        .job-description-content h3 { font-size: 1.2em !important; }
        .job-description-content h4 { font-size: 1.05em !important; }
        .job-description-content p strong {
          color: #fff !important; font-weight: 700 !important;
          display: inline-block; margin-top: 0.8em !important;
        }
      `}</style>
    </>
  );
}

const mobileInputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "14px 16px",
  color: "#fff",
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
};
