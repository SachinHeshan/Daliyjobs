"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import { Job } from "@/data/jobs";
import Link from "next/link";

export default function JobClientPage({ job }: { job: Job }) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantCV, setApplicantCV] = useState<File | null>(null);
  const [applicantCoverLetter, setApplicantCoverLetter] = useState("");
  const [emailCopy, setEmailCopy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !applicantCV) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitSuccess(true);
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
      setApplicantCV(null);
      setApplicantCoverLetter("");
      setEmailCopy(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 820, width: "100%", margin: "0 auto", padding: "40px 20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Link href="/" style={{ color: "#1591DC", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            ← Back to Jobs
          </Link>
        </div>

        <div
          className="job-client-container"
          style={{
            background: "rgba(13, 13, 13, 0.96)",
            border: "1px solid rgba(21, 145, 220, 0.2)",
            borderRadius: 24,
            width: "100%",
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Header */}
          <div
            className="job-client-header"
            style={{
              padding: "32px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                background: "linear-gradient(135deg, rgba(21, 145, 220, 0.2), rgba(255, 255, 255, 0.05))",
                border: "1px solid rgba(21, 145, 220, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {job.logo && (job.logo.startsWith("http") || job.logo.startsWith("/")) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.logo} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : job.website ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://www.google.com/s2/favicons?domain=${job.website}&sz=128`} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10, background: "#fff", borderRadius: 16 }} />
              ) : (
                job.company.charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>{job.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {job.website ? (
                  <a
                    href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 16, color: "#1591DC", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    {job.company} ↗
                  </a>
                ) : (
                  <span style={{ fontSize: 16, color: "#1591DC", fontWeight: 700 }}>{job.company}</span>
                )}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {job.urgent && (
                    <span style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>
                      URGENT
                    </span>
                  )}
                  <span style={{ background: "rgba(21, 145, 220, 0.12)", border: "1px solid rgba(21, 145, 220, 0.25)", color: "#1591DC", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 50 }}>
                    {job.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div
            className="job-client-facts"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 16,
              padding: "20px 32px",
              background: "rgba(255, 255, 255, 0.01)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(21, 145, 220, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#1591DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 700 }}>LOCATION</span>
                <span style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{job.location}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 700 }}>SALARY</span>
                <span style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{job.salary}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 700 }}>POSTED</span>
                <span style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{job.postedDate}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="job-client-body" style={{ padding: 32 }}>
            <div>
              <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>REQUIRED SKILLS</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {job.tags.map((tag) => (
                  <span key={tag} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 50 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>JOB DESCRIPTION</span>
              <div className="job-description-content" dangerouslySetInnerHTML={{ __html: job.description }} style={{ color: "#a3a3a3", fontSize: 16, lineHeight: 1.7 }} />

              <p style={{ color: "#22c55e", fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
                💡 It would be better if you apply using your own email address.
              </p>

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(job as any).postImage && (
                <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(job as any).postImage} alt="Job Post Details" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              )}
            </div>

            {/* Application Form */}
            {showApplyForm && (
              <div style={{ marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {submitSuccess ? (
                  <div style={{ padding: 32, background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 20, textAlign: "center" }}>
                    <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>✅</span>
                    <h4 style={{ color: "#22c55e", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Application Submitted Successfully!</h4>
                    <p style={{ color: "#a3a3a3", fontSize: 15 }}>Your candidates details have been delivered directly to the employer.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <h4 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Apply for this position</h4>
                    <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input type="text" placeholder="Full Name" required value={applicantName} onChange={e => setApplicantName(e.target.value)} className="form-input" />
                      <input type="email" placeholder="Email Address" required value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} className="form-input" />
                    </div>
                    <input type="tel" placeholder="Phone Number" required value={applicantPhone} onChange={e => setApplicantPhone(e.target.value)} className="form-input" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Upload CV (PDF/DOCX) *</label>
                      <input type="file" accept=".pdf,.doc,.docx" required onChange={e => setApplicantCV(e.target.files?.[0] || null)} className="form-input" style={{ padding: "12px" }} />
                    </div>
                    <textarea placeholder="Cover Letter (Optional)" value={applicantCoverLetter} onChange={e => setApplicantCoverLetter(e.target.value)} className="form-input" style={{ minHeight: 120, resize: "vertical" }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 12, color: "#a3a3a3", fontSize: 14, cursor: "pointer", userSelect: "none" }}>
                      <input type="checkbox" checked={emailCopy} onChange={e => setEmailCopy(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                      Email me a copy of my job application (optional)
                    </label>
                    <div className="form-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 16 }}>
                      <button type="button" onClick={() => setShowApplyForm(false)} disabled={isSubmitting} style={{ background: "rgba(255,255,255,0.04)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, fontSize: 15 }}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!showApplyForm && !submitSuccess && (
              <div className="form-buttons" style={{ display: "flex", justifyContent: "flex-end", marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <button onClick={() => setShowApplyForm(true)} style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(21, 145, 220, 0.3)", fontSize: 16 }}>
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavbar />

      <style>{`
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 16px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }
        .form-input:focus {
          border-color: #1591DC;
        }
        .job-description-content {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
          overflow-x: hidden;
        }
        .job-description-content * {
          max-width: 100%;
        }
        .job-description-content h1, .job-description-content h2, .job-description-content h3, .job-description-content h4 {
          color: #fff; margin-top: 24px; margin-bottom: 12px; font-weight: 700;
        }
        .job-description-content p {
          margin-bottom: 16px;
        }
        .job-description-content ul, .job-description-content ol {
          margin-left: 20px; margin-bottom: 16px;
        }
        .job-description-content li {
          margin-bottom: 8px;
        }
        @media (max-width: 768px) {
          .job-client-container {
            border-radius: 0px !important;
            border-left: none !important;
            border-right: none !important;
          }
          .job-client-header {
            padding: 24px 16px !important;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .job-client-body {
            padding: 24px 16px !important;
          }
          .job-client-facts {
            grid-template-columns: 1fr !important;
            padding: 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-buttons {
            flex-direction: column;
            width: 100%;
          }
          .form-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
