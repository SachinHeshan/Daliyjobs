import { useState, useRef, useEffect } from "react";

interface ShareMenuProps {
  jobUrl: string;
  jobTitle: string;
  isMobile?: boolean;
  fullWidth?: boolean;
}

export default function ShareMenu({ jobUrl, jobTitle, isMobile, fullWidth }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 2000);
  };

  const shareOptions = [
    { 
      name: "Facebook", 
      hoverColor: "#1877F2",
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
        </svg>
      ), 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}` 
    },
    { 
      name: "WhatsApp", 
      hoverColor: "#25D366",
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm5.44 14.24c-.27.77-1.46 1.48-2.07 1.54-.53.05-1.2-.07-3.95-1.21-3.32-1.38-5.49-4.76-5.65-4.99-.17-.22-1.35-1.8-1.35-3.43 0-1.63.85-2.43 1.15-2.75.29-.32.64-.4.85-.4h.59c.2 0 .47-.07.72.54.26.65.89 2.18.97 2.34.07.16.12.35.02.57-.1.22-.15.35-.3.53-.16.17-.33.38-.47.53-.15.15-.3.32-.13.62.17.3 1.25 1.95 2.19 2.8 1.21 1.1 2.84 1.44 3.14 1.59.3.15.48.12.65-.06.18-.18.77-.9 1.05-1.27.28-.38.56-.31.85-.22.28.1 1.83.86 2.15 1.02.31.16.53.24.6.38.07.13.07.77-.2 1.54z"/>
        </svg>
      ), 
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(jobTitle + " " + jobUrl)}` 
    },
    { 
      name: "LinkedIn", 
      hoverColor: "#0A66C2",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.25 12.27h-3v-5.6c0-3.37-4-3.11-4 0v5.6h-3v-11h3v1.76c1.4-2.58 7-2.78 7 2.47v6.77z"/>
        </svg>
      ), 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}` 
    },
    { 
      name: "Telegram", 
      hoverColor: "#0088cc",
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.96 1.85c-5.56 0-10.08 4.52-10.08 10.08 0 5.56 4.52 10.08 10.08 10.08s10.08-4.52 10.08-10.08c0-5.56-4.52-10.08-10.08-10.08zm4.76 6.84c-.45 2.5-2.2 10.35-2.6 11.83-.17.65-.55.72-.94.38-.63-.56-2.13-1.63-2.68-2.07-.63-.5-1.12-.82-.24-1.67.23-.22 4.15-3.8 4.22-4.13.01-.04.02-.18-.06-.25-.07-.07-.19-.05-.27-.03-.12.02-2.05 1.28-5.78 3.78-.54.38-1.03.56-1.48.55-.49-.01-1.42-.27-2.12-.5-.85-.28-1.52-.43-1.47-.91.03-.25.37-.51 1.04-.79 4.07-1.77 6.78-2.94 8.13-3.5 3.86-1.61 4.67-1.89 5.2-1.9.11 0 .37.03.5.15.11.11.14.25.15.35.01.12.01.27-.01.37z"/>
        </svg>
      ), 
      url: `https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(jobTitle)}` 
    },
    { 
      name: "X", 
      hoverColor: "#1DA1F2",
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.97 6.07-6.97zm-1.29 19.75h2.04L7.18 3.25H5.02l12.59 17.65z"/>
        </svg>
      ), 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(jobTitle)}` 
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div className="share-menu-container" style={{ display: fullWidth ? "block" : "inline-block", width: fullWidth ? "100%" : undefined }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#e2e8f0",
            padding: isMobile ? "10px 16px" : "8px 16px",
            borderRadius: fullWidth ? "10px" : "50px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: fullWidth ? "center" : "flex-start",
            gap: "8px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
            width: fullWidth ? "100%" : undefined,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(21, 145, 220, 0.15)";
            e.currentTarget.style.borderColor = "rgba(21, 145, 220, 0.3)";
            e.currentTarget.style.color = "#1591DC";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "#e2e8f0";
          }}
        >
          <span>↗️</span> Share Job
        </button>
      </div>

      {/* Full-screen Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "20px",
            animation: "shareFadeIn 0.3s ease-out forwards",
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(13, 13, 13, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "400px",
              width: "100%",
              animation: "shareScaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 700 }}>Share this job</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={option.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    width: "70px",
                    color: "#94a3b8",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.color = option.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {option.icon}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{option.name}</span>
                </a>
              ))}

              <button
                onClick={handleCopyLink}
                title="Copy Link"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  width: "70px",
                  color: copied ? "#10b981" : "#94a3b8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: copied ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    border: copied ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {copied ? (
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "12px", fontWeight: 500 }}>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shareFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shareScaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
