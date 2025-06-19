import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import styles from "../styles/sermons.module.css";

// ----------------------
// Utility Functions
// ----------------------
const decodeHtmlEntities = (str = "") => decode(str);

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

// ----------------------
// Sermons Component
// ----------------------
const Sermons = ({ initialConfig, initialSermons }) => {
  const [pageConfig] = useState(initialConfig);
  const [sermons, setSermons] = useState(initialSermons || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(
    initialConfig.defaultSort || "likeCount"
  );
  const [activeSubcat, setActiveSubcat] = useState(
    initialConfig.subcategories?.[0] || ""
  );
  const [searchQuery, setSearchQuery] = useState(
    initialConfig.subcategories?.[0] || initialConfig.searchQuery || ""
  );
  const [limit, setLimit] = useState(6);

  const sortOrderLabels = {
    likeCount: "Most Liked",
    viewCount: "Most Viewed",
    publishedAt: "Newest First",
    commentCount: "Most Comments",
  };

  // adjust items per page on resize
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setLimit(w < 600 ? 4 : w < 1024 ? 6 : 8);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // fetch sermons on subcat/sort/page change
  useEffect(() => {
    if (page === 1 && sermons.length) return;
    setLoading(true);
    fetch(
      `https://faith-hub-backend.onrender.com/api/videos/${encodeURIComponent(
        searchQuery
      )}?page=${page}&limit=${limit}&sort=${sortOrder}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (sortOrder === "commentCount") {
          data = data
            .map((v) => ({ ...v, commentCount: parseInt(v.commentCount) || 0 }))
            .sort((a, b) => b.commentCount - a.commentCount);
        }
        setSermons((prev) => [...prev, ...data]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchQuery, sortOrder, page, limit]);

  return (
    <div className={styles.sermonsContainer}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1>{pageConfig.title}</h1>
        <p>{pageConfig.description}</p>

        <div className={styles.heroButtons}>
          {pageConfig.subcategories?.map((subcat) => (
            <button
              key={subcat}
              aria-pressed={activeSubcat === subcat}
              className={`${styles.btnCategory} ${
                activeSubcat === subcat ? styles.active : ""
              }`}
              onClick={() => {
                setActiveSubcat(subcat);
                setSearchQuery(subcat);
                setPage(1);
                setSermons([]);
              }}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className={styles.sortingButtons}>
        {Object.entries(sortOrderLabels).map(([key, label]) => (
          <button
            key={key}
            aria-pressed={sortOrder === key}
            className={`${styles.btnSort} ${
              sortOrder === key ? styles.active : ""
            }`}
            onClick={() => {
              setSortOrder(key);
              setPage(1);
              setSermons([]);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <h2>
        Showing “{activeSubcat}” — Sorted by {sortOrderLabels[sortOrder]}
      </h2>

      {/* Grid */}
      <div className={styles.sermonsGrid}>
        {sermons.map((video) => (
          <div key={video.videoId} className={styles.sermonCard}>
            <div className={styles.videoFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={decodeHtmlEntities(video.title)}
                allowFullScreen
              />
            </div>
            <div className={styles.videoDetails}>
              <h3>{decodeHtmlEntities(video.title)}</h3>
            </div>
            <div className={styles.videoStats}>
              Views: {formatNumber(video.viewCount)} | Likes:{" "}
              {formatNumber(video.likeCount)} | Comments:{" "}
              {formatNumber(video.commentCount)} | Published:{" "}
              {formatDate(video.publishedAt)}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <button
        className={styles.loadMoreBtn}
        onClick={() => setPage((p) => p + 1)}
        disabled={loading}
      >
        {loading ? "Loading…" : "Load More Sermons"}
      </button>
    </div>
  );
};

export default Sermons;