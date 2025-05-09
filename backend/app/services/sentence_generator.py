# app/services/sentence_generator.py
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def generate_sentence(words):
    # Ensure words is not empty
    if not words:
        return "No words provided to generate a sentence."
    
    # Get API key from environment variables
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "OpenRouter API key not configured."
    
    input_text = " ".join(words)
    
    # Prepare the request to OpenRouter.ai
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",  # Your website URL
        "X-Title": "Sign Language Translator"  # Your app name
    }
    
    data = {
        "model": "google/gemini-pro-1.5",  # Using Gemini 1.5 Pro via OpenRouter
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that creates grammatically correct sentences from sign language words."
            },
            {
                "role": "user",
                "content": f"Create a natural, grammatically correct sentence using these sign language words: {input_text}. The sentence should be clear, concise, and maintain the meaning conveyed by the signs. Only return the sentence, no explanations."
            }
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        result = response.json()
        # Extract the generated sentence from the response
        sentence = result["choices"][0]["message"]["content"].strip()
        return sentence
    except Exception as e:
        print(f"Error generating sentence: {str(e)}")
        return f"Could not generate sentence. Error: {str(e)}"