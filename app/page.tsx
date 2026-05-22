"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import JobCard from "@/components/JobCard";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import { Job, mockJobs as fallbackJobs } from "@/data/jobs";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantCV, setApplicantCV] = useState<File | null>(null);
  const [applicantCoverLetter, setApplicantCoverLetter] = useState("");
  const [emailCopy, setEmailCopy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch banners from Firestore
        const bannersSnap = await getDocs(collection(db, "banners"));
        if (!bannersSnap.empty) {
          const list = bannersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setBanners(list);
        }

        // Fetch jobs from Firestore
        const snap = await getDocs(collection(db, "job-vacancies"));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Job));
          setJobs(list);
        } else {
          // Only use mock data as last resort fallback
          setJobs(fallbackJobs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data on error
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedType]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !applicantCV) return;

    setIsSubmitting(true);

    // Simulate network request delay to just show the success message
    setTimeout(() => {
      setSubmitSuccess(true);

      // Reset form fields
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
      setApplicantCV(null);
      setApplicantCoverLetter("");
      setEmailCopy(false);

      setIsSubmitting(false);
    }, 800);
  };

  // Get unique locations for dropdown filter
  const locations = useMemo(() => {
    const locs = jobs.map((j) => {
      // Clean up common variations or display names
      if (j.location.toLowerCase().includes("remote")) return "Remote";
      if (j.location.toLowerCase().includes("colombo")) return "Colombo";
      if (j.location.toLowerCase().includes("kandy")) return "Kandy";
      if (j.location.toLowerCase().includes("galle")) return "Galle";
      if (j.location.toLowerCase().includes("negombo")) return "Negombo";
      if (j.location.toLowerCase().includes("jaffna")) return "Jaffna";
      if (j.location.toLowerCase().includes("gampaha")) return "Gampaha";
      return j.location;
    });
    return ["All Locations", ...Array.from(new Set(locs))];
  }, [jobs]);

  // Filter jobs based on search terms, location, and type
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchLocation =
        !selectedLocation ||
        selectedLocation === "All Locations" ||
        (selectedLocation === "Remote" && job.location.toLowerCase().includes("remote")) ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchType =
        selectedType === "All" ||
        (selectedType === "Remote" && job.location.toLowerCase().includes("remote")) ||
        job.type === selectedType;

      return matchSearch && matchLocation && matchType;
    });
  }, [searchQuery, selectedLocation, selectedType, jobs]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div suppressHydrationWarning style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      {/* Google Jobs Structured Schema Generator for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jobs.map((job) => ({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": job.title,
              "description": job.description,
              "datePosted": job.postedDate,
              "validThrough": "2026-12-31",
              "employmentType": job.type.toUpperCase() === "FULL-TIME" ? "FULL_TIME" : "PART_TIME",
              "hiringOrganization": {
                "@type": "Organization",
                "name": job.company,
                "sameAs": "https://www.dailyjobs.com",
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": job.location.includes("Remote") ? "Remote" : job.location,
                  "addressRegion": job.location.includes("Remote") ? "Remote" : "",
                  "addressCountry": "LK",
                },
              },
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "LKR",
                "value": {
                  "@type": "QuantitativeValue",
                  "value": job.salary,
                  "unitText": "MONTH",
                },
              },
            }))
          ),
        }}
      />

      {/* Main Header & Nav */}
      <Navbar />

      {/* Banner Section */}
      <Banner banners={banners} />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "60px 24px" }} id="jobs">

        {/* Title and Direct Apply Badge */}
        <div style={{ textAlign: "center", marginBottom: 40 }} className="animate-fadeinup">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(21,145,220,0.1)", border: "1px solid rgba(21,145,220,0.3)", borderRadius: 50, padding: "6px 16px", color: "#1591DC", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            <span>🇱🇰</span>
            <span>Sri Lanka&apos;s Direct Job Portal</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-0.5px" }}>
            Explore Sri Lankan Job Vacancies
          </h2>
          <p style={{ color: "#a3a3a3", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
            Direct connections to local recruiters. Find your next full-time position, hybrid role, or internship in seconds.
          </p>
        </div>

        {/* Dynamic Filters Bar */}
        <section
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(21, 145, 220, 0.2)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
          className="glass"
        >
          {/* Top row: search input and select filters */}
          <div className="filter-top-row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {/* Search inputs */}
            <div className="filter-input-wrap" style={{ flex: 2, minWidth: 280, position: "relative" }}>
              <input
                type="text"
                placeholder="Search job title, skills, tags, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...filterInputStyle, paddingRight: 40 }}
              />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>🔍</span>
            </div>

            {/* Location selector */}
            <div className="filter-select-wrap" style={{ flex: 1, minWidth: 180 }}>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={filterSelectStyle}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc === "All Locations" ? "" : loc} style={{ background: "#0a0a0a" }}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: category pills */}
          <div className="filter-pills-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginRight: 8 }}>Filter by Job Type:</span>
            {["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  borderRadius: 50,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  background: selectedType === type
                    ? "linear-gradient(135deg, #1591DC, #0d74b5)"
                    : "rgba(255, 255, 255, 0.05)",
                  color: selectedType === type ? "#fff" : "#a3a3a3",
                  boxShadow: selectedType === type ? "0 4px 15px rgba(21, 145, 220, 0.4)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== type) {
                    (e.target as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.1)";
                    (e.target as HTMLButtonElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== type) {
                    (e.target as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.05)";
                    (e.target as HTMLButtonElement).style.color = "#94a3b8";
                  }
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Jobs Grid Listing */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minHeight: 300,
          }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, display: "flex", gap: 16, alignItems: "center", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
                <div style={{ width: 88, height: 88, borderRadius: 16, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ height: 20, width: "55%", borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ height: 14, width: "35%", borderRadius: 8, background: "rgba(255,255,255,0.04)" }} />
                  <div style={{ height: 12, width: "65%", borderRadius: 8, background: "rgba(255,255,255,0.03)" }} />
                </div>
              </div>
            ))
          ) : currentJobs.length > 0 ? (
            currentJobs.map((job) => <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />)
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 24px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: 20,
                border: "1px dashed rgba(255, 255, 255, 0.08)",
              }}
            >
              <span style={{ fontSize: 48, marginBottom: 16 }}>🔍</span>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No matching vacancies found</h3>
              <p style={{ color: "#64748b", maxWidth: 400 }}>
                Try adjusting your search criteria, choosing a different location, or clearing filters to see more results.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                  setSelectedType("All");
                }}
                style={{
                  marginTop: 20,
                  background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(21, 145, 220, 0.3)",
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: currentPage === page ? "linear-gradient(135deg, #1591DC, #0d74b5)" : "rgba(255,255,255,0.05)",
                  color: currentPage === page ? "#fff" : "#a3a3a3",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {page}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#a3a3a3",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                Next »
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Mobile Sticky Navigation */}
      <BottomNavbar />

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => {
            setSelectedJob(null);
            setShowApplyForm(false);
            setSubmitSuccess(false);
          }}
        >
          <div
            className="job-modal-container"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(21, 145, 220, 0.3)",
              borderRadius: 24,
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "0 25px 50px -12px rgba(21, 145, 220, 0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div
              className="job-modal-header"
              style={{
                height: 120,
                background: "linear-gradient(135deg, rgba(21, 145, 220, 0.2) 0%, rgba(0,0,0,0) 100%)",
                position: "relative",
                padding: "24px 32px",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setShowApplyForm(false);
                  setSubmitSuccess(false);
                }}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a3a3a3",
                  fontSize: 18,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ✕
              </button>

              {/* Logo Badge */}
              <div
                className="job-modal-logo"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(21, 145, 220, 0.4), rgba(255, 255, 255, 0.15))",
                  border: "1px solid rgba(21, 145, 220, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#fff",
                  position: "absolute",
                  bottom: -24,
                  left: 32,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                }}
              >
                {selectedJob.logo && (selectedJob.logo.startsWith("http") || selectedJob.logo.startsWith("/")) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedJob.logo} alt={selectedJob.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : selectedJob.website ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://www.google.com/s2/favicons?domain=${selectedJob.website}&sz=128`} alt={selectedJob.company} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12, background: "#fff", borderRadius: 16 }} />
                ) : (
                  selectedJob.company.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="job-modal-body" style={{ padding: "48px 32px 32px 32px" }}>
              {/* Job Title and Badges */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{selectedJob.title}</h3>
                  {selectedJob.website ? (
                    <a
                      href={selectedJob.website.startsWith('http') ? selectedJob.website : `https://${selectedJob.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="job-modal-company-link"
                      style={{ fontSize: 16, color: "#1591DC", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                      title={`Visit ${selectedJob.company} website`}
                    >
                      {selectedJob.company} <span style={{ fontSize: "0.8em" }}>↗</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: 16, color: "#1591DC", fontWeight: 700 }}>{selectedJob.company}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {selectedJob.urgent && (
                    <span style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, letterSpacing: 0.5 }}>
                      URGENT
                    </span>
                  )}
                  <span style={{ background: "rgba(21, 145, 220, 0.15)", border: "1px solid rgba(21, 145, 220, 0.3)", color: "#1591DC", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 50 }}>
                    {selectedJob.type}
                  </span>
                </div>
              </div>

              {/* Job Metadata Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 24, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>📍 LOCATION</span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{selectedJob.location}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>💰 SALARY RANGE</span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{selectedJob.salary}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>⏰ POSTED DATE</span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{selectedJob.postedDate}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginTop: 24 }}>
                <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>REQUIRED SKILLS</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedJob.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#94a3b8",
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "6px 14px",
                        borderRadius: 50,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Description and Optional Post Image */}
              <div style={{ marginTop: 28 }}>
                <span style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>JOB DESCRIPTION</span>

                {/* Description content */}
                <div style={{ color: "#a3a3a3", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                <p style={{ color: "#22c55e", fontSize: 14, fontWeight: 600, marginTop: -10, marginBottom: 20 }}>
                  It would be better if you apply using your own email address.
                </p>

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(selectedJob as any).postImage && (
                  <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={(selectedJob as any).postImage} alt="Job Post" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                )}
              </div>

              {/* Call to Action Footer / Application Form */}
              {submitSuccess ? (
                <div style={{ marginTop: 32, padding: 24, background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: 16, textAlign: "center" }}>
                  <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>✅</span>
                  <h4 style={{ color: "#22c55e", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Application Submitted Successfully!</h4>
                  <p style={{ color: "#a3a3a3", fontSize: 15, marginBottom: 24 }}>Your application has been successfully sent to the employer.</p>
                  <button onClick={() => { setShowApplyForm(false); setSubmitSuccess(false); setSelectedJob(null); }} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer", width: "100%" }}>Close</button>
                </div>
              ) : showApplyForm ? (
                <form onSubmit={handleApply} style={{ marginTop: 32, paddingTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Apply for this position</h4>

                  <div className="job-modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <input type="text" placeholder="Full Name" required value={applicantName} onChange={e => setApplicantName(e.target.value)} style={filterInputStyle} />
                    <input type="email" placeholder="Email Address" required value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} style={filterInputStyle} />
                  </div>

                  <input type="tel" placeholder="Phone Number" required value={applicantPhone} onChange={e => setApplicantPhone(e.target.value)} style={filterInputStyle} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 14, color: "#a3a3a3", fontWeight: 500 }}>Upload CV (PDF/DOCX) *</label>
                    <input type="file" accept=".pdf,.doc,.docx" required onChange={e => setApplicantCV(e.target.files?.[0] || null)} style={{ ...filterInputStyle, padding: "10px" }} />
                  </div>

                  <textarea placeholder="Cover Letter (Optional)" value={applicantCoverLetter} onChange={e => setApplicantCoverLetter(e.target.value)} style={{ ...filterInputStyle, minHeight: 100, resize: "vertical" }} />

                  <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#a3a3a3", fontSize: 14, cursor: "pointer" }}>
                    <input type="checkbox" checked={emailCopy} onChange={e => setEmailCopy(e.target.checked)} />
                    Email me a copy of my job application (optional)
                  </label>

                  <div className="job-modal-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                    <button type="button" onClick={() => setShowApplyForm(false)} disabled={isSubmitting} style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="job-modal-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32, paddingTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      setShowApplyForm(false);
                      setSubmitSuccess(false);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 24px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(true)}
                    style={{
                      background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 32px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(21, 145, 220, 0.4)",
                    }}
                  >
                    Apply to Job
                  </button>
                </div>
              )}
            </div>
          </div>
          <style>{`
            .job-description-content {
              text-align: justify !important;
              text-justify: inter-word;
              word-break: break-word;
              width: 100%;
            }
            .job-description-content * {
              text-align: justify !important;
              max-width: 100%;
              white-space: normal !important;
            }
            .job-description-content p, 
            .job-description-content div, 
            .job-description-content span {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .job-description-content p {
              margin-top: 0;
              margin-bottom: 12px;
            }
            .job-description-content ul, .job-description-content ol {
              margin-top: 0;
              margin-bottom: 12px;
              padding-left: 20px !important;
              margin-left: 0 !important;
            }
            .job-description-content h1, .job-description-content h2, .job-description-content h3, .job-description-content h4 {
              margin-top: 16px;
              margin-bottom: 8px;
              color: #e2e8f0;
              text-align: left !important;
            }
            .job-modal-company-link:hover {
              text-decoration: underline !important;
            }
            @media (max-width: 600px) {
              .filter-top-row { flex-direction: column; }
              .filter-input-wrap, .filter-select-wrap { min-width: 100% !important; }
              
              .job-modal-container {
                border-radius: 16px !important;
              }
              .job-modal-header {
                padding: 16px !important;
                height: 100px !important;
              }
              .job-modal-logo {
                left: 16px !important;
                width: 56px !important;
                height: 56px !important;
                bottom: -20px !important;
                font-size: 24px !important;
              }
              .job-modal-body {
                padding: 36px 16px 20px 16px !important;
              }
              .job-modal-form-grid {
                grid-template-columns: 1fr !important;
              }
              .job-modal-buttons {
                flex-direction: column;
                width: 100%;
              }
              .job-modal-buttons button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

// Inline styles for cleaner layout compatibility
const filterInputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  padding: "14px 20px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  transition: "all 0.2s ease",
};

const filterSelectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  padding: "14px 20px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
