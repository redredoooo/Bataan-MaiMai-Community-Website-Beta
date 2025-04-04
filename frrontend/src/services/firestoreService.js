import { addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { queueCollection, currentlyPlayingCollection, gameHistoryCollection } from "../firebase";

// Add a player to the queue
export async function addPlayerToQueue(player) {
  try {
    const docRef = await addDoc(queueCollection, player);
    return docRef.id;
  } catch (error) {
    console.error("Error adding player to queue:", error);
    throw error;
  }
}

// Get all players in the queue
export async function getQueue() {
  try {
    const snapshot = await getDocs(queueCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw error;
  }
}

// Delete a player from the queue
export async function deletePlayerFromQueue(playerId) {
  try {
    const playerDoc = doc(queueCollection, playerId);
    await deleteDoc(playerDoc);
  } catch (error) {
    console.error("Error deleting player from queue:", error);
    throw error;
  }
}

// Update a player's data in the queue
export async function updatePlayerInQueue(playerId, updates) {
  try {
    const playerDoc = doc(queueCollection, playerId);
    await updateDoc(playerDoc, updates);
    } catch (error) {
      console.error("Error updating player in queue:", error);
      throw error;
    }
  }

// Add currently playing players
export async function setCurrentlyPlaying(players) {
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
export async function getCurrentlyPlaying() {
  try {
    const snapshot = await getDocs(currentlyPlayingCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching currently playing players:", error);
    throw error;
  }
}

// Add a game history entry
export async function addGameHistoryEntry(entry) {
  try {
    await addDoc(gameHistoryCollection, entry);
  } catch (error) {
    console.error("Error adding game history entry:", error);
    throw error;
  }
}

// Get all game history entries
export async function getGameHistory() {
  try {
    const snapshot = await getDocs(gameHistoryCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw error;
  }
}

// Clear game history
export async function clearGameHistory() {
  try {
    const snapshot = await getDocs(gameHistoryCollection);
    snapshot.forEach(async (doc) => await deleteDoc(doc.ref));
  } catch (error) {
    console.error("Error clearing game history:", error);
    throw error;
  }
}
