# Repvyn — Deploy directly to your Cloudflare account

**Deploying from your phone? Start with [PHONE-SETUP.md](PHONE-SETUP.md).** It contains the browser-only steps, exact Cloudflare build settings and the database setup SQL. The desktop commands below are optional.

This repository contains the editable source code, images, font, signup API, database schema and setup commands. It is a separate Cloudflare deployment package. It does not change or remove the existing ChatGPT Sites publication.

## 1. What you need

Use a Windows, Mac or Linux computer. Create a Cloudflare account at https://dash.cloudflare.com/sign-up and install Node.js 22.13 or newer from https://nodejs.org/. Unzip the download. Open Terminal (Mac/Linux) or PowerShell (Windows) in the extracted `repvyn-cloudflare` folder, the one containing `package.json`.

Do not upload this source ZIP through Cloudflare Pages' static drag-and-drop flow: this project needs a Worker and D1 for the working signup form.

## 2. Deploy — run these commands in order

```sh
npm ci
npm run cloudflare:login
npm run cloudflare:database
npm run cloudflare:migrate
npm run cloudflare:deploy
```

- Login opens your browser. Sign in to your own Cloudflare account and approve Wrangler, Cloudflare's official deployment tool. Never paste your password or API token into chat.
- If you have several Cloudflare accounts, choose the intended account when prompted.
- `cloudflare:database` creates `repvyn-waitlist` and writes its real database ID and the `DB` binding into `wrangler.jsonc`. No manual ID editing is needed. Run database creation only once. If the command reports that the database already exists, do not delete it or recreate it: use its existing database ID under the `DB` binding in `wrangler.jsonc`.
- `cloudflare:migrate` creates the waitlist table. Approve the migration prompt. This command can safely be rerun because applied migrations are tracked.
- `cloudflare:deploy` checks that the DB binding is configured, builds the website, then uploads the Worker and assets.
- If Cloudflare asks you to set a workers.dev subdomain, choose an available label for your account. Wrangler prints the actual live HTTPS URL after deployment; it ends in `workers.dev`, with no `chatgpt` in the address. No purchased domain is required.

The deployment is public. Submit one test signup, answer the optional interest question, then verify the record in Cloudflare before sharing the link.

## 3. View signup emails

Sign in at https://dash.cloudflare.com/, select your account, and open **D1 SQL Database** (use the dashboard search if needed). Open **repvyn-waitlist → Tables → waitlist**. The `email` column contains signup addresses. The `interest` column contains `yes`, `maybe` or `no`; `unsubscribed_at` is empty for active signups.

To view only active emails, open the database's **Console** and execute:

```sql
SELECT email, interest,
       datetime(created_at / 1000, 'unixepoch') AS joined_at_utc
FROM waitlist
WHERE unsubscribed_at IS NULL
ORDER BY created_at DESC
LIMIT 1000;
```

This query shows the latest 1,000 active signups. The database is private; public visitors cannot browse signup emails through the website. Access through Cloudflare depends on the account roles you grant.

## 4. Export emails as CSV

In the project folder, run:

```sh
npm run cloudflare:export-emails
```

The command saves `repvyn-active-emails.csv` on your computer. Open it in Google Sheets or Excel, or import it into your email service. It reads in batches and excludes unsubscribed records and management tokens. Move or rename a previous export before running again. Exports query the live database and count towards D1 usage; avoid exporting while doing major data changes if you need a consistent snapshot.

## 5. Capacity and costs

Cloudflare Workers automatically scales requests, and D1 is suitable for an email waitlist. Actual simultaneous signup throughput depends on query times and traffic bursts; this package has functional tests but has not been load-tested to certify a maximum customer count.

Current published limits checked 20 October 2026:

- Workers Free: 100,000 Worker requests per day; 10 ms CPU per invocation.
- D1 Free: 5 million rows read per day, 100,000 rows written per day, 500 MB maximum per database, 5 GB total account storage.
- Workers Paid: starts at US$5/month, with usage charges beyond included allowances. The published included allowance is 10 million Worker requests/month; D1 includes 25 billion rows read, 50 million rows written/month and 5 GB storage.
- D1 Paid: maximum 10 GB per database.

A request is not the same as a visitor, and a row write is not the same as one signup. Index updates and optional answers also use writes. If Free daily limits are exceeded, requests or queries can fail until reset or upgrade. For a large campaign, use an appropriate paid plan, monitor usage and CPU, add rate limiting/bot protection and test the expected burst of signups. A paid plan does not guarantee any specific concurrency.

Official references:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/get-started/

## 6. Future edits

Edit the files, then run `npm run typecheck` and `npm run cloudflare:deploy`. For a database schema change, generate a new SQL migration, place a new numbered SQL file under `migrations/`, run `npm run cloudflare:migrate`, then redeploy. Do not edit an already applied migration.

## What this website includes

This is a waitlist landing page. It saves emails and optional price-interest answers, and lets visitors deactivate their signup using a secure HttpOnly management cookie. No customer account system, workout platform, payment system or AI coaching service is implemented. No email provider is connected; launch emails and confirmation emails are not sent automatically.

Existing signups on the ChatGPT Sites publication do not automatically move into the new database. Transfer them separately before switching traffic. The source ZIP contains no customer records, credentials or management tokens.

## Local development

After configuring the database, run `npx wrangler d1 migrations apply repvyn-waitlist --local --persist-to .wrangler/state`, then `npm run dev`. Local and production databases are separate. For the built Worker, run `npm run build`, then `npm start`. Use `npm run cloudflare:export-emails -- --local` only when intentionally exporting local test data.
