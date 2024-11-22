# app/services/sentence_generator.py
import os
import google.generativeai as genai

def generate_sentence(words):
    # Ensure words is not empty
    if not words:
        return "No words provided to generate a sentence."
    
    # Configure the API key
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    
    input_text = " ".join(words)
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    try:
        response = model.generate_content(f"Construct a grammatically correct sentence from these words: {input_text}")
        return response.text
    except Exception as e:
        return f"Could not generate sentence. Error: {str(e)}"