import React, { useState, useRef } from 'react';
import { uploadVideoForProcessing, startVideoRecording } from '../services/videoService.tsx';
import { VideoUploaderProps, DetectionResult } from '../types';

const VideoUploader: React.FC<VideoUploaderProps> = ({ onDetectionComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const result = await uploadVideoForProcessing(selectedFile);
      onDetectionComplete(result);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordVideo = async () => {
    try {
      setIsProcessing(true);
      const recordedBlob = await startVideoRecording();
      const recordedFile = new File([recordedBlob], 'recorded_video.webm', { type: 'video/webm' });
      setSelectedFile(recordedFile);
      
      const result = await uploadVideoForProcessing(recordedFile);
      onDetectionComplete(result);
    } catch (error) {
      console.error('Recording failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="video-uploader">
      <div className="file-input-container">
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          {selectedFile ? selectedFile.name : 'Choose Video File'}
        </button>
        <button 
          onClick={handleFileUpload} 
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Upload & Process'}
        </button>
        <button 
          onClick={handleRecordVideo} 
          disabled={isProcessing}
        >
          Record Video
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;