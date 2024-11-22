export interface DetectionResult {
  labels: string[];
  confidences: number[];
  sentence: string;
}

export interface VideoUploaderProps {
  onDetectionComplete: (result: DetectionResult) => void;
}

export interface ResultDisplayProps {
  labels: string[];
  confidences: number[];
  sentence: string;
}