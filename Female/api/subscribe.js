export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    try {
        // Forward to provider if configured (set SUBSCRIBE_PROVIDER_URL in Vercel env)
        const providerUrl = process.env.SUBSCRIBE_PROVIDER_URL;
        if (providerUrl) {
            const r = await fetch(providerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!r.ok) {
                const text = await r.text();
                console.error('Provider error:', text);
            }
        } else {
            // Demo: log subscription on server
            console.log('New subscription (demo):', email);
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}