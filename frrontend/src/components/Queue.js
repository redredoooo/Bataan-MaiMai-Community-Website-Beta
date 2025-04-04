import React, { useEffect, useState } from "react";
import { getQueue, getCurrentlyPlaying } from "../services/firestoreService";

function Queue() {
  const [queue, setQueue] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState([]);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    async function fetchData() {
      try {
        const queueData = await getQueue();
        const playingData = await getCurrentlyPlaying();
        setQueue(queueData);
        setCurrentlyPlaying(playingData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later."); // Set error message
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center">Currently Playing</h2>
          <ul>
            {currentlyPlaying.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title text-center">Queue</h2>
          <ul>
            {queue.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Queue;
