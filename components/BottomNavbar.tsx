"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Jobs",
      href: "/#jobs",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "About",
      href: "/about",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Contact",
      href: "/contact",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="bottom-nav-container">
        <div className="bottom-nav-content">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href.startsWith("/#") && pathname === "/");
            return (
              <Link key={item.label} href={item.href} className={`bottom-nav-item ${isActive ? "active" : ""}`}>
                <span className="bottom-nav-icon">{item.icon}</span>
                <span className="bottom-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(21, 145, 220, 0.2);
          z-index: 999;
          display: none;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
        }

        .bottom-nav-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s ease;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 12px;
        }

        .bottom-nav-item:active {
          transform: scale(0.92);
        }

        .bottom-nav-item.active {
          color: #1591DC;
        }

        .bottom-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .bottom-nav-item.active .bottom-nav-icon {
          transform: translateY(-2px);
          color: #1591DC;
          filter: drop-shadow(0 0 6px rgba(21, 145, 220, 0.6));
        }

        @media (max-width: 768px) {
          .bottom-nav-container {
            display: block;
          }
          /* Add bottom padding to body to prevent content from being cut off by mobile nav */
          body {
            padding-bottom: 64px;
          }
        }
      `}</style>
    </>
  );
}
