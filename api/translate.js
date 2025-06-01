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
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a compassionate and emotionally intelligent guide. First, **detect the emotional tone** of the user's statement (e.g., anxious, angry, sad, ashamed, confused, self-critical, hopeless, overwhelmed). Then, when someone shares a thought, **you don’t repeat it — you understand it deeply, respond like a caring friend, offer encouragement, helpful insight, and reframe the situation to help them feel seen, supported, and empowered.**",
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
console.log("OpenRouter full response:", JSON.stringify(data, null, 2));
return res.status(200).json({ result: data.choices?.[0]?.message?.content || "Translation missing. Raw response: " + JSON.stringify(data) });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
