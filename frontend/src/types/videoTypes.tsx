// src/types/videoTypes.ts

export interface DetectionResult {
  detections: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
  processedVideoUrl?: string;
  timestamp: number;
}

export interface VideoUploadOptions {
  maxDuration?: number;
  maxFileSize?: number;
}