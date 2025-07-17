// components/Layout.jsx
import React from "react";
import Head from "next/head";
import Navbar from "./navbar";
import { FaFacebookSquare, FaYoutubeSquare } from "react-icons/fa";

export default function Layout({ children, pageTitle, pageDescription }) {
  const title = pageTitle
    ? `${pageTitle} | The Spirit Hub`
    : "The Spirit Hub";
  const description =
    pageDescription ||
    "Your destination for faith-driven media—sermons, podcasts, and community.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Navbar />

      <main style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
        {children}
      </main>

      <footer style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}>
        &copy; {new Date().getFullYear()} The Spirit Hub
        <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
          <a
            href="https://www.facebook.com/profile.php?id=61577753076153"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            style={{ color: "#666", margin: "0 0.5rem" }}
          >
            <FaFacebookSquare />
          </a>

          <a
            href="https://www.youtube.com/@thespirithubyt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            style={{ color: "#666", margin: "0 0.5rem" }}
          >
            <FaYoutubeSquare />
          </a>
        </div>
        <ins class="CANBMDDisplayAD" data-bmd-ad-unit="1219220520250620T142018403D8CD860AA710400BA7BB613989C34002" style={{display:"block"}}></ins>
        <script src="https://secureaddisplay.com/au/bmd/"></script>
      </footer>
    </>
  );
}