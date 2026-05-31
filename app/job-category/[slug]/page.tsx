import HomeContent from "@/components/HomeContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const slug = p.slug;
  const categoryName = slug.replace(/-jobs$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return {
    title: `${categoryName} Jobs in Sri Lanka | DailyJobs`,
    description: `Browse the latest ${categoryName} job vacancies and career opportunities in Sri Lanka. Find your next full-time, part-time, or remote role on DailyJobs.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const p = await params;
  return <HomeContent categorySlug={p.slug} />;
}
