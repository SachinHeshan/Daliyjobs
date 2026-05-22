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
              background: "rgba(13, 13, 13, 0.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(21, 145, 220, 0.2)",
              borderRadius: 24,
              width: "100%",
              maxWidth: 820,
              maxHeight: "88vh",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant Header with Logo & Close Button */}
            <div
              className="job-modal-header-premium"
              style={{
                padding: "32px 32px 24px 32px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", gap: 20, alignItems: "center", flex: 1 }}>
                {/* Logo */}
                <div
                  className="job-modal-logo-premium"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(21, 145, 220, 0.2), rgba(255, 255, 255, 0.05))",
                    border: "1px solid rgba(21, 145, 220, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fff",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {selectedJob.logo && (selectedJob.logo.startsWith("http") || selectedJob.logo.startsWith("/")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedJob.logo} alt={selectedJob.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : selectedJob.website ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://www.google.com/s2/favicons?domain=${selectedJob.website}&sz=128`} alt={selectedJob.company} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10, background: "#fff", borderRadius: 16 }} />
                  ) : (
                    selectedJob.company.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Title and Company */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>{selectedJob.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {selectedJob.website ? (
                      <a
                        href={selectedJob.website.startsWith('http') ? selectedJob.website : `https://${selectedJob.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="job-modal-company-link-premium"
                        style={{ fontSize: 15, color: "#1591DC", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                        title={`Visit ${selectedJob.company} website`}
                      >
                        {selectedJob.company} <span style={{ fontSize: "0.8em" }}>↗</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: 15, color: "#1591DC", fontWeight: 700 }}>{selectedJob.company}</span>
                    )}

                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {selectedJob.urgent && (
                        <span style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, letterSpacing: 0.5 }}>
                          URGENT
                        </span>
                      )}
                      <span style={{ background: "rgba(21, 145, 220, 0.12)", border: "1px solid rgba(21, 145, 220, 0.25)", color: "#1591DC", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 50 }}>
                        {selectedJob.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setShowApplyForm(false);
                  setSubmitSuccess(false);
                }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                className="job-modal-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Quick Facts Grid Bar */}
            <div 
              className="job-modal-facts-bar"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                padding: "20px 32px",
                background: "rgba(255, 255, 255, 0.01)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(21, 145, 220, 0.1)", display: "flex", alignItems: "center", justify: "center", flexShrink: 0, padding: 10 }}>
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#1591DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>LOCATION</span>
                  <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{selectedJob.location}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justify: "center", flexShrink: 0, padding: 10 }}>
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>SALARY RANGE</span>
                  <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{selectedJob.salary}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justify: "center", flexShrink: 0, padding: 10 }}>
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>POSTED DATE</span>
                  <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{selectedJob.postedDate}</span>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="job-modal-body-premium" style={{ padding: 32 }}>
              
              {/* Required Skills (Tags) */}
              <div>
                <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>REQUIRED SKILLS</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedJob.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
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

              {/* Job Description */}
              <div style={{ marginTop: 28 }}>
                <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>JOB DESCRIPTION</span>

                <div className="job-description-content" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                
                <p style={{ color: "#22c55e", fontSize: 13.5, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
                  💡 It would be better if you apply using your own email address.
                </p>

                {/* Optional Post Image */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(selectedJob as any).postImage && (
                  <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }} className="job-modal-post-img-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={(selectedJob as any).postImage} alt="Job Post Details" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                )}
              </div>

              {/* Application Form Block */}
              {showApplyForm && (
                <div className="job-modal-form-section" style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {submitSuccess ? (
                    <div style={{ padding: 32, background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 20, textAlign: "center" }}>
                      <span style={{ fontSize: 44, display: "block", marginBottom: 12 }}>✅</span>
                      <h4 style={{ color: "#22c55e", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>Application Submitted Successfully!</h4>
                      <p style={{ color: "#a3a3a3", fontSize: 14.5, marginBottom: 20 }}>Your candidates details have been delivered directly to the employer.</p>
                      <button onClick={() => { setShowApplyForm(false); setSubmitSuccess(false); setSelectedJob(null); }} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer", width: "100%", transition: "all 0.2s" }} className="form-action-btn">Close Details</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 2 }}>Apply for this position</h4>

                      <div className="job-modal-form-grid-premium" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <input type="text" placeholder="Full Name" required value={applicantName} onChange={e => setApplicantName(e.target.value)} style={{ ...filterInputStyle, fontSize: 16 }} />
                        <input type="email" placeholder="Email Address" required value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} style={{ ...filterInputStyle, fontSize: 16 }} />
                      </div>

                      <input type="tel" placeholder="Phone Number" required value={applicantPhone} onChange={e => setApplicantPhone(e.target.value)} style={{ ...filterInputStyle, fontSize: 16 }} />

                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 600 }}>Upload CV (PDF/DOCX) *</label>
                        <input type="file" accept=".pdf,.doc,.docx" required onChange={e => setApplicantCV(e.target.files?.[0] || null)} style={{ ...filterInputStyle, padding: "12px", fontSize: 14 }} />
                      </div>

                      <textarea placeholder="Cover Letter (Optional)" value={applicantCoverLetter} onChange={e => setApplicantCoverLetter(e.target.value)} style={{ ...filterInputStyle, minHeight: 110, resize: "vertical", fontSize: 16 }} />

                      <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#a3a3a3", fontSize: 13.5, cursor: "pointer", userSelect: "none" }}>
                        <input type="checkbox" checked={emailCopy} onChange={e => setEmailCopy(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                        Email me a copy of my job application (optional)
                      </label>

                      <div className="job-modal-buttons-premium" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                        <button type="button" onClick={() => setShowApplyForm(false)} disabled={isSubmitting} style={{ background: "rgba(255,255,255,0.04)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }} className="form-cancel-btn">
                          Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }} className="form-submit-btn">
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Static CTA Bar (PC and Mobile standard layout when form not visible) */}
              {!showApplyForm && !submitSuccess && (
                <div 
                  className="job-modal-actions-bar"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    marginTop: 32,
                    paddingTop: 24,
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "12px 24px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    className="job-modal-standard-close"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(true)}
                    className="job-modal-action-apply-btn"
                    style={{
                      background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 36px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(21, 145, 220, 0.3)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>

            {/* Mobile-Only Sticky Apply Bar (Peaks at mobile UX!) */}
            {!showApplyForm && !submitSuccess && (
              <div className="job-modal-mobile-sticky-bar">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(true)}
                  style={{
                    background: "linear-gradient(135deg, #1591DC, #0d74b5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 24px",
                    fontWeight: 700,
                    width: "100%",
                    fontSize: 15,
                    boxShadow: "0 4px 20px rgba(21, 145, 220, 0.4)",
                  }}
                >
                  Apply Now
                </button>
              </div>
            )}

          </div>
          <style>{`
            .job-modal-close-btn:hover {
              background: rgba(255,255,255,0.08) !important;
              color: #fff !important;
              transform: rotate(90deg);
            }
            .job-modal-company-link-premium:hover {
              text-decoration: underline !important;
            }
            .job-modal-action-apply-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(21, 145, 220, 0.5) !important;
            }
            .job-modal-standard-close:hover {
              background: rgba(255,255,255,0.08) !important;
            }
            .job-description-content {
              text-align: left !important;
              word-break: normal !important;
              overflow-wrap: break-word !important;
              width: 100%;
              line-height: 1.6 !important;
              color: #a3a3a3;
              font-size: 15px;
            }
            .job-description-content * {
              max-width: 100%;
            }
            .job-description-content p {
              margin-top: 0 !important;
              margin-bottom: 1em !important;
              text-align: left !important;
              line-height: 1.6 !important;
            }
            .job-description-content ul {
              list-style-type: disc !important;
              margin-top: 0.5em !important;
              margin-bottom: 1em !important;
              padding-left: 24px !important;
              display: block !important;
            }
            .job-description-content ol {
              list-style-type: decimal !important;
              margin-top: 0.5em !important;
              margin-bottom: 1em !important;
              padding-left: 24px !important;
              display: block !important;
            }
            .job-description-content li {
              margin-bottom: 0.5em !important;
              display: list-item !important;
              list-style: inherit !important;
              text-align: left !important;
              line-height: 1.6 !important;
            }
            .job-description-content h1, 
            .job-description-content h2, 
            .job-description-content h3, 
            .job-description-content h4 {
              color: #fff !important;
              font-weight: 700 !important;
              margin-top: 1.8em !important;
              margin-bottom: 0.8em !important;
              text-align: left !important;
              display: block !important;
            }
            .job-description-content h1 { font-size: 1.7em !important; }
            .job-description-content h2 { font-size: 1.4em !important; }
            .job-description-content h3 { font-size: 1.25em !important; }
            .job-description-content h4 { font-size: 1.1em !important; }
            
            .job-description-content p strong {
              color: #fff !important;
              font-weight: 700 !important;
              display: inline-block;
              margin-top: 0.8em !important;
            }
            .job-description-content br {
              display: inline !important;
            }
            .job-modal-mobile-sticky-bar {
              display: none;
            }
            @media (max-width: 768px) {
              .job-modal-facts-bar {
                grid-template-columns: 1fr !important;
                gap: 14px !important;
                padding: 16px 24px !important;
              }
              .job-modal-header-premium {
                padding: 24px 24px 16px 24px !important;
              }
              .job-modal-body-premium {
                padding: 24px 24px 80px 24px !important; /* Extra bottom padding for sticky bar */
              }
              .job-modal-mobile-sticky-bar {
                display: block;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(13, 13, 13, 0.9);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(255,255,255,0.06);
                padding: 12px 24px;
                z-index: 100;
              }
              .job-modal-actions-bar {
                display: none !important; /* Hide standard buttons in favor of sticky footer */
              }
              .job-modal-form-grid-premium {
                grid-template-columns: 1fr !important;
              }
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
