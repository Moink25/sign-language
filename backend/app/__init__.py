from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Comprehensive CORS configuration
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",   # React development server
                "http://127.0.0.1:3000",   # Alternative localhost
                "http://localhost:5173",   # Vite development server
                "http://127.0.0.1:5173",   # Alternative Vite localhost
                "*"  # Use cautiously, preferably specify exact origins in production
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type", 
                "Authorization", 
                "X-Requested-With"
            ],
            "supports_credentials": True
        }
    })

    # Import and register blueprint
    from app.routes.video_processing import video_processing_bp
    app.register_blueprint(video_processing_bp, url_prefix='/api')

    # Additional CORS and error handling
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
        return response

    # Error handlers (optional but recommended)
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not Found"}, 404

    @app.errorhandler(500)
    def server_error(error):
        return {"error": "Internal Server Error"}, 500

    return app