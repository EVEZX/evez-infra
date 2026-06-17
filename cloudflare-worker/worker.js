// EVEZ API Proxy - Cloudflare Worker
// Free tier: 100K requests/day, 10ms CPU time
// Routes requests to Railway EVEZ Provider

const RAILWAY_URL = 'https://evez-provider-production.up.railway.app';
const VULTR_URL = 'http://66.42.125.106:9100';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'evez-cloud-proxy',
        backends: { railway: RAILWAY_URL, vultr: VULTR_URL },
        version: '1.0.0'
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Proxy to Railway first, fallback to Vultr
    const target = RAILWAY_URL + url.pathname;
    try {
      const resp = await fetch(target, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });
      return new Response(resp.body, {
        status: resp.status,
        headers: resp.headers,
      });
    } catch (e) {
      // Fallback to Vultr
      const fallback = VULTR_URL + url.pathname;
      const resp2 = await fetch(fallback, { method: request.method });
      return new Response(resp2.body, {
        status: resp2.status,
        headers: resp2.headers,
      });
    }
  }
};
