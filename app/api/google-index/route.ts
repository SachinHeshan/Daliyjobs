import { NextResponse } from "next/server";
import { google } from "googleapis";

// Extremely robust private key parser for Vercel/Local
let rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
// 1. Remove surrounding quotes if they exist
rawKey = rawKey.replace(/^"|"$/g, "");
// 2. Unescape literal '\n' and '\r' to real newlines
rawKey = rawKey.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
// 3. Normalize all newlines to just '\n' (removes Windows carriage returns that break OpenSSL)
const privateKey = rawKey ? rawKey.replace(/\r\n/g, "\n").replace(/\r/g, "\n") : undefined;

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
