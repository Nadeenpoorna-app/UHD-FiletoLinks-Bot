# Workers-only deployment

No Render, Python, MongoDB or D1 required. R2 stores both file and metadata. Telegram imports are limited to 20 MB. Large Telegram files are not supported.

1. Rotate previously exposed credentials. Create a private R2 bucket named uhd-file-links. Disable lifecycle expiration.
2. In this directory run npx wrangler login, then npx wrangler deploy.
3. Run npx wrangler secret put BOT_TOKEN and npx wrangler secret put WEBHOOK_SECRET. Choose a random webhook secret using letters, digits, underscores and hyphens. Optionally set ALLOWED_USERS as comma-separated Telegram user IDs to restrict uploads and costs.
4. Register webhook using the Telegram Bot API setWebhook method with JSON fields url (your Worker HTTPS URL plus /webhook) and secret_token (the same webhook secret). Stop any previous polling bot first.
5. Send a small authorized file, test download, range resume and retention. Links are bearer links: anyone with the URL can download. Delete objects from R2 to revoke links.

R2 storage and operations have free allowances, not unlimited free storage. No automatic expiration is configured by this project. No live tests have been performed. Background webhook processing is best effort and may fail if execution exceeds Worker limits. Original Python files are retained for history but are not used by this deployment.
