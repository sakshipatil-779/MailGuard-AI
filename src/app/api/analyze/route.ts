import { NextRequest, NextResponse } from "next/server";
import { analyzeEmailOnBackend } from "@/server/threat-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawContent, filename } = body;

    if (!rawContent || typeof rawContent !== "string") {
      return NextResponse.json(
        { error: "Invalid payload: 'rawContent' string is required." },
        { status: 400 }
      );
    }

    const emailName = filename || "analyzed_message.eml";
    const analysis = await analyzeEmailOnBackend(rawContent, emailName);

    return NextResponse.json({
      success: true,
      data: analysis,
      engine: "HuggingFace-Neural-SOC",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Backend /api/analyze error:", error);
    return NextResponse.json(
      { error: "Threat analysis pipeline failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
