import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        padding: "1rem"
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.25rem", margin: "1rem 0" }}>
        Oops—page not found.
      </p>
      <Link href="/" style={{
          color: "#FFD700",
          textDecoration: "underline",
          fontWeight: "bold"
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}