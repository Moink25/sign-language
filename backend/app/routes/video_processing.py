from flask import Blueprint, request, jsonify
from app.services.object_detection import process_video
import os
import uuid

video_processing_bp = Blueprint('video_processing', __name__)

@video_processing_bp.route('/process-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file'}), 400
    
    video = request.files['video']
    video_path = f"uploads/{uuid.uuid4()}_{video.filename}"
    video.save(video_path)

    try:
        result = process_video(video_path)
        os.remove(video_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500