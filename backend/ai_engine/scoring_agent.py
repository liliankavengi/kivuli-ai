from google import genai # New 2026 way
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Define the structure we expect from the AI
class TrustReport(BaseModel):
    score: int
    summary: str
    strengths: List[str]
    risks: List[str]
    sdg_8_advice: str

def analyze_business_health(transactions_summary: str):
    try:
        # Use the new 2026 client syntax
        response = client.models.generate_content(
            model='gemini-3-flash-preview', 
            contents=f"Analyze these transactions for a Kenyan SME: {transactions_summary}. Provide a trust score and SDG 8 advice."
        )
        return response.text
    except Exception as e:
        return f"AI Logic Error: {str(e)}"