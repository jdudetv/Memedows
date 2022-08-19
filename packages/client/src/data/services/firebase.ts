import {
  doc,
  getDoc,
  getFirestore,
  increment,
  writeBatch,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

import { UserData } from "@memedows/types";

initializeApp({
  apiKey: "AIzaSyBS_U2ihP7VmI_253PbknLpgwD8ik48AXA",
  authDomain: "memedows.firebaseapp.com",
  projectId: "memedows",
  storageBucket: "memedows.appspot.com",
  messagingSenderId: "2006781696",
  appId: "1:2006781696:web:731d17b6bb9c8f267cede5",
  measurementId: "G-DSB5D9BNR3",
});

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();

export const initializeFirebase = async () => {
  signInWithEmailAndPassword(
    auth,
    import.meta.env.VITE_FIREBASE_EMAIL!,
    import.meta.env.VITE_FIREBASE_PASSWORD!
  );
};

export async function getUserData(id: string) {
  const user = await getDoc(doc(db, "users", id));
  if (!user.exists) return;
  return user.data() as UserData | undefined;
}

export async function updateitproperly(data: Record<number, number>) {
  const entries = [...Object.entries(data)];
  const batchesCount = Math.ceil(entries.length / 250);

  const batches = Array.from({ length: batchesCount }, () => writeBatch(db));

  entries.forEach(([user, xp], i) => {
    batches[Math.floor(i / 250)].update(doc(db, "users", user), {
      xp: increment(xp),
    });
  });

  return Promise.all(batches.map((b) => b.commit()));
}
