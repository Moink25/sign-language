import os
import cv2
import uuid
import roboflow
from app.services.sentence_generator import generate_sentence
from dotenv import load_dotenv

load_dotenv()

def process_video(video_path):
    try:
        # Initialize Roboflow
        rf = roboflow.Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
        project = rf.workspace().project("moin-project")
        model = project.version("7").model
        model.confidence = 50
        model.overlap = 25

        cap = cv2.VideoCapture(video_path)
        
        # Check if video is opened successfully
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        frame_skip = 15
        frame_count = 0
        labels = set()
        confidences = []
        last_label = None

        while True:
            ret, frame = cap.read()
            if not ret:
                break

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
                        if confidence >= 0.65:
                            if label != last_label:
                                labels.add(label)
                                last_label = label
                                confidences.append(confidence)
                finally:
                    # Always remove the temporary frame file
                    if os.path.exists(temp_frame_path):
                        os.remove(temp_frame_path)

            frame_count += 1

        # Release the video capture
        cap.release()
        
        # Generate sentence if labels exist
        sentence = generate_sentence(list(labels)) if labels else "No objects detected"
        
        return {
            'labels': list(labels),
            'confidences': confidences,
            'sentence': sentence
        }
    
    except Exception as e:
        # Log the error (you might want to use a proper logging mechanism)
        print(f"Error processing video: {e}")
        raise