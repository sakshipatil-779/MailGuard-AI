import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "MailGuard-AI | Email Threat Detection, Geolocation & Forensic Intelligence Platform",
  description: "SOC-grade AI platform for detecting phishing, BEC, spoofing, reconstructing email relay paths, and preserving forensic evidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#ffffff] text-[#1a2A2f] antialiased font-sans min-h-screen">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

