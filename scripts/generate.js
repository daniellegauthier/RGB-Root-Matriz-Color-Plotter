// scripts/generate.js

document.addEventListener('DOMContentLoaded', () => {

  const pathwayStatements = {
    knot: "let's maybe clarify the white-pathway with blue-pathway from green-pathway. The red-pathway will melt with black-pathway from brown-pathway due to yellow-pathway for purple-pathway.",
    plot: "let's maybe set the grey-pathway from the pink-pathway and the gold-pathway to return a nude-pathway and an orange-pathway.",
    pain: "let's maybe use inspiration from clarity and distribution from gold-pathway to address the pain from the orange-pathway as from the world of a return.",
    practical: "let's maybe use our energy from work to achieve the yellow-pathway for the green-pathway.",
    spiritual: "let's maybe blue-pathway with brown-pathway.",
    prayer: "let's maybe nude-pathway our white-pathway.",
    sad: "let's maybe use the freedom from purple-pathway to grey-pathway for red-pathway awareness.",
    precise: "let's maybe give openness from the pink-pathway to black-pathway.",
    feminine: "let's maybe use brown-pathway to gold-pathway the pain of the orange-pathway as a new pink-pathway.",
    masc: "let's maybe use awareness from the red-pathway to blue-pathway to address the pain from the orange-pathway as a seed for a return.",
    direct: "let's maybe use gratitude from a return and inspiration from clarity to limit from red-pathway the pain from orange-pathway."
  };

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
    e.preventDefault(); // prevent reload

    const obstacle = document.getElementById('obstacle').value.trim();
    const pathway = document.getElementById('pathway').value.trim();
    const sentiment = document.getElementById('sentimentScore').innerText || 'Sentiment Score: [not analyzed]';
    const sentimentScore = parseInt(sentiment.match(/\d+/)) || 5;
    const colorInputs = document.querySelectorAll('#colorGrid input');

    if (!pathway || colorInputs.length === 0) {
      alert('Please select a pathway and fill your interpretations.');
      return;
    }

    const userInterpretations = {};
    colorInputs.forEach(input => {
      const color = input.getAttribute('data-color');
      userInterpretations[color] = input.value || `[no input for ${color}]`;
    });

    // Fetch original pathway statement
    let pathwayOriginal = pathwayStatements[pathway] || "Pathway statement not available.";
    let pathwayStatement = replacePathwayColorsWithInputs(pathwayOriginal, userInterpretations);

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
      const meaning = input.value.trim();
userInterpretations[color] = meaning || fallbackWords[color] || `[no input for ${color}]`;

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

    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultText;
  });
});

// Correctly replace full "color-pathway" words with user inputs
function replacePathwayColorsWithInputs(text, userInputs) {
  let modified = text;

  Object.keys(userInputs).forEach(color => {
    const regex = new RegExp(`${color}-pathway`, 'gi'); // match e.g. pink-pathway exactly
    modified = modified.replace(regex, userInputs[color]);
  });

  return modified;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
