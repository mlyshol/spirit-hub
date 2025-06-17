import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the hamburger menu.
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu on link click (for mobile)
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <h1 className="logo">Spirit Hub</h1>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/faithchristianliving" onClick={closeMenu}>
            Faith & Christian Living
          </Link>
        </li>
        <li>
          <Link to="/churchleadership" onClick={closeMenu}>
            Church & Leadership
          </Link>
        </li>
        <li>
          <Link to="/biblicalbooks" onClick={closeMenu}>
            Biblical Books & Teachings
          </Link>
        </li>
        <li>
          <Link to="/featuredpastors" onClick={closeMenu}>
            Featured Pastors
          </Link>
        </li>
        <li>
          {/* Hardcoded support link (update the href as needed) */}
          <a
            href="https://www.paypal.com/ncp/payment/K7TZPRBA2VY7U"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Support our Work
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;