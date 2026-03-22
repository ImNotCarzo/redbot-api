export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.redirect("https://redbot.me");

  try {
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type:    "authorization_code",
        code,
        redirect_uri:  process.env.REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token");

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    await fetch(`https://discord.com/api/v10/users/@me/applications/${process.env.CLIENT_ID}/role-connection`, {
      method: "PUT",
      headers: {
        Authorization:  `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform_name: "RedBot",
        metadata: {},
      }),
    });

    res.redirect("https://redbot.me?vinculado=1");
  } catch (err) {
    console.error(err);
    res.redirect("https://redbot.me?error=1");
  }
}
