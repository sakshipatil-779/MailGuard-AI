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
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.error("Firebase Google Sign In Error:", error);
    return { user: null, error: error?.message || "Failed to authenticate with Google" };
  }
}

/**
 * Sign out current Firebase user
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut(auth);
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
  return onAuthStateChanged(auth, callback);
}
