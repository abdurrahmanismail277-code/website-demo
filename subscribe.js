export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, website } = req.body || {};

  // Honeypot: real visitors leave this empty, bots fill it in
  if (website) return res.status(200).json({ ok: true });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
    },
    body: JSON.stringify({
      email,
      groups: [process.env.MAILERLITE_GROUP_ID]
    })
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Something went wrong. Please try again.' });
  }

  return res.status(200).json({ ok: true });
}