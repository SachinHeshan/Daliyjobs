"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function ManageBanners() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [banners, setBanners] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "banners"));
      const list = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      setBanners(list);
    } catch (err) {
      console.error("Error fetching banners:", err);
      alert("Failed to fetch banners: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const seedBanners = async () => {
    if (!confirm("Load default banners to Firestore?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/data");
      const { banners: mockBanners } = await res.json();
      for (const b of mockBanners) {
        await addDoc(collection(db, "banners"), b);
      }
      alert("Successfully seeded banners!");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to seed banners. Error: " + (err as Error).message);
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    setLoading(true);
    
    try {
      if (editingBanner.firestoreId) {
        const { firestoreId, ...data } = editingBanner;
        await updateDoc(doc(db, "banners", firestoreId), data);
      } else {
        await addDoc(collection(db, "banners"), editingBanner);
      }
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner: " + (err as Error).message);
      setLoading(false);
    }
  };

  const handleDelete = async (firestoreId: string) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "banners", firestoreId));
      await fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner: " + (err as Error).message);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: "#a3a3a3", padding: 40 }}>Loading banners...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>Manage Banners</h1>
        <div style={{ display: "flex", gap: 12 }}>
          {banners.length === 0 && (
             <button onClick={seedBanners} style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
               🌱 Seed Mock Banners
             </button>
          )}
          <button onClick={() => setEditingBanner({ image: "", title: "", description: "" })} style={btnStyle}>
            + Add New Banner
          </button>
        </div>
      </div>

      {editingBanner && (
        <form onSubmit={handleSave} style={{ background: "rgba(255,255,255,0.02)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, color: "#fff" }}>{editingBanner.firestoreId ? "Edit Banner" : "Add Banner"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <input placeholder="Image Link (URL) *" required value={editingBanner.image || ""} onChange={e => setEditingBanner({...editingBanner, image: e.target.value})} style={inputStyle} />
            <input placeholder="Title (Optional)" value={editingBanner.title || ""} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} style={inputStyle} />
          </div>
          <textarea placeholder="Description (Optional)" value={editingBanner.description || ""} onChange={e => setEditingBanner({...editingBanner, description: e.target.value})} style={{ ...inputStyle, minHeight: 80 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" style={btnStyle}>Save Banner</button>
            <button type="button" onClick={() => setEditingBanner(null)} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", color: "#fff" }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {banners.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No banners yet. Click &quot;Add New Banner&quot; or seed them.</p>}
        {banners.map((banner) => (
          <div key={banner.firestoreId || banner.id} style={{ background: "rgba(255,255,255,0.02)", padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            {banner.image ? (
              <div style={{ width: 120, height: 60, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#000" }}>
                <img src={banner.image} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: 120, height: 60, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", color: "#a3a3a3", fontSize: 12 }}>No Image</div>
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{banner.title || "No Title"}</h3>
              <p style={{ color: "#a3a3a3", fontSize: 14 }}>{banner.description || banner.subtitle || "No description"}</p>
              <p style={{ color: "#64748b", fontSize: 12, wordBreak: "break-all", marginTop: 4 }}>{banner.image}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditingBanner(banner)} style={{ ...btnActionStyle, color: "#1591DC", background: "rgba(21,145,220,0.1)" }}>Edit</button>
              <button onClick={() => handleDelete(banner.firestoreId)} style={{ ...btnActionStyle, color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>Delete</button>
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
