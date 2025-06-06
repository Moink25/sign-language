# Sign-to-Text

A sign language recognition application that translates sign language videos into text using Gemini 1.5 Pro AI.

## Project Structure

- `frontend/`: React application for the user interface
- `backend/`: Python Flask API for video processing and sign language recognition
- `Test-Videos/`: Sample videos for testing

## Requirements

### Frontend

- Node.js (v14+)
- npm or yarn

### Backend

- Python 3.8+
- Flask
- OpenCV
- Requests

## API Keys Setup

This application requires API keys for:

1. **OpenRouter.ai** - For accessing Gemini 1.5 Pro AI

   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Create an API key
   - Add it to the `.env` file in the backend directory

2. **Roboflow** - For sign language detection
   - Sign up at [Roboflow](https://roboflow.com/)
   - Create an API key
   - Add it to the `.env` file in the backend directory

Create a `.env` file in the backend directory with the following content:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
ROBOFLOW_API_KEY=your_roboflow_api_key_here
```

## Running the Application

### Start the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the backend server
python run.py
```

The backend API will be available at http://localhost:5000

### Start the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

The frontend will be available at http://localhost:3000

## Features

- Upload sign language videos for processing
- Record sign language videos directly from the browser
- View detected signs with confidence scores
- Get translated sentences from Gemini 1.5 Pro AI
- Dark mode support for better user experience
- Responsive design for mobile and desktop

## Usage

1. Open the application in your browser
2. Upload a video file or record a new video
3. Process the video to detect sign language
4. View the detected signs and translated text

## Technology Stack

- **Frontend**: React with TypeScript, modern CSS
- **Backend**: Python Flask API
- **AI Services**:
  - Roboflow for sign language detection
  - OpenRouter.ai's Gemini 1.5 Pro for natural language generation

## License

This project is licensed under the MIT License.
# sign-language
# sign-language
