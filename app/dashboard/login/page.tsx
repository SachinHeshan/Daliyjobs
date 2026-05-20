"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#000" }}>
      <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.02)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 10 }}>Admin Login</h1>
        
        {error && <div style={{ color: "#ef4444", fontSize: 14, textAlign: "center", background: "rgba(239,68,68,0.1)", padding: 10, borderRadius: 8 }}>{error}</div>}
        
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: "#a3a3a3", fontSize: 13, fontWeight: 600 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="Enter email"
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: "#a3a3a3", fontSize: 13, fontWeight: 600 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" style={{ background: "linear-gradient(135deg, #1591DC, #0d74b5)", color: "#fff", padding: "14px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 10, boxShadow: "0 4px 15px rgba(21,145,220,0.3)" }}>
          Login
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "12px 16px",
  borderRadius: 12,
  color: "#fff",
  outline: "none",
  fontSize: 15,
};
