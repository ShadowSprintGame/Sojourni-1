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
        model: "mistral/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You're an empathetic mental health AI that helps users better understand their thoughts. First, **detect the emotional tone** of the user's statement (e.g., anxious, angry, sad, ashamed, confused, self-critical, hopeless, overwhelmed). Then, **reframe the thought kindly and constructively** as if you're gently talking to a close friend.",
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
}
 
