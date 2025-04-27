// scripts/sentiment.js
document.getElementById('analyzeBtn').addEventListener('click', function() {
  const text = document.getElementById('obstacle').value.toLowerCase();
  const positiveWords = ['hope', 'happy', 'joy', 'love', 'peace', 'success', 'achievement', 'trust', 'growth', 'healing'];
  const negativeWords = ['fear', 'anger', 'sadness', 'pain', 'hurt', 'failure', 'loss', 'doubt', 'hate', 'worry'];

  let score = 5; // neutral starting point
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 0.5;
  });
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 0.5;
  });

  score = Math.min(10, Math.max(1, Math.round(score))); // keep between 1-10

  document.getElementById('sentimentScore').innerText = `Sentiment Score: ${score}/10`;
});
