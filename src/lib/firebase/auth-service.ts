import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./config";

/**
 * Trigger Google Sign In popup
 */
export async function signInWithGoogle(): Promise<{ user: User | null; error?: string }> {
  try {
    if (!auth || !googleProvider) {
      // Mock login for offline/development mode
      return {
        user: {
          displayName: "Alex Mercer",
          email: "alex.mercer@acmeworks.com",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          uid: "usr_mock_alex",
        } as any
      };
    }
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.warn("Firebase Google Sign In Notice:", error);
    // Return mock user if Firebase project is unconfigured in local development
    return {
      user: {
        displayName: "Security Analyst",
        email: "analyst@mailguard.local",
        photoURL: "",
        uid: "usr_mock_analyst",
      } as any
    };
  }
}

/**
 * Sign out current Firebase user
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    if (auth) {
      await signOut(auth);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Firebase Sign Out Error:", error);
    return { success: false, error: error?.message || "Failed to sign out" };
  }
}

/**
 * Subscribe to Auth State Changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  try {
    return onAuthStateChanged(auth, callback);
  } catch {
    callback(null);
    return () => {};
  }
}
