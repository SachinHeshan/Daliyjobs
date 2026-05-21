import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const applyEmail = formData.get("applyEmail") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const cvFile = formData.get("cv") as File;

    if (!cvFile || !applyEmail || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

    // Configure Nodemailer for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sachinheshan921@gmail.com",
        // The user must set this environment variable for their Gmail App Password
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"DailyJob Application" <sachinheshan921@gmail.com>`,
      to: applyEmail,
      subject: `New Job Application - ${jobTitle}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}

${coverLetter ? `Cover Letter:\n${coverLetter}\n\n` : ""}`,
      attachments: [
        {
          filename: cvFile.name,
          content: cvBuffer,
          contentType: cvFile.type,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Application sent successfully!" });
  } catch (error) {
    console.error("Error sending application email:", error);
    return NextResponse.json({ error: "Failed to send application email." }, { status: 500 });
  }
}
