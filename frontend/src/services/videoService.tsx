import axios from 'axios';
import { DetectionResult } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const uploadVideoForProcessing = async (file: File): Promise<DetectionResult> => {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await axios.post<DetectionResult>(`${API_BASE_URL}/process-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
};

export const startVideoRecording = async (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(chunks, { type: 'video/webm' });
          stream.getTracks().forEach(track => track.stop());
          resolve(recordedBlob);
        };

        mediaRecorder.start();

        // Stop recording after 10 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000);
      })
      .catch(reject);
  });
};