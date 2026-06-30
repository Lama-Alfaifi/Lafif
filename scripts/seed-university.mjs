/**
 * Run once to add a test university to Firestore.
 * Usage: node scripts/seed-university.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";

// Read Firebase config from .env.local
const env = readFileSync(".env.local", "utf-8");
const get = (key) => env.match(new RegExp(`${key}=(.+)`))?.[1]?.trim();

const firebaseConfig = {
  apiKey:            get("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain:        get("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId:         get("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket:     get("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: get("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId:             get("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);

const universities = [
  {
    id:     "jazanu",
    name:   "جامعة جازان",
    domain: "stu.jazanu.edu.sa",
  },
  {
    id:     "kau",
    name:   "جامعة الملك عبدالعزيز",
    domain: "stu.kau.edu.sa",
  },
  {
    id:     "test_uni",
    name:   "جامعة تجريبية",
    domain: "test.edu",   // easy to use locally: user@test.edu
  },
];

for (const uni of universities) {
  await setDoc(doc(db, "universities", uni.id), {
    name:      uni.name,
    domain:    uni.domain,
    createdAt: new Date(),
  });
  console.log(`✓ Added: ${uni.name} (${uni.domain})`);
}

console.log("\nDone. You can now register with any of these email domains:");
universities.forEach((u) => console.log(`  • @${u.domain}`));
process.exit(0);
