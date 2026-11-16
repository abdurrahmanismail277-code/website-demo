export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email: submittedEmail, website } = req.body || {};
  const email = typeof submittedEmail === 'string' ? submittedEmail.trim() : '';

  // Honeypot: real visitors leave this empty, bots fill it in
  if (website) return res.status(200).json({ ok: true });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) {
    return res.status(503).json({ error: 'Newsletter signup is temporarily unavailable. Please try again later.' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        email,
        groups: [groupId]
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Newsletter signup is temporarily unavailable. Please try again later.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Newsletter signup is temporarily unavailable. Please try again later.' });
  }
}
