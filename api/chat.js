export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/interactions?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-3-flash-preview",
          input: userMessage,
        }),
      }
    );

    const data = await response.json();

    // VAŽNO: tvoj response format
    const aiText =
      data?.outputs?.find((o) => o.type === "text")?.text ||
      "Nema odgovora.";

    return res.status(200).json({
      reply: aiText,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}