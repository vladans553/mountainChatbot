exports.handler = async (event) => {
  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "NO API KEY" }),
      };
    }

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
          inputs: message
        }),
      }
    );

    const text = await response.text();

    // 🔴 KLJUČNO: vidi RAW odgovor
    console.log("HF RAW:", text);

    return {
      statusCode: 200,
      body: JSON.stringify({
        raw: text
      }),
    };

  } catch (err) {
    console.log("ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: err.message
      }),
    };
  }
};
