import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App";
import "./styles.css";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5Pc_yxMGGR7EF0Fobz52I-9PXjMc3rGk",
  authDomain: "bataan-maimai-community.firebaseapp.com",
  projectId: "bataan-maimai-community",
  storageBucket: "bataan-maimai-community.firebasestorage.app",
  messagingSenderId: "159168139213",
  appId: "1:159168139213:web:c7ab59ff5cf95b50f2be84",
  measurementId: "G-YR9C3VC7YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Updated rendering method
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
