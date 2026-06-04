"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postImage: "",
    category: "",
    location: "",
    type: "Full-time",
    company: "",
    website: "",
    applyEmail: "",
    salary: "",
    tags: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      await addDoc(collection(db, "job-vacancies"), {
        ...formData,
        tags: tagsArray,
        postedDate: new Date().toISOString().split("T")[0],
        postedTime: "Just now",
        createdAt: Date.now(),
        approved: false, // Must be approved by admin
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting job:", error);
      alert("Failed to submit job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (content: string) => {
    setFormData({ ...formData, description: content });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000" }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: "100px 24px 60px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16, textAlign: "center" }}>
          Post a Job Vacancy
        </h1>
        <p style={{ color: "#a3a3a3", textAlign: "center", marginBottom: 40 }}>
          Reach thousands of job seekers across Sri Lanka. Fill out the details below.
        </p>

        {submitted ? (
          <div style={{ background: "rgba(21,145,220,0.1)", border: "1px solid rgba(21,145,220,0.3)", padding: 40, borderRadius: 16, textAlign: "center" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>✅</span>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Submitted Successfully!</h2>
            <p style={{ color: "#a3a3a3", fontSize: 16, marginBottom: 24 }}>
              Your job has been submitted and is currently in <strong>Preview</strong>. Our team will review and publish it shortly.
            </p>
            <button
              onClick={() => {
                setFormData({ title: "", description: "", postImage: "", category: "", location: "", type: "Full-time", company: "", website: "", applyEmail: "", salary: "", tags: "" });
                setSubmitted(false);
              }}
              style={btnStyle}
            >
              Post Another Job
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 32, borderRadius: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>Job Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Senior Software Engineer" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>Company Name *</label>
              <input required name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="e.g. Creative Software" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Location (City) *</label>
                <select required name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
                  <option value="" disabled style={{ background: "#0a0a0a" }}>Select City</option>
                  <option value="Colombo" style={{ background: "#0a0a0a" }}>Colombo</option>
                  <option value="Kandy" style={{ background: "#0a0a0a" }}>Kandy</option>
                  <option value="Galle" style={{ background: "#0a0a0a" }}>Galle</option>
                  <option value="Negombo" style={{ background: "#0a0a0a" }}>Negombo</option>
                  <option value="Jaffna" style={{ background: "#0a0a0a" }}>Jaffna</option>
                  <option value="Gampaha" style={{ background: "#0a0a0a" }}>Gampaha</option>
                  <option value="Kurunegala" style={{ background: "#0a0a0a" }}>Kurunegala</option>
                  <option value="Remote" style={{ background: "#0a0a0a" }}>Remote</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Work Type *</label>
                <select required name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                  <option value="Full-time" style={{ background: "#0a0a0a" }}>Full-time</option>
                  <option value="Part-time" style={{ background: "#0a0a0a" }}>Part-time</option>
                  <option value="Internship" style={{ background: "#0a0a0a" }}>Internship</option>
                  <option value="Remote" style={{ background: "#0a0a0a" }}>Remote</option>
                  <option value="Freelancer" style={{ background: "#0a0a0a" }}>Freelancer</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Category *</label>
                <select required name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                  <option value="" disabled style={{ background: "#0a0a0a" }}>Select Category</option>
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
                <label style={labelStyle}>Contact Email *</label>
                <input type="email" required name="applyEmail" value={formData.applyEmail} onChange={handleChange} style={inputStyle} placeholder="For receiving applications" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Salary</label>
                <select name="salary" value={formData.salary} onChange={handleChange} style={inputStyle}>
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
                <label style={labelStyle}>Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} style={inputStyle} placeholder="Comma separated (e.g. React, Node.js)" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>Company Website (Optional)</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https://..." />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>Job Poster Link (Image/PDF URL) (Optional)</label>
              <input type="url" name="postImage" value={formData.postImage} onChange={handleChange} style={inputStyle} placeholder="https://..." />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>Job Description *</label>
              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", color: "#000" }}>
                <ReactQuill theme="snow" modules={quillModules} value={formData.description} onChange={handleDescriptionChange} style={{ minHeight: 150 }} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !formData.description.trim() || formData.description === '<p><br></p>'} style={{ ...btnStyle, opacity: (isSubmitting || !formData.description.trim() || formData.description === '<p><br></p>') ? 0.7 : 1, marginTop: 10 }}>
              {isSubmitting ? "Submitting..." : "Submit Job for Review"}
            </button>
          </form>
        )}
      </main>

      <Footer />
      <BottomNavbar />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  color: "#e2e8f0",
  fontSize: 14,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "12px 16px",
  borderRadius: 8,
  color: "#fff",
  outline: "none",
  fontSize: 15,
  width: "100%",
  fontFamily: "inherit",
};

const btnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1591DC, #0d74b5)",
  color: "#fff",
  padding: "14px 24px",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  transition: "all 0.2s",
  boxShadow: "0 4px 15px rgba(21, 145, 220, 0.4)",
};
