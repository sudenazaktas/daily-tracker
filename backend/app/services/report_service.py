import os
import resend
from dotenv import load_dotenv
from app.services.search_service import search_topic
from app.services.ranking import rank_results

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def build_email_html(topic: str, results: list[dict]) -> str:
    items_html = ""
    for r in results:
        title = r.get("title", "Başlıksız")
        url = r.get("url", "#")
        items_html += f'<li style="margin-bottom: 12px;"><a href="{url}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{title}</a></li>'

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #111827;">Daily Topic Report</h2>
        <p style="color: #6b7280;">Your Daily Report - {topic}</p>
        <ol style="padding-left: 20px;">
            {items_html}
        </ol>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            Bu rapor, "{topic}" konusuna aboneliginiz dogrultusunda otomatik olarak olusturulmustur.
        </p>
    </div>
    """
    return html


def send_daily_report(to_email: str, topic: str, category: str = "General"):
    raw_results = search_topic(topic=topic, category=category)
    ranked = rank_results(topic=topic, results=raw_results)

    if not ranked:
        print(f"'{topic}' için gönderilecek sonuç bulunamadı.")
        return None

    html = build_email_html(topic, ranked)

    response = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": f"Your Daily Report - {topic}",
        "html": html,
    })

    return response