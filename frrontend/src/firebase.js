import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5Pc_yxMGGR7EF0Fobz52I-9PXjMc3rGk",
  authDomain: "bataan-maimai-community.firebaseapp.com",
  projectId: "bataan-maimai-community",
  storageBucket: "bataan-maimai-community.appspot.com", // Fixed URL
  messagingSenderId: "159168139213",
  appId: "1:159168139213:web:c7ab59ff5cf95b50f2be84",
  measurementId: "G-YR9C3VC7YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore references
const db = getFirestore(app);
const queueCollection = collection(db, "queue");
const currentlyPlayingCollection = collection(db, "currentlyPlaying");
const gameHistoryCollection = collection(db, "gameHistory");

export { db, queueCollection, currentlyPlayingCollection, gameHistoryCollection, doc };
