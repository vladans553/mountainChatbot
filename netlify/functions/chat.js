exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "API ključ nije podešen na serveru."
        }),
      };
    }

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
          inputs: `<s>[INST] Ti si stručni planinarski vodič. Odgovaraj isključivo na srpskom jeziku. Budi kratak i konkretan. Korisnik pita: ${message} [/INST]`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    // HF loading (cold start)
    if (data?.error?.includes("loading")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: `Model se pokreće... pokušaj za ${Math.round(
            data.estimated_time || 20
          )} sekundi.`,
        }),
      };
    }

    // HF error
    if (data?.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "AI trenutno nije dostupan. Pokušaj ponovo za malo."
        }),
      };
    }

    if (data?.[0]?.generated_text) {
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
        reply: "Neočekivan odgovor modela."
      }),
    };

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Server greška."
      }),
    };
  }
};
