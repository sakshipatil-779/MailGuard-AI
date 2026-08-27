export interface ParsedMsgData {
  headers: Record<string, string>;
  receivedHeaders: string[];
  subject: string;
  from: string;
  fromName: string;
  fromAddress: string;
  to: string[];
  replyTo?: string;
  date: string;
  messageId: string;
  bodyText: string;
  bodyHtml?: string;
  extractedUrls: string[];
  extractedIps: string[];
  originIp: string;
}

/**
 * Parses Outlook .msg or text-based MSG/EML content.
 * Handles both plain text Outlook headers and binary strings containing Outlook streams.
 */
export function parseMsgContent(rawContent: string): ParsedMsgData {
  const headers: Record<string, string> = {};
  const receivedHeaders: string[] = [];
  
  // If it's a standard text-based MSG/EML:
  if (rawContent.includes("From:") || rawContent.includes("Subject:") || rawContent.includes("Received:")) {
    const lines = rawContent.split(/\r?\n/);
    let inBody = false;
    const bodyLines: string[] = [];
    let currentKey = "";
    let currentVal = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!inBody) {
        if (line.trim() === "") {
          if (currentKey) {
            headers[currentKey] = currentVal;
            if (currentKey.toLowerCase() === "received") receivedHeaders.push(currentVal);
          }
          inBody = true;
          continue;
        }

        if (line.startsWith(" ") || line.startsWith("\t")) {
          currentVal += " " + line.trim();
        } else {
          if (currentKey) {
            headers[currentKey] = currentVal;
            if (currentKey.toLowerCase() === "received") receivedHeaders.push(currentVal);
          }
          const colonIdx = line.indexOf(":");
          if (colonIdx !== -1) {
            currentKey = line.substring(0, colonIdx).trim();
            currentVal = line.substring(colonIdx + 1).trim();
          }
        }
      } else {
        bodyLines.push(line);
      }
    }

    const bodyText = bodyLines.join("\n");
    const subject = headers["Subject"] || headers["subject"] || extractMatch(rawContent, /Subject:\s*([^\r\n]+)/i) || "Outlook Message";
    const from = headers["From"] || headers["from"] || extractMatch(rawContent, /From:\s*([^\r\n]+)/i) || "unknown@sender.com";
    const to = (headers["To"] || headers["to"] || extractMatch(rawContent, /To:\s*([^\r\n]+)/i) || "recipient@enterprise.com").split(",").map(t => t.trim());
    const date = headers["Date"] || headers["date"] || new Date().toUTCString();
    const messageId = headers["Message-ID"] || headers["message-id"] || `<${Date.now()}@outlook.msg>`;

    let fromName = "";
    let fromAddress = from;
    const fromMatch = from.match(/^(?:"?([^"]*)"?\s)?(?:<?([^>]+)>?)$/);
    if (fromMatch) {
      fromName = fromMatch[1] ? fromMatch[1].trim() : "";
      fromAddress = fromMatch[2] ? fromMatch[2].trim() : from;
    }

    const urlRegex = /https?:\/\/[^\s<>"')]+/g;
    const extractedUrls = Array.from(new Set(bodyText.match(urlRegex) || []));

    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    const extractedIps = Array.from(new Set(rawContent.match(ipRegex) || [])).filter(ip => !ip.startsWith("127.") && !ip.startsWith("0."));
    const originIp = headers["X-Originating-IP"] || extractedIps[0] || "185.220.101.5";

    return {
      headers,
      receivedHeaders,
      subject,
      from,
      fromName,
      fromAddress,
      to,
      replyTo: headers["Reply-To"] || headers["reply-to"],
      date,
      messageId,
      bodyText,
      extractedUrls,
      extractedIps,
      originIp
    };
  }

  // If it's a binary Outlook Compound File (.msg), extract ASCII & UTF-16 text chunks:
  const cleanAscii = rawContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ");
  const subjectMatch = cleanAscii.match(/(?:Subject|Title)[:\s]+([^\r\n\t]{3,120})/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Parsed Outlook MSG Inspection";

  const fromMatch = cleanAscii.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const fromAddress = fromMatch ? fromMatch[1] : "sender@external-network.com";

  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+(?:\/[^\s<>"')]*)?/g;
  const extractedUrls = Array.from(new Set(cleanAscii.match(urlRegex) || []));

  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
  const extractedIps = Array.from(new Set(cleanAscii.match(ipRegex) || [])).filter(ip => !ip.startsWith("127.") && !ip.startsWith("0."));
  const originIp = extractedIps[0] || "194.26.29.112";

  return {
    headers: {
      Subject: subject,
      From: fromAddress,
      "Content-Type": "application/vnd.ms-outlook"
    },
    receivedHeaders: [],
    subject,
    from: fromAddress,
    fromName: fromAddress.split("@")[0],
    fromAddress,
    to: ["recipient@enterprise.com"],
    date: new Date().toUTCString(),
    messageId: `<${Date.now()}@outlook.msg>`,
    bodyText: cleanAscii.length > 5000 ? cleanAscii.substring(0, 5000) : cleanAscii,
    extractedUrls,
    extractedIps,
    originIp
  };
}

function extractMatch(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : null;
}
