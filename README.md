# EVEZ Infrastructure

Cross-platform deployment infrastructure for the EVEZ AI ecosystem.

## Platforms

| Platform | Status | Service | URL |
|----------|--------|---------|-----|
| GitHub Pages | ✅ Active | Static site | evezx.github.io/evez-ai |
| Railway | ✅ Active | EVEZ Provider (35 models) | evez-provider-production.up.railway.app |
| GitHub Codespaces | ✅ Active | Compute nodes (2× 32GB) | - |
| GitHub Actions | ✅ Active | Health monitor (every 15 min) | - |
| Cloudflare Workers | 📦 Ready | API proxy | Needs wrangler login |
| Vercel | ⚠️ Suspended | API functions | Needs billing fix |

## Architecture

```
User → Cloudflare Worker (CDN) → Railway EVEZ Provider (primary)
                                 ↘ Vultr EVEZ Provider (fallback)
```

## GitHub Actions

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `health-monitor.yml` | Every 15 min | Checks all platforms, alerts on failure |
| `api-proxy.yml` | Manual dispatch | Serverless API proxy |
| `serverless-chat.yml` | Manual dispatch | Chat via EVEZ Provider |
| `daily-digest.yml` | Daily midnight UTC | Posts daily status issue |
| `freee-agent.yml` | Every 30 min | Surface discovery & API testing |
| `freee-content.yml` | Daily midnight UTC | Generates daily status page |
| `a16-release-notify.yml` | On release | Notifies Steven of new releases |

## Required Secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Description | Required By |
|--------|-------------|-------------|
| `VULTR_HOST` | Vultr server IP (fallback: 66.42.125.106) | Most workflows |
| `EVEZ_API_KEY` | EVEZ Provider auth key | api-proxy, serverless-chat, freee-agent |
| `OPENCLAW_API_URL` | OpenClaw message API endpoint | a16-release-notify |
| `OPENCLAW_API_KEY` | OpenClaw API auth token | a16-release-notify |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for notifications | a16-release-notify |

## Development

```bash
# Cloudflare Worker
cd cloudflare-worker && npx wrangler dev

# Vercel API
cd vercel-api && npx vercel dev
```
