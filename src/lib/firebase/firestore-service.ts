import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc
} from "firebase/firestore";
import { db } from "./config";
import { EmailAnalysis } from "@/types/analysis";
import { ThreatAlert } from "../data/mock-alerts";
import { InvestigationCase } from "@/types/investigation";

/**
 * Save an analyzed email to Firestore under user subcollection
 */
export async function saveEmailToCloud(userId: string, email: EmailAnalysis): Promise<boolean> {
  try {
    const docRef = doc(db, "users", userId, "emails", email.id);
    await setDoc(docRef, {
      ...email,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveEmail error:", error);
    return false;
  }
}

/**
 * Fetch all analyzed emails for a user from Firestore
 */
export async function getUserEmailsFromCloud(userId: string): Promise<EmailAnalysis[]> {
  try {
    const q = query(
      collection(db, "users", userId, "emails"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const emails: EmailAnalysis[] = [];
    snapshot.forEach((doc) => {
      emails.push(doc.data() as EmailAnalysis);
    });
    return emails;
  } catch (error) {
    console.warn("Firestore getUserEmails error:", error);
    return [];
  }
}

/**
 * Save an alert/notification to Firestore
 */
export async function saveAlertToCloud(userId: string, alert: ThreatAlert): Promise<boolean> {
  try {
    const docRef = doc(db, "users", userId, "alerts", alert.id);
    await setDoc(docRef, {
      ...alert,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveAlert error:", error);
    return false;
  }
}

/**
 * Fetch alerts from Firestore
 */
export async function getUserAlertsFromCloud(userId: string): Promise<ThreatAlert[]> {
  try {
    const q = query(
      collection(db, "users", userId, "alerts"),
      orderBy("detectedAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const alerts: ThreatAlert[] = [];
    snapshot.forEach((doc) => {
      alerts.push(doc.data() as ThreatAlert);
    });
    return alerts;
  } catch (error) {
    console.warn("Firestore getUserAlerts error:", error);
    return [];
  }
}

/**
 * Save an investigation case to Firestore
 */
export async function saveCaseToCloud(userId: string, caseObj: InvestigationCase): Promise<boolean> {
  try {
    const docRef = doc(db, "users", userId, "cases", caseObj.id);
    await setDoc(docRef, {
      ...caseObj,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveCase error:", error);
    return false;
  }
}

/**
 * Fetch cases from Firestore
 */
export async function getUserCasesFromCloud(userId: string): Promise<InvestigationCase[]> {
  try {
    const q = query(
      collection(db, "users", userId, "cases"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const cases: InvestigationCase[] = [];
    snapshot.forEach((doc) => {
      cases.push(doc.data() as InvestigationCase);
    });
    return cases;
  } catch (error) {
    console.warn("Firestore getUserCases error:", error);
    return [];
  }
}
