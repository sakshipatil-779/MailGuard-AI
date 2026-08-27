"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandSearch } from "./CommandSearch";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1a2A2f] selection:bg-[#88BDF2] selection:text-[#1a2A2f]">
      <Sidebar />
      <Topbar />
      <main className="lg:ml-64 ml-0 p-3 sm:p-4 md:p-6 min-h-[calc(100vh-4rem)] bg-[#ffffff] transition-all duration-300">
        {children}
      </main>
      <CommandSearch />
    </div>
  );
}

