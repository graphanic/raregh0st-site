export const config = { runtime: 'nodejs' };

export default async function handler(request) {
  const headers = { 'Content-Type': 'application/json' };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await request.json();
    const submitted = (body.password || "").trim();
    const expected = (process.env.ADMIN_PASSWORD || "").trim();

    if (!expected) {
      return new Response(JSON.stringify({ error: 'ADMIN_PASSWORD not configured on server' }), { status: 500, headers });
    }

    if (submitted !== expected) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401, headers });
    }

    // Simple token: base64 of password + today's date
    const today = new Date().toISOString().split('T')[0];
    const token = Buffer.from(submitted + ':' + today).toString('base64');

    return new Response(JSON.stringify({ success: true, token }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Auth failed: ' + error.message }), { status: 500, headers });
  }
}
