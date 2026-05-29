import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Job, mockJobs } from "@/data/jobs";
import { slugify } from "@/lib/slugify";
import JobClientPage from "./JobClientPage";

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js 15 requires params to be awaited
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let job: Job | undefined = undefined;

  try {
    const snap = await getDocs(collection(db, "job-vacancies"));
    const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    job = jobs.find((j) => slugify(j.title) === slug) || mockJobs.find((j) => slugify(j.title) === slug);
  } catch (error) {
    job = mockJobs.find((j) => slugify(j.title) === slug);
  }

  if (!job) {
    return {
      title: "Job Not Found - DailyJobs",
    };
  }

  return {
    title: `${job.title} | ${job.company} - DailyJobs`,
    description: job.description.replace(/<[^>]+>/g, "").substring(0, 160) + "...",
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `Apply for ${job.title} at ${job.company} on DailyJobs.`,
      url: `https://dailysjobs.com/job/${slug}`,
      siteName: "DailyJobs",
      images: [
        {
          url: job.logo || "https://dailysjobs.com/logo.png",
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function JobPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let job: Job | undefined = undefined;

  try {
    const snap = await getDocs(collection(db, "job-vacancies"));
    const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    job = jobs.find((j) => slugify(j.title) === slug) || mockJobs.find((j) => slugify(j.title) === slug);
  } catch (error) {
    job = mockJobs.find((j) => slugify(j.title) === slug);
  }

  if (!job) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", flexDirection: "column" }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Job Not Found</h1>
        <p style={{ color: "#a3a3a3", marginBottom: 24 }}>The job you are looking for does not exist or has been removed.</p>
        <a href="/" style={{ padding: "12px 24px", background: "#1591DC", color: "#fff", textDecoration: "none", borderRadius: 8, fontWeight: 600 }}>Back to Home</a>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Schema for JobPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              "sameAs": job.website ? (job.website.startsWith("http") ? job.website : `https://${job.website}`) : "https://dailysjobs.com",
              "logo": job.logo
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
          })
        }}
      />
      <JobClientPage job={job} />
    </>
  );
}
