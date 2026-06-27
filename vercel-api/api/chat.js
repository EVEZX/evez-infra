// EVEZ API - Vercel Serverless Function
// Uses Next.js App Router compatible handler (Vercel recommended)

const RAILWAY_URL = process.env.RAILWAY_URL || 'https://evez-provider-production.up.railway.app';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      status: 'healthy',
      service: 'evez-api',
      upstream: RAILWAY_URL,
      version: '1.0.0'
    });
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const response = await fetch(RAILWAY_URL + '/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: e.message, upstream: RAILWAY_URL });
  }
}
