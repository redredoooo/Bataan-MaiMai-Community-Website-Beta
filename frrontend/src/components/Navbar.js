import React from "react";

function Navbar({ navigateTo }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">Bataan MaiMai Community</a>
        <div className="d-flex">
          <button className="btn btn-primary me-2" onClick={() => navigateTo("landing")}>Home</button>
          <button className="btn btn-primary me-2" onClick={() => navigateTo("queue")}>Queue</button>
          <button className="btn btn-primary me-2" onClick={() => navigateTo("history")}>History</button>
          <button className="btn btn-primary" onClick={() => navigateTo("admin")}>Admin</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
