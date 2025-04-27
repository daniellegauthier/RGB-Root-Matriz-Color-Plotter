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
    grey: { label: 'Economic Wellness', description: 'Measures financial security, employment, debt levels, etc.' },
    pink: { label: 'Mental Wellness', description: 'Relates to emotional health, psychological resilience, and happiness.' },
    gold: { label: 'Workplace Wellness', description: 'Evaluates work-life balance, safety, and job satisfaction.' },
    nude: { label: 'Physical Wellness', description: 'Reflects physical health conditions and healthy living.' },
    orange: { label: 'Social Wellness', description: 'Assesses community engagement, relationships, and social support.' },
    white: { label: 'Political Wellness', description: 'Civic freedom, government trust, and social justice.' },
    blue: { label: 'Environmental Wellness', description: 'Ecological health, conservation, clean air and water.' },
    green: { label: 'Ecological Diversity', description: 'Protection of biodiversity, forests, ecosystems.' },
    red: { label: 'Health', description: 'Overall medical wellbeing, life expectancy, access to healthcare.' },
    black: { label: 'Good Governance', description: 'Transparency, leadership effectiveness, public trust.' },
    brown: { label: 'Education Value', description: 'Literacy, educational access, lifelong learning support.' },
    yellow: { label: 'Living Standards', description: 'Access to food, shelter, income, material wellbeing.' },
    purple: { label: 'Cultural Diversity', description: 'Preservation of languages, traditions, cultural expressions.' },
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

    // Fetch pathway statement
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

    colorInputs.forEach(input => {
      const color = input.getAttribute('data-color');
      const meaning = input.value || '[no input]';

      const similars = (similarityMatrix[color] || []).map(c => capitalizeFirstLetter(c)).join(', ') || 'No similar colors';
      const gnh = gnhIndicators[color]?.label || 'Unknown GNH';
      const description = gnhIndicators[color]?.description || '';

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

    // Output results
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

// Correct color word replacement
function replaceColorWordsInPathway(originalText, userInputs) {
  let modified = originalText;

  Object.keys(userInputs).forEach(color => {
    const regex = new RegExp(`{${color}}`, 'gi'); // exact {color} placeholders
    modified = modified.replace(regex, userInputs[color]);
  });

  return modified;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
