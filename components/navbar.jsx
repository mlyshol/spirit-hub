import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo as link */}
      <Link href="/" className={styles.logo} onClick={closeMenu}>
        <img
          src="/img/logo.png"
          alt="The Spirit Hub"
          className={styles.logoImg}
        />
        <span className={styles.logoTxt}>The Spirit Hub</span>
      </Link>

      {/* Hamburger */}
      <div
        className={`${styles.hamburger} ${
          menuOpen ? styles.open : ""
        }`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>

      {/* Navigation Links */}
      <ul
        className={`${styles.navLinks} ${
          menuOpen ? styles.active : ""
        }`}
      >
        <li>
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/sermons/faithchristianliving" onClick={closeMenu}>
            Faith &amp; Christian Living
          </Link>
        </li>
        <li>
          <Link href="/sermons/churchleadership" onClick={closeMenu}>
            Church &amp; Leadership
          </Link>
        </li>
        <li>
          <Link href="/sermons/biblicalbooks" onClick={closeMenu}>
            Biblical Books &amp; Teachings
          </Link>
        </li>
        <li>
          <Link href="/sermons/featuredpastors" onClick={closeMenu}>
            Featured Pastors
          </Link>
        </li>
        <li>
          <a
            href="https://www.paypal.com/ncp/payment/K7TZPRBA2VY7U"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className={styles.supportLink}
          >
            Support our Work
          </a>
        </li>
      </ul>
    </nav>
);
}