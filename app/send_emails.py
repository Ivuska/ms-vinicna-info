from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import make_msgid
import smtplib
import os
from dotenv import load_dotenv

# Load environment variables from .env file.
load_dotenv()

sender_email =  os.environ.get('SENDER_EMAIL')
password = os.environ.get('PASSWORD')
server_domain = os.environ.get('SERVER')
test_receiver_emails = os.environ.get('TEST_RECEIVER_EMAILS')
# All environment variables are strings by default so I need to convert it to integer.
port = int(os.environ.get('PORT'))

worker_url = os.environ.get('WORKER_URL')

def send_activation_email(email, token):
    # Create the HTML version of your message
    html = f"""\
    <html>
    <body>
        <p>Ahoj,
        <br>
        pro dokončení registrace k odběru článků z webu MŠ Viničná je třeba potvrdit emailovou adresu.
        </p>
        <p>
        <a href="https://novinky-ze-skolky.ifischerova.cz/activation/{token}"> Klikněte pro aktivaci </a>
        </p>
    </body>
    </html>
    """
    send_email(html, email)

def send_email(html, email):
    message = MIMEMultipart()
    message["Subject"] = 'Novinky ze školky - aktivace emailu'
    message["From"] = sender_email
    message["To"] = email
    # Every message must have its own message id. This id is not stored just in the message.
    # This id is an unique identifier of the message.
    message["Message-Id"] = make_msgid()

    # Turn into html MIMEText objects
    part1 = MIMEText(html, "html")

    message.attach(part1)

    # Create secure connection with server and send email
    with smtplib.SMTP(server_domain, port) as server:
        server.starttls() 
        server.login(sender_email, password)
        server.sendmail(
            sender_email, email, message.as_string()
        )

    print(f"Odeslano na { email }.")