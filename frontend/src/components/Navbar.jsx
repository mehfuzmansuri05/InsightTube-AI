import React from 'react';

/**
 * Navbar Component
 * Application header with branding and system status indicator.
 */
const Navbar = ({ isVideoLoaded, videoId }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>InsightTube <span className="gradient-accent-text">AI</span></span>
            <span className="brand-badge">RAG Chat</span>
          </div>
        </a>

        <div className="navbar-status">
          <span className={`status-dot ${isVideoLoaded ? '' : 'inactive'}`}></span>
          <span>{isVideoLoaded ? `Connected (${videoId})` : 'Ready to analyze'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
