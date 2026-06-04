import { NextResponse } from "next/server";
import { google } from "googleapis";

// Bulletproof private key formatter
function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  let formatted = key.replace(/^"|"$/g, "");
  formatted = formatted.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  
  const beginHeader = "-----BEGIN PRIVATE KEY-----";
  const endHeader = "-----END PRIVATE KEY-----";
  
  if (formatted.includes(beginHeader) && formatted.includes(endHeader)) {
    // Extract base64 body, remove ALL whitespace, and chunk into 64-character lines
    const body = formatted
      .substring(formatted.indexOf(beginHeader) + beginHeader.length, formatted.indexOf(endHeader))
      .replace(/\s+/g, ""); // Remove all whitespace (spaces, newlines, tabs)
    
    const bodyLines = body.match(/.{1,64}/g)?.join("\n") || body;
    return `${beginHeader}\n${bodyLines}\n${endHeader}\n`;
  }

  // Fallback
  return formatted.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim() + "\n";
}

const privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);

// Initialize the Google Auth client using environment variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, type = "URL_UPDATED" } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Initialize the Indexing API client
    const indexing = google.indexing({
      version: "v3",
      auth: auth,
    });

    // Create the indexing request
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type, // URL_UPDATED or URL_DELETED
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Google Indexing API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit to Google Indexing API", details: error.message },
      { status: 500 }
    );
  }
}
