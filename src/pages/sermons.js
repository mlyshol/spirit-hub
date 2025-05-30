import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./sermons.css";

// Utility function to decode HTML entities
const decodeHtmlEntities = (str) => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
};

// Utility function to format numbers (K, M, B)
const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// Utility function to format the published date as MM/DD/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const Sermons = () => {
  const { pageId } = useParams();

  // State for page configuration
  const [pageConfig, setPageConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // State for MongoDB sermons and pagination
  const [page, setPage] = useState(1);
  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(false);

  // States for sorting, search query, and active subcategory
  const [sortOrder, setSortOrder] = useState("likeCount");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcat, setActiveSubcat] = useState("");

  // New state: dynamic limit based on screen size
  const [limit, setLimit] = useState(6);

  // Mapping sort keys to display labels
  const sortOrderLabels = {
    likeCount: "Most Liked",
    viewCount: "Most Viewed",
    publishedAt: "Newest First",
    commentCount: "Most Comments",
  };

  // Listen for window resize to update the limit dynamically
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
    // Set initial limit based on current window width:
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch page configuration on pageId change
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`https://faith-hub-backend.onrender.com/api/pages/${pageId}`);
        const configData = await response.json();
        setPageConfig(configData);

        // Use the default sort (or "likeCount" as fallback)
        setSortOrder(configData.defaultSort || "likeCount");

        // Set active subcategory and search query
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

  // Reset sermons and pagination when pageId changes
  useEffect(() => {
    setSermons([]);
    setPage(1);
  }, [pageId]);

  // Fetch sermons when searchQuery, sortOrder, page, or limit changes
  useEffect(() => {
    const fetchSermons = async () => {
      setLoadingSermons(true);
      try {
        const response = await fetch(
          `https://faith-hub-backend.onrender.com/api/videos/${encodeURIComponent(
            searchQuery
          )}?page=${page}&limit=${limit}&sort=${sortOrder}`
        );
        const data = await response.json();

        // For commentCount sorting, ensure numeric conversion and proper sorting.
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
              onClick={() => {
                setActiveSubcat(subcat);
                setSearchQuery(subcat);
                setPage(1); // Reset page when changing category
                setSermons([]); // Clear old sermons when changing category
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
          onClick={() => {
            setSortOrder("likeCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "likeCount" ? "active" : ""}`}
        >
          Most Liked
        </button>
        <button
          onClick={() => {
            setSortOrder("viewCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "viewCount" ? "active" : ""}`}
        >
          Most Viewed
        </button>
        <button
          onClick={() => {
            setSortOrder("publishedAt");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "publishedAt" ? "active" : ""}`}
        >
          Newest First
        </button>
        <button
          onClick={() => {
            setSortOrder("commentCount");
            setPage(1);
            setSermons([]);
          }}
          className={`btn-sort ${sortOrder === "commentCount" ? "active" : ""}`}
        >
          Most Comments
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
                Views: {formatNumber(video.viewCount)} | Likes: {formatNumber(video.likeCount)} | Comments: {formatNumber(video.commentCount)} | Published: {formatDate(video.publishedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button className="load-more-btn" onClick={() => setPage((prevPage) => prevPage + 1)}>
        Load More Sermons
      </button>
    </div>
  );
};

export default Sermons;