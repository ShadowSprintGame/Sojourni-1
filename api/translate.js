export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "❌ Method not allowed." });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ result: "❌ No prompt provided." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter API error:", data);
      return res.status(500).json({ result: "❌ API error from OpenRouter." });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "❌ Translation failed."
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    return res.status(500).json({ result: "❌ Internal server error." });
  }
}
