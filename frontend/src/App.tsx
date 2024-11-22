import React, { useState } from 'react';
import VideoUploader from './components/videoUploader.tsx';
import ResultDisplay from './components/resultDisplay.tsx';
import { DetectionResult } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  const handleDetectionComplete = (result: DetectionResult) => {
    setDetectionResult(result);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sign Language Video to Text Translator</h1>
      </header>
      <main>
        <VideoUploader onDetectionComplete={handleDetectionComplete} />
        {detectionResult && (
          <ResultDisplay 
            labels={detectionResult.labels} 
            confidences={detectionResult.confidences} 
            sentence={detectionResult.sentence} 
          />
        )}
      </main>
    </div>
  );
};

export default App;