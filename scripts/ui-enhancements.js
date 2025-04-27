// scripts/ui-enhancements.js

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

const colorData = [
  { color: 'grey', matrice1: 'Cover', 'english-words': 'respectful effective apposite precary', gnh: 'Economic Wellness' },
  { color: 'pink', matrice1: 'Category', 'english-words': 'incredibly exquisite and ambitious', gnh: 'Mental Wellness' },
  { color: 'gold', matrice1: 'Pull', 'english-words': 'undepartable preflorating technocracy lotiform', gnh: 'Workplace Wellness' },
  { color: 'nude', matrice1: 'Approach', 'english-words': 'felicitously deft satisfied unextenuable', gnh: 'Physical Wellness' },
  { color: 'orange', matrice1: 'Hit', 'english-words': 'blurry artesian awesome', gnh: 'Social Wellness' },
  { color: 'white', matrice1: 'Hope', 'english-words': 'unlavish analeptical', gnh: 'Political Wellness' },
  { color: 'blue', matrice1: 'Collect', 'english-words': 'daintily perfect, intelligent photopathy', gnh: 'Environmental Wellness' },
  { color: 'green', matrice1: 'Transition', 'english-words': 'bulbous spontaneous heroic', gnh: 'Ecological Diversity' },
  { color: 'red', matrice1: 'Limit', 'english-words': 'candid apophantic, distinct and radiant', gnh: 'Health' },
  { color: 'black', matrice1: 'Order', 'english-words': 'undertreated paleoatavistic obeyable swabble', gnh: 'Good Governance' },
  { color: 'brown', matrice1: 'Learn', 'english-words': 'abundantly notable and unique submissive', gnh: 'Education Value' },
  { color: 'yellow', matrice1: 'Structure', 'english-words': 'exhilarating redressible authority plausible', gnh: 'Living Standards' },
  { color: 'purple', matrice1: 'Free', 'english-words': 'perfectly great - imaginative, brave, gifted', gnh: 'Cultural Diversity' }
];

let currentMode = 'gnh'; // default

document.addEventListener('DOMContentLoaded', function() {
  populatePathwaysDropdown();
  attachModeButtons();
  attachPathwaySelector();
  attachGenerateButton();
});

// Populate the dropdown
function populatePathwaysDropdown() {
  const pathwaySelect = document.getElementById('pathway');
  Object.keys(pathways).forEach(path => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = path.charAt(0).toUpperCase() + path.slice(1);
    pathwaySelect.appendChild(option);
  });
}

// Attach Mode Switching Buttons
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

// Attach Pathway Dropdown Change
function attachPathwaySelector() {
  document.getElementById('pathway').addEventListener('change', () => {
    rerenderColorWords();
  });
}

// Attach Generate Button
function attachGenerateButton() {
  document.getElementById('colorForm').addEventListener('submit', function(e) {
    e.preventDefault(); // stop form from refreshing page

    const obstacle = document.getElementById('obstacle').value;
    const selectedPathway = document.getElementById('pathway').value;
    const sentiment = document.getElementById('sentimentScore').innerText;

    let resultsText = `Obstacle: ${obstacle || '[no obstacle entered]'}\n`;
    resultsText += `Pathway: ${selectedPathway || '[no pathway selected]'}\n`;
    resultsText += `${sentiment}\n\n`;

    const inputs = document.querySelectorAll('#colorGrid input');

    inputs.forEach(input => {
      const color = input.getAttribute('data-color');
      const value = input.value || '[no input]';
      const colorInfo = colorData.find(c => c.color === color);

      let word = '';
      if (currentMode === 'matrice1') word = colorInfo.matrice1;
      else if (currentMode === 'english-words') word = colorInfo['english-words'];
      else word = colorInfo.gnh;

      resultsText += `${color.toUpperCase()} - ${word}: ${value}\n`;
    });

    // Show results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultsText;
  });
}

// Rerender Colors & Guidance Words
function rerenderColorWords() {
  const selectedPathway = document.getElementById('pathway').value;
  const colorGrid = document.getElementById('colorGrid');
  colorGrid.innerHTML = '';

  if (!selectedPathway) return;

  const selectedColors = pathways[selectedPathway];

  selectedColors.forEach(colorName => {
    const colorInfo = colorData.find(c => c.color === colorName);

    let word = '';
    if (currentMode === 'matrice1') word = colorInfo.matrice1;
    else if (currentMode === 'english-words') word = colorInfo['english-words'];
    else word = colorInfo.gnh;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label class="block mb-1 font-bold">${colorName.toUpperCase()} 
        <span class="text-gray-600 text-sm">(${word})</span>
      </label>
      <input type="text" data-color="${colorName}" placeholder="Interpret here..." class="w-full p-2 border rounded" />
    `;
    colorGrid.appendChild(wrapper);
  });
}
