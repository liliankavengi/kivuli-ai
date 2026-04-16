import os
from dotenv import load_dotenv
from google import genai

# 1. Load environment variables
load_dotenv()

# 2. Initialize the new Client
# It automatically looks for 'GOOGLE_API_KEY' or you can pass it explicitly
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    print("🤖 Sending request to Kivuli's brain (Gemini 3 Flash)...")
    
    # 3. Use the latest 2026 model name
    response = client.models.generate_content(
        model='gemini-3-flash-preview', 
        contents="Say: 'Kivuli AI is connected and using the 2026 SDK!'"
    )
    
    print("\n--- Response ---")
    print(response.text)
    print("----------------\n")
    print("!! Success!! Your 2026 SDK connection is solid.")

except Exception as e:
    print(f"!! Connection Failed: {e}")