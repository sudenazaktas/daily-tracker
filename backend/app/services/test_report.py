from app.services.report_service import send_daily_report

response = send_daily_report(
    to_email="snazaktas@gmail.com",
    topic="Tesla",
    category="Business & Finance",
)

print(response)