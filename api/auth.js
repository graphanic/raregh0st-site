// Admin authentication handler - v1.1
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const submitted = (req.body?.password || "").trim();
    const expected = (process.env.ADMIN_PASSWORD || "").trim();

    if (!expected) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
    }

    if (submitted !== expected) {
      // Safe diagnostic: lengths only, never the actual values.
      return res.status(401).json({
        error: 'Invalid password',
        debug: {
          submittedLength: submitted.length,
          expectedLength: expected.length,
          firstCharMatches: submitted.charAt(0) === expected.charAt(0),
          lastCharMatches: submitted.charAt(submitted.length - 1) === expected.charAt(expected.length - 1),
        },
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const token = Buffer.from(submitted + ':' + today).toString('base64');

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ error: 'Auth failed: ' + error.message });
  }
}
