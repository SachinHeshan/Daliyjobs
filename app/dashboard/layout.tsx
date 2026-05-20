"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        if (pathname !== "/dashboard/login") {
          router.push("/dashboard/login");
        }
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  if (isAuth === null) return <div style={{ background: "#000", minHeight: "100vh" }} />;

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/dashboard/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff" }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.05)", padding: 24, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 40, color: "#1591DC" }}>Admin Panel</h2>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          <Link href="/dashboard" style={{ ...navItemStyle, background: pathname === "/dashboard" ? "rgba(21,145,220,0.1)" : "transparent", color: pathname === "/dashboard" ? "#1591DC" : "#a3a3a3" }}>
            Overview
          </Link>
          <Link href="/dashboard/jobs" style={{ ...navItemStyle, background: pathname === "/dashboard/jobs" ? "rgba(21,145,220,0.1)" : "transparent", color: pathname === "/dashboard/jobs" ? "#1591DC" : "#a3a3a3" }}>
            Manage Jobs
          </Link>
          <Link href="/dashboard/banners" style={{ ...navItemStyle, background: pathname === "/dashboard/banners" ? "rgba(21,145,220,0.1)" : "transparent", color: pathname === "/dashboard/banners" ? "#1591DC" : "#a3a3a3" }}>
            Manage Banners
          </Link>
          <Link href="/" style={{ ...navItemStyle, marginTop: 24 }} target="_blank">
            View Live Site ↗
          </Link>
        </nav>

        <button onClick={handleLogout} style={{ ...navItemStyle, marginTop: "auto", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#ef4444" }}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 40, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

const navItemStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 15,
  transition: "all 0.2s",
  cursor: "pointer",
  display: "block",
  textAlign: "left" as const,
};
