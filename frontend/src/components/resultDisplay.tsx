import React from 'react';
import { ResultDisplayProps } from '../types';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  labels, 
  confidences, 
  sentence 
}) => {
  return (
    <div className="result-display">
      <div className="result-section">
        <h2>Detected Labels</h2>
        <ul>
          {labels.map((label, index) => (
            <li key={index}>
              {label}
              <span className="badge">{index + 1}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="result-section">
        <h2>Confidence Scores</h2>
        <ul>
          {confidences.map((confidence, index) => (
            <li key={index}>
              Label Confidence
              <span className="confidence-value">
                {(confidence * 100).toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="result-section">
         <h2>Generated Sentence</h2>
        <p>{sentence}</p>
      </div>
    </div>
  );
};

export default ResultDisplay;