"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import JobCard from "@/components/JobCard";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Job, mockJobs as fallbackJobs } from "@/data/jobs";
export default function HomeContent({ categorySlug, locationSlug, typeSlug }: { categorySlug?: string, locationSlug?: string, typeSlug?: string }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [banners, setBanners] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedType, selectedCategory]);

  useEffect(() => {
    if (typeSlug) {
      setSelectedType(typeSlug);
    } else {
      setSelectedType("All");
    }
  }, [typeSlug]);

  // Extract unique categories from jobs
  const categories = useMemo(() => {
    const cats = jobs.map(j => j.category).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [jobs]);

  useEffect(() => {
    if (categorySlug && categories.length > 1) {
      const matched = categories.find(c => slugify(c) === categorySlug || `${slugify(c)}-jobs` === categorySlug);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (matched) {
        setSelectedCategory(matched);
      } else {
        setSelectedCategory("All");
      }
    } else {
      setSelectedCategory("All");
    }
  }, [categorySlug, categories]);

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

  useEffect(() => {
    if (locationSlug && locations.length > 1) {
      const matched = locations.find(l => slugify(l) === locationSlug || l.toLowerCase() === locationSlug.replace(/-/g, ' ').toLowerCase());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (matched) {
        setSelectedLocation(matched);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedLocation(locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1).replace(/-/g, ' '));
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedLocation(locationSlug ? locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1).replace(/-/g, ' ') : "");
    }
  }, [locationSlug, locations]);

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

      const matchCategory =
        selectedCategory === "All" ||
        job.category === selectedCategory;

      return matchSearch && matchLocation && matchType && matchCategory;
    }).sort((a, b) => {
      // Primary sort: Exact creation time (if available) or Date (Newest first)
      const timeA = a.createdAt || new Date(a.postedDate || 0).getTime();
      const timeB = b.createdAt || new Date(b.postedDate || 0).getTime();

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      // Secondary sort: Urgent jobs at the top for that specific day
      const urgentA = a.urgent ? 1 : 0;
      const urgentB = b.urgent ? 1 : 0;
      return urgentB - urgentA;
    });
  }, [searchQuery, selectedLocation, selectedType, selectedCategory, jobs]);

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
                "sameAs": "https://dailysjobs.com",
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
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-0.5px" }}>
            Explore Sri Lankan Job Vacancies
          </h1>
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
                placeholder={isMobile ? "Search job title..." : "Search job title, skills, tags, or company..."}
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
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val || val === "All Locations") {
                    router.push("/", { scroll: false });
                  } else {
                    router.push(`/jobs-in-${slugify(val)}`, { scroll: false });
                  }
                }}
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

          {/* Job Category Selector Row */}
          <div className="filter-category-row" style={{ display: "flex", gap: 16, width: "100%" }}>
            <div className="filter-select-wrap" style={{ flex: 1 }}>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val || val === "All") {
                    router.push("/", { scroll: false });
                  } else {
                    router.push(`/job-category/${slugify(val)}-jobs`, { scroll: false });
                  }
                }}
                style={filterSelectStyle}
              >
                <option value="All" style={{ background: "#0a0a0a" }}>All Categories</option>
                {categories.filter(c => c !== "All").map((cat) => (
                  <option key={cat} value={cat} style={{ background: "#0a0a0a" }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Job Type Filter (Select on Mobile, Pills on Desktop) */}
          {isMobile ? (
            <div className="filter-category-row" style={{ display: "flex", gap: 16, width: "100%" }}>
              <div className="filter-select-wrap" style={{ flex: 1 }}>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "All") {
                      router.push("/", { scroll: false });
                    } else {
                      const slug = val.replace("-", "").toLowerCase();
                      router.push(`/${slug}`, { scroll: false });
                    }
                  }}
                  style={filterSelectStyle}
                >
                  <option value="All" style={{ background: "#0a0a0a" }}>All Job Types</option>
                  {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                    <option key={type} value={type} style={{ background: "#0a0a0a" }}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="filter-pills-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginRight: 8 }}>Filter by Job Type:</span>
              {["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (type === "All") {
                      router.push("/", { scroll: false });
                    } else {
                      const slug = type.replace("-", "").toLowerCase();
                      router.push(`/${slug}`, { scroll: false });
                    }
                  }}
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
          )}
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
            currentJobs.map((job) => <JobCard key={job.id} job={job} />)
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
                  router.push("/", { scroll: false });
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

      {/* SEO Content Section to prevent "Thin Content" */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", color: "#a3a3a3", fontSize: 14, lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 12, fontWeight: 700 }}>About DailyJobs Sri Lanka</h2>
        <p style={{ marginBottom: 12 }}>
          DailyJobs is Sri Lanka's premier online job portal, dedicated to connecting talented professionals with the country's top employers. Whether you are searching for software engineering roles in Colombo, hospitality and tourism jobs in Galle, financial sector positions in Kandy, or remote work-from-home opportunities nationwide, we ensure our job board is updated daily with the freshest and most highly sought-after vacancies.
        </p>
        <p>
          We feature a diverse array of employment types including full-time careers, part-time jobs, flexible contract work, and valuable internship positions suited for school leavers and undergraduates. By allowing you to apply directly to top-tier Sri Lankan companies and innovative startups, DailyJobs streamlines your recruitment journey. Accelerate your career growth, discover new professional pathways, and find your dream job in Sri Lanka today with our comprehensive and easy-to-use platform.
        </p>
      </section>

      {/* Footer Details */}
      <Footer />

      {/* Mobile Sticky Navigation */}
      <BottomNavbar />

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
