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

const colorGNH = {
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
  purple: 'Cultural Diversity'
};

// ➡️ New: Populate dropdown automatically
function populatePathwaysDropdown() {
  const pathwaySelect = document.getElementById('pathway');
  Object.keys(pathways).forEach(path => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = path.charAt(0).toUpperCase() + path.slice(1);
    pathwaySelect.appendChild(option);
  });
}

// ➡️ Existing: Tooltip enhancer
function addTooltips() {
  const colorElements = document.querySelectorAll('#colorGrid input');

  colorElements.forEach(input => {
    const color = input.getAttribute('data-color');
    if (color && colorGNH[color]) {
      input.title = `GNH Indicator: ${colorGNH[color]}`;
    }
  });
}

// ➡️ Initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  populatePathwaysDropdown();
  addTooltips();
});
