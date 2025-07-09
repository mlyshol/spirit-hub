import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import styles from "../styles/sermons.module.css";
import Link from 'next/link';

const decodeHtmlEntities = (str = "") => decode(str);
const formatNumber = (n) =>
  n >= 1_000_000_000 ? (n / 1_000_000_000).toFixed(1) + "B"
  : n >= 1_000_000     ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1_000         ? (n / 1_000).toFixed(1) + "K"
  : n?.toString() || "0";
const formatDate = (s) => {
  const d = new Date(s);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function Sermons({ initialConfig, initialSermons }) {
  const [pageConfig] = useState(initialConfig);
  const [sermons, setSermons] = useState(initialSermons || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(initialConfig.defaultSort || "likeCount");
  const [activeSubcat, setActiveSubcat] = useState(initialConfig.subcategories?.[0] || "");
  const [searchQuery, setSearchQuery] = useState(initialConfig.subcategories?.[0] || initialConfig.searchQuery || "");
  const [limit, setLimit] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  const sortOrderLabels = {
    likeCount: "Most Liked",
    viewCount: "Most Viewed",
    commentCount: "Most Comments",
    random: "Random",
  };

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 600);
      setLimit(w < 600 ? 4 : w < 1024 ? 6 : 8);
    };
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (page === 1 && sermons.length) return;
    setLoading(true);
    fetch(`https://faith-hub-backend.onrender.com/api/videos/${encodeURIComponent(searchQuery)}?page=${page}&limit=${limit}&sort=${sortOrder}`)
      .then((r) => r.json())
      .then((data) => {
        if (sortOrder === "commentCount") {
          data = data.map((v) => ({ ...v, commentCount: parseInt(v.commentCount) || 0 }))
                     .sort((a, b) => b.commentCount - a.commentCount);
        }
        else if (sortOrder === "random") {
          for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];}
        }

        setSermons((prev) => [...prev, ...data]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery, sortOrder, page, limit]);

  const handleSubcat = (val) => {
    if (val === activeSubcat) return;     
    setActiveSubcat(val);
    setSearchQuery(val);
    setPage(1);
    setSermons([]);
  };

  const handleSort = (val) => {
    if (val === sortOrder) return;
    setSortOrder(val);
    setPage(1);
    setSermons([]);
  };

  return (
    <div className={styles.sermonsContainer}>
      {/* Hero Header */}
      <div className={styles.hero}>
        <h1>{pageConfig.title}</h1>
        <p>{pageConfig.description}</p>

        {isMobile ? (
          <select className={styles.mobileSelect} value={activeSubcat} onChange={(e) => handleSubcat(e.target.value)}>
            {pageConfig.subcategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : (
          <div className={styles.heroButtons}>
            {pageConfig.subcategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.btnCategory} ${activeSubcat === cat ? styles.active : ""}`}
                onClick={() => handleSubcat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Options */}
      {isMobile ? (
        <select className={styles.mobileSelect} value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
          {Object.entries(sortOrderLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      ) : (
        <div className={styles.sortingButtons}>
          {Object.entries(sortOrderLabels).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.btnSort} ${sortOrder === key ? styles.active : ""}`}
              onClick={() => handleSort(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <h2>
        Showing “{activeSubcat}” — Sorted by {sortOrderLabels[sortOrder]}
      </h2>

      <div className={styles.sermonsGrid}>
    {sermons.map((v) => (
      <div key={v.videoId} className={styles.sermonCard}>
      <Link href={`/watch/${v._id}`}>
      {/* Thumbnail Image */}
        <div className={styles.thumbnailWrapper}>
          <img
            src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
            alt={decodeHtmlEntities(v.title)}
            className={styles.thumbnail}
          />
        </div>
       </Link>
      
        <div className={styles.videoDetails}>
          <h3>{decodeHtmlEntities(v.title)}</h3>
        </div>

      {/* Watch Button */}
      <Link href={`/watch/${v._id}`}>
      <div className={styles.watchNow}>
        <div className={styles.watchButton}>
          Watch Now
        </div>
      </div>
      </Link>
    </div>
  ))}
</div>

      <button
        className={styles.loadMoreBtn}
        onClick={() => setPage((prev) => prev + 1)}
        disabled={loading}
      >
        {loading ? "Loading…" : "Load More Sermons"}
      </button>
    </div>
  );
}