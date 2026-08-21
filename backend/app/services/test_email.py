import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

response = resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": "[mehmet03du@gmail.com]",
    "subject": "Daily Tracker Test Email",
    "html": "<h1>Merhaba!</h1><p>Bu bir test e-postasıdır. Sistem çalışıyor.</p>",
})

print(response)