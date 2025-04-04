import React from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Queue from "./components/Queue";
import History from "./components/History";
import Admin from "./components/Admin";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  // ...existing Firebase configuration...
};

// Initialize Firebase
initializeApp(firebaseConfig);
getAnalytics();

function App() {
  const [currentPage, setCurrentPage] = React.useState("landing");

  const navigateTo = (page) => {
    if (["landing", "queue", "history", "admin"].includes(page)) {
      setCurrentPage(page);
    } else {
      console.error("Invalid page navigation:", page);
    }
  };

  return (
    <div>
      <Navbar navigateTo={navigateTo} />
      {currentPage === "landing" && <LandingPage />}
      {currentPage === "queue" && <Queue />}
      {currentPage === "history" && <History />}
      {currentPage === "admin" && <Admin />}
    </div>
  );
}

export default App;
