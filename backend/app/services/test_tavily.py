import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

print("Script başladı")

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

response = client.search(
    query="React 19",
    topic="news",
    days=1,
    max_results=10,
)

print("Toplam sonuç:", len(response.get("results", [])))

for result in response["results"]:
    print(result["title"])
    print(result["url"])
    print(result.get("published_date", "tarih yok"))
    print("---")

print("Script bitti")