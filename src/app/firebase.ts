import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA72lxh7qPCAIgZFiwfKz6uTayqZjoosL0",
  authDomain: "refine-problem-statement.firebaseapp.com",
  databaseURL: "https://refine-problem-statement-default-rtdb.firebaseio.com",
  projectId: "refine-problem-statement",
  storageBucket: "refine-problem-statement.firebasestorage.app",
  messagingSenderId: "409012314394",
  appId: "1:409012314394:web:2951322eeeeeed04fc4ca3",
  measurementId: "G-LNVR8WML6F"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
