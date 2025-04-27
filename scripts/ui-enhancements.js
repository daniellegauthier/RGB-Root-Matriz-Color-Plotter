// scripts/ui-enhancements.js

// PATHWAYS mapping
const pathways = {
  pain: ['gold', 'orange'],
  practical: ['yellow', 'green'],
  spiritual: ['blue', 'brown'],
  prayer: ['nude', 'white'],
  sad: ['purple', 'grey', 'red'],
  precise: ['pink', 'black'],
  fem: ['brown', 'gold', 'orange', 'pink'],
  masc: ['red', 'blue', 'orange'],
  direct: ['red', 'orange'],
};

// GNH INDICATOR definitions
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

// Global mode variable
let currentMode = 'gnh';

document.addEventListener('DOMContentLoaded', function() {
  populatePathwaysDropdown();
  attachModeButtons();
  attachPathwaySelector();
});

// Populate dropdown
function populatePathwaysDropdown() {
  const pathwaySelect = document.getElementById('pathway');
  Object.keys(pathways).forEach(path => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = path.charAt(0).toUpperCase() + path.slice(1);
    pathwaySelect.appendChild(option);
  });
}

// Mode switchers
function attachModeButtons() {
  document.getElementById('matrice1Btn').addEventListener('click', () => {
    currentMode = 'matrice1';
    rerenderColorWords();
  });
  document.getElementById('englishBtn').addEventListener('click', () => {
    currentMode = 'english-words';
    rerenderColorWords();
  });
  document.getElementById('gnhBtn').addEventListener('click', () => {
    currentMode = 'gnh';
    rerenderColorWords();
  });
}

// Pathway selector
function attachPathwaySelector() {
  document.getElementById('pathway').addEventListener('change', () => {
    rerenderColorWords();
  });
}

// Render Color Inputs
function rerenderColorWords() {
  const selectedPathway = document.getElementById('pathway').value;
  const colorGrid = document.getElementById('colorGrid');
  colorGrid.innerHTML = '';

  if (!selectedPathway) return;

  const selectedColors = pathways[selectedPathway];

  selectedColors.forEach(colorName => {
    const colorInfo = gnhIndicators[colorName];

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label class="block mb-1 font-bold">
        ${colorName.toUpperCase()} (${colorInfo?.label || 'Unknown'})
        <span class="text-gray-400 text-xs" title="${colorInfo?.description || ''}">
          ⓘ
        </span>
      </label>
      <input type="text" data-color="${colorName}" placeholder="Interpret here..." class="w-full p-2 border rounded" />
    `;
    colorGrid.appendChild(wrapper);
  });
}
