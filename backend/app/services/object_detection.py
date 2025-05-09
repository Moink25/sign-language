import os
import cv2
import uuid
import roboflow
import numpy as np
from app.services.sentence_generator import generate_sentence
from dotenv import load_dotenv

load_dotenv()

def process_video(video_path):
    try:
        # Initialize Roboflow
        rf = roboflow.Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
        project = rf.workspace().project("ty-it-c-01")
        model = project.version("7").model
        model.confidence = 50
        model.overlap = 25

        cap = cv2.VideoCapture(video_path)
        
        # Check if video is opened successfully
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        # Get video properties
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Adjust frame skip based on video length
        frame_skip = max(5, int(fps / 3))  # Process about 3 frames per second
        
        frame_count = 0
        labels = []
        confidences = []
        timestamps = []
        last_label = None
        last_label_time = 0
        min_label_interval = 1.0  # Minimum time in seconds between same labels

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            current_time = frame_count / fps
            
            if frame_count % frame_skip == 0:
                # Create a temporary frame file
                temp_frame_path = f"temp_frame_{uuid.uuid4()}.jpg"
                cv2.imwrite(temp_frame_path, frame)

                try:
                    # Predict on the frame
                    prediction = model.predict(temp_frame_path)
                    predictions_json = prediction.json()

                    for prediction in predictions_json['predictions']:
                        label = prediction['class']
                        confidence = prediction['confidence']
                        
                        # Only consider high confidence predictions
                        if confidence >= 0.65:
                            # Add new label or if same label appears after interval
                            if label != last_label or (current_time - last_label_time) > min_label_interval:
                                labels.append(label)
                                confidences.append(confidence)
                                timestamps.append(current_time)
                                last_label = label
                                last_label_time = current_time
                finally:
                    # Always remove the temporary frame file
                    if os.path.exists(temp_frame_path):
                        os.remove(temp_frame_path)

            frame_count += 1
            
            # Progress update (optional)
            if frame_count % 50 == 0:
                print(f"Processing frame {frame_count}/{total_frames}")

        # Release the video capture
        cap.release()
        
        # Process results
        if not labels:
            return {
                'labels': [],
                'confidences': [],
                'timestamps': [],
                'sentence': "No signs detected",
                'summary': "No signs were detected in the video."
            }
        
        # Remove duplicates while preserving order
        unique_labels = []
        unique_confidences = []
        unique_timestamps = []
        seen = set()
        
        for i, label in enumerate(labels):
            if label not in seen:
                seen.add(label)
                unique_labels.append(label)
                unique_confidences.append(confidences[i])
                unique_timestamps.append(timestamps[i])
        
        # Generate sentence from unique labels
        sentence = generate_sentence(unique_labels)
        
        # Create a summary
        summary = f"Detected {len(unique_labels)} unique signs in {frame_count/fps:.1f} seconds of video."
        
        return {
            'labels': unique_labels,
            'confidences': unique_confidences,
            'timestamps': unique_timestamps,
            'sentence': sentence,
            'summary': summary
        }
    
    except Exception as e:
        # Log the error
        print(f"Error processing video: {e}")
        raise