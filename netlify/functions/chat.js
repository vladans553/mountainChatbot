exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    const { message } = JSON.parse(event.body || "{}");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Odgovori kao planinarski vodič na srpskom jeziku: ${message}`,
        }),
      }
    );

    const text = await response.text();

    // 🔴 PROVERA: ako je HTML
    if (text.trim().startsWith("<")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Model trenutno nije dostupan (HF vraća HTML error). Pokušaj ponovo za minut.",
        }),
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Nevalidan JSON iz API-ja.",
        }),
      };
    }

    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "Nema odgovora.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Server error: " + err.message,
      }),
    };
  }
};
