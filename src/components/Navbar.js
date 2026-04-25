import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const links = [
    { path: "/ajout", label: "Ajouter" },
    { path: "/liste", label: "Liste" },
    { path: "/bilan", label: "Bilan" },
  ];

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#121212" }}>
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand fw-bold fs-4 text-light"
          to="/"
          style={{ letterSpacing: "1.2px" }}
        >
          Gestion Appartements
        </Link>

        <button
          className="navbar-toggler btn-outline-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "#bbb" }}
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {links.map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <Link
                  to={path}
                  className={`nav-link px-3 py-2 rounded ${
                    location.pathname === path
                      ? "active fw-semibold text-white bg-secondary"
                      : "text-light"
                  }`}
                  style={{ transition: "background-color 0.3s ease" }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== path)
                      e.currentTarget.style.backgroundColor = "#2c2c2c";
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== path)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="nav-item ms-3">
              <button
                onClick={onLogout}
                className="btn btn-outline-light px-3 py-2 rounded"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
