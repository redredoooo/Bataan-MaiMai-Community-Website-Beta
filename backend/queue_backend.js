require("dotenv").config();
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

const {
  addPlayerToQueue,
  getQueue,
  deletePlayerFromQueue,
  setCurrentlyPlaying,
  getCurrentlyPlaying,
  addGameHistoryEntry,
  getGameHistory: getFirebaseGameHistory,
  clearGameHistory: clearFirebaseGameHistory,
} = require("./firebase_service");

let queue = [];
let currentlyPlaying = [];
let adminAuthenticated = false;
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

// Admin Login
io.on("connection", (socket) => {
  console.log("New client connected");

  // Emit initial data to the client
  getQueue().then((queueData) => {
    queue = queueData;
    socket.emit("queueUpdate", queue);
  });

  getCurrentlyPlaying().then((playingData) => {
    currentlyPlaying = playingData;
    socket.emit("playingUpdate", currentlyPlaying);
  });

  getFirebaseGameHistory().then((history) => {
    socket.emit("gameHistoryUpdate", history);
  });

  socket.on("adminLogin", async (password) => {
    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (isMatch) {
      adminAuthenticated = true;
      socket.emit("loginSuccess");
    } else {
      socket.emit("loginFailed");
    }
  });

  // Add Player
  socket.on("addPlayer", async (playerName) => {
    if (playerName) {
      const player = { name: playerName, paid: false };
      await addPlayerToQueue(player);
      queue = await getQueue();
      io.emit("queueUpdate", queue);
    } else {
      socket.emit("errorMessage", "Player name cannot be empty.");
    }
  });

  // Swap Players
  socket.on("swapPlayers", ({ pos1, pos2 }) => {
    if (pos1 >= 0 && pos2 >= 0 && pos1 < queue.length && pos2 < queue.length) {
      [queue[pos1], queue[pos2]] = [queue[pos2], queue[pos1]];
      io.emit("queueUpdate", queue);
    } else {
      socket.emit("errorMessage", "Invalid positions for swapping.");
    }
  });

  // Delete Top Pair
  socket.on("deleteTopPair", () => {
    if (queue.length >= 2) {
      queue.splice(0, 2);
    } else if (queue.length === 1) {
      queue.splice(0, 1);
    }
    io.emit("queueUpdate", queue);
  });

  // Delete Player by Position
  socket.on("deletePlayerByPosition", async (pos) => {
    if (pos >= 0 && pos < queue.length) {
      await deletePlayerFromQueue(queue[pos].id);
      queue = await getQueue();
      io.emit("queueUpdate", queue);
    }
  });

  // Mark Player as Paid
  socket.on("markPlayerPaid", (pos) => {
    if (pos >= 0 && pos < queue.length) {
      queue[pos].paid = true;
      io.emit("queueUpdate", queue);
    }
  });

  // Display Current Pair
  socket.on("displayCurrentPair", () => {
    if (queue.length >= 2) {
      socket.emit("displayCurrentPair", [queue[0].name, queue[1].name]);
    } else {
      socket.emit("displayCurrentPair", []);
    }
  });

  // Next Pair Playing - Replace Current Pair
  socket.on("nextPairPlaying", async () => {
    if (queue.length >= 2) {
      const pair = queue.splice(0, 2);
      const timestamp = new Date().toISOString();
      await setCurrentlyPlaying(pair);
      await addGameHistoryEntry({ players: pair.map((p) => p.name), timestamp });
      currentlyPlaying = await getCurrentlyPlaying();
      queue = await getQueue();
      const gameHistory = await getFirebaseGameHistory();
      io.emit("queueUpdate", queue);
      io.emit("playingUpdate", currentlyPlaying);
      io.emit("gameHistoryUpdate", gameHistory);
    } else {
      socket.emit("errorMessage", "Not enough players in the queue.");
    }
  });

  socket.on("requestGameHistory", async () => {
    const gameHistory = await getFirebaseGameHistory();
    socket.emit("gameHistoryUpdate", gameHistory);
  });

  socket.on("clearGameHistory", async () => {
    await clearFirebaseGameHistory();
    io.emit("gameHistoryUpdate", []);
  });

  // Clear Currently Playing
  socket.on("deleteCurrentlyPlaying", async () => {
    await setCurrentlyPlaying([]);
    currentlyPlaying = [];
    io.emit("playingUpdate", currentlyPlaying);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});