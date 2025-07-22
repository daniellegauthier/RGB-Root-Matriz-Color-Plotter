// Map domain descriptions
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

// Fetch embeddings from HF Inference API
async function getEmbedding(text) {
  const apiUrl = "https://api-inference.huggingface.co/embed/sentence-transformers/all-MiniLM-L6-v2";
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer YOUR_HF_API_TOKEN`, 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });
  if (!res.ok) throw new Error("Embedding API error");
  return (await res.json()).embedding;
}

// Cosine similarity
function cosine(a, b) {
  const dot = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const magB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  return dot / (magA * magB);
}

// Score domains
export async function getGnhScores(text) {
  const embText = await getEmbedding(text);
  const promises = Object.entries(GNH_DOMAINS).map(async ([label, desc]) => {
    const embDesc = await getEmbedding(desc);
    return [label, cosine(embText, embDesc)];
  });
  const sims = await Promise.all(promises);
  return Object.fromEntries(sims);
}
