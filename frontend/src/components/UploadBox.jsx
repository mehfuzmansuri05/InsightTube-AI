import React, { useState } from 'react';
import Loader from './Loader';

/**
 * UploadBox Component
 * Manages YouTube URL input, video analysis submission, loading state,
 * error presentation, and active video confirmation.
 */
const UploadBox = ({ onUploadSuccess, currentVideoId, currentUrl, onResetVideo, isLoading, error, setError }) => {
  const [url, setUrl] = useState(currentUrl || '');

  // Quick client-side YouTube URL checker
  const isValidYouTubeUrl = (urlStr) => {
    if (!urlStr || !urlStr.trim()) return false;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
    return pattern.test(urlStr.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setError) setError(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      if (setError) setError('Please enter a YouTube video URL.');
      return;
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      if (setError) setError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...).');
      return;
    }

    onUploadSuccess(trimmedUrl);
  };

  const handleClear = () => {
    setUrl('');
    if (setError) setError(null);
  };

  // Thumbnail URL generator helper
  const getThumbnailUrl = (vidId) => {
    return vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : null;
  };

  return (
    <div className="glass-card upload-container">
      {currentVideoId ? (
        <div className="video-active-card">
          <div className="video-info">
            <img
              src={getThumbnailUrl(currentVideoId)}
              alt="YouTube Video Thumbnail"
              className="video-thumbnail"
              onError={(e) => {
                // Fallback image if thumbnail fails to load
                e.target.style.display = 'none';
              }}
            />
            <div className="video-details">
              <div className="video-status-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Indexed & Ready for Chat</span>
              </div>
              <span className="video-id-text">
                Video ID: <strong>{currentVideoId}</strong>
              </span>
            </div>
          </div>

          <button className="change-video-btn" onClick={onResetVideo}>
            Analyze Another Video
          </button>
        </div>
      ) : (
        <>
          <div className="upload-header">
            <h1 className="upload-title">
              Chat with any <span className="gradient-text">YouTube Video</span>
            </h1>
            <p className="upload-subtitle">
              Paste a YouTube video URL below to extract transcripts, build vector indices, and ask instant AI questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="input-wrapper">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FF0000"></polygon>
                </svg>
              </div>

              <input
                type="text"
                className="youtube-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error && setError) setError(null);
                }}
                disabled={isLoading}
              />

              {url && !isLoading && (
                <button type="button" className="clear-input-btn" onClick={handleClear} title="Clear input">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <button type="submit" className="upload-btn" disabled={isLoading || !url.trim()}>
              {isLoading ? (
                <>
                  <Loader size="sm" />
                  <span>Processing Video Transcript...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Analyze Video</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-banner">
              <div className="error-content">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
              <button className="close-error-btn" onClick={() => setError(null)} title="Dismiss">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadBox;
