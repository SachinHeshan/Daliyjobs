export default function DashboardOverview() {
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 24 }}>Dashboard Overview</h1>
      <p style={{ color: "#a3a3a3", fontSize: 16 }}>Welcome to the admin panel. Use the sidebar to manage jobs and banners.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: 32, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Manage Jobs</h3>
          <p style={{ color: "#a3a3a3", marginBottom: 20 }}>Add, edit, or remove job listings from the platform.</p>
          <a href="/dashboard/jobs" style={{ color: "#1591DC", textDecoration: "none", fontWeight: 600 }}>Go to Jobs →</a>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: 32, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Manage Banners</h3>
          <p style={{ color: "#a3a3a3", marginBottom: 20 }}>Customize the hero banners displayed on the home page.</p>
          <a href="/dashboard/banners" style={{ color: "#1591DC", textDecoration: "none", fontWeight: 600 }}>Go to Banners →</a>
        </div>
      </div>
    </div>
  );
}
