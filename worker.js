// Cloudflare Worker: forwards browser requests to Discord and adds CORS headers.
// 1) Set ORIGIN below to your GitHub Pages origin (no path, no trailing slash).
// 2) Cloudflare dashboard > Workers & Pages > Create > Hello World > paste this > Deploy.
// 3) Paste the worker URL (https://NAME.USER.workers.dev) into the "API proxy URL" box on the site.
const ORIGIN = 'https://Web-mc1.github.io';
const GUILD = '1541009615167422514';
export default {
  async fetch(req) {
    const cors = {
      'Access-Control-Allow-Origin': ORIGIN,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.headers.get('Origin') !== ORIGIN) return new Response('forbidden', { status: 403 });
    const u = new URL(req.url);
    const h = { Authorization: req.headers.get('Authorization') || '', 'User-Agent': 'DiscordBot (https://github.com, 1.0)' };
    const ct = req.headers.get('Content-Type'); if (ct) h['Content-Type'] = ct;
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : req.body;
    const r = await fetch('https://discord.com/api/v10' + u.pathname + u.search, { method: req.method, headers: h, body });
    const out = new Headers(r.headers);
    for (const [k, v] of Object.entries(cors)) out.set(k, v);
    return new Response(r.body, { status: r.status, headers: out });
  },
};
