"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/threat";
import { MockStorage } from "@/lib/storage/mock-store";
import { ThreatAlert } from "@/lib/data/mock-alerts";
import { onAuthStateChange, signInWithGoogle as firebaseGoogleLogin, signOutUser } from "@/lib/firebase/auth-service";
import { User } from "firebase/auth";
import { toast } from "sonner";

export interface StoredSession {
  type: "google" | "credentials" | "role";
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

const AUTH_STORAGE_KEY = "mailguard_auth_session";

interface SecurityContextType {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  userAvatar: string;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isFirebaseLoading: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  loginWithCredentials: (email: string, role?: UserRole) => Promise<boolean>;
  loginWithRole: (role: UserRole, roleName?: string) => Promise<boolean>;
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
  const router = useRouter();
  const [userRole, setUserRoleState] = useState<UserRole>("SECURITY_ANALYST");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

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

  const getRoleName = (role: UserRole): { name: string; email: string } => {
    switch (role) {
      case "ADMIN":
        return { name: "Jordan Wells", email: "jordan.wells@mailguard.soc" };
      case "INVESTIGATOR":
        return { name: "Elena Rostova", email: "elena.rostova@mailguard.soc" };
      case "AUDITOR":
        return { name: "Marcus Chen", email: "marcus.chen@mailguard.soc" };
      case "VIEWER":
        return { name: "Guest Analyst", email: "guest.analyst@mailguard.soc" };
      case "SECURITY_ANALYST":
      default:
        return { name: "Alex Mercer", email: "alex.mercer@mailguard.soc" };
    }
  };

  useEffect(() => {
    refreshAlerts();

    // 1. Check local storage session first
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        if (session && session.email) {
          setIsAuthenticated(true);
          setUserName(session.name);
          setUserEmail(session.email);
          setUserAvatar(session.avatar || "");
          setUserRoleState(session.role || "SECURITY_ANALYST");
        }
      }
    } catch {
      // Ignore local storage parse error
    }

    // 2. Firebase Auth State Listener
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setFirebaseUser(user);
        setIsAuthenticated(true);
        const name = user.displayName || "Google SOC Analyst";
        const email = user.email || "analyst@mailguard.soc";
        const avatar = user.photoURL || "";
        setUserName(name);
        setUserEmail(email);
        setUserAvatar(avatar);
        setUserRoleState("SECURITY_ANALYST");

        try {
          const session: StoredSession = {
            type: "google",
            name,
            email,
            avatar,
            role: "SECURITY_ANALYST"
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } catch {
          // ignore
        }
      } else {
        setFirebaseUser(null);
        // If not in Firebase and no local session, keep unauthenticated
        try {
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (!stored) {
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        }
      }
      setAuthLoading(false);
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
      setIsAuthenticated(true);
      const name = res.user.displayName || "Google SOC Analyst";
      const email = res.user.email || "analyst@mailguard.soc";
      const avatar = res.user.photoURL || "";
      setUserName(name);
      setUserEmail(email);
      setUserAvatar(avatar);
      setUserRoleState("SECURITY_ANALYST");

      try {
        const session: StoredSession = {
          type: "google",
          name,
          email,
          avatar,
          role: "SECURITY_ANALYST"
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } catch {
        // ignore
      }

      toast.success(`Welcome ${name}! Authenticated via Google.`);
      return true;
    } else {
      toast.error(res.error || "Google Sign-In was cancelled or failed.");
      return false;
    }
  };

  const loginWithCredentials = async (email: string, role: UserRole = "SECURITY_ANALYST"): Promise<boolean> => {
    const defaults = getRoleName(role);
    const displayName = email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()) || defaults.name;
    
    setIsAuthenticated(true);
    setUserName(displayName);
    setUserEmail(email);
    setUserAvatar("");
    setUserRoleState(role);

    try {
      const session: StoredSession = {
        type: "credentials",
        name: displayName,
        email: email,
        role: role
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    toast.success(`Authenticated as ${displayName} (${role})`);
    return true;
  };

  const loginWithRole = async (role: UserRole, roleName?: string): Promise<boolean> => {
    const { name, email } = getRoleName(role);
    setIsAuthenticated(true);
    setUserName(name);
    setUserEmail(email);
    setUserAvatar("");
    setUserRoleState(role);

    try {
      const session: StoredSession = {
        type: "role",
        name,
        email,
        role
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    toast.success(`Authenticated with ${roleName || role} credentials`);
    return true;
  };

  const logout = async () => {
    await signOutUser();
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail("");
    setUserAvatar("");
    
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }

    toast.info("Signed out from SOC session. Redirecting to home page...");
    router.push("/");
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    const { name, email } = getRoleName(role);
    if (!firebaseUser) {
      setUserName(name);
      setUserEmail(email);
    }
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        session.role = role;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }
    } catch {
      // ignore
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
        isAuthenticated,
        isFirebaseLoading: authLoading,
        authLoading,
        signInWithGoogle,
        loginWithCredentials,
        loginWithRole,
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


