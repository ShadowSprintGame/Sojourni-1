
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sojourni.xyz",
        "X-Title": "Sojourni"
      },
      body: JSON.stringify({
        model: "mistral/mixtral-8x7b",
        messages: [{
          role: "user",
          content: `You're an empathetic mental health AI that helps users better understand their thoughts. First, **detect the emotional tone** of the user's statement (e.g., anxious, angry, sad, ashamed, confused, self-critical, hopeless, overwhelmed). Then, **reframe the thought kindly and constructively** as if you're gently talking to a close friend.

User’s thought: "${prompt}".

Output format:
Tone: [describe emotional tone]
Reframe: [provide a gentle and constructive rewording]`
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ OpenRouter API error:", data);
      return res.status(500).json({ result: "❌ Internal server error." });
    }

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "Translation failed."
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ result: "❌ Server error occurred." });
  }
}
