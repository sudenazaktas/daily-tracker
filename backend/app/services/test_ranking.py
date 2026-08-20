from app.services.search_service import search_topic
from app.services.ranking import rank_results

results = search_topic(topic="Tesla", category="Business & Finance")
print(f"Tavily'den gelen ham sonuç sayısı: {len(results)}")

ranked = rank_results("Tesla", results)
print(f"\nGemini'nin seçtiği sonuç sayısı: {len(ranked)}\n")

for r in ranked:
    print(r["title"])
    print(r["url"])
    print("---")