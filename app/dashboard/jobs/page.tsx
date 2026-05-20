"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedTime: string;
  postedDate: string;
  type: string;
  salary: string;
  logo: string;
  tags: string[];
  description: string;
  urgent?: boolean;
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagsInput, setTagsInput] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "jobs"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    setJobs(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const jobData = {
      title: editingJob.title || "",
      company: editingJob.company || "",
      location: editingJob.location || "",
      type: editingJob.type || "Full-time",
      salary: editingJob.salary || "",
      logo: editingJob.logo || "💼",
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      description: editingJob.description || "",
      postedDate: editingJob.postedDate || new Date().toISOString().split("T")[0],
      postedTime: editingJob.postedTime || "Just now",
      urgent: editingJob.urgent || false,
    };

    if (editingJob.id) {
      await updateDoc(doc(db, "jobs", editingJob.id), jobData);
    } else {
      await addDoc(collection(db, "jobs"), jobData);
    }

    setEditingJob(null);
    setTagsInput("");
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await deleteDoc(doc(db, "jobs", id));
    fetchJobs();
  };

  const startEdit = (job: Job) => {
    setEditingJob(job);
    setTagsInput(job.tags?.join(", ") || "");
  };

  const startAdd = () => {
    setEditingJob({
      title: "", company: "", location: "", type: "Full-time",
      salary: "", logo: "💼", tags: [], description: "",
      postedDate: new Date().toISOString().split("T")[0],
      postedTime: "Just now", urgent: false,
    });
    setTagsInput("");
  };

  if (loading) return <div style={{ color: "#a3a3a3", padding: 40 }}>Loading jobs...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>Manage Jobs</h1>
        <button onClick={startAdd} style={btnStyle}>+ Add New Job</button>
      </div>

      {editingJob && (
        <form onSubmit={handleSave} style={{ background: "rgba(255,255,255,0.02)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, color: "#fff" }}>{editingJob.id ? "Edit Job" : "Add Job"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <input placeholder="Job Title" required value={editingJob.title || ""} onChange={e => setEditingJob({...editingJob, title: e.target.value})} style={inputStyle} />
            <input placeholder="Company" required value={editingJob.company || ""} onChange={e => setEditingJob({...editingJob, company: e.target.value})} style={inputStyle} />
            <input placeholder="Location" required value={editingJob.location || ""} onChange={e => setEditingJob({...editingJob, location: e.target.value})} style={inputStyle} />
            <input placeholder="Salary" required value={editingJob.salary || ""} onChange={e => setEditingJob({...editingJob, salary: e.target.value})} style={inputStyle} />
            <input placeholder="Type (e.g. Full-time)" required value={editingJob.type || ""} onChange={e => setEditingJob({...editingJob, type: e.target.value})} style={inputStyle} />
            <input placeholder="Logo Emoji" required value={editingJob.logo || ""} onChange={e => setEditingJob({...editingJob, logo: e.target.value})} style={inputStyle} />
          </div>
          <input placeholder="Tags (comma separated, e.g. React, Node.js, AWS)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} style={inputStyle} />
          <textarea placeholder="Description" required value={editingJob.description || ""} onChange={e => setEditingJob({...editingJob, description: e.target.value})} style={{ ...inputStyle, minHeight: 100 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#a3a3a3", fontSize: 14 }}>
            <input type="checkbox" checked={editingJob.urgent || false} onChange={e => setEditingJob({...editingJob, urgent: e.target.checked})} />
            Mark as Urgent
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" style={btnStyle}>Save Job</button>
            <button type="button" onClick={() => { setEditingJob(null); setTagsInput(""); }} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", color: "#fff" }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {jobs.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No jobs yet. Click &quot;Add New Job&quot; to create one.</p>}
        {jobs.map((job) => (
          <div key={job.id} style={{ background: "rgba(255,255,255,0.02)", padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{job.logo}</span>
                <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{job.title}</h3>
                {job.urgent && <span style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>URGENT</span>}
              </div>
              <p style={{ color: "#a3a3a3", fontSize: 14 }}>{job.company} • {job.location} • {job.type}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(job)} style={{ ...btnActionStyle, color: "#1591DC", background: "rgba(21,145,220,0.1)" }}>Edit</button>
              <button onClick={() => handleDelete(job.id)} style={{ ...btnActionStyle, color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "12px 16px",
  borderRadius: 8,
  color: "#fff",
  outline: "none",
  fontSize: 14,
  width: "100%",
};

const btnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1591DC, #0d74b5)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const btnActionStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 13,
};
