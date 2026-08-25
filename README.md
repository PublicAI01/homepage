PublicAI homepage

## Getting Started

First, install all dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

## Configuration

The contact form (`/business`) and the official-account verification API
read configuration from environment variables. `.env.example` documents
every name; put local values in `.env.local` (gitignored). The server
validates all of them at boot and refuses to start if any is missing or
malformed.

For deployments, the values live in GitHub Actions Secrets
(`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
`RECAPTCHA_SECRET_KEY`, `CONTACT_EMAIL_TO`, `OFFICIAL_ACCOUNTS_JSON`) and
are injected into the container at runtime by the deploy workflow — they
are never baked into the image. The reCAPTCHA **site** key is public and
committed in `.env.production`; for local development set it in
`.env.local` together with the server-only values.

To rotate a secret: revoke it at the provider (AWS IAM / Google Cloud
console) first, then update the GitHub Secret and re-run the
deploy workflow. Updating `OFFICIAL_ACCOUNTS_JSON` also just needs a
secret edit plus a redeploy.

## Docker Deploy

Build images:

```bash
docker build --platform linux/amd64 -t homepage-docker .
```

View current run images:

```bash
docker ps
```

Stop last run image:

```bash
docker container stop [CONTAINER ID]
```

Run latest image:

```bash
docker run -d -p 3000:3000 --name homepage-container --restart always homepage-docker
```

Remove last container:

```bash
docker container rm [CONTAINER ID]
```

Clear cache:

```bash
docker system prune -af  # force clear all unused assets
docker volume prune -f   # clear unused volume
docker builder prune -f  # clear unused build cache
```
