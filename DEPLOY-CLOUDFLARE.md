# Render + Cloudflare deployment

1. Rotate exposed Telegram bot token and MongoDB credentials. Never commit secrets.
2. Disable auto-delete in the private Telegram storage channel; retain the same channel and bot to preserve existing file references.
3. Create a Render Python web service from the cloudflare-render branch (or use render.yaml). Set API_ID, API_HASH, BOT_TOKEN, DATABASE_URI, DATABASE_NAME, LOG_CHANNEL, ADMINS and URL. Initially URL can be the Render HTTPS URL.
4. In cloudflare/wrangler.toml replace ORIGIN_URL with the Render HTTPS URL. From cloudflare/ run npx wrangler deploy after authenticating.
5. Set Render URL to the deployed Worker HTTPS URL and redeploy. Existing URLs require their original hostname to remain operational.
6. Test a small file, HEAD, Range: bytes=0-1023, then an authorized large file and resumed download. Verify after restart and after 24 hours.

The Worker streams the upstream response without buffering or caching. Telegram remains the file store. No R2 integration is included. Render free services sleep and have bandwidth limits; the Worker does not eliminate origin bandwidth or guarantee uptime. Links have no application-level expiration but require the original channel message and a working backend. Only share files you have permission to distribute.
