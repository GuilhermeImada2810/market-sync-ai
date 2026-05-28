import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANoRGcqV2x1G7LP8Wx4c5HtmNj90kmauk",
  authDomain: "market-sync-ai.firebaseapp.com",
  projectId: "market-sync-ai",
  storageBucket: "market-sync-ai.firebasestorage.app",
  messagingSenderId: "549756913311",
  appId: "1:549756913311:web:01427fc556349bda1e04aa",
  measurementId: "G-SBG90L8SFM",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);