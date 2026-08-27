"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandSearch } from "./CommandSearch";
import { SecurityProvider } from "@/context/SecurityContext";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SecurityProvider>
      <div className="min-h-screen bg-[#ffffff] text-[#1a2A2f] selection:bg-[#88BDF2] selection:text-[#1a2A2f]">
        <Sidebar />
        <Topbar />
        <main className="ml-64 p-6 min-h-[calc(100vh-4rem)] bg-[#ffffff]">
          {children}
        </main>
        <CommandSearch />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#1a2A2f",
              borderColor: "#88BDF2",
              color: "#ffffff",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </div>
    </SecurityProvider>
  );
}
