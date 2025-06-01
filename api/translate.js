module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral/mixtral-8x7b",
        messages: [
          {
            role: "system",
            content: "You are an empathetic overthinking translator. Rephrase the user's anxious or overthought message in a clearer, calmer way. Then explain why this might help, and offer a healthier way to look at it.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: `OpenRouter API error: ${JSON.stringify(data)}` });
    }

    return res.status(200).json({ result: data.choices?.[0]?.message?.content || "Translation failed." });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
