import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def search_topic(topic: str, category: str = "General") -> list[dict]:
    query = topic if category == "General" else f"{topic} {category}"

    response = client.search(
        query=query,
        topic="news",
        days=1,
        max_results=20,
    )

    return response.get("results", [])