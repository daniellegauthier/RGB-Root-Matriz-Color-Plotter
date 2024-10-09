// Color similarity matrix
const similarityMatrix = {
    grey: {
        grey: 1.000000, pink: 0.738781, gold: 0.811503, nude: 0.960488, orange: 0.760979, 
        white: 1.000000, blue: 0.577350, green: 0.577350, red: 0.577350, black: 0.000000,
        brown: 0.710812, yellow: 0.816497, purple: 0.885817
    },
    pink: {
        grey: 0.738781, pink: 1.000000, gold: 0.734710, nude: 0.834433, orange: 0.861208,
        white: 0.738781, blue: 0.338719, green: 0.000000, red: 0.940887, black: 0.000000,
        brown: 0.906562, yellow: 0.665308, purple: 0.809003
    },
    gold: {
        grey: 0.811503, pink: 0.734710, gold: 1.000000, nude: 0.930603, orange: 0.966330,
        white: 0.811503, blue: 0.000000, green: 0.624695, red: 0.780869, black: 0.000000,
        brown: 0.919577, yellow: 0.993884, purple: 0.543455
    },
    nude: {
        grey: 0.960488, pink: 0.834433, gold: 0.930603, nude: 1.000000, orange: 0.911424,
        white: 0.960488, blue: 0.362970, green: 0.544456, red: 0.756188, black: 0.000000,
        brown: 0.874321, yellow: 0.919694, purple: 0.809512
    },
    orange: {
        grey: 0.760979, pink: 0.861208, gold: 0.966330, nude: 0.911424, orange: 1.000000,
        white: 0.760979, blue: 0.000000, green: 0.402739, red: 0.915315, black: 0.000000,
        brown: 0.989713, yellow: 0.932005, purple: 0.584904
    },
    white: {
        grey: 1.000000, pink: 0.738781, gold: 0.811503, nude: 0.960488, orange: 0.760979,
        white: 1.000000, blue: 0.577350, green: 0.577350, red: 0.577350, black: 0.000000,
        brown: 0.710812, yellow: 0.816497, purple: 0.885817
    },
    blue: {
        grey: 0.577350, pink: 0.338719, gold: 0.000000, nude: 0.362970, orange: 0.000000,
        white: 0.577350, blue: 1.000000, green: 0.000000, red: 0.000000, black: 0.000000,
        brown: 0.000000, yellow: 0.000000, purple: 0.806683
    },
    green: {
        grey: 0.577350, pink: 0.000000, gold: 0.624695, nude: 0.544456, orange: 0.402739,
        white: 0.577350, blue: 0.000000, green: 1.000000, red: 0.000000, black: 0.000000,
        brown: 0.267644, yellow: 0.707107, purple: 0.158173
    },
    red: {
        grey: 0.577350, pink: 0.940887, gold: 0.780869, nude: 0.756188, orange: 0.915315,
        white: 0.577350, blue: 0.000000, green: 0.000000, red: 1.000000, black: 0.000000,
        brown: 0.963518, yellow: 0.707107, purple: 0.569424
    },
    black: {
        grey: 0.000000, pink: 0.000000, gold: 0.000000, nude: 0.000000, orange: 0.000000,
        white: 0.000000, blue: 0.000000, green: 0.000000, red: 0.000000, black: 1.000000,
        brown: 0.000000, yellow: 0.000000, purple: 0.000000
    },
    brown: {
        grey: 0.710812, pink: 0.906562, gold: 0.919577, nude: 0.874321, orange: 0.989713,
        white: 0.710812, blue: 0.000000, green: 0.267644, red: 0.963518, black: 0.000000,
        brown: 1.000000, yellow: 0.870563, purple: 0.590984
    },
    yellow: {
        grey: 0.816497, pink: 0.665308, gold: 0.993884, nude: 0.919694, orange: 0.932005,
        white: 0.816497, blue: 0.000000, green: 0.707107, red: 0.707107, black: 0.000000,
        brown: 0.870563, yellow: 1.000000, purple: 0.514489
    },
    purple: {
        grey: 0.885817, pink: 0.809003, gold: 0.543455, nude: 0.809512, orange: 0.584904,
        white: 0.885817, blue: 0.806683, green: 0.158173, red: 0.569424, black: 0.000000,
        brown: 0.590984, yellow: 0.514489, purple: 1.000000
    }
};

function getColorData() {
    return [
        { color: 'grey', rgb: [170,170,170], direction: 'respectful effective apposite precary' },
        { color: 'pink', rgb: [250,0,90], direction: 'incredibily exquisite and ambitious' },
        { color: 'gold', rgb: [250,200,0], direction: 'undepartable preflorating technocracy lotiform' },
        { color: 'nude', rgb: [250,180,120], direction: 'felicitously deft satisfied unextenuable' },
        { color: 'orange', rgb: [250,110,0], direction: 'blurry artesian awesome' },
        { color: 'white', rgb: [255,255,255], direction: 'unlavish analeptical' },
        { color: 'blue', rgb: [0,0,255], direction: 'daintily perfect, intelligent photopathy' },
        { color: 'green', rgb: [0,255,0], direction: 'bulbous spontaneous heroic' },
        { color: 'red', rgb: [255,0,0], direction: 'candid apophantic, distinct and radiant' },
        { color: 'black', rgb: [0,0,0], direction: 'undertreated paleoatavistic obeyable swabble' },
        { color: 'brown', rgb: [180,50,0], direction: 'abundantly notable and unique submissive' },
        { color: 'yellow', rgb: [255,255,0], direction: 'exhilerating redressible authority plausible' },
        { color: 'purple', rgb: [180,50,255], direction: 'perfectly great - imaginative, brave, gifted' }
    ];
}

function getPathwaySequences() {
    return {
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
}

// Function to get the direction for a color by name
function getColorDirection(color) {
    const colorData = getColorData();
    const foundColor = colorData.find(c => c.color === color);
    return foundColor ? foundColor.direction : '';
}

// Function to calculate dot product similarity for color sequences
function rgbDistance(rgb1, rgb2) {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
}

function calculateDotProduct(sequence1, sequence2) {
    let dotProduct = 0;
    const minLength = Math.min(sequence1.length, sequence2.length);
    for (let i = 0; i < minLength; i++) {
        dotProduct += sequence1[i][0] * sequence2[i][0] +
                      sequence1[i][1] * sequence2[i][1] +
                      sequence1[i][2] * sequence2[i][2];
    }
    return dotProduct;
}

// Function to get the color RGB values for a pathway
function getColorSequenceRgb(pathway) {
    const colorData = getColorData();
    const pathwaySequence = getPathwaySequences()[pathway] || [];
    return pathwaySequence.map(color => {
        const foundColor = colorData.find(c => c.color === color);
        return foundColor ? foundColor.rgb : [0, 0, 0];
    });
}

function getColorDirection(color) {
    const colorData = getColorData().find(c => c.color === color);
    return colorData ? colorData.direction : '';
}

function getColorRgb(color) {
    const colorData = getColorData().find(c => c.color === color);
    return colorData ? colorData.rgb : [0, 0, 0];
}

function getColorSequenceRgb(pathway) {
    const pathwaySequences = getPathwaySequences();
    const sequence = pathwaySequences[pathway] || [];
    return sequence.map(color => getColorRgb(color));
}

function calculateDotProduct(rgbSeq1, rgbSeq2) {
    // Ensure sequences are of equal length for comparison
    const minLength = Math.min(rgbSeq1.length, rgbSeq2.length);
    let dotProduct = 0;
    
    for (let i = 0; i < minLength; i++) {
        const rgb1 = rgbSeq1[i];
        const rgb2 = rgbSeq2[i];
        dotProduct += rgb1[0] * rgb2[0] + rgb1[1] * rgb2[1] + rgb1[2] * rgb2[2];
    }
    
    return dotProduct;
}

// Function to get the closest pathway based on similarity score
function getClosestPathway(selectedPathway) {
    const allSequences = getPathwaySequences();
    const selectedRgb = getColorSequenceRgb(selectedPathway);
    let bestMatch = null;
    let highestDotProduct = -Infinity;
    
    for (const [pathway, sequence] of Object.entries(allSequences)) {
        if (pathway !== selectedPathway) {
            const currentRgb = getColorSequenceRgb(pathway);
            const dotProduct = calculateDotProduct(selectedRgb, currentRgb);
            if (dotProduct > highestDotProduct) {
                highestDotProduct = dotProduct;
                bestMatch = pathway;
            }
        }
    }
    
    return { bestMatch, similarityScore: highestDotProduct };
}

// Function to generate healing suggestion sentences
function generateHealingSentences() {
    const pathways = getPathwaySequences();
    const sentences = [];
    
    for (const [pathway, colors] of Object.entries(pathways)) {
        let sentence = `Let's create `;
        colors.forEach((color, index) => {
            const direction = getColorDirection(color);
            sentence += direction;
            if (index < colors.length - 1) sentence += ' with ';
        });
        sentence += `. This aligns with the notion of "${pathway}".`;
        
        // Calculate the closest pathway based on similarity
        const { bestMatch, similarityScore } = getClosestPathway(pathway);
        sentence += ` The closest sequence is "${bestMatch}" with a similarity score of ${(similarityScore / 1000000).toFixed(4)}.`;
        
        sentences.push(sentence);
    }
    
    return sentences;
}

// Update your document.addEventListener('DOMContentLoaded', ...) function:
document.addEventListener('DOMContentLoaded', () => {
    // ... (keep your existing initialization code)

    const form = document.getElementById('colorForm');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const resultSpan = document.getElementById('result');
    const comparisonSpan = document.getElementById('comparison');
    const formContentPre = document.getElementById('formResults');

    // Add this new function to update the UI with healing suggestions
    function updateHealingSuggestions() {
        const sentences = generateHealingSentences();
        let healingContent = '\nHealing Pathway Suggestions:\n\n';
        sentences.forEach(sentence => {
            healingContent += sentence + '\n\n';
        });
        return healingContent;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const obstacle = document.getElementById('obstacle').value || '[no obstacle entered]';
        const pathway = document.getElementById('pathway').value;
        
        let formContent = `RGB Root Matriz Color Plotter Results\n\n`;
        formContent += `Obstacle: ${obstacle}\nPathway: ${pathway || '[no pathway selected]'}\n\n`;
        
        if (pathway) {
            const pathwaySequences = getPathwaySequences();
            const sequence = pathwaySequences[pathway];
            
            const sentencePath = createSentenceFromInputs(sequence);
            formContent += `Suggested Direction:\n${sentencePath}\n\n`;
            
            formContent += `Color Sequence Analysis:\n`;
            for (let i = 0; i < sequence.length - 1; i++) {
                const similarity = similarityMatrix[sequence[i]][sequence[i+1]];
                formContent += `${sequence[i].toUpperCase()} to ${sequence[i+1].toUpperCase()}: ${(similarity * 100).toFixed(1)}% resonance\n`;
            }
            formContent += '\n';
        }
        
        formContent += `Individual Color Interpretations:\n`;
        getColorData().forEach(data => {
            const input = form.querySelector(`input[name="${data.color}-input"]`);
            const userInput = input.value || input.placeholder;
            formContent += `${data.color.toUpperCase()}:\n  Original: ${data.direction}\n  Your interpretation: ${userInput}\n\n`;
        });
        
        // Add healing suggestions to the form content
        formContent += updateHealingSuggestions();
        
        resultSpan.innerText = pathway ? 
            `Path: ${createSentenceFromInputs(pathwaySequences[pathway])}` : 
            'Awaiting your journey through color...';
        
        comparisonSpan.innerText = obstacle !== '[no obstacle entered]' ? 
            `Transforming "${obstacle}" through the wisdom of color relationships` : 
            'Ready to transmute challenges into chromatic wisdom.';
        
        formContentPre.innerText = formContent;
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        formContentPre.innerText = '';
        resultSpan.innerText = 'Awaiting your journey through color...';
        comparisonSpan.innerText = 'Ready to transmute challenges into chromatic wisdom.';
    });

    saveBtn.addEventListener('click', () => {
        const content = formContentPre.innerText;
        if (!content) {
            alert('Please generate results before saving.');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-plotter-results.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    });
});
