import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [featuredSermon, setFeaturedSermon] = useState(null);

  useEffect(() => {
    // Hard-coded featured sermon data
    const dummyFeatured = {
      id: "ZA0_i_dXjNU",
      snippet: {
        title: "Lord I Don't Get This, HELP Me | Pastor Greg Laurie Sermon",
        description:
          "In this sermon, Pastor Greg Laurie addresses doubt and shows that doubts are normal—feel free to bring them to God for help.",
      },
    };
    setFeaturedSermon(dummyFeatured);
  }, []);

  return (
    <div className="home-container">
      {/* Featured Sermon Section */}
      <section className="home-hero">
        {featuredSermon && (
          <div className="featured-sermon">
            <div className="responsive-iframe-container">
              <iframe
                src={`https://www.youtube.com/embed/${featuredSermon.id}`}
                title={featuredSermon.snippet.title}
                allowFullScreen
              ></iframe>
            </div>
            <div className="hero-content">
              <h1>{featuredSermon.snippet.title}</h1>
              <p>{featuredSermon.snippet.description}</p>
              <Link to="/faithchristianliving" className="btn-explore">
                Explore More Sermons
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Site Information Section */}
      <section className="home-info">
        <h2>Welcome to Spirit Hub</h2>
        <p>
          Spirit Hub is your destination for inspirational sermons designed to
          empower and uplift your spiritual journey. Discover insightful
          teachings and messages that help you grow in faith and overcome life’s
          challenges.
        </p>
        <p>
          Explore our curated collections and join a community inspired by hope
          and perseverance.
        </p>
        <Link to="/faithchristianliving" className="btn-join">
          Start Exploring
        </Link>
      </section>
    </div>
  );
};

export default Home;