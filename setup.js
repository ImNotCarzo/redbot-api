export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/role-connections/metadata`,
      {
        method: "PUT",
        headers: {
          Authorization:  `Bearer ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),  
      }
    );

    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
