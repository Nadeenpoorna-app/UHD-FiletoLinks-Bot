# 🗿  Visit & Support us - @UHD_NETWORK
# ⚡️ Do Not Remove Credit - Made by @UHDBots
# 💬 For Any Help Join Support Group: @UHDBots_Support
# 🚫 Removing or Modifying these Lines will Cause the bot to Stop Working.


import re
from os import environ


id_pattern = re.compile(r'^-?\d+$')


SESSION = environ.get("SESSION", "NADEENFiletoLinksBot")
API_ID = int(environ["API_ID"])
API_HASH = environ["API_HASH"]
BOT_TOKEN = environ["BOT_TOKEN"]


PORT = int(environ.get("PORT", "8080"))
MULTI_CLIENT = False
SLEEP_THRESHOLD = int(environ.get("SLEEP_THRESHOLD", "60"))
PING_INTERVAL = int(environ.get("PING_INTERVAL", "1200"))  # 20 minutes
ON_HEROKU = "DYNO" in environ
URL = environ["URL"]


LOG_CHANNEL = int(environ["LOG_CHANNEL"])
ADMINS = [
    int(admin) if id_pattern.match(admin) else admin
    for admin in environ["ADMINS"].split()
]


DATABASE_URI = environ["DATABASE_URI"]
DATABASE_NAME = environ.get("DATABASE_NAME", "PAY")

URL = URL.rstrip('/') + '/'
