exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "Missing API key on server (HUGGINGFACE_API_KEY).",
        }),
      };
    }

    const { message } = JSON.parse(event.body || "{}");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Ti si planinarski vodič. Odgovaraj kratko i jasno na srpskom jeziku.\n\nKorisnik: ${message}`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    // fallback za različite Hugging Face formate
    let reply = "Nema odgovora.";

    if (data?.[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.generated_text) {
      reply = data.generated_text;
    } else if (data?.error) {
      reply = "HF error: " + data.error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    console.error("Function error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Server error: " + err.message,
      }),
    };
  }
};
