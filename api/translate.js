export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let prompt;

  try {
    const body = await req.json?.() || req.body;
    prompt = body?.prompt;
  } catch (err) {
    return res.status(400).json({ error: "Bad request. Could not read prompt." });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is missing." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [{
  role: "user",
  content: `You're a supportive mental health guide. Reframe this thought to help the person see it more clearly, kindly, and constructively, as if you're gently talking to a friend:
  "${prompt}"`
}]


    const data = await response.json();

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: "OpenRouter API error", detail: data });
    }

    return res.status(200).json({ result: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}
