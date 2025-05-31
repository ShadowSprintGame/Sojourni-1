export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        { role: "system", content: "You are an 'overthinking translator'. Take any message the user gives and translate it into a calm, rational, clear version that removes spiraling, panic, or anxiety." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices?.[0]?.message?.content || "Translation failed." });
}
