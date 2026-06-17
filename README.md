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

- **health-monitor.yml** — Checks all platforms every 15 min
- **api-proxy.yml** — Serverless API proxy via workflow_dispatch
