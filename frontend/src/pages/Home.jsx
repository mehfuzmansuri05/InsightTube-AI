import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadBox from '../components/UploadBox';
import ChatBox from '../components/ChatBox';
import { uploadVideo, askQuestion } from '../api/api';

/**
 * Home Page Component
 * Main layout coordinating application state:
 * - Current video state (videoId, processedUrl)
 * - Chat message history
 * - Loading and error states for video analysis & Q&A operations
 */
const Home = () => {
  const [videoId, setVideoId] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  // Formats current time into a clean string (e.g., 2:45 PM)
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Handles video upload analysis workflow
   */
  const handleUploadVideo = async (url) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Call existing upload API layer function
      const extractedVidId = await uploadVideo(url);

      if (extractedVidId) {
        setVideoId(extractedVidId);
        setCurrentUrl(url);
        setMessages([]); // Reset chat history for newly loaded video
      } else {
        setUploadError('Failed to extract video ID from response. Please try again.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      
      // Parse FastAPI error detail or network error
      const detail = err.response?.data?.detail;
      if (detail === 'Invalid YouTube URL.') {
        setUploadError('Invalid YouTube URL. Please check the link and try again.');
      } else if (detail === 'Transcript not available.') {
        setUploadError('Transcript is not available for this video (no captions/subtitles found).');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setUploadError('Unable to connect to the server. Please verify the backend is running at http://127.0.0.1:8000.');
      } else {
        setUploadError(typeof detail === 'string' ? detail : 'Something went wrong while processing the video. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Resets active video state to analyze another URL
   */
  const handleResetVideo = () => {
    setVideoId(null);
    setCurrentUrl('');
    setMessages([]);
    setUploadError(null);
    setChatError(null);
  };

  /**
   * Handles sending a question to the AI chat backend
   */
  const handleSendMessage = async (userQuery) => {
    if (!videoId || !userQuery.trim()) return;

    setChatError(null);

    // 1. Instantly append user question to chat UI
    const userMsg = {
      id: Date.now(),
      text: userQuery,
      sender: 'user',
      timestamp: getFormattedTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // 2. Call existing chat API layer function
      const answer = await askQuestion(videoId, userQuery);

      // 3. Append AI response
      const aiMsg = {
        id: Date.now() + 1,
        text: answer || 'No response returned from server.',
        sender: 'ai',
        timestamp: getFormattedTime()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat Error:', err);
      
      const detail = err.response?.data?.detail;
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setChatError('Unable to connect to the server. Please check your network or backend service.');
      } else {
        setChatError(typeof detail === 'string' ? detail : 'Something went wrong while generating the answer. Please try again.');
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar isVideoLoaded={!!videoId} videoId={videoId} />

      <main className="main-content">
        <UploadBox
          onUploadSuccess={handleUploadVideo}
          currentVideoId={videoId}
          currentUrl={currentUrl}
          onResetVideo={handleResetVideo}
          isLoading={isUploading}
          error={uploadError}
          setError={setUploadError}
        />

        <ChatBox
          videoId={videoId}
          messages={messages}
          isChatLoading={isChatLoading}
          onSendMessage={handleSendMessage}
          chatError={chatError}
          setChatError={setChatError}
        />
      </main>
    </div>
  );
};

export default Home;
