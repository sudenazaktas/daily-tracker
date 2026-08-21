from app.services.report_service import send_daily_report

target_email = "mehmet03du@hotmail.com"
topic = "Tesla"
category = "Business & Finance"

print(f"Sending daily report for '{topic}' ({category}) to {target_email}...")
response = send_daily_report(
    to_email=target_email,
    topic=topic,
    category=category,
)

print(f"Resend Response: {response}")