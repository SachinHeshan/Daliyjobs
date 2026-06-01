import HomeContent from "@/components/HomeContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

const jobTypeMap: Record<string, string> = {
  "fulltime": "Full-time",
  "full-time": "Full-time",
  "parttime": "Part-time",
  "part-time": "Part-time",
  "contract": "Contract",
  "internship": "Internship",
  "remote": "Remote",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  if (p.slug.startsWith("jobs-in-")) {
    const location = p.slug.replace("jobs-in-", "").replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `Jobs in ${location} | DailyJobs`,
      description: `Find the latest job vacancies and career opportunities in ${location}. Browse jobs in ${location} and apply directly on DailyJobs.`,
    };
  }

  const jobType = jobTypeMap[p.slug.toLowerCase()];
  if (jobType) {
    return {
      title: `${jobType} Jobs | DailyJobs`,
      description: `Find the latest ${jobType} job vacancies and career opportunities. Apply directly on DailyJobs.`,
    };
  }
  
  return {
    title: `DailyJobs`,
  };
}

export default async function SlugPage({ params }: Props) {
  const p = await params;
  
  if (p.slug.startsWith("jobs-in-")) {
    const locationSlug = p.slug.replace("jobs-in-", "");
    return <HomeContent locationSlug={locationSlug} />;
  }

  const jobType = jobTypeMap[p.slug.toLowerCase()];
  if (jobType) {
    return <HomeContent typeSlug={jobType} />;
  }
  
  notFound();
}
