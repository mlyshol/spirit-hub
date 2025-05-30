import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">Faith-Hub</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/faithchristianliving">Faith & Christian Living</Link></li>
        <li><Link to="/churchleadership">Church & Leadership</Link></li>
        <li><Link to="/biblicalbooks">Biblical Books & Teachings</Link></li>
        <li><Link to="/featuredpastors">Featured Pastors</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;