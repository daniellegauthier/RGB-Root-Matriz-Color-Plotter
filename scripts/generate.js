// scripts/generate.js

document.addEventListener('DOMContentLoaded', async () => {
  const matriceData = await loadMatriceCSV();

  const similarityMatrix = {
    grey: ['nude', 'white', 'gold'],
    pink: ['purple', 'red', 'brown'],
    gold: ['orange', 'yellow', 'brown'],
    nude: ['grey', 'yellow', 'gold'],
    orange: ['gold', 'brown', 'yellow'],
    white: ['grey', 'nude', 'gold'],
    blue: ['purple', 'white', 'green'],
    green: ['yellow', 'blue', 'nude'],
    red: ['pink', 'purple', 'orange'],
    black: ['brown', 'red', 'purple'],
    brown: ['orange', 'gold', 'red'],
    yellow: ['gold', 'orange', 'green'],
    purple: ['pink', 'blue', 'red'],
  };

  const gnhIndicators = {
    grey: 'Economic Wellness',
    pink: 'Mental Wellness',
    gold: 'Workplace Wellness',
    nude: 'Physical Wellness',
    orange: 'Social Wellness',
    white: 'Political Wellness',
    blue: 'Environmental Wellness',
    green: 'Ecological Diversity',
    red: 'Health',
    black: 'Good Governance',
    brown: 'Education Value',
    yellow: 'Living Standards',
    purple: 'Cultural Diversity',
  };

  document.getElementById('colorForm').addEventListener('submit', function (e) {
    e.preventDefault(); // 🚫 stop page reload

    const obstacle = document.getElementById('obstacle').value.trim();
    const pathway = document.getElementById('pathway').value.trim();
    const sentiment = document.getElementById('sentimentScore').innerText || 'Sentiment Score: [not analyzed]';
    const sentimentScore = parseInt(sentiment.match(/\d+/)) || 5; // fallback neutral
    const colorInputs = document.querySelectorAll('#colorGrid input');

    if (!pathway || colorInputs.length === 0) {
      alert('Please select a pathway and fill your interpretations.');
      return;
    }

    // Build user input map
    const userInterpretations = {};
    colorInputs.forEach(input => {
      const color = input.getAttribute('data-color');
      userInterpretations[color] = input.value || `[no input for ${color}]`;
    });

    // Fetch pathway statement and replace
    let pathwayOriginal = matriceData[pathway] || "Navigate challenges with strength and grace.";
    let pathwayStatement = replaceColorWordsInPathway(pathwayOriginal, userInterpretations);

    // Tone Adjustment
    if (sentimentScore <= 3) {
      pathwayStatement = "Despite difficulties, " + pathwayStatement;
    } else if (sentimentScore >= 8) {
      pathwayStatement = "With hope and resilience, " + pathwayStatement;
    }

    let resultText = `🌿 Obstacle: ${obstacle || '[none entered]'}\n`;
    resultText += `🌿 Selected Pathway: ${capitalizeFirstLetter(pathway)}\n`;
    resultText += `🌿 ${sentiment}\n\n`;

    resultText += `🌟 Pathway Statement:\n${pathwayStatement}\n\n`;
    resultText += `✨ Color Interpretations:\n\n`;

    // Per color details
    colorInputs.forEach(input => {
      const color = input.getAttribute('data-color');
      const meaning = input.value || '[no input]';

      const similars = (similarityMatrix[color] || []).map(c => capitalizeFirstLetter(c)).join(', ') || 'No similar colors';
      const gnh = gnhIndicators[color] || 'Unknown GNH';

      let colorSentiment = 'Neutral';
      if (meaning.match(/hope|joy|trust|growth|healing/gi)) {
        colorSentiment = 'Positive';
      } else if (meaning.match(/fear|pain|worry|doubt|hurt/gi)) {
        colorSentiment = 'Negative';
      }

      resultText += `🔸 ${capitalizeFirstLetter(color)} (${gnh})\n`;
      resultText += `- Your Meaning: ${meaning}\n`;
      resultText += `- Similar Colors: ${similars}\n`;
      resultText += `- GNH Sentiment: ${colorSentiment}\n\n`;
    });

    resultText += `---\n✨ GNH Indicator Health Analysis:\n`;
    Object.keys(gnhIndicators).forEach(color => {
      const gnh = gnhIndicators[color];
      let status = 'Neutral';
      if (obstacle.match(new RegExp(gnh, 'i'))) {
        status = 'Related';
      }
      resultText += `- ${gnh}: ${status}\n`;
    });

    // Output Results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultText;
  });
});

// Load the CSV
function loadMatriceCSV() {
  return fetch('la matrice plus.csv')
    .then(res => res.text())
    .then(csv => {
      const lines = csv.trim().split('\n');
      const data = {};
      lines.forEach(line => {
        const [pathway, statement] = line.split(',');
        if (pathway && statement) {
          data[pathway.trim().toLowerCase()] = statement.trim();
        }
      });
      return data;
    });
}

// Properly replace color names inside the text
function replaceColorWordsInPathway(originalText, userInputs) {
  let modified = originalText;

  Object.keys(userInputs).forEach(color => {
    const regex = new RegExp(`\\b${color}\\b`, 'gi'); // match whole word
    modified = modified.replace(regex, userInputs[color]);
  });

  return modified;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
