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

  return (
    <>
      <Head>
        <title>The Spirit Hub</title>
        <meta
          name="description"
          content="Your destination for faith-driven media—uplifting sermons, thought-provoking podcasts, and community."
        />
      </Head>

      <section className="info">
        <h2>Welcome to The Spirit Hub</h2>
        <p>
          The Spirit Hub is your destination for inspirational sermons designed
          to empower and uplift your spiritual journey. Discover insightful
          teachings and messages that help you grow in faith and overcome
          life's challenges.
        </p>
        <p>
          Explore our curated collections and join a community inspired by hope
          and perseverance.
        </p>
        <Link href="/sermons/faithchristianliving" className="btn">
          Start Exploring
        </Link>
      </section>

      <section className="hero">
        <div className="iframeWrap">
          <iframe
            src={`https://www.youtube.com/embed/${featured.id}`}
            title={featured.snippet.title}
            allowFullScreen
            className="responsiveIframe"
          />
        </div>
        <h1>{featured.snippet.title}</h1>
        <p>{featured.snippet.description}</p>
      </section>
    </>
  );
}