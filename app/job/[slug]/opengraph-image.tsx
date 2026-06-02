import { ImageResponse } from 'next/og';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Job, mockJobs } from "@/data/jobs";
import { slugify } from "@/lib/slugify";

export const runtime = 'edge';

// Image metadata
export const alt = 'Job Details on DailyJobs';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  let job: Job | undefined = undefined;

  try {
    const snap = await getDocs(collection(db, "job-vacancies"));
    const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    job = jobs.find((j) => slugify(j.title) === slug) || mockJobs.find((j) => slugify(j.title) === slug);
  } catch (error) {
    job = mockJobs.find((j) => slugify(j.title) === slug);
  }

  if (!job) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#f8fafc', color: '#0f172a', fontSize: 60, fontWeight: 700 }}>
          Job Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top blue bar with "HIRING NOW!" */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '80px',
            backgroundColor: '#1591DC',
            alignItems: 'center',
            paddingLeft: '60px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              color: '#1591DC',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            HIRING NOW!
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            flex: 1,
            justifyContent: 'flex-start',
          }}
        >
          {/* Job Title and Type Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
            <h1
              style={{
                fontSize: '76px',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.1,
                margin: 0,
                padding: 0,
                display: 'flex',
              }}
            >
              {job.title}
            </h1>
            <div
              style={{
                border: '2px solid #e5e7eb',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '28px',
                fontWeight: 600,
                color: '#4b5563',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                marginTop: '12px',
              }}
            >
              {job.type}
            </div>
          </div>

          {/* Company Name */}
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 500,
              color: '#4b5563',
              margin: '0 0 16px 0',
              padding: 0,
              display: 'flex',
            }}
          >
            {job.company}
          </h2>

          {/* Location */}
          <h3
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: '#9ca3af',
              margin: 0,
              padding: 0,
              display: 'flex',
            }}
          >
            {job.location}
          </h3>
        </div>

        {/* Footer Area with Tag and Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0 60px 60px 60px',
            width: '100%',
          }}
        >
          {/* Bottom Left: First Tag or Category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#9ca3af',
              fontSize: '32px',
              fontWeight: 500,
            }}
          >
            {/* Briefcase Icon (simplified using emoji or simple SVG path if supported, using emoji for compatibility in Edge) */}
            <span style={{ fontSize: '36px' }}>💼</span>
            {job.tags && job.tags.length > 0 ? job.tags[0] : 'Job Vacancy'}
          </div>

          {/* Bottom Right: DailyJobs Logo Box */}
          <div
            style={{
              backgroundColor: '#1591DC',
              color: '#ffffff',
              fontSize: '64px',
              fontWeight: 800,
              padding: '24px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            DailyJobs
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
