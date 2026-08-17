import React from 'react';

/**
 * Loader Component
 * Reusable loading indicator supporting multiple types:
 * - 'spinner': Standard spinning loader
 * - 'dots': AI typing animated dots
 * - 'card': Card layout with loading spinner and message
 */
const Loader = ({ type = 'spinner', message = 'Loading...', size = 'md' }) => {
  if (type === 'dots') {
    return (
      <div className="typing-indicator" aria-label="AI is typing">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="spinner primary" style={{ width: '28px', height: '28px' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="spinner"
      style={{
        width: size === 'sm' ? '16px' : size === 'lg' ? '28px' : '20px',
        height: size === 'sm' ? '16px' : size === 'lg' ? '28px' : '20px',
      }}
    ></div>
  );
};

export default Loader;
