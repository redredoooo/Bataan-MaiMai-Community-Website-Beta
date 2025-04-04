const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require("firebase/firestore");
require("dotenv").config();

// Validate environment variables
const requiredEnvVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore collections
const queueCollection = collection(db, "queue");
const currentlyPlayingCollection = collection(db, "currentlyPlaying");
const gameHistoryCollection = collection(db, "gameHistory");

// Add a player to the queue
async function addPlayerToQueue(player) {
  try {
    await addDoc(queueCollection, player);
  } catch (error) {
    console.error("Error adding player to queue:", error);
    throw error;
  }
}

// Get all players in the queue
async function getQueue() {
  try {
    const snapshot = await getDocs(queueCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw error;
  }
}

// Delete a player from the queue
async function deletePlayerFromQueue(playerId) {
  try {
    await deleteDoc(doc(queueCollection, playerId));
  } catch (error) {
    console.error("Error deleting player from queue:", error);
    throw error;
  }
}

// Add currently playing players
async function setCurrentlyPlaying(players) {
  try {
    const snapshot = await getDocs(currentlyPlayingCollection);
    snapshot.forEach(async (doc) => await deleteDoc(doc.ref)); // Clear existing data
    for (const player of players) {
      await addDoc(currentlyPlayingCollection, player);
    }
  } catch (error) {
    console.error("Error setting currently playing players:", error);
    throw error;
  }
}

// Get currently playing players
async function getCurrentlyPlaying() {
  try {
    const snapshot = await getDocs(currentlyPlayingCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching currently playing players:", error);
    throw error;
  }
}

// Add a game history entry
async function addGameHistoryEntry(entry) {
  try {
    await addDoc(gameHistoryCollection, entry);
  } catch (error) {
    console.error("Error adding game history entry:", error);
    throw error;
  }
}

// Get all game history entries
async function getGameHistory() {
  try {
    const snapshot = await getDocs(gameHistoryCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw error;
  }
}

// Clear game history
async function clearGameHistory() {
  try {
    const snapshot = await getDocs(gameHistoryCollection);
    snapshot.forEach(async (doc) => await deleteDoc(doc.ref));
  } catch (error) {
    console.error("Error clearing game history:", error);
    throw error;
  }
}

module.exports = {
  addPlayerToQueue,
  getQueue,
  deletePlayerFromQueue,
  setCurrentlyPlaying,
  getCurrentlyPlaying,
  addGameHistoryEntry,
  getGameHistory,
  clearGameHistory,
};
