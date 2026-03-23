export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.redirect("https://redbot.me");

  try {
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Token error:", tokenData);
      throw new Error("No access token");
    }

    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = await userRes.json();

    if (!user.id) {
      console.error("User error:", user);
      throw new Error("No user data");
    }

    const connRes = await fetch(
      `https://discord.com/api/v10/users/@me/applications/${process.env.CLIENT_ID}/role-connection`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform_name: "RedBot",
          platform_username: user.username, 
          metadata: {
            servidores: 1, 
          },
        }),
      }
    );

    const connData = await connRes.json();

    if (!connRes.ok) {
      console.error("Connection error:", connData);
      throw new Error("Failed to set role connection");
    }

    res.redirect("https://redbot.me?vinculado=1");

  } catch (err) {
    console.error("Callback error:", err);
    res.redirect("https://redbot.me?error=1");
  }
}
