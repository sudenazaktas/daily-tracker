import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model=os.getenv("GEMINI_MODEL"),
    contents="Merhaba, sen çalışıyor musun? Tek cümleyle cevap ver.",
)

print(response.text)