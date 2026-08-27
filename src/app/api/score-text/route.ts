import { NextRequest, NextResponse } from "next/server";
import { scoreTextAndLinksWithHuggingFace } from "@/server/threat-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, subject = "Message Subject", from = "sender@domain.com", urls = [], ip = "185.220.101.5" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid payload: 'text' string is required." },
        { status: 400 }
      );
    }

    const verdict = await scoreTextAndLinksWithHuggingFace(subject, from, text, urls, ip);

    return NextResponse.json({
      success: true,
      data: verdict,
      engine: "HuggingFace-Neural-SOC",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Backend /api/score-text error:", error);
    return NextResponse.json(
      { error: "Text scoring failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
