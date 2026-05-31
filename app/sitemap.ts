import { MetadataRoute } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Job, mockJobs } from "@/data/jobs";
import { slugify } from "@/lib/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dailysjobs.com";
  const now = new Date();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Fetch jobs dynamically to include in sitemap
  let allJobs: Job[] = [...mockJobs];
  try {
    const snap = await getDocs(collection(db, "job-vacancies"));
    const firestoreJobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    // Combine them, potentially removing duplicates or just relying on firestore
    // For simplicity, we just add the firestore jobs and mock jobs
    allJobs = [...firestoreJobs, ...mockJobs];
  } catch (error) {
    console.error("Error fetching jobs for sitemap:", error);
  }

  // Deduplicate by title to avoid duplicate URLs
  const uniqueJobsMap = new Map<string, Job>();
  allJobs.forEach((job) => {
    uniqueJobsMap.set(job.title, job);
  });
  
  const uniqueJobs = Array.from(uniqueJobsMap.values());

  // Add job routes
  uniqueJobs.forEach((job) => {
    const slug = slugify(job.title);
    routes.push({
      url: `${baseUrl}/job/${slug}`,
      // Use job.postedDate if available, otherwise current time
      lastModified: job.postedDate ? new Date(job.postedDate) : now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  // Extract unique locations and categories
  const locations = new Set<string>();
  const categories = new Set<string>();

  uniqueJobs.forEach((job) => {
    if (job.location) {
      if (job.location.toLowerCase().includes("remote")) locations.add("Remote");
      else if (job.location.toLowerCase().includes("colombo")) locations.add("Colombo");
      else if (job.location.toLowerCase().includes("kandy")) locations.add("Kandy");
      else if (job.location.toLowerCase().includes("galle")) locations.add("Galle");
      else if (job.location.toLowerCase().includes("negombo")) locations.add("Negombo");
      else if (job.location.toLowerCase().includes("jaffna")) locations.add("Jaffna");
      else if (job.location.toLowerCase().includes("gampaha")) locations.add("Gampaha");
      else locations.add(job.location);
    }
    if (job.category) {
      categories.add(job.category);
    }
  });

  locations.forEach((loc) => {
    routes.push({
      url: `${baseUrl}/jobs-in-${slugify(loc)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  categories.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/job-category/${slugify(cat)}-jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  return routes;
}
