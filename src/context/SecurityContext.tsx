"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types/threat";
import { MockStorage } from "@/lib/storage/mock-store";
import { ThreatAlert } from "@/lib/data/mock-alerts";
import { onAuthStateChange, signInWithGoogle as firebaseGoogleLogin, signOutUser } from "@/lib/firebase/auth-service";
import { User } from "firebase/auth";
import { toast } from "sonner";

interface SecurityContextType {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  userAvatar: string;
  firebaseUser: User | null;
  isFirebaseLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
  maskPii: boolean;
  setMaskPii: (mask: boolean) => void;
  maskIps: boolean;
  setMaskIps: (mask: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
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
  const [userAvatar, setUserAvatar] = useState("");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  const [maskPii, setMaskPii] = useState(false);
  const [maskIps, setMaskIps] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [activeTheme, setActiveTheme] = useState<"dark" | "cyber">("cyber");

  const refreshAlerts = () => {
    const list = MockStorage.getAlerts();
    setAlerts(list);
  };

  useEffect(() => {
    refreshAlerts();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChange((user) => {
      setFirebaseUser(user);
      setIsFirebaseLoading(false);
      if (user) {
        setUserName(user.displayName || "Google SOC Analyst");
        setUserEmail(user.email || "analyst@enterprise.com");
        setUserAvatar(user.photoURL || "");
        setUserRoleState("SECURITY_ANALYST");
      }
    });
    
    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    const res = await firebaseGoogleLogin();
    if (res.user) {
      setFirebaseUser(res.user);
      setUserName(res.user.displayName || "Google SOC Analyst");
      setUserEmail(res.user.email || "analyst@enterprise.com");
      setUserAvatar(res.user.photoURL || "");
      toast.success(`Welcome ${res.user.displayName || "Analyst"}! Authenticated via Google.`);
      return true;
    } else {
      toast.error(res.error || "Google Sign-In was cancelled or failed.");
      return false;
    }
  };

  const logout = async () => {
    await signOutUser();
    setFirebaseUser(null);
    setUserName("Alex Mercer");
    setUserEmail("alex.mercer@acmeworks.com");
    setUserAvatar("");
    toast.info("Signed out from Google SOC session.");
  };

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
        userAvatar,
        firebaseUser,
        isFirebaseLoading,
        signInWithGoogle,
        logout,
        setUserRole,
        maskPii,
        setMaskPii,
        maskIps,
        setMaskIps,
        isSearchOpen,
        setIsSearchOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
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

