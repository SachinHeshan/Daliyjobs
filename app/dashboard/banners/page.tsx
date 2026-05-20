"use client";
import { useEffect, useState } from "react";

export default function ManageBanners() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ jobs: any[], banners: any[] } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToApi = async (newData: any) => {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData)
    });
    setData(newData);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    
    let updatedBanners = [...data.banners];
    if (editingBanner?.id) {
      updatedBanners = updatedBanners.map(b => b.id === editingBanner.id ? editingBanner : b);
    } else {
      updatedBanners.unshift({ ...editingBanner, id: Date.now() });
    }
    
    await saveToApi({ ...data, banners: updatedBanners });
    setEditingBanner(null);
  };

  const handleDelete = async (id: number) => {
    if (!data || !confirm("Are you sure?")) return;
    const updatedBanners = data.banners.filter(b => b.id !== id);
    await saveToApi({ ...data, banners: updatedBanners });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>Manage Banners</h1>
        <button onClick={() => setEditingBanner({ title: "", subtitle: "", tag: "", cta: "Explore", href: "/#jobs", gradient: "linear-gradient(135deg, #1591DC 0%, #0d74b5 50%, #000000 100%)", accent: "#1591DC", emoji: "✨", stats: [{label: "Stat 1", value: "100"}] })} style={btnStyle}>
          + Add New Banner
        </button>
      </div>

      {editingBanner && (
        <form onSubmit={handleSave} style={{ background: "rgba(255,255,255,0.02)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, color: "#fff" }}>{editingBanner.id ? "Edit Banner" : "Add Banner"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <input placeholder="Tag (e.g. 🇱🇰 Sri Lanka Focus)" required value={editingBanner.tag || ""} onChange={e => setEditingBanner({...editingBanner, tag: e.target.value})} style={inputStyle} />
            <input placeholder="Title" required value={editingBanner.title || ""} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} style={inputStyle} />
            <input placeholder="CTA Text" required value={editingBanner.cta || ""} onChange={e => setEditingBanner({...editingBanner, cta: e.target.value})} style={inputStyle} />
            <input placeholder="Emoji" required value={editingBanner.emoji || ""} onChange={e => setEditingBanner({...editingBanner, emoji: e.target.value})} style={inputStyle} />
          </div>
          <textarea placeholder="Subtitle" required value={editingBanner.subtitle || ""} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} style={{ ...inputStyle, minHeight: 80 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" style={btnStyle}>Save Banner</button>
            <button type="button" onClick={() => setEditingBanner(null)} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", color: "#fff" }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.banners.map((banner) => (
          <div key={banner.id} style={{ background: "rgba(255,255,255,0.02)", padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: 4, marginBottom: 8, display: "inline-block" }}>{banner.tag}</span>
              <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{banner.title}</h3>
              <p style={{ color: "#a3a3a3", fontSize: 14 }}>{banner.subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditingBanner(banner)} style={{ ...btnActionStyle, color: "#1591DC", background: "rgba(21,145,220,0.1)" }}>Edit</button>
              <button onClick={() => handleDelete(banner.id)} style={{ ...btnActionStyle, color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "12px 16px",
  borderRadius: 8,
  color: "#fff",
  outline: "none",
  fontSize: 14,
  width: "100%",
};

const btnStyle = {
  background: "linear-gradient(135deg, #1591DC, #0d74b5)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const btnActionStyle = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 13,
};
