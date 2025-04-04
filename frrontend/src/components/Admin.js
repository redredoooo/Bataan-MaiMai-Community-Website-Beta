import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Admin() {
  const [email, setEmail] = useState(""); // Added email input
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password) // Use dynamic email
      .then(() => setIsAuthenticated(true))
      .catch((error) => alert(`Login failed: ${error.message}`)); // Improved error handling
  };

  return (
    <div className="container mt-5">
      {!isAuthenticated ? (
        <div>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Admin Controls</h2>
          {/* Add admin controls here */}
        </div>
      )}
    </div>
  );
}

export default Admin;
