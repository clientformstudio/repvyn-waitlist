# Put Repvyn on Cloudflare from your phone

No terminal or Node.js installation on your phone is needed. Cloudflare runs the build on its servers. The GitHub repository is private; sign into the `clientformstudio` account to view it and authorize Cloudflare.

## 1. Create the signup database

1. Sign into https://dash.cloudflare.com/ and select your account.
2. Find **D1 SQL Database**, using the dashboard search if necessary.
3. Choose **Create database**. Name it **repvyn-waitlist**.
4. Open the database, select **Console**, paste ALL the SQL from [cloudflare-dashboard-schema.sql](cloudflare-dashboard-schema.sql), then select **Execute**.
5. Copy the database's **Database ID**. This is the UUID shown in the database overview/settings. It is not an API token or password.

## 2. Import the GitHub repository

1. Go to **Workers & Pages → Create application → GitHub** in Cloudflare. Choose a Worker/Git repository import, not a Pages static upload.
2. Connect the `clientformstudio` GitHub account. Authorize Cloudflare to access the private **repvyn-waitlist** repository. If it does not appear, edit the GitHub app's repository access to include it.
3. Select **clientformstudio/repvyn-waitlist**.
4. Enter the following settings. Expand the build settings or advanced section as needed:

| Setting | Value |
| --- | --- |
| Worker/project name | `repvyn-waitlist` |
| Production branch | `main` |
| Root directory | repository root `/` |
| Build command | `npm run cloudflare:build` |
| Deploy command | `npm run cloudflare:publish` |

5. Under **Build variables and secrets**, add a plain build variable named **REPVYN_DATABASE_ID**, with the Database ID you copied in step 1 as its value. This must be available during the build, rather than only as a runtime variable. The build writes the database binding for you.
6. Turn off non-production branch builds/preview builds for now. This setup targets one production database.
7. Select **Save and Deploy**. Cloudflare installs dependencies, builds and publishes the app. If build variables were not available in the initial screen, save the project, add the variable under **Settings → Builds → Build variables and secrets**, then retry the build.
8. If prompted, choose an available **workers.dev** account subdomain. Open the actual HTTPS URL Cloudflare displays. Its address ends in **workers.dev**, with no **chatgpt** in it.

You do not need to buy a domain for this setup. The final URL depends on the account subdomain Cloudflare assigns or lets you select.

## 3. Check that signup works

1. Visit the new website and join with a test email.
2. Confirm that you see **You're on the list**.
3. In Cloudflare, open **D1 SQL Database → repvyn-waitlist → Tables → waitlist**.
4. Verify the test email is present. Answer the optional US$39 question on the site and check that the `interest` field updates.
5. Only then share the new link.

## 4. Read active signup emails

In the database's **Console**, run:

```sql
SELECT email, interest,
       datetime(created_at / 1000, 'unixepoch') AS joined_at_utc
FROM waitlist
WHERE unsubscribed_at IS NULL
ORDER BY created_at DESC
LIMIT 1000;
```

This displays the most recent 1,000 active signups. An empty `unsubscribed_at` means the signup is active. Public site visitors cannot browse the database; access is controlled by your Cloudflare account roles.

## If something fails

- **Repository missing:** authorize Cloudflare's GitHub app for this private repository under the correct GitHub account.
- **REPVYN_DATABASE_ID missing:** set it under Build variables and retry the build.
- **no such table: waitlist:** execute the supplied SQL in the D1 database you selected.
- **D1 binding missing or unavailable:** check the Database ID belongs to the same Cloudflare account you are deploying into. The binding must be named `DB`; the build configures it automatically.
- **Worker name mismatch:** use `repvyn-waitlist` as the Cloudflare project name.
- **Phone layout cramped:** enable your browser's Request desktop site option.

The existing ChatGPT Sites publication stays online. Its stored signup records are separate and do not automatically migrate. This repository contains source code and setup instructions, without customer email records or credentials.

Cloudflare account authorization and the first deployment have not been performed for you. After you authorize Cloudflare to read the repository, future pushes to `main` can automatically update your Worker.

Official reference: https://developers.cloudflare.com/workers/ci-cd/builds/
