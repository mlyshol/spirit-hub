import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./sermons.css";

// ----------------------
// Utility Functions
// ----------------------

// Decode HTML entities from a string (used for video titles)
const decodeHtmlEntities = (str) => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
};

// Format numbers into K, M, B when needed
const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// Format a date string as MM/DD/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// ----------------------
// Sermons Component
// ----------------------
const Sermons = () => {
  const { pageId } = useParams();

  // Page configuration state
  const [pageConfig, setPageConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Sermons and pagination state
  const [page, setPage] = useState(1);
  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(false);

  // Sorting, search, and category states
  const [sortOrder, setSortOrder] = useState("likeCount");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcat, setActiveSubcat] = useState("");

  // Dynamic limit based on screen size
  const [limit, setLimit] = useState(6);

  // Mapping for sort labels to display text
  const sortOrderLabels = {
    likeCount: "Most Liked",
    viewCount: "Most Viewed",
    publishedAt: "Newest First",
    commentCount: "Most Comments",
  };

  // ----------------------
  // Dynamic Limit on Resize
  // ----------------------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setLimit(4);
      } else if (width < 1024) {
        setLimit(6);
      } else {
        setLimit(8);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial limit

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----------------------
  // Fetch Page Configuration
  // ----------------------
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `https://faith-hub-backend.onrender.com/api/pages/${pageId}`
        );
        const configData = await response.json();

        setPageConfig(configData);
        setSortOrder(configData.defaultSort || "likeCount");

        if (configData.subcategories?.length > 0) {
          setActiveSubcat(configData.subcategories[0]);
          setSearchQuery(configData.subcategories[0]);
        } else {
          setSearchQuery(configData.searchQuery || "");
        }
      } catch (err) {
        console.error("Error fetching configuration:", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, [pageId]);

  // Reset sermons and pagination when the page configuration changes
  useEffect(() => {
    setSermons([]);
    setPage(1);
  }, [pageId]);

  // ----------------------
  // Fetch Sermons Based on Query, Sort, and Pagination
  // ----------------------
  useEffect(() => {
    const fetchSermons = async () => {
      setLoadingSermons(true);
      try {
        const url =
          `https://faith-hub-backend.onrender.com/api/videos/${encodeURIComponent(
            searchQuery
          )}?page=${page}&limit=${limit}&sort=${sortOrder}`;
        const response = await fetch(url);
        const data = await response.json();

        // If sorting by comment count require numeric conversion & sorting
        let sortedData = data;
        if (sortOrder === "commentCount") {
          sortedData = data
            .map((video) => ({
              ...video,
              commentCount: parseInt(video.commentCount, 10) || 0,
            }))
            .sort((a, b) => b.commentCount - a.commentCount);
        }

        setSermons((prevSermons) => [...prevSermons, ...sortedData]);
      } catch (err) {
        console.error("Error fetching sermons:", err);
      } finally {
        setLoadingSermons(false);
      }
    };

    if (searchQuery) {
      fetchSermons();
    }
  }, [searchQuery, sortOrder, page, limit]);

  // ----------------------
  // Render
  // ----------------------
  if (loadingConfig) return <p>Loading page configuration...</p>;
  if (!pageConfig) return <p>Error: Page configuration not found.</p>;

  return (
    <div className="sermons-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>{pageConfig.title}</h1>
        <p>{pageConfig.description}</p>
        <div className="hero-buttons">
          {pageConfig.subcategories?.map((subcat) => (
            <button
              key={subcat}
              onClick={(e) => {
                // If this subcategory is already active, do nothing
                if (activeSubcat === subcat) {
                  e.preventDefault();
                  return;
                }
                // Otherwise, update the filter and reset state
                setActiveSubcat(subcat);
                setSearchQuery(subcat);
                setPage(1); // Reset page when switching category
                setSermons([]); // Clear current sermons
              }}
              className={`btn-category ${activeSubcat === subcat ? "active" : ""}`}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Buttons */}
      <div className="sorting-buttons">
        <button
          onClick={(e) => {
            if (sortOrder === "likeCount") {
              e.preventDefault();
              return;
            }
            setSortOrder("likeCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "likeCount" ? "active" : ""}`}
        >
          {sortOrderLabels.likeCount}
        </button>
        <button
          onClick={(e) => {
            if (sortOrder === "viewCount") {
              e.preventDefault();
              return;
            }
            setSortOrder("viewCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "viewCount" ? "active" : ""}`}
        >
          {sortOrderLabels.viewCount}
        </button>
        <button
          onClick={(e) => {
            if (sortOrder === "publishedAt") {
              e.preventDefault();
              return;
            }
            setSortOrder("publishedAt");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "publishedAt" ? "active" : ""}`}
        >
          {sortOrderLabels.publishedAt}
        </button>
        <button
          onClick={(e) => {
            if (sortOrder === "commentCount") {
              e.preventDefault();
              return;
            }
            setSortOrder("commentCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "commentCount" ? "active" : ""}`}
        >
          {sortOrderLabels.commentCount}
        </button>
      </div>

      <h2>
        Showing Results for "{activeSubcat}" — Sorted by {sortOrderLabels[sortOrder]}
      </h2>
      {loadingSermons && <p>Loading sermons...</p>}

      {/* Sermons Grid */}
      <div className="sermons-grid">
        {sermons.map((video) => (
          <div key={video.videoId} className="sermon-card">
            <div className="video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={decodeHtmlEntities(video.title)}
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-details">
              <h3>{decodeHtmlEntities(video.title)}</h3>
            </div>
            <div className="video-stats">
              <p>
                Views: {formatNumber(video.viewCount)} | Likes: {formatNumber(video.likeCount)}{" "}
                | Comments: {formatNumber(video.commentCount)} | Published:{" "}
                {formatDate(video.publishedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button className="load-more-btn" onClick={() => setPage((prev) => prev + 1)}>
        Load More Sermons
      </button>
    </div>
  );
};

export default Sermons;