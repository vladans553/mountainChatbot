exports.handler = async (event) => {
  try {
    console.log("FUNCTION START");

    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing API key" }),
      };
    }

    const { message } = JSON.parse(event.body || "{}");

    console.log("USER MESSAGE:", message);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const text = await response.text();

    console.log("HF RAW RESPONSE:", text);

    return {
      statusCode: 200,
      body: JSON.stringify({
        debug: text,
      }),
    };

  } catch (err) {
    console.error("FUNCTION ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
