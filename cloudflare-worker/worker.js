// EVEZ API Proxy - Cloudflare Worker
// Free tier: 100K requests/day, 10ms CPU time
// Routes requests to Railway EVEZ Provider with Vultr fallback

const RAILWAY_URL = 'https://evez-provider-production.up.railway.app';
const VULTR_URL = 'http://66.42.125.106:9100';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'evez-cloud-proxy',
        backends: { railway: RAILWAY_URL, vultr: VULTR_URL },
        version: '1.1.0'
      }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    // Proxy to Railway first, fallback to Vultr
    const target = RAILWAY_URL + url.pathname;
    try {
      const resp = await fetch(target, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });
      const body = await resp.text();
      return new Response(body, {
        status: resp.status,
        headers: { 'Content-Type': resp.headers.get('Content-Type') || 'application/json', ...CORS_HEADERS },
      });
    } catch (e) {
      // Fallback to Vultr
      const fallback = VULTR_URL + url.pathname;
      try {
        const resp2 = await fetch(fallback, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' ? request.body : undefined,
        });
        const body2 = await resp2.text();
        return new Response(body2, {
          status: resp2.status,
          headers: { 'Content-Type': resp2.headers.get('Content-Type') || 'application/json', ...CORS_HEADERS },
        });
      } catch (e2) {
        return new Response(JSON.stringify({
          error: 'Both backends unavailable',
          details: [e.message, e2.message]
        }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }
  }
};
