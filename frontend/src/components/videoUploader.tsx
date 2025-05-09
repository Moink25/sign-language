import React, { useState, useRef } from 'react';
import { uploadVideoForProcessing, startVideoRecording } from '../services/videoService.tsx';
import { VideoUploaderProps, DetectionResult } from '../types';
import '../styles/VideoUploader.css';

const VideoUploader: React.FC<VideoUploaderProps> = ({ onDetectionComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(fileUrl);
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

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: 'video/webm' });
        const recordedFile = new File([recordedBlob], 'recorded_video.webm', { type: 'video/webm' });
        setSelectedFile(recordedFile);
        
        const fileUrl = URL.createObjectURL(recordedBlob);
        setVideoPreviewUrl(fileUrl);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          handleStopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordAndProcess = async () => {
    try {
      setIsProcessing(true);
      
      if (!selectedFile) {
        throw new Error('No recorded video found');
      }
      
      const result = await uploadVideoForProcessing(selectedFile);
      onDetectionComplete(result);
    } catch (error) {
      console.error('Processing failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="video-uploader">
      <div className="video-preview-container">
        {videoPreviewUrl ? (
          <video 
            ref={videoRef}
            src={videoPreviewUrl} 
            controls={!isRecording}
            muted
            className="video-preview"
          />
        ) : (
          <div className="video-placeholder" ref={videoRef as any}>
            <div className="placeholder-text">
              {isRecording ? "Recording..." : "No video selected"}
            </div>
          </div>
        )}
      </div>
      
      <div className="controls-container">
        <div className="file-input-container">
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="btn upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || isProcessing}
          >
            <span className="btn-icon">📁</span>
            {selectedFile ? 'Change Video' : 'Choose Video'}
          </button>
          
          
          
          <button 
            className="btn process-btn"
            onClick={selectedFile ? handleFileUpload : handleRecordAndProcess} 
            disabled={(!selectedFile && !isRecording) || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner-small"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="btn-icon">🔍</span>
                Process Video
              </>
            )}
          </button>
        </div>
      </div>
      
      {isProcessing && (
        <div className="processing-overlay">
          <div className="spinner"></div>
          <p>Processing video...</p>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;