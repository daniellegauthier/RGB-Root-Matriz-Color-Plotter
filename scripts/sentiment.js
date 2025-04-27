// scripts/sentiment.js

document.addEventListener('DOMContentLoaded', function () {
  const obstacleInput = document.getElementById('obstacle');
  const sentimentScore = document.getElementById('sentimentScore');

  obstacleInput.addEventListener('input', function () {
    const text = obstacleInput.value.trim();
    const score = analyzeSentiment(text);
    sentimentScore.innerText = `Sentiment Score: ${score}/10`;
  });
});

// Basic simple sentiment analyzer
function analyzeSentiment(text) {
  if (!text) return 5; // Neutral fallback

  const positiveWords = ["hope", "trust", "joy", "gratitude", "love", "resilience", "growth"];
  const negativeWords = ["fear", "pain", "anger", "sadness", "loss", "doubt", "stress"];

  let score = 5; // Start neutral
  const lowered = text.toLowerCase();

  positiveWords.forEach(word => {
    if (lowered.includes(word)) score += 1;
  });
  negativeWords.forEach(word => {
    if (lowered.includes(word)) score -= 1;
  });

  // Clamp between 1–10
  return Math.max(1, Math.min(10, score));
}
