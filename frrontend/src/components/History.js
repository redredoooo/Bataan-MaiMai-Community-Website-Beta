import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.emit("requestGameHistory");
    socket.on("gameHistoryUpdate", (data) => setHistory(data));
    return () => socket.off("gameHistoryUpdate");
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Game History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.players.join(" vs ")} - {new Date(entry.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
