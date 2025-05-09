import React, { useState } from 'react';
import { ResultDisplayProps } from '../types';
import '../styles/ResultDisplay.css';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  labels, 
  confidences, 
  sentence,
  timestamps,
  summary
}) => {
  const [activeTab, setActiveTab] = useState<'sentence' | 'details'>('sentence');

  // Format timestamp to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="result-display">
      <h2 className="result-title">Detection Results</h2>
      
      <div className="summary-container">
        <div className="summary-icon">✨</div>
        <p className="summary-text">{summary}</p>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'sentence' ? 'active' : ''}`}
          onClick={() => setActiveTab('sentence')}
        >
          Translated Sentence
        </button>
        <button 
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Sign Details
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'sentence' ? (
          <div className="sentence-tab">
            <div className="sentence-container">
              <div className="ai-badge">
                <span className="ai-icon">🤖</span>
                <span className="ai-text">Gemini 1.5 Pro</span>
              </div>
              <p className="sentence-text">{sentence}</p>
            </div>
          </div>
        ) : (
          <div className="details-tab">
            <div className="result-grid">
              <div className="result-section">
                <div className="section-header">
                  <h3>Detected Signs</h3>
                  <span className="badge">{labels.length}</span>
                </div>
                <div className="label-list">
                  {labels.map((label, index) => (
                    <div key={index} className="label-item">
                      <div className="label-info">
                        <span className="label-text">{label}</span>
                        <span className="label-time">{formatTime(timestamps[index])}</span>
                      </div>
                      <span className="label-index">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="result-section">
                <div className="section-header">
                  <h3>Confidence Scores</h3>
                </div>
                <div className="confidence-list">
                  {confidences.map((confidence, index) => (
                    <div key={index} className="confidence-item">
                      <div className="confidence-bar-container">
                        <div 
                          className="confidence-bar" 
                          style={{ width: `${confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="confidence-value">
                        {(confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button className="action-btn share-btn">
          <span className="btn-icon">📤</span>
          Share Results
        </button>
        <button className="action-btn download-btn">
          <span className="btn-icon">📥</span>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;