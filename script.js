// Color data
const colorData = [
  { color: 'grey', rgb: [170,170,170], matrice1: 'Cover', 'english-words': 'respectful effective apposite precary' },
  { color: 'pink', rgb: [250,0,90], matrice1: 'Category', 'english-words': 'incredibily exquisite and ambitious' },
  { color: 'gold', rgb: [250,200,0], matrice1: 'Pull', 'english-words': 'undepartable preflorating technocracy lotiform' },
  { color: 'nude', rgb: [250,180,120], matrice1: 'Approach', 'english-words': 'felicitously deft satisfied unextenuable' },
  { color: 'orange', rgb: [250,110,0], matrice1: 'Hit', 'english-words': 'blurry artesian awesome' },
  { color: 'white', rgb: [255,255,255], matrice1: 'Hope', 'english-words': 'unlavish analeptical' },
  { color: 'blue', rgb: [0,0,255], matrice1: 'Collect', 'english-words': 'daintily perfect, intelligent photopathy' },
  { color: 'green', rgb: [0,255,0], matrice1: 'Transition', 'english-words': 'bulbous spontaneous heroic' },
  { color: 'red', rgb: [255,0,0], matrice1: 'Limit', 'english-words': 'candid apophantic, distinct and radiant' },
  { color: 'black', rgb: [0,0,0], matrice1: 'Order', 'english-words': 'undertreated paleoatavistic obeyable swabble' },
  { color: 'brown', rgb: [180,50,0], matrice1: 'Learn', 'english-words': 'abundantly notable and unique submissive' },
  { color: 'yellow', rgb: [255,255,0], matrice1: 'Structure', 'english-words': 'exhilerating redressible authority plausible' },
  { color: 'purple', rgb: [180,50,255], matrice1: 'Free', 'english-words': 'perfectly great - imaginative, brave, gifted' }
];

// Pathways
const pathways = {
  'plot': ['grey', 'pink', 'gold', 'nude', 'orange'],
  'knot': ['white', 'blue', 'green', 'red', 'black', 'brown', 'yellow', 'purple'],
  'pain': ['gold', 'orange'],
  'practical': ['yellow', 'green'],
  'spiritual': ['blue', 'brown'],
  'prayer': ['nude', 'white'],
  'sad': ['purple', 'grey', 'red'],
  'precise': ['pink', 'black'],
  'fem': ['brown', 'gold', 'orange', 'pink'],
  'masc': ['red', 'blue', 'orange'],
  'direct': ['red', 'orange']
};

// Predefined movement sequences for each color
const colorSequences = {
  'gold': { x: [250], y: [200], t: [0] },
  'orange': { x: [250], y: [110], t: [0] },
  'yellow': { x: [255], y: [255], t: [0] },
  'green': { x: [0], y: [255], t: [0] },
  'blue': { x: [0], y: [0], t: [255] },
  'brown': { x: [180], y: [50], t: [0] },
  'nude': { x: [250], y: [180], t: [120] },
  'white': { x: [255], y: [255], t: [255] },
  'purple': { x: [180], y: [50], t: [255] },
  'grey': { x: [170], y: [170], t: [170] },
  'red': { x: [255], y: [0], t: [0] },
  'pink': { x: [250], y: [0], t: [90] },
  'black': { x: [0], y: [0], t: [0] }
};

// State variables
let currentVersion = 'matrice1';
let selectedPathway = '';
let obstacle = '';
let colorInputs = {};
let result = '';
let highlightedColor = null;
let scene, camera, renderer, controls;
let animationFrameId;

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize color inputs
  colorData.forEach(({ color }) => {
    colorInputs[color] = '';
  });

  // Set up event listeners
  document.getElementById('matrice1-btn').addEventListener('click', () => setVersion('matrice1'));
  document.getElementById('english-words-btn').addEventListener('click', () => setVersion('english-words'));
  document.getElementById('plotter-form').addEventListener('submit', handleGenerate);
  document.getElementById('clear-btn').addEventListener('click', handleClear);
  document.getElementById('print-btn').addEventListener('click', handlePrintToPDF);
  document.getElementById('pathway-select').addEventListener('change', handlePathwayChange);

  // Render color inputs
  renderColorInputs();
});

// Set version (matrice1 or english-words)
function setVersion(version) {
  currentVersion = version;
  
  // Update button styles
  document.getElementById('matrice1-btn').classList.toggle('btn-active', version === 'matrice1');
  document.getElementById('english-words-btn').classList.toggle('btn-active', version === 'english-words');
  
  // Update placeholders
  renderColorInputs();
}

// Render color input fields
function renderColorInputs() {
  const colorInputsContainer = document.getElementById('color-inputs');
  colorInputsContainer.innerHTML = '';

  colorData.forEach(({ color, rgb, matrice1, 'english-words': englishWords }) => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = `rgb(${rgb.join(',')})`;
    if (color === 'white') {
      colorSwatch.style.border = '1px solid black';
    }
    colorSwatch.addEventListener('click', () => highlightSimilarColors(color));
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'color-input';
    input.value = colorInputs[color] || '';
    input.placeholder = currentVersion === 'matrice1' ? matrice1 : englishWords;
    input.dataset.color = color;
    input.addEventListener('input', (e) => {
      colorInputs[color] = e.target.value;
    });
    
    if (highlightedColor === color) {
      input.classList.add('highlighted');
    }
    
    colorItem.appendChild(colorSwatch);
    colorItem.appendChild(input);
    colorInputsContainer.appendChild(colorItem);
  });
}

// Handle pathway selection change
function handlePathwayChange(e) {
  selectedPathway = e.target.value;
  
  if (selectedPathway) {
    document.getElementById('visualization-container').classList.remove('hidden');
    initVisualization();
  } else {
    document.getElementById('visualization-container').classList.add('hidden');
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
}

// Initialize 3D visualization
function initVisualization() {
  const container = document.getElementById('canvas-container');
  
  // Clear previous visualization
  if (renderer) {
    container.removeChild(renderer.domElement);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
  
  // Set up scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  
  // Set up camera
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 2;
  
  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Set up controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  
  // Add color points
  const relevantColors = pathways[selectedPathway] || [];
  
  relevantColors.forEach(color => {
    if (colorSequences[color]) {
      const seq = colorSequences[color];
      const colorInfo = colorData.find(c => c.color === color);
      
      const geometry = new THREE.SphereGeometry(0.02, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(`rgb(${colorInfo.rgb.join(',')})`) 
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      sphere.position.set(
        seq.x[0] / 255, 
        seq.y[0] / 255, 
        seq.t[0] / 255
      );
      
      scene.add(sphere);
    }
  });
  
  // Add lines between points
  if (relevantColors.length > 1) {
    const points = [];
    
    relevantColors.forEach(color => {
      if (colorSequences[color]) {
        const seq = colorSequences[color];
        points.push(new THREE.Vector3(
          seq.x[0] / 255,
          seq.y[0] / 255,
          seq.t[0] / 255
        ));
      }
    });
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
  
  // Animation loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Highlight similar colors
function highlightSimilarColors(color) {
  highlightedColor = color;
  renderColorInputs();
  
  const similarColorsContainer = document.getElementById('similar-colors');
  const similarColorsDisplay = document.getElementById('similar-colors-display');
  
  similarColorsContainer.classList.remove('hidden');
  similarColorsDisplay.innerHTML = '';
  
  // Get similar colors (simplified implementation)
  const similarColors = colorData
    .filter(c => c.color !== color)
    .slice(0, 5)
    .map(c => c.color);
  
  similarColors.forEach(similarColor => {
    const colorInfo = colorData.find(c => c.color === similarColor);
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'similar-color';
    colorSwatch.style.backgroundColor = `rgb(${colorInfo.rgb.join(',')})`;
    if (similarColor === 'white') {
      colorSwatch.style.border = '1px solid black';
    }
    
    similarColorsDisplay.appendChild(colorSwatch);
  });
}

// Generate pathway statement
function generatePathwayStatement(pathway, relevantColors, inputs) {
  const getColorPhrase = (color) => {
    const colorInfo = colorData.find(c => c.color === color);
    const input = inputs[color];
    if (input && input.trim() !== '') {
      return input.trim();
    }
    return currentVersion === 'matrice1' ? colorInfo.matrice1 : colorInfo['english-words'];
  };

  const statements = {
    'knot': () => {
      const [white, blue, green, red, black, brown, yellow, purple] = relevantColors;
      return `Let's maybe clarify the ${getColorPhrase(white)} with ${getColorPhrase(blue)} from ${getColorPhrase(green)}. The ${getColorPhrase(red)} will melt with ${getColorPhrase(black)} from ${getColorPhrase(brown)} due to ${getColorPhrase(yellow)} for ${getColorPhrase(purple)}.`;
    },
    'plot': () => {
      const [grey, pink, gold, nude, orange] = relevantColors;
      return `Let's maybe set the ${getColorPhrase(grey)} from the ${getColorPhrase(pink)} and the ${getColorPhrase(gold)} to return a ${getColorPhrase(nude)} and a ${getColorPhrase(orange)}.`;
    },
    'pain': () => {
      const [gold, orange] = relevantColors;
      return `The ${getColorPhrase(gold)} might intensify the ${getColorPhrase(orange)}.`;
    },
    'practical': () => {
      const [yellow, green] = relevantColors;
      return `Consider applying ${getColorPhrase(yellow)} methods to achieve ${getColorPhrase(green)} results.`;
    },
    'spiritual': () => {
      const [blue, brown] = relevantColors;
      return `Seek ${getColorPhrase(blue)} insights through ${getColorPhrase(brown)} practices.`;
    },
    'prayer': () => {
      const [nude, white] = relevantColors;
      return `Open your ${getColorPhrase(nude)} heart to receive ${getColorPhrase(white)} blessings.`;
    },
    'sad': () => {
      const [purple, grey, red] = relevantColors;
      return `Acknowledge the ${getColorPhrase(purple)} emotions, embrace the ${getColorPhrase(grey)} moments, and let the ${getColorPhrase(red)} passion guide you through.`;
    },
    'precise': () => {
      const [pink, black] = relevantColors;
      return `Focus on ${getColorPhrase(pink)} details with ${getColorPhrase(black)} determination.`;
    },
    'fem': () => {
      const [brown, gold, orange, pink] = relevantColors;
      return `Embrace your ${getColorPhrase(brown)} strength, celebrate your ${getColorPhrase(gold)} value, ignite your ${getColorPhrase(orange)} passion, and nurture your ${getColorPhrase(pink)} sensitivity.`;
    },
    'masc': () => {
      const [red, blue, orange] = relevantColors;
      return `Channel your ${getColorPhrase(red)} energy, maintain your ${getColorPhrase(blue)} composure, and let your ${getColorPhrase(orange)} confidence shine.`;
    },
    'direct': () => {
      const [red, orange] = relevantColors;
      return `Approach with ${getColorPhrase(red)} clarity and ${getColorPhrase(orange)} assertiveness.`;
    }
  };

  return statements[pathway] ? statements[pathway]() : `Let's maybe explore the connection between ${getColorPhrase(relevantColors[0])} and ${getColorPhrase(relevantColors[1])} in this ${pathway}.`;
}

// Process input and generate result
function processInput() {
  const relevantColors = pathways[selectedPathway] || [];
  let resultText = `Sequencing Result for Pathway "${selectedPathway}" with obstacle "${obstacle}":\n\n`;

  relevantColors.forEach(color => {
    const colorInfo = colorData.find(c => c.color === color);
    const input = colorInputs[color] || '[no input]';

    resultText += `${color.toUpperCase()}:\n`;
    resultText += `Your interpretation: ${input}\n`;
    resultText += `Matrice1: ${colorInfo.matrice1}\n`;
    resultText += `English words: ${colorInfo['english-words']}\n`;
    resultText += `Top similar colors:\n`;
    
    // Get similar colors (simplified implementation)
    const similarColors = colorData
      .filter(c => c.color !== color)
      .slice(0, 5)
      .map(c => c.color);
    
    similarColors.forEach((similarColor) => {
      resultText += `  - ${similarColor.toUpperCase()}\n`;
    });
    
    resultText += '\n';
  });

  resultText += "\nPathway Statement:\n";
  resultText += generatePathwayStatement(selectedPathway, relevantColors, colorInputs);

  return resultText;
}

// Handle generate button click
function handleGenerate(e) {
  e.preventDefault();
  
  obstacle = document.getElementById('obstacle-input').value;
  
  if (!selectedPathway) {
    alert('Please select a pathway');
    return;
  }
  
  result = processInput();
  
  const resultsCard = document.getElementById('results-card');
  const resultsContent = document.getElementById('results-content');
  
  resultsCard.classList.remove('hidden');
  resultsContent.textContent = result;
}

// Handle clear button click
function handleClear() {
  obstacle = '';
  selectedPathway = '';
  colorInputs = {};
  result = '';
  highlightedColor = null;
  
  document.getElementById('obstacle-input').value = '';
  document.getElementById('pathway-select').value = '';
  document.getElementById('results-card').classList.add('hidden');
  document.getElementById('similar-colors').classList.add('hidden');
  document.getElementById('visualization-container').classList.add('hidden');
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  colorData.forEach(({ color }) => {
    colorInputs[color] = '';
  });
  
  renderColorInputs();
}

// Handle print to PDF button click
function handlePrintToPDF() {
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>RGB Root Matriz Color Plotter Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1 { color: #333; }
        h2 { color: #666; }
        .color-input { margin-bottom: 10px; }
        pre { white-space: pre-wrap; background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>RGB Root Matriz Color Plotter Results</h1>
      <h2>Settings</h2>
      <p><strong>Obstacle:</strong> ${obstacle}</p>
      <p><strong>Pathway:</strong> ${selectedPathway}</p>
      <p><strong>Version:</strong> ${currentVersion}</p>

      <h2>Color Inputs</h2>
      ${Object.entries(colorInputs).map(([color, value]) => `
        <div class="color-input">
          <strong>${color}:</strong> ${value || '(No input)'}
        </div>
      `).join('')}

      <h2>Result</h2>
      <pre>${result}</pre>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
