from app.services.search_service import search_topic

results = search_topic(topic="Tesla", category="Business & Finance")

print("Toplam sonuç:", len(results))

for r in results:
    print(r["title"])
    print(r["url"])
    print(r.get("published_date", "tarih yok"))
    print("---")