document.getElementById("translateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("input").value;
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Translating...";

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    resultElement.textContent = data.result || "No translation returned.";
  } catch (err) {
    resultElement.textContent = "❌ Network error or invalid API response.";
  }
});
