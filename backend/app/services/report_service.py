import os
import httpx
from urllib.parse import urlparse
from dotenv import load_dotenv
from app.services.search_service import search_topic
from app.services.ranking import rank_results

load_dotenv()

# Brevo (HTTP API) ile gönderim — Render giden SMTP'yi engellediği için SMTP kullanılamıyor.
# Tek bir gönderen e-postası Brevo'da doğrulanır; sonra herkese gönderilebilir (domain gerekmez).
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "snazaktas@gmail.com")  # Brevo'da doğrulanmış gönderen
SENDER_NAME = os.getenv("SENDER_NAME", "Daily Tracker")


def _source_from_url(url: str) -> str:
    """URL'den okunabilir kaynak adı (alan adı) çıkarır."""
    try:
        netloc = urlparse(url).netloc
        return netloc[4:] if netloc.startswith("www.") else netloc
    except Exception:
        return ""


def normalize_results(raw_results: list[dict]) -> list[dict]:
    """
    Ham Tavily/ranking sonuçlarını, hem e-posta hem de veritabanı/önizleme için
    tutarlı bir şekle indirger.
    """
    normalized = []
    for r in raw_results:
        url = r.get("url", "")
        content = (r.get("content") or "")[:400]
        normalized.append({
            "title": r.get("title", "Başlıksız"),
            "url": url,
            "content": content,
            "score": r.get("score"),
            "source": _source_from_url(url),
        })
    return normalized


def generate_report(topic: str, category: str = "General") -> list[dict]:
    """
    Bir konu için arama + sıralama yapıp normalize edilmiş sonuç listesi döner.
    E-posta göndermez, kayıt yapmaz — hem günlük görev hem 'Şimdi Getir' önizlemesi bunu kullanır.
    """
    raw_results = search_topic(topic=topic, category=category)
    ranked = rank_results(topic=topic, results=raw_results)
    return normalize_results(ranked)


def build_email_html(topic: str, results: list[dict]) -> str:
    items_html = ""
    for r in results:
        title = r.get("title", "Başlıksız")
        url = r.get("url", "#")
        items_html += f'<li style="margin-bottom: 12px;"><a href="{url}" style="color: #006b31; text-decoration: none; font-weight: 600;">{title}</a></li>'

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #111827;">Günlük Konu Raporu</h2>
        <p style="color: #6b7280;">Günlük Raporunuz - {topic}</p>
        <ol style="padding-left: 20px;">
            {items_html}
        </ol>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            Bu rapor, "{topic}" konusuna aboneliğiniz doğrultusunda otomatik olarak oluşturulmuştur.
        </p>
    </div>
    """
    return html


def send_report_email(to_email: str, topic: str, results: list[dict]):
    """Verilen (normalize edilmiş) sonuçlarla rapor e-postasını Brevo HTTP API ile gönderir."""
    if not results:
        print(f"'{topic}' için gönderilecek sonuç bulunamadı.")
        return None

    if not BREVO_API_KEY:
        raise RuntimeError("BREVO_API_KEY tanımlı değil. E-posta gönderilemiyor.")

    html = build_email_html(topic, results)

    response = httpx.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
            "to": [{"email": to_email}],
            "subject": f"Günlük Raporunuz - {topic}",
            "htmlContent": html,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def send_daily_report(to_email: str, topic: str, category: str = "General"):
    """
    Geriye dönük uyumluluk: tek adımda üretip gönderir.
    Yeni akışta daily_job, generate_report + send_report_email'i ayrı ayrı kullanır.
    """
    results = generate_report(topic=topic, category=category)
    return send_report_email(to_email=to_email, topic=topic, results=results)
