"use client";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { slugify } from "@/lib/slugify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean']
  ]
};

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
  website?: string;
  applyEmail?: string;
  createdAt?: number;
  category?: string;
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagsInput, setTagsInput] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [currency, setCurrency] = useState("LKR");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Logo upload error:", error);
          alert("Failed to upload logo.");
          setUploadingLogo(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setEditingJob((prev) => prev ? { ...prev, logo: downloadURL } : prev);
          setUploadingLogo(false);
        }
      );
    } catch (err) {
      console.error("Error initiating upload:", err);
      setUploadingLogo(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "job-vacancies"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Job));
      list.sort((a, b) => {
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeB - timeA;
      });
      setJobs(list);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Failed to fetch jobs: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const seedMockData = async () => {
    if (!confirm("This will load the default mock jobs into your Firestore 'job-vacancies' collection. Continue?")) return;
    setLoading(true);
    try {
      const { mockJobs } = await import("@/data/jobs");
      for (const job of mockJobs) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...jobData } = job;
        await addDoc(collection(db, "job-vacancies"), jobData);
      }
      alert("Successfully seeded jobs!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to seed jobs. Make sure you have created the Cloud Firestore database in your Firebase Console. Error: " + (err as Error).message);
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const jobData = {
      title: editingJob.title || "",
      company: editingJob.company || "",
      location: editingJob.location || "",
      type: editingJob.type || "Full-time",
      salary: `${currency} ${salaryAmount}`.trim(),
      logo: editingJob.logo || "",
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      description: editingJob.description || "",
      postedDate: editingJob.postedDate || new Date().toISOString().split("T")[0],
      urgent: editingJob.urgent || false,
      website: editingJob.website || "",
      applyEmail: editingJob.applyEmail || "",
      category: editingJob.category || "",
      postImage: (editingJob as any).postImage || "",
      createdAt: editingJob.createdAt || Date.now(),
      approved: true,
    };

    setLoading(true);
    try {
      if (editingJob.id) {
        await updateDoc(doc(db, "job-vacancies", editingJob.id), jobData);
      } else {
        await addDoc(collection(db, "job-vacancies"), jobData);
      }

      // Trigger Google Indexing API
      try {
        const jobUrl = `https://dailysjobs.com/job/${slugify(jobData.title)}`;
        const res = await fetch('/api/google-index', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobUrl, type: "URL_UPDATED" })
        });
        const indexData = await res.json();
        console.log("Google Indexing Update:", indexData);
      } catch (indexError) {
        console.error("Failed to trigger google indexing:", indexError);
      }

      setEditingJob(null);
      setTagsInput("");
      await fetchJobs();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job: " + (err as Error).message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    try {
      const jobToDelete = jobs.find(j => j.id === id);
      await deleteDoc(doc(db, "job-vacancies", id));
      
      if (jobToDelete) {
        try {
          const jobUrl = `https://dailysjobs.com/job/${slugify(jobToDelete.title)}`;
          const res = await fetch('/api/google-index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: jobUrl, type: "URL_DELETED" })
          });
          const indexData = await res.json();
          console.log("Google Indexing Delete:", indexData);
        } catch (e) {
          console.error("Index error:", e);
        }
      }

      await fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job: " + (err as Error).message);
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedJobs.length} selected jobs?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedJobs.map(id => deleteDoc(doc(db, "job-vacancies", id))));
      setSelectedJobs([]);
      await fetchJobs();
    } catch (err) {
      console.error("Error bulk deleting jobs:", err);
      alert("Failed to delete selected jobs: " + (err as Error).message);
      setLoading(false);
    }
  };

  const toggleSelectJob = (id: string) => {
    setSelectedJobs(prev => prev.includes(id) ? prev.filter(jId => jId !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === jobs.length && jobs.length > 0) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(j => j.id));
    }
  };

  const startEdit = (job: Job) => {
    setEditingJob(job);
    setTagsInput(job.tags?.join(", ") || "");
    const match = job.salary?.match(/^(LKR|USD)\s*(.*)/);
    if (match) {
      setCurrency(match[1]);
      setSalaryAmount(match[2] || "");
    } else {
      setCurrency("LKR");
      setSalaryAmount(job.salary || "");
    }
  };

  const startAdd = () => {
    setEditingJob({
      title: "", company: "", location: "", type: "Full-time",
      salary: "", logo: "", tags: [], description: "", website: "", applyEmail: "",
      category: "",
      postedDate: new Date().toISOString().split("T")[0],
      postedTime: "Just now", urgent: false,
      createdAt: Date.now(),
    });
    setTagsInput("");
    setCurrency("LKR");
    setSalaryAmount("");
  };

  if (loading) return <div style={{ color: "#a3a3a3", padding: 40 }}>Loading jobs...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>Manage Jobs</h1>
          <span style={{ background: "rgba(21,145,220,0.15)", color: "#1591DC", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
            {jobs.length} Total Jobs
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {selectedJobs.length > 0 && (
            <button onClick={handleBulkDelete} style={{ ...btnStyle, background: "#ef4444" }}>
              Trash Selected ({selectedJobs.length})
            </button>
          )}
          {jobs.length === 0 && (
            <button onClick={seedMockData} style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              🌱 Seed Mock Data
            </button>
          )}
          <button onClick={startAdd} style={btnStyle}>+ Add New Job</button>
        </div>
      </div>

      {editingJob && (
        <form onSubmit={handleSave} style={{ background: "rgba(255,255,255,0.02)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, color: "#fff" }}>{editingJob.id ? "Edit Job" : "Add Job"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <input placeholder="Job Title" required value={editingJob.title || ""} onChange={e => setEditingJob({...editingJob, title: e.target.value})} style={inputStyle} />
            <input placeholder="Company Name" required value={editingJob.company || ""} onChange={e => setEditingJob({...editingJob, company: e.target.value})} style={inputStyle} />
            <input placeholder="Location" required value={editingJob.location || ""} onChange={e => setEditingJob({...editingJob, location: e.target.value})} style={inputStyle} />
            <input type="email" placeholder="Application Receiving Email" required value={editingJob.applyEmail || ""} onChange={e => setEditingJob({...editingJob, applyEmail: e.target.value})} style={inputStyle} />
            <div style={{ display: "flex", gap: 8 }}>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={{...inputStyle, width: "100px"}}>
                <option value="LKR" style={{ background: "#0a0a0a" }}>LKR</option>
                <option value="USD" style={{ background: "#0a0a0a" }}>USD</option>
              </select>
              <select required value={salaryAmount} onChange={e => setSalaryAmount(e.target.value)} style={inputStyle}>
                <option value="" disabled style={{ background: "#0a0a0a" }}>Select Salary Range</option>
                <option value="10,000 - 20,000" style={{ background: "#0a0a0a" }}>10,000 - 20,000</option>
                <option value="20,000 - 35,000" style={{ background: "#0a0a0a" }}>20,000 - 35,000</option>
                <option value="35,000 - 50,000" style={{ background: "#0a0a0a" }}>35,000 - 50,000</option>
                <option value="50,000 - 75,000" style={{ background: "#0a0a0a" }}>50,000 - 75,000</option>
                <option value="75,000 - 100,000" style={{ background: "#0a0a0a" }}>75,000 - 100,000</option>
                <option value="100,000 - 120,000" style={{ background: "#0a0a0a" }}>100,000 - 120,000</option>
                <option value="120,000 - 150,000" style={{ background: "#0a0a0a" }}>120,000 - 150,000</option>
                <option value="150,000 - 175,000" style={{ background: "#0a0a0a" }}>150,000 - 175,000</option>
                <option value="175,000 - 200,000" style={{ background: "#0a0a0a" }}>175,000 - 200,000</option>
                <option value="Negotiable" style={{ background: "#0a0a0a" }}>Negotiable</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select required value={editingJob.type || "Full-time"} onChange={e => setEditingJob({...editingJob, type: e.target.value})} style={inputStyle}>
                <option value="Full-time" style={{ background: "#0a0a0a" }}>Full-time</option>
                <option value="Part-time" style={{ background: "#0a0a0a" }}>Part-time</option>
                <option value="Internship" style={{ background: "#0a0a0a" }}>Internship</option>
                <option value="Remote" style={{ background: "#0a0a0a" }}>Remote</option>
                <option value="Hybrid" style={{ background: "#0a0a0a" }}>Hybrid</option>
                <option value="Onsite" style={{ background: "#0a0a0a" }}>Onsite</option>
              </select>
              <select required value={editingJob.category || ""} onChange={e => setEditingJob({...editingJob, category: e.target.value})} style={inputStyle}>
                <option value="" disabled style={{ background: "#0a0a0a" }}>Select a Category</option>
                <option value="IT Software / Database / QA / Web / Graphics / GIS" style={{ background: "#0a0a0a" }}>IT Software / Database / QA / Web / Graphics / GIS</option>
                <option value="IT Hardware / Networks / Systems" style={{ background: "#0a0a0a" }}>IT Hardware / Networks / Systems</option>
                <option value="Accounting / Auditing / Finance" style={{ background: "#0a0a0a" }}>Accounting / Auditing / Finance</option>
                <option value="Banking / Finance / Insurance" style={{ background: "#0a0a0a" }}>Banking / Finance / Insurance</option>
                <option value="Sales / Marketing / Merchandising" style={{ background: "#0a0a0a" }}>Sales / Marketing / Merchandising</option>
                <option value="Human Resources / Training" style={{ background: "#0a0a0a" }}>Human Resources / Training</option>
                <option value="Corporate Management / Business Analysis" style={{ background: "#0a0a0a" }}>Corporate Management / Business Analysis</option>
                <option value="Office Administration / Secretarial / Reception" style={{ background: "#0a0a0a" }}>Office Administration / Secretarial / Reception</option>
                <option value="Civil Engineering / Interior Design / Architecture" style={{ background: "#0a0a0a" }}>Civil Engineering / Interior Design / Architecture</option>
                <option value="IT Telecommunications" style={{ background: "#0a0a0a" }}>IT Telecommunications</option>
                <option value="Customer Relations / Public Relations" style={{ background: "#0a0a0a" }}>Customer Relations / Public Relations</option>
                <option value="Logistics / Warehouse / Transport" style={{ background: "#0a0a0a" }}>Logistics / Warehouse / Transport</option>
                <option value="Mechanical / Automotive / Electrical Engineering" style={{ background: "#0a0a0a" }}>Mechanical / Automotive / Electrical Engineering</option>
                <option value="Manufacturing / Operations" style={{ background: "#0a0a0a" }}>Manufacturing / Operations</option>
                <option value="Media / Advertising / Communication" style={{ background: "#0a0a0a" }}>Media / Advertising / Communication</option>
                <option value="Hotel / Restaurant / Hospitality" style={{ background: "#0a0a0a" }}>Hotel / Restaurant / Hospitality</option>
                <option value="Travel / Tourism" style={{ background: "#0a0a0a" }}>Travel / Tourism</option>
                <option value="Sports / Fitness / Recreation" style={{ background: "#0a0a0a" }}>Sports / Fitness / Recreation</option>
                <option value="Medical / Nursing / Healthcare" style={{ background: "#0a0a0a" }}>Medical / Nursing / Healthcare</option>
                <option value="Legal / Law" style={{ background: "#0a0a0a" }}>Legal / Law</option>
                <option value="Supervision / Quality Control" style={{ background: "#0a0a0a" }}>Supervision / Quality Control</option>
                <option value="Apparel / Clothing" style={{ background: "#0a0a0a" }}>Apparel / Clothing</option>
                <option value="Ticketing / Airline / Marine" style={{ background: "#0a0a0a" }}>Ticketing / Airline / Marine</option>
                <option value="Education / Teaching" style={{ background: "#0a0a0a" }}>Education / Teaching</option>
                <option value="Research & Development / Science" style={{ background: "#0a0a0a" }}>Research & Development / Science</option>
                <option value="Agriculture / Dairy / Environment" style={{ background: "#0a0a0a" }}>Agriculture / Dairy / Environment</option>
                <option value="Security Services" style={{ background: "#0a0a0a" }}>Security Services</option>
                <option value="Fashion / Design / Beauty" style={{ background: "#0a0a0a" }}>Fashion / Design / Beauty</option>
                <option value="International Development" style={{ background: "#0a0a0a" }}>International Development</option>
                <option value="KPO / BPO" style={{ background: "#0a0a0a" }}>KPO / BPO</option>
                <option value="Imports / Exports" style={{ background: "#0a0a0a" }}>Imports / Exports</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input placeholder="Company Website Link (for Favicon logo)" value={editingJob.website || ""} onChange={e => setEditingJob({...editingJob, website: e.target.value})} style={inputStyle} />
              <input placeholder="Company Logo URL (Optional)" value={editingJob.logo || ""} onChange={e => setEditingJob({...editingJob, logo: e.target.value})} style={inputStyle} />
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{...inputStyle, padding: "8px 12px"}} />
              {uploadingLogo && <span style={{ color: "#1591DC", fontSize: 12 }}>Uploading logo...</span>}
              {editingJob.logo && !editingJob.logo.startsWith("http") && <span style={{ fontSize: 24 }}>{editingJob.logo}</span>}
              {editingJob.logo && editingJob.logo.startsWith("http") && (
                <img src={editingJob.logo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              )}
            </div>
            <input type="date" placeholder="Posted Date" required value={editingJob.postedDate || ""} onChange={e => setEditingJob({...editingJob, postedDate: e.target.value})} style={inputStyle} />
          </div>
          <input placeholder="Tags (comma separated, e.g. React, Node.js, AWS)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} style={inputStyle} />
          
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", color: "#000" }}>
            <ReactQuill theme="snow" modules={quillModules} value={editingJob.description || ""} onChange={(val: string) => setEditingJob({...editingJob, description: val})} style={{ minHeight: 150 }} />
          </div>
          
          <input placeholder="Job Post URL (Image/PDF) (Optional)" value={(editingJob as any).postImage || ""} onChange={e => setEditingJob({...editingJob, postImage: e.target.value} as any)} style={inputStyle} />

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
        {jobs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 12px", marginBottom: 4 }}>
            <input 
              type="checkbox" 
              checked={selectedJobs.length === jobs.length && jobs.length > 0} 
              onChange={toggleSelectAll} 
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ color: "#94a3b8", fontSize: 14 }}>Select All</span>
          </div>
        )}
        {jobs.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No jobs yet. Click &quot;Add New Job&quot; to create one.</p>}
        {jobs.map((job) => (
          <div key={job.id} style={{ background: selectedJobs.includes(job.id) ? "rgba(21,145,220,0.05)" : "rgba(255,255,255,0.02)", padding: "16px 24px", borderRadius: 12, border: selectedJobs.includes(job.id) ? "1px solid rgba(21,145,220,0.3)" : "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <input 
                type="checkbox" 
                checked={selectedJobs.includes(job.id)} 
                onChange={() => toggleSelectJob(job.id)}
                style={{ width: 18, height: 18, cursor: "pointer", flexShrink: 0 }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {job.logo && job.logo.startsWith("http") ? (
                    <img src={job.logo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>{job.logo}</span>
                  )}
                  <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{job.title}</h3>
                  {job.urgent && <span style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>URGENT</span>}
                </div>
                <p style={{ color: "#a3a3a3", fontSize: 14 }}>{job.company} • {job.location} • {job.type}</p>
              </div>
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
