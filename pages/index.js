import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  // Hard-coded featured sermon for SSR
  const featured = {
    id: "ZA0_i_dXjNU",
    snippet: {
      title: "Lord I Don't Get This, HELP Me | Pastor Greg Laurie Sermon",
      description:
        "In this sermon, Pastor Greg Laurie addresses doubt and shows that doubts are normal—feel free to bring them to God for help.",
    },
  };

  // Styles (extract to CSS if you prefer)
  const hero = {
    textAlign: "center",
    padding: "3rem 1rem",
    background: "url('/img/sermons_bg.jpg') center/cover no-repeat #222",
    color: "#fff",
  };
  const iframeWrap = {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%",
    marginBottom: "1.5rem",
  };
  const iframe = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
    borderRadius: 8,
  };
  const btn = {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#FFD700",
    color: "#2C3E50",
    borderRadius: 5,
    textDecoration: "none",
    fontWeight: "bold",
  };
  const info = {
    maxWidth: 700,
    margin: "3rem auto",
    padding: "0 1rem",
    textAlign: "center",
  };

  return (
    <>
      <Head>
        <title>The Spirit Hub</title>
        <meta
          name="description"
          content="Your destination for faith-driven media—uplifting sermons, thought-provoking podcasts, and community."
        />
      </Head>
      
      <section style={info}>
        <h2>Welcome to The Spirit Hub</h2>
        <p>
          The Spirit Hub is your destination for inspirational sermons designed
          to empower and uplift your spiritual journey. Discover insightful
          teachings and messages that help you grow in faith and overcome
          life’s challenges.
        </p>
        <p>
          Explore our curated collections and join a community inspired by hope
          and perseverance.
        </p>
        <Link href="/sermons/faithchristianliving" style={btn}>
          Start Exploring
        </Link>
      </section>
      <section style={hero}>
        <div style={iframeWrap}>
          <iframe
            src={`https://www.youtube.com/embed/${featured.id}`}
            title={featured.snippet.title}
            allowFullScreen
            style={iframe}
          />
        </div>
        <h1>{featured.snippet.title}</h1>
        <p>{featured.snippet.description}</p>
      </section>

    </>
  );
}