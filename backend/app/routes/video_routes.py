# app/routes/video_routes.py
import os
import logging
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from werkzeug.utils import secure_filename

def create_video_blueprint():
    video_bp = Blueprint('video', __name__)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    @video_bp.route('/process-video', methods=['POST', 'OPTIONS'])
    @cross_origin(supports_credentials=True)
    def process_video():
        # Logging for debugging
        logger.info("Received request to process video")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {request.headers}")

        # Handle OPTIONS preflight request
        if request.method == 'OPTIONS':
            logger.info("Handling CORS preflight request")
            response = jsonify(success=True)
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            return response

        try:
            # Detailed logging for file upload
            logger.info("Checking for uploaded files")
            logger.info(f"Files in request: {request.files}")

            # Check if file is present
            if 'video' not in request.files:
                logger.error("No video file uploaded")
                return jsonify({
                    "error": "No video file uploaded",
                    "files_received": list(request.files.keys())
                }), 400

            video_file = request.files['video']
            
            # Additional file validation
            if video_file.filename == '':
                logger.error("No selected file")
                return jsonify({"error": "No selected file"}), 400

            # Secure filename and create upload directory
            upload_dir = os.path.join(os.getcwd(), 'uploads')
            os.makedirs(upload_dir, exist_ok=True)

            filename = secure_filename(video_file.filename)
            file_path = os.path.join(upload_dir, filename)

            # Save the file with detailed logging
            logger.info(f"Saving file to: {file_path}")
            video_file.save(file_path)

            logger.info("File saved successfully")

            # Return success response
            return jsonify({
                "status": "success",
                "message": "Video uploaded successfully",
                "filename": filename,
                "file_path": file_path
            }), 200

        except Exception as e:
            # Comprehensive error logging
            logger.error(f"Video upload error: {str(e)}", exc_info=True)
            return jsonify({
                "error": "Video processing failed",
                "details": str(e)
            }), 500

    return video_bp