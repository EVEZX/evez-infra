// EVEZ API - Vercel Serverless Function
// Free tier: 100GB bandwidth, 10s execution

const RAILWAY_URL = 'https://evez-provider-production.up.railway.app';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'healthy', service: 'evez-api' });
  }
  
  try {
    const response = await fetch(RAILWAY_URL + '/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}
