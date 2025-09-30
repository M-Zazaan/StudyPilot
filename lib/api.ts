export async function sendMessage(message: string, mode: "chat" | "mcq" = "chat") {
  const response = await fetch("https://sciaticmz-studypilot.hf.space/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, mode }),
  });

  const data = await response.json();
  return data.response;
}
