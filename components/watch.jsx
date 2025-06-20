import React from 'react';
import styles from "../styles/sermons.module.css";
const Watch = ({ video }) => {
  if (!video) {
    return <div>No video found.</div>;
  }

  return (
    <div
      className="video-container"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        background: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <h2>{video.title}</h2>
        <div className={styles.videoWrapper}>
            <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allowFullScreen
            className={styles.responsiveIframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
      <div className="details" style={{ marginTop: '15px' }}>
        <p>
          <strong>Views:</strong> {video.viewCount} |{' '}
          <strong>Likes:</strong> {video.likeCount} |{' '}
          <strong>Comments:</strong> {video.commentCount} |{' '}
          <strong>Published on:</strong>{' '}
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
        <p>
            {video.description}
        </p>
      </div>
    </div>
  );
};

export default Watch;