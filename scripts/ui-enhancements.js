// scripts/ui-enhancements.js
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

function addTooltips() {
  const colorElements = document.querySelectorAll('#colorGrid input');

  colorElements.forEach(input => {
    const color = input.getAttribute('data-color');
    if (color && colorGNH[color]) {
      input.title = `GNH Indicator: ${colorGNH[color]}`;
    }
  });
}

// Initialize tooltips after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  addTooltips();
});
