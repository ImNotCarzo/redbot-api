export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/role-connections/metadata`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`, // FIX
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            key: "servidores",
            name: "Servidores",
            description: "Cantidad de servidores en RedBot",
            type: 2,
          }
        ]),
      }
    );

    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
