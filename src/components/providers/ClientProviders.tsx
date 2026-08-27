"use client";

import React from "react";
import { SecurityProvider } from "@/context/SecurityContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SecurityProvider>
      {children}
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
    </SecurityProvider>
  );
}
