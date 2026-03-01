const OLLAMA = "http://localhost:11434";

export const getEmbed = async (text, model = "nomic-embed-text") => {
  const res = await fetch(`${OLLAMA}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt: text }),
  });
  const json = await res.json();
  if (!json.embedding) throw new Error("No embedding in response");
  return json.embedding;
};
