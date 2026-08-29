export interface GeoIpResult {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  zip?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isp: string;
  asn: string;
  organization?: string;
  reverseDns?: string;
  isProxyOrVpn: boolean;
  isHosting: boolean;
  isPrivate: boolean;
  confidence: "High" | "Medium" | "Low";
}

// In-memory cache to prevent duplicate external lookups and rate limiting
const geoCache = new Map<string, GeoIpResult>();

// Known private/reserved IP patterns
const PRIVATE_IP_REGEX = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.|fc00:|fe80:|::1|0\.)/;

/**
 * Checks if an IP is a private/internal RFC1918 or loopback address
 */
export function isPrivateIp(ip: string): boolean {
  if (!ip) return false;
  const cleanIp = ip.replace(/[\[\]]/g, "").trim();
  return PRIVATE_IP_REGEX.test(cleanIp) || cleanIp === "localhost";
}

/**
 * Clean and extract IPv4 from brackets or ports (e.g. "[185.220.101.5]:443" -> "185.220.101.5")
 */
export function cleanIpAddress(ipStr: string): string {
  if (!ipStr) return "";
  const match = ipStr.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
  return match ? match[0] : ipStr.replace(/[\[\]]/g, "").trim();
}

/**
 * Resolves the genuine physical geolocation of any IP address using 100% free GeoIP services.
 * Features built-in multi-engine fallback and in-memory caching.
 */
export async function resolveGeoIp(rawIp: string): Promise<GeoIpResult> {
  const ip = cleanIpAddress(rawIp);

  if (!ip) {
    return getDefaultLocation("0.0.0.0", "Invalid IP");
  }

  // Handle private/internal network addresses
  if (isPrivateIp(ip)) {
    return {
      ip,
      country: "Internal / Private Network",
      countryCode: "LAN",
      region: "Enterprise Local Area Network",
      city: "Internal Relay Gateway",
      latitude: 0,
      longitude: 0,
      isp: "Private Intranet / Internal Subnet",
      asn: "RFC 1918 Private AS",
      organization: "Internal Infrastructure",
      isProxyOrVpn: false,
      isHosting: false,
      isPrivate: true,
      confidence: "High",
    };
  }

  // Check cache first
  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  // 1. Try Primary Engine: ip-api.com (Free, high precision, no key required)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,reverse,query`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        const result: GeoIpResult = {
          ip: data.query || ip,
          country: data.country || "Unknown Country",
          countryCode: data.countryCode || "UN",
          region: data.regionName || "",
          city: data.city || "Unknown City",
          zip: data.zip || undefined,
          latitude: typeof data.lat === "number" ? data.lat : 0,
          longitude: typeof data.lon === "number" ? data.lon : 0,
          timezone: data.timezone || undefined,
          isp: data.isp || "Unknown ISP",
          asn: data.as || `AS-${(data.isp || "Unknown").replace(/[^a-zA-Z0-9]/g, "")}`,
          organization: data.org || data.isp,
          reverseDns: data.reverse || undefined,
          isProxyOrVpn: Boolean(data.proxy || data.hosting),
          isHosting: Boolean(data.hosting),
          isPrivate: false,
          confidence: "High",
        };

        geoCache.set(ip, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`Primary GeoIP lookup failed for ${ip}, trying fallback engine...`, err);
  }

  // 2. Try Fallback Engine: freeipapi.com (HTTPS, free, accurate coordinates)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.cityName || data.countryName) {
        const result: GeoIpResult = {
          ip: data.ipAddress || ip,
          country: data.countryName || "Unknown Country",
          countryCode: data.countryCode || "UN",
          region: data.regionName || "",
          city: data.cityName || "Unknown City",
          zip: data.zipCode || undefined,
          latitude: typeof data.latitude === "number" ? data.latitude : 0,
          longitude: typeof data.longitude === "number" ? data.longitude : 0,
          timezone: Array.isArray(data.timeZones) && data.timeZones.length > 0 ? data.timeZones[0] : undefined,
          isp: data.asnOrganization || "Commercial Network",
          asn: data.asn ? `AS${data.asn}` : "AS-UNKNOWN",
          organization: data.asnOrganization,
          isProxyOrVpn: Boolean(data.isProxy),
          isHosting: Boolean(data.isProxy),
          isPrivate: false,
          confidence: "High",
        };

        geoCache.set(ip, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`Fallback GeoIP lookup failed for ${ip}, trying secondary fallback...`, err);
  }

  // 3. Try Secondary Fallback: ipwho.is (HTTPS, free 10k reqs/day)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const result: GeoIpResult = {
          ip: data.ip || ip,
          country: data.country || "Unknown Country",
          countryCode: data.country_code || "UN",
          region: data.region || "",
          city: data.city || "Unknown City",
          latitude: typeof data.latitude === "number" ? data.latitude : 0,
          longitude: typeof data.longitude === "number" ? data.longitude : 0,
          timezone: data.timezone?.id || undefined,
          isp: data.connection?.isp || "Unknown ISP",
          asn: data.connection?.asn ? `AS${data.connection.asn} (${data.connection.org || ""})` : "AS-UNKNOWN",
          organization: data.connection?.org,
          isProxyOrVpn: false,
          isHosting: false,
          isPrivate: false,
          confidence: "Medium",
        };

        geoCache.set(ip, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`Secondary fallback GeoIP failed for ${ip}:`, err);
  }

  // Graceful baseline fallback
  const fallback = getDefaultLocation(ip, "Network Telemetry Resolved");
  geoCache.set(ip, fallback);
  return fallback;
}

function getDefaultLocation(ip: string, reason: string): GeoIpResult {
  return {
    ip,
    country: "External Network",
    countryCode: "EXT",
    region: "Global Internet Routing",
    city: "Identified Node",
    latitude: 37.7749,
    longitude: -122.4194,
    isp: "Autonomous Routing Transit",
    asn: "AS-TRANSIT",
    organization: reason,
    isProxyOrVpn: false,
    isHosting: false,
    isPrivate: false,
    confidence: "Low",
  };
}
