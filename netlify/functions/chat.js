exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;
    const { message } = JSON.parse(event.body);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] Ti si stručni planinarski vodič. Odgovaraj isključivo na srpskom jeziku. Budi koristan, ljubazan i kratak. Korisnik pita: ${message} [/INST]`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error && data.error.includes("loading")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: `Model se učitava... pokušaj za ${Math.round(
            data.estimated_time || 20
          )} sekundi.`,
        }),
      };
    }

    if (data && data[0] && data[0].generated_text) {
      const text = data[0].generated_text
        .split("[/INST]")
        .pop()
        .trim();

      return {
        statusCode: 200,
        body: JSON.stringify({ reply: text }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Greška u odgovoru modela.",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Server greška.",
      }),
    };
  }
};