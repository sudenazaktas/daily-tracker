import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL")


def rank_results(topic: str, results: list[dict]) -> list[dict]:
    sorted_results = sorted(results, key=lambda r: r.get("score", 0), reverse=True)
    pre_filtered = sorted_results[:20]

    if not pre_filtered:
        return []

    items_text = ""
    for i, r in enumerate(pre_filtered):
        items_text += f"[{i}] Baslik: {r.get('title', '')}\n"
        items_text += f"Kaynak: {r.get('url', '')}\n"
        items_text += f"Tarih: {r.get('published_date', 'bilinmiyor')}\n"
        items_text += f"Icerik ozeti: {r.get('content', '')[:300]}\n\n"

    prompt = f"""Sen bir haber kurator susun. Asagida "{topic}" konusuyla ilgili olabilecek {len(pre_filtered)} arama sonucu var.

Gorevin:
1. Konuyla gercekten alakali olmayanlari ele (orn. kelime benzerligi ama farkli baglam)
2. Ayni haberin farkli kaynaklardaki tekrarlarini tespit et, sadece birini tut
3. Kaynagin guvenilirligini ve icerigin guncelliginin/onemini degerlendir
4. MUMKUN OLDUGUNCA TAM 10 sonuc sec. Elinde en az 10 alakali sonuc varsa, kesinlikle 10 tanesini secmelisin. Sadece gercekten 10'dan az alakali sonuc kaldiysa (cogu tekrar veya tamamen alakasizsa) daha az secebilirsin.

Sonuclar:
{items_text}

SADECE asagidaki JSON formatinda cevap ver, baska hicbir aciklama ekleme:
{{"selected_indices": [en iyi sonuclarin index numaralari, onem sirasina gore, mumkunse 10 tane]}}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    try:
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1].replace("json", "", 1).strip()

        parsed = json.loads(raw_text)
        selected_indices = parsed["selected_indices"]
        return [pre_filtered[i] for i in selected_indices if i < len(pre_filtered)]

    except (json.JSONDecodeError, KeyError, IndexError) as e:
        print(f"Gemini yaniti parse edilemedi, fallback kullaniliyor: {e}")
        return pre_filtered[:10]