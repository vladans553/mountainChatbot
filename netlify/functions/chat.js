exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    const { message } = JSON.parse(event.body || "{}");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] Odgovaraj kao planinarski vodič na srpskom jeziku. Korisnik pita: ${message} [/INST]`
        }),
      }
    );

    const data = await response.json();

    let reply = "Nema odgovora.";

    if (data?.[0]?.generated_text) {
      reply = data[0].generated_text.split("[/INST]").pop().trim();
    } else if (data?.error) {
      reply = "HF error: " + data.error;
    }

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
