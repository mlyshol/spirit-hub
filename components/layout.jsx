// components/Layout.jsx
import React from "react";
import Head from "next/head";
import Navbar from "./navbar";

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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
        {children}
      </main>

      <footer style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}>
        &copy; {new Date().getFullYear()} The Spirit Hub
      </footer>
    </>
  );
}