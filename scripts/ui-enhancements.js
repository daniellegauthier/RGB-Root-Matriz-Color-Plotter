// scripts/ui-enhancements.js

const pathways = {
  knot: ['white', 'blue', 'green', 'red', 'black', 'brown', 'yellow', 'purple'],
  plot: ['grey', 'pink', 'gold', 'nude', 'orange'],
  pain: ['gold', 'orange'],
  practical: ['yellow', 'green'],
  spiritual: ['blue', 'brown'],
  prayer: ['nude', 'white'],
  sad: ['purple', 'grey', 'red'],
  precise: ['pink', 'black'],
  feminine: ['brown', 'gold', 'orange', 'pink'],
  masc: ['red', 'blue', 'orange'],
  direct: ['red', 'orange']
};

const pathwayImages = {
  knot: "knot_white_blue_green_red_black_brown_yellow_purple.png",
  plot: "plot_grey_pink_gold_nude_orange.png",
  pain: "pain_gold_orange.png",
  practical: "practical_yellow_green.png",
  prayer: "prayer_nude_white.png",
  sad: "sad_purple_grey_red.png",
  spiritual: "spiritual_blue_brown.png",
  precise: "precise_pink_black.png",
  feminine: "fem_brown_gold_orange_pink.png",
  masc: "masc_red_blue_orange.png",
  direct: "direct_red_orange.png"
};

// Fallback modes
const wordModes = {
  matrice1: {
    red: "vitality", orange: "creativity", yellow: "foundation", green: "nature", blue: "dreaming", purple: "connection",
    brown: "belonging", pink: "intuition", black: "focus", white: "breath", grey: "memory", nude: "body", gold: "opportunity"
  },
  english: {
    red: "energy", orange: "sociability", yellow: "resourcefulness", green: "balance", blue: "reflection", purple: "identity",
    brown: "education", pink: "compassion", black: "organization", white: "hope", grey: "persistence", nude: "health", gold: "work"
  },
  gnh: {
    red: "Health", orange: "Social Wellness", yellow: "Living Standards", green: "Ecological Diversity",
    blue: "Environmental Wellness", purple: "Cultural Diversity", brown: "Education Value",
    pink: "Mental Wellness", black: "Good Governance", white: "Political Wellness",
    grey: "Economic Wellness", nude: "Physical Wellness", gold: "Workplace Wellness"
  }
};

let currentMode = 'gnh'; // default
let fallbackWords = {}; // active fallback suggestions

document.addEventListener('DOMContentLoaded', function () {
  populatePathwaysDropdown();
  attachModeButtons();
  attachPathwaySelector();
});

function populatePathwaysDropdown() {
  const pathwaySelect = document.getElementById('pathway');
  Object.keys(pathways).forEach(path => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = path.charAt(0).toUpperCase() + path.slice(1);
    pathwaySelect.appendChild(option);
  });
}

function attachModeButtons() {
  document.getElementById('matrice1Btn').addEventListener('click', () => {
    currentMode = 'matrice1';
    rerenderColorWords();
  });
  document.getElementById('englishBtn').addEventListener('click', () => {
    currentMode = 'english';
    rerenderColorWords();
  });
  document.getElementById('gnhBtn').addEventListener('click', () => {
    currentMode = 'gnh';
    rerenderColorWords();
  });
}

function attachPathwaySelector() {
  document.getElementById('pathway').addEventListener('change', () => {
    rerenderColorWords();
    updatePathwayImage();
  });
}

function rerenderColorWords() {
  const selectedPathway = document.getElementById('pathway').value;
  const colorGrid = document.getElementById('colorGrid');
  colorGrid.innerHTML = '';

  if (!selectedPathway) return;

  const selectedColors = pathways[selectedPathway];
  fallbackWords = {};

  selectedColors.forEach(colorName => {
    const fallback = wordModes[currentMode][colorName] || `[${colorName}]`;
    fallbackWords[colorName] = fallback;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label class="block mb-1 font-bold">${colorName.toUpperCase()}</label>
      <input type="text" data-color="${colorName}" placeholder="${fallback}" class="w-full p-2 border rounded placeholder-gray-400" />
    `;
    colorGrid.appendChild(wrapper);
  });
}

function updatePathwayImage() {
  const selectedPathway = document.getElementById('pathway').value;
  const pathwayImage = document.getElementById('pathwayImage');

  if (selectedPathway && pathwayImages[selectedPathway]) {
    pathwayImage.src = `images/${pathwayImages[selectedPathway]}`;
    pathwayImage.classList.remove('hidden');
  } else {
    pathwayImage.src = '';
    pathwayImage.classList.add('hidden');
  }
}
