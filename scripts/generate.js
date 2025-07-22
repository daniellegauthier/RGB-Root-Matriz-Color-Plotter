// scripts/generate.js
import { analyzeSentiment } from './sentiment.js';
import { getGnhScores } from './gnhSemantic.js';

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
    grey: { label: 'Economic Wellness' },
    pink: { label: 'Mental Wellness' },
    gold: { label: 'Workplace Wellness' },
    nude: { label: 'Physical Wellness' },
    orange: { label: 'Social Wellness' },
    white: { label: 'Political Wellness' },
    blue: { label: 'Environmental Wellness' },
    green: { label: 'Ecological Diversity' },
    red: { label: 'Health' },
    black: { label: 'Good Governance' },
    brown: { label: 'Education Value' },
    yellow: { label: 'Living Standards' },
    purple: { label: 'Cultural Diversity' }
  };

  document.getElementById('colorForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const obstacle = document.getElementById('obstacle').value.trim();
    const pathway = document.getElementById('pathway').value.trim();
    const sentimentScore = analyzeSentiment(obstacle);
    document.getElementById('sentimentScore').innerText = `Sentiment Score: ${sentimentScore}/10`;

    if (!pathway) {
      alert('Please select a pathway.');
      return;
    }

    // Build meanings
    const userInterpretations = {};
    document.querySelectorAll('#colorGrid input').forEach(input => {
      const color = input.getAttribute('data-color');
      const meaning = input.value.trim();
      userInterpretations[color] = meaning || fallbackWords[color] || `[no input for ${color}]`;
    });

    // Prepare base result text
    let resultText = `🌿 Obstacle: ${obstacle || '[none entered]'}\n`;
    resultText += `🌿 Selected Pathway: ${capitalizeFirstLetter(pathway)}\n`;
    resultText += `🌿 Sentiment Score: ${sentimentScore}/10\n\n`;

    // Pathway statement with tone
    let statement = replacePathwayColorsWithInputs(pathwayStatements[pathway] || '', userInterpretations);
    if (sentimentScore <= 3) statement = "Despite difficulties, " + statement;
    else if (sentimentScore >= 8) statement = "With hope and resilience, " + statement;
    resultText += `🌟 Pathway Statement:\n${statement}\n\n✨ Color Interpretations:\n\n`;

    // Add color blocks
    Object.entries(userInterpretations).forEach(([color, meaning]) => {
      const similars = (similarityMatrix[color] || []).map(c => capitalizeFirstLetter(c)).join(', ');
      const gnhLabel = gnhIndicators[color]?.label || 'Unknown';
      resultText += `🔸 ${capitalizeFirstLetter(color)} (${gnhLabel})\n- Your Meaning: ${meaning}\n- Similar Colors: ${similars}\n`;
    });

    // NOW: get GNH semantic scores
    try {
      const meaningsString = Object.values(userInterpretations).join(' ');
      const gnhScores = await getGnhScores(meaningsString);

      Object.keys(userInterpretations).forEach(color => {
        const label = gnhIndicators[color]?.label;
        const sim = gnhScores[label] || 0;
        const score10 = Math.round(sim * 9) + 1;
        const sentiment = score10 >= 6 ? 'Positive' : score10 <= 4 ? 'Negative' : 'Neutral';
        resultText += `- GNH Sentiment: ${sentiment} (${score10}/10)\n\n`;
      });
    } catch(err) {
      console.error('GNH scoring failed', err);
      resultText += '\n⚠️ GNH analysis failed – try again later.\n';
    }

    // Render results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultText;

    // Setup PDF export
    const pdfContent = document.getElementById('pdfContent');
    pdfContent.innerHTML = `
      <div style="text-align:center;">
        <img src="${document.getElementById('pathwayImage').src}" style="max-width:300px;margin-bottom:20px;" />
      </div>
      <pre style="white-space:pre-wrap;">${resultText}</pre>`;
    pdfContent.classList.remove('hidden');
    document.getElementById('downloadPDF').classList.remove('hidden');
  });
});
