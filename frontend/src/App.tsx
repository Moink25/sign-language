import React, { useState } from 'react';
import VideoUploader from './components/videoUploader.tsx';
import ResultDisplay from './components/resultDisplay.tsx';
import { DetectionResult } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleDetectionComplete = (result: DetectionResult) => {
    setDetectionResult(result);
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <div className="header-content">
          <h1>Sign Language Translator</h1>
          <p>Powered by Gemini 1.5 Pro AI</p>
        </div>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <main className="App-main">
        <section className="intro-section">
          <div className="intro-text">
            <h2>Translate Sign Language to Text</h2>
            <p>Upload or record sign language videos and our AI will convert them to text using advanced computer vision and Gemini 1.5 Pro.</p>
          </div>
        </section>
        
        <section className="upload-section">
          <VideoUploader onDetectionComplete={handleDetectionComplete} />
        </section>
        
        {detectionResult && (
          <section id="results-section" className="results-section">
            <ResultDisplay 
              labels={detectionResult.labels} 
              confidences={detectionResult.confidences} 
              sentence={detectionResult.sentence}
              timestamps={detectionResult.timestamps || []}
              summary={detectionResult.summary || ""}
            />
          </section>
        )}

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Video Recording</h3>
              <p>Record sign language directly from your browser</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Sign Detection</h3>
              <p>Advanced AI detects signs with high accuracy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Translation</h3>
              <p>Gemini 1.5 Pro generates natural sentences</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Confidence Scores</h3>
              <p>See detection confidence for each sign</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="App-footer">
        <p>Sign Language Recognition Project</p>
        <p>Powered by OpenRouter.ai and Gemini 1.5 Pro</p>
      </footer>
    </div>
  );
};

export default App;