import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./admin.css";

// A separate component for each video row to handle preview toggle
const VideoRow = ({ video, updateVideoStatus }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <tr>
      <td>
        {!showPreview ? (
          <button onClick={() => setShowPreview(true)}>Show Preview</button>
        ) : (
          <div>
            <button onClick={() => setShowPreview(false)}>Hide Preview</button>
            <iframe
              width="320"
              height="180"
              src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            ></iframe>
          </div>
        )}
      </td>
      <td>{video.title}</td>
      <td>{video.status}</td>
      <td>
        <button onClick={() => updateVideoStatus(video._id, "Published")}>
          Publish
        </button>
        <button onClick={() => updateVideoStatus(video._id, "Unpublished")}>
          Unpublish
        </button>
        <button onClick={() => updateVideoStatus(video._id, "Needs Review")}>
          Reset Review
        </button>
      </td>
    </tr>
  );
};

const AdminPanel = () => {
  const { pageId } = useParams();
  const [pageConfig, setPageConfig] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // Limit videos to 10 at a time
  const [hasMore, setHasMore] = useState(true);

  // New state for filter by status
  const [filter, setFilter] = useState("Needs Review");

  // Fetch page configuration if a pageId is provided
  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        const response = await fetch(
          `https://faith-hub-backend.onrender.com/api/pages/${pageId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch page configuration");
        }
        const data = await response.json();
        setPageConfig(data);
      } catch (err) {
        console.error("Error fetching page configuration:", err);
        setError("Error fetching page configuration");
      } finally {
        setLoadingPage(false);
      }
    };

    if (pageId) {
      fetchPageConfig();
    } else {
      setLoadingPage(false);
    }
  }, [pageId]);

  // Fetch videos based on filter and pagination
  const fetchFilteredVideos = async (currentPage, statusFilter) => {
    try {
      const response = await fetch(
        `https://faith-hub-backend.onrender.com/api/admin/videos?status=${encodeURIComponent(
          statusFilter
        )}&page=${currentPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch videos for review");
      }
      const data = await response.json();
      if (data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      // Reset videos when on the first page
      if (currentPage === 1) {
        setVideos(data);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...data]);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to fetch videos for review");
    } finally {
      setLoadingVideos(false);
    }
  };

  // Fire the fetch when the page or filter changes
  useEffect(() => {
    setLoadingVideos(true);
    fetchFilteredVideos(page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  // Update video status (Publish, Unpublish, or Reset Review)
  const updateVideoStatus = async (videoId, newStatus) => {
    try {
      const response = await fetch(
        `https://faith-hub-backend.onrender.com/api/admin/videos/${videoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Failed to update status. Response status:",
          response.status,
          "Response text:",
          errorData
        );
        throw new Error("Failed to update video status");
      }

      const updatedVideo = await response.json();
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? updatedVideo : video
        )
      );
    } catch (err) {
      console.error("Error updating video status:", err);
      alert("Error updating video status");
    }
  };

  if (loadingPage || loadingVideos) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-panel">
      {pageConfig ? (
        <div className="page-config">
          <h1>Admin Panel - {pageConfig.title}</h1>
          <p>{pageConfig.description}</p>
        </div>
      ) : (
        <h1>Admin Panel: Videos</h1>
      )}

      {/* Filters Section */}
      <div className="filters">
        <button
          className={filter === "Needs Review" ? "active" : ""}
          onClick={() => {
            setFilter("Needs Review");
            setPage(1);
          }}
        >
          Needs Review
        </button>
        <button
          className={filter === "Published" ? "active" : ""}
          onClick={() => {
            setFilter("Published");
            setPage(1);
          }}
        >
          Published
        </button>
        <button
          className={filter === "Unpublished" ? "active" : ""}
          onClick={() => {
            setFilter("Unpublished");
            setPage(1);
          }}
        >
          Unpublished
        </button>
      </div>

      {videos.length === 0 ? (
        <p>No videos for the selected filter.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <VideoRow
                key={video._id}
                video={video}
                updateVideoStatus={updateVideoStatus}
              />
            ))}
          </tbody>
        </table>
      )}

      {hasMore && (
        <button className="load-more-btn" onClick={() => setPage((prev) => prev + 1)}>
          Load More Videos
        </button>
      )}
    </div>
  );
};

export default AdminPanel;