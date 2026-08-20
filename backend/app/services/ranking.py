import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL")


def rank_results(topic: str, results: list[dict]) -> list[dict]:
    # 1) Kod tarafı ön filtre — Tavily'nin relevance score'una göre sırala, en iyi 15'i al
    sorted_results = sorted(results, key=lambda r: r.get("score", 0), reverse=True)
    pre_filtered = sorted_results[:15]

    if not pre_filtered:
        return []

    # 2) Gemini'ye gönderilecek özet listeyi hazırla
    items_text = ""
    for i, r in enumerate(pre_filtered):
        items_text += f"[{i}] Başlık: {r.get('title', '')}\n"
        items_text += f"Kaynak: {r.get('url', '')}\n"
        items_text += f"Tarih: {r.get('published_date', 'bilinmiyor')}\n"
        items_text += f"İçerik özeti: {r.get('content', '')[:300]}\n\n"

    prompt = f"""Sen bir haber küratörüsün. Aşağıda "{topic}" konusuyla ilgili olabilecek {len(pre_filtered)} arama sonucu var.

Görevin:
1. Konuyla gerçekten alakalı olmayanları ele (örn. kelime benzerliği ama farklı bağlam)
2. Aynı haberin farklı kaynaklardaki tekrarlarını tespit et, sadece birini tut
3. Kaynağın güvenilirliğini ve içeriğin güncelliğini/önemini değerlendir
4. En iyi en fazla 10 tanesini önem sırasına göre seç

Sonuçlar:
{items_text}

SADECE aşağıdaki JSON formatında cevap ver, başka hiçbir açıklama ekleme:
{{"selected_indices": [en iyi sonuçların index numaraları, önem sırasına göre]}}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    try:
        raw_text = response.text.strip()
        # Gemini bazen ```json ile sarabiliyor, temizleyelim
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1].replace("json", "", 1).strip()

        parsed = json.loads(raw_text)
        selected_indices = parsed["selected_indices"]
        return [pre_filtered[i] for i in selected_indices if i < len(pre_filtered)]

    except (json.JSONDecodeError, KeyError, IndexError) as e:
        print(f"Gemini yanıtı parse edilemedi, fallback kullanılıyor: {e}")
        # Fallback — Gemini başarısız olursa, kod tarafı sıralamasının ilk 10'unu döndür
        return pre_filtered[:10]