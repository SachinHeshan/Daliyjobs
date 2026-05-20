import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mockJobs } from '@/data/jobs';

const dataFilePath = path.join(process.cwd(), 'data.json');

const initialBanners = [
  {
    id: 1,
    tag: "🇱🇰 Sri Lanka Focus",
    title: "1,500+ Top Local Jobs Available",
    subtitle: "Find vacancies at leading Sri Lankan companies and multinationals hiring in Colombo, Kandy, Galle, and more.",
    cta: "Explore Jobs",
    href: "/#jobs",
    gradient: "linear-gradient(135deg, #1591DC 0%, #0d74b5 50%, #000000 100%)",
    accent: "#1591DC",
    emoji: "💼",
    stats: [
      { label: "Active Jobs", value: "1,500+" },
      { label: "Top Companies", value: "150+" },
      { label: "Added Today", value: "80+" },
    ],
  },
  {
    id: 2,
    tag: "💻 Remote Options",
    title: "Work Remotely from Sri Lanka",
    subtitle: "Discover global and local remote job opportunities that allow you to work from home, earning in LKR or foreign currencies.",
    cta: "Find Remote Jobs",
    href: "/#jobs",
    gradient: "linear-gradient(135deg, #000000 0%, #0d74b5 60%, #1591DC 100%)",
    accent: "#1591DC",
    emoji: "🌍",
    stats: [
      { label: "Remote Jobs", value: "400+" },
      { label: "Work From Home", value: "100%" },
      { label: "New Today", value: "25+" },
    ],
  },
  {
    id: 3,
    tag: "⚡ Direct Connect",
    title: "Apply Directly to Hiring Managers",
    subtitle: "No registration required. Get the hiring managers' direct email address or official application links instantly.",
    cta: "Apply Now",
    href: "/#jobs",
    gradient: "linear-gradient(135deg, #0d74b5 0%, #1591DC 50%, #000000 100%)",
    accent: "#1591DC",
    emoji: "🚀",
    stats: [
      { label: "Avg. Response", value: "24h" },
      { label: "No Signup Needed", value: "Free" },
      { label: "Daily Applicants", value: "5K+" },
    ],
  },
];

export async function GET() {
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  }
  
  const initialData = { jobs: mockJobs, banners: initialBanners };
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf8');
  return NextResponse.json(initialData);
}

export async function POST(req: Request) {
  const data = await req.json();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  return NextResponse.json({ success: true });
}
