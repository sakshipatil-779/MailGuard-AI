import { NextRequest, NextResponse } from "next/server";
import { resolveGeoIp, cleanIpAddress } from "@/lib/services/geoip-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("ip") || searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'ip' is required." },
        { status: 400 }
      );
    }

    // Check if query is domain or IP
    let targetIp = query.trim();
    
    // If it's a domain name (contains letters and dots without being an IP), try DNS lookup
    const isDomain = /[a-zA-Z]/.test(targetIp) && targetIp.includes(".");
    if (isDomain) {
      try {
        const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(targetIp)}&type=A`);
        if (dnsRes.ok) {
          const dnsData = await dnsRes.json();
          if (dnsData.Answer && dnsData.Answer.length > 0) {
            const aRecord = dnsData.Answer.find((a: any) => a.type === 1);
            if (aRecord && aRecord.data) {
              targetIp = aRecord.data;
            }
          }
        }
      } catch (dnsErr) {
        console.warn("DNS resolution failed for domain:", targetIp, dnsErr);
      }
    }

    const geo = await resolveGeoIp(targetIp);

    return NextResponse.json({
      success: true,
      data: {
        ...geo,
        searchedQuery: query,
        resolvedIp: targetIp,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GeoIP API error:", error);
    return NextResponse.json(
      { error: "Failed to resolve geolocation", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
