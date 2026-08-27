"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types/threat";
import { MockStorage } from "@/lib/storage/mock-store";
import { ThreatAlert } from "@/lib/data/mock-alerts";

interface SecurityContextType {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  setUserRole: (role: UserRole) => void;
  maskPii: boolean;
  setMaskPii: (mask: boolean) => void;
  maskIps: boolean;
  setMaskIps: (mask: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  unreadAlertsCount: number;
  alerts: ThreatAlert[];
  refreshAlerts: () => void;
  activeTheme: "dark" | "cyber";
  setActiveTheme: (theme: "dark" | "cyber") => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>("SECURITY_ANALYST");
  const [userName, setUserName] = useState("Alex Mercer");
  const [userEmail, setUserEmail] = useState("alex.mercer@acmeworks.com");
  const [maskPii, setMaskPii] = useState(false);
  const [maskIps, setMaskIps] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [activeTheme, setActiveTheme] = useState<"dark" | "cyber">("cyber");

  const refreshAlerts = () => {
    const list = MockStorage.getAlerts();
    setAlerts(list);
  };

  useEffect(() => {
    refreshAlerts();
    
    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    switch (role) {
      case "ADMIN":
        setUserName("Chief CISO Jordan Wells");
        setUserEmail("jordan.wells@acmeworks.com");
        break;
      case "INVESTIGATOR":
        setUserName("Elena Rostova (Lead Forensics)");
        setUserEmail("elena.rostova@acmeworks.com");
        break;
      case "AUDITOR":
        setUserName("Marcus Chen (Compliance Auditor)");
        setUserEmail("marcus.chen@acmeworks.com");
        break;
      case "VIEWER":
        setUserName("Read-Only Analyst Guest");
        setUserEmail("viewer.guest@acmeworks.com");
        break;
      case "SECURITY_ANALYST":
      default:
        setUserName("Alex Mercer (Senior Threat Hunter)");
        setUserEmail("alex.mercer@acmeworks.com");
        break;
    }
  };

  const unreadAlertsCount = alerts.filter((a) => a.status === "NEW").length;

  return (
    <SecurityContext.Provider
      value={{
        userRole,
        userName,
        userEmail,
        setUserRole,
        maskPii,
        setMaskPii,
        maskIps,
        setMaskIps,
        isSearchOpen,
        setIsSearchOpen,
        unreadAlertsCount,
        alerts,
        refreshAlerts,
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
