// scripts/sentiment.js

let sentimentAnalyzer;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sentiment once
  sentimentAnalyzer = new Sentiment();
});

// Analyze entire obstacle string (1–10 scale)
function analyzeSentiment(text) {
  const score = sentimentAnalyzer.analyze(text).score;
  return Math.max(1, Math.min(10, Math.floor(score + 5)));  // normalize 1–10
}

// Analyze each GNH meaning text as well
function analyzeGNHMeaning(meaning, indicatorLabel) {
  const score = sentimentAnalyzer.analyze(meaning).score;
  let sentiment = 'Neutral';

  if (score > 1) sentiment = 'Positive';
  else if (score < -1) sentiment = 'Negative';

  return { sentiment, score: Math.max(1, Math.min(10, Math.floor(score + 5))) };
}
