# 🗿  Visit & Support us - @UHD_NETWORK
# ⚡️ Do Not Remove Credit - Made by @UHDBots
# 💬 For Any Help Join Support Group: @UHDBots_Support
# 🚫 Removing or Modifying these Lines will Cause the bot to Stop Working.


import re
from os import environ


id_pattern = re.compile(r'^-?\d+$')


SESSION = environ.get("SESSION", "NADEENFiletoLinksBot")
API_ID = int(environ.get("API_ID", "25652418"))
API_HASH = environ.get("API_HASH", "ea8410db4b3301aa261ba5a9e7e2a62b")
BOT_TOKEN = environ.get("BOT_TOKEN", "7912521844:AAFO1PJb98V7asqsfg9Fj8TeKxUGomV8awY")


PORT = int(environ.get("PORT", "8080"))
MULTI_CLIENT = False
SLEEP_THRESHOLD = int(environ.get("SLEEP_THRESHOLD", "60"))
PING_INTERVAL = int(environ.get("PING_INTERVAL", "1200"))  # 20 minutes
ON_HEROKU = "DYNO" in environ
URL = environ.get("URL", "https://nadeen-link.up.railway.app/")


LOG_CHANNEL = int(environ.get("LOG_CHANNEL", "-1003757405063"))
ADMINS = [
    int(admin) if id_pattern.match(admin) else admin
    for admin in environ.get("ADMINS", "5737807853").split()
]


DATABASE_URI = environ.get("DATABASE_URI", "mongodb://mongo:WPhYgkSrKGthURgsNdMubOpJSFBPGWxV@metro.proxy.rlwy.net:48917")
DATABASE_NAME = environ.get("DATABASE_NAME", "PAY")
