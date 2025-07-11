// scripts/sentiment.js

// GNH keyword sentiment map
const gnhSentimentKeywords = {
  "Mental Wellness": {
    positive: ["calm", "peaceful", "balanced", "focused", "centered", "relieved"],
    negative: ["depressed", "anxious", "stressed", "worried", "overwhelmed", "panic", "fear"]
  },
  "Health": {
    positive: ["healthy", "fit", "strong", "healing"],
    negative: ["sick", "injured", "ill", "pain", "disease", "disabled"]
  },
  "Social Wellness": {
    positive: ["connected", "supported", "belonging", "bond", "friendship"],
    negative: ["isolated", "lonely", "excluded", "rejected"]
  },
  "Physical Wellness": {
    positive: ["active", "energetic", "fit", "well"],
    negative: ["tired", "fatigued", "weak", "exhausted"]
  },
  "Workplace Wellness": {
    positive: ["productive", "valued", "motivated", "engaged"],
    negative: ["burnout", "overworked", "unrecognized", "disengaged"]
  },
  "Good Governance": {
    positive: ["fair", "transparent", "just", "accountable"],
    negative: ["corrupt", "unfair", "oppressive", "authoritarian"]
  },
  "Economic Wellness": {
    positive: ["stable", "secure", "prosperous", "thriving"],
    negative: ["broke", "poor", "unstable", "jobless"]
  },
  "Cultural Diversity": {
    positive: ["inclusive", "vibrant", "respected"],
    negative: ["divided", "intolerant", "erased"]
  },
  "Living Standards": {
    positive: ["comfortable", "secure", "adequate"],
    negative: ["poverty", "lack", "struggling"]
  },
  "Education Value": {
    positive: ["educated", "skilled", "learned", "knowledgeable"],
    negative: ["uneducated", "illiterate", "ignorant"]
  },
  "Environmental Wellness": {
    positive: ["sustainable", "clean", "green", "natural"],
    negative: ["polluted", "dirty", "toxic", "hazardous"]
  },
  "Ecological Diversity": {
    positive: ["biodiverse", "balanced", "rich"],
    negative: ["destroyed", "degraded", "extinct"]
  },
  "Political Wellness": {
    positive: ["stable", "democratic", "representative"],
    negative: ["unstable", "oppressive", "dictatorial"]
  }
};

// Boosted Obstacle Sentiment
function analyzeSentiment(text) {
  const positive = [
    "hope", "joy", "trust", "growth", "love", "excited", "opportunity", "peace", "clarity", "healing"
  ];
  const negative = [
    "fear", "pain", "worry", "doubt", "hurt", "stress", "depression", "abuse", "hate", "lost"
  ];

  let score = 5;
  const lowerText = text.toLowerCase();

  positive.forEach(word => { if (lowerText.includes(word)) score++; });
  negative.forEach(word => { if (lowerText.includes(word)) score--; });

  // Clamp to 1–10
  score = Math.max(1, Math.min(10, score));
  return score;
}

// Per-Indicator GNH Analysis
function analyzeGNHMeaning(meaning, indicatorLabel) {
  const cleanText = meaning.toLowerCase();

  const indicator = gnhSentimentKeywords[indicatorLabel];
  if (!indicator) return { sentiment: 'Neutral', score: 5 };

  const negativeMatch = indicator.negative.some(word => cleanText.includes(word));
  const positiveMatch = indicator.positive.some(word => cleanText.includes(word));

  if (positiveMatch && !negativeMatch) return { sentiment: 'Positive', score: 8 };
  if (negativeMatch && !positiveMatch) return { sentiment: 'Negative', score: 3 };
  if (positiveMatch && negativeMatch) return { sentiment: 'Mixed', score: 5 };

  return { sentiment: 'Neutral', score: 5 };
}
