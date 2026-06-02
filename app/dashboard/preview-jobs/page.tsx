"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  approved?: boolean;
  description?: string;
  postImage?: string;
  category?: string;
  website?: string;
  applyEmail?: string;
  salary?: string;
}

export default function PreviewJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "job-vacancies"), where("approved", "==", false));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Job));
      setJobs(list);
    } catch (err) {
      console.error("Error fetching pending jobs:", err);
      alert("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Approve and publish this job?")) return;
    try {
      await updateDoc(doc(db, "job-vacancies", id), { approved: true });
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      console.error("Error approving job:", err);
      alert("Failed to approve job.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pending job?")) return;
    try {
      await deleteDoc(doc(db, "job-vacancies", id));
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 24 }}>Preview Jobs (Pending Approval)</h1>
      
      {loading ? (
        <div style={{ color: "#a3a3a3", padding: 40 }}>Loading pending jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.02)", padding: 40, borderRadius: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>🎉</span>
          <h3 style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>All caught up!</h3>
          <p style={{ color: "#64748b" }}>There are no pending jobs to review right now.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            
            return (
              <div key={job.id} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                
                {/* Header (Always Visible) */}
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isExpanded ? "rgba(255,255,255,0.03)" : "transparent" }} onClick={() => toggleExpand(job.id)}>
                  <div>
                    <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                    <p style={{ color: "#a3a3a3", fontSize: 14 }}>{job.company} • {job.location} • {job.type}</p>
                    <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>Submitted: {job.postedDate}</p>
                  </div>
                  <div style={{ color: "#1591DC", fontWeight: 600, fontSize: 14 }}>
                    {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 16, paddingTop: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                      <div>
                        <p style={labelStyle}>Category</p>
                        <p style={valueStyle}>{job.category || "N/A"}</p>
                      </div>
                      <div>
                        <p style={labelStyle}>Contact Email</p>
                        <p style={valueStyle}>{job.applyEmail || "N/A"}</p>
                      </div>
                      <div>
                        <p style={labelStyle}>Company Website</p>
                        <p style={valueStyle}>{job.website ? <a href={job.website} target="_blank" style={{ color: "#1591DC" }}>{job.website}</a> : "N/A"}</p>
                      </div>
                      <div>
                        <p style={labelStyle}>Salary</p>
                        <p style={valueStyle}>{job.salary || "N/A"}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <p style={labelStyle}>Job Description</p>
                      <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, color: "#e2e8f0", fontSize: 14, whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.05)", maxHeight: 300, overflowY: "auto" }}>
                        {job.description || "No description provided."}
                      </div>
                    </div>

                    {job.postImage && (
                      <div style={{ marginBottom: 24 }}>
                        <p style={labelStyle}>Image / PDF Poster</p>
                        {job.postImage.toLowerCase().includes('.pdf') ? (
                          <div style={{ padding: 24, textAlign: "center", background: "rgba(21, 145, 220, 0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                            <a href={job.postImage} target="_blank" rel="noopener noreferrer" style={{ color: "#1591DC", textDecoration: "none", fontWeight: 600 }}>
                              View PDF Document
                            </a>
                          </div>
                        ) : (
                          <img src={job.postImage} alt="Job Poster" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />
                        )}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 12, marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                      <button onClick={() => handleApprove(job.id)} style={{ ...btnActionStyle, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        Approve & Publish
                      </button>
                      <button onClick={() => handleDelete(job.id)} style={{ ...btnActionStyle, color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>
                        Reject / Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const btnActionStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontWeight: 600,
  marginBottom: 4,
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#fff",
};
