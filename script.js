document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.querySelector("#userInput").value;
  const result = document.querySelector("#result");
  result.textContent = "Translating...";

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userInput })
  });

  const data = await response.json();
  result.textContent = data.reply || "No response.";
});
