// scripts/sentiment.js

// Load Sentiment.js
let sentimentAnalyzer;
document.addEventListener('DOMContentLoaded', () => {
  sentimentAnalyzer = new Sentiment();
});

// Returns 1–10 sentiment score
export function analyzeSentiment(text) {
  const score = sentimentAnalyzer.analyze(text).score;
  return Math.max(1, Math.min(10, Math.floor(score + 5)));
}
