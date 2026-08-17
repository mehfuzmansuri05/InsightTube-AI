import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import Loader from './Loader';

/**
 * ChatBox Component
 * Handles user questions, chat history display, quick preset prompts,
 * auto-scroll behavior, and loading states during AI response generation.
 */
const ChatBox = ({ videoId, messages, isChatLoading, onSendMessage, chatError, setChatError }) => {
  const [question, setQuestion] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoId) return;
    if (chatError && setChatError) setChatError(null);

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isChatLoading) return;

    onSendMessage(trimmedQuestion);
    setQuestion('');
  };

  const handleKeyDown = (e) => {
    // Submit on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePresetClick = (promptText) => {
    if (!videoId || isChatLoading) return;
    onSendMessage(promptText);
  };

  const presetQuestions = [
    'What is the main topic discussed in this video?',
    'Can you summarize the key takeaways in bullet points?',
    'What are the most important conclusions or recommendations?'
  ];

  return (
    <div className="glass-card chat-container">
      {/* Header Bar */}
      <div className="chat-header">
        <div className="chat-header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Video Q&A Chat</span>
        </div>

        {videoId ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            Video Ready ({videoId})
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '12px' }}>
            No Video Loaded
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages">
        {!videoId ? (
          <div className="chat-empty-state">
            <div className="empty-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M10 9l5 3-5 3V9z"></path>
              </svg>
            </div>
            <h3 className="empty-title">Process a Video to Begin Chatting</h3>
            <p className="empty-desc">
              Please enter a YouTube video URL above and click <strong>Analyze Video</strong>. Once processing completes, you can ask any question about the video content.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 12L2.5 7.5"></path>
                <path d="M12 12v10"></path>
              </svg>
            </div>
            <h3 className="empty-title">Ask anything about this video!</h3>
            <p className="empty-desc">
              Try typing a question below or select one of these suggested starter prompts:
            </p>

            <div className="preset-prompts">
              {presetQuestions.map((q, idx) => (
                <button key={idx} className="preset-prompt-btn" onClick={() => handlePresetClick(q)}>
                  <span>"{q}"</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => <Message key={index} message={msg} />)
        )}

        {/* AI Thinking Indicator */}
        {isChatLoading && (
          <div className="message-wrapper ai">
            <div className="avatar ai-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 12L2.5 7.5"></path>
                <path d="M12 12v10"></path>
              </svg>
            </div>
            <div className="message-content">
              <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Thinking & retrieving context</span>
                <Loader type="dots" />
              </div>
            </div>
          </div>
        )}

        {/* Error notification banner in chat */}
        {chatError && (
          <div className="error-banner" style={{ margin: '8px 0' }}>
            <div className="error-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{chatError}</span>
            </div>
            <button className="close-error-btn" onClick={() => setChatError(null)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={videoId ? "Ask something about this video... (Press Enter to send)" : "Please analyze a video first to start chatting..."}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!videoId || isChatLoading}
          rows={1}
        />

        <button
          type="submit"
          className="send-btn"
          disabled={!videoId || !question.trim() || isChatLoading}
          title="Send question"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
