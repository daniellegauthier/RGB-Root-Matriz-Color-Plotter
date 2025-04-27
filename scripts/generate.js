// scripts/generate.js

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('colorForm').addEventListener('submit', function(e) {
    e.preventDefault(); // stop page reload ❗

    const obstacle = document.getElementById('obstacle').value.trim();
    const pathway = document.getElementById('pathway').value.trim();
    const sentiment = document.getElementById('sentimentScore').innerText || 'Sentiment Score: [not analyzed]';

    if (!pathway) {
      alert('Please select a pathway!');
      return;
    }

    let resultText = `🌿 Obstacle: ${obstacle || '[none]'}\n`;
    resultText += `🌿 Selected Pathway: ${pathway.charAt(0).toUpperCase() + pathway.slice(1)}\n`;
    resultText += `🌿 ${sentiment}\n\n`;

    resultText += `✨ GNH Interpretation Based on Pathway Colors:\n\n`;

    const colorInputs = document.querySelectorAll('#colorGrid input');
    colorInputs.forEach(input => {
      const color = input.getAttribute('data-color');
      const meaning = input.value || '[no input provided]';
      const wordDisplay = input.previousElementSibling.querySelector('span')?.textContent || '';

      resultText += `🔸 ${color.toUpperCase()} (${wordDisplay.trim()}): ${meaning}\n`;
    });

    // Show results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultText;
  });
});
