// GNH Domain Descriptions
const GNH_DOMAINS = {
  "Mental Wellness": "mental health, emotional clarity, peace of mind",
  "Social Wellness": "relationships, community, friendship, social harmony",
  "Economic Wellness": "income, savings, financial stability, cost of living",
  "Workplace Wellness": "career, work-life balance, promotion, productivity",
  "Physical Wellness": "physical health, sleep, fitness, exercise",
  "Environmental Wellness": "green space, nature, environmental care",
  "Health": "healthcare, medical care, recovery, well-being",
  "Education Value": "learning, education, school, knowledge, wisdom",
  "Good Governance": "freedom, justice, fairness, democratic participation",
  "Living Standards": "housing, wealth, basic needs, affordability",
  "Cultural Diversity": "tradition, language, cultural expression, heritage",
  "Political Wellness": "rights, law, free speech, civic participation",
  "Ecological Diversity": "biodiversity, forest, ecosystem, wildlife"
};

// Replace with your Hugging Face API Token
const HF_TOKEN = "YOUR_HF_API_TOKEN"; // 🔒 secure it properly in production

// Fetch text embedding from HF endpoint
async function getEmbedding(text) {
  const response = await fetch("https://api-inference.huggingface.co/embed/sentence-transformers/all-MiniLM-L6-v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Embedding API failed: ${response.status} ${msg}`);
  }

  const result = await response.json();
  if (!result.embedding) throw new Error("Invalid embedding response");
  return result.embedding;
}

// Compute cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// Main scoring function
export async function getGnhScores(userText) {
  const userEmbedding = await getEmbedding(userText);

  const results = await Promise.all(
    Object.entries(GNH_DOMAINS).map(async ([label, desc]) => {
      const domainEmbedding = await getEmbedding(desc);
      const score = cosineSimilarity(userEmbedding, domainEmbedding);
      return [label, Math.round(score * 1000) / 1000]; // e.g., 0.923
    })
  );

  return Object.fromEntries(results);
}
