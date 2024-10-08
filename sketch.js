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

function findStrongestConnections(color) {
    const connections = Object.entries(similarityMatrix[color])
        .filter(([key, value]) => key !== color && value > 0.8)
        .sort((a, b) => b[1] - a[1]);
    return connections.slice(0, 3);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colorForm');
    const resultSpan = document.getElementById('result');
    const comparisonSpan = document.getElementById('comparison');
    const formContentPre = document.getElementById('formResults');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const obstacle = document.getElementById('obstacle').value || '[no obstacle entered]';
        const pathway = document.getElementById('pathway').value || '[no pathway selected]';
        
        let formContent = `Obstacle: ${obstacle}\nPathway: ${pathway}\n\n`;
        
        if (pathway) {
            const pathwaySequences = getPathwaySequences();
            const sequence = pathwaySequences[pathway] || [];
            
            formContent += `Pathway Sequence:\n`;
            sequence.forEach(color => {
                const colorData = getColorData().find(c => c.color === color);
                if (colorData) {
                    formContent += `${colorData.color.toUpperCase()}: ${colorData.direction}\n`;
                    
                    // Add color relationships
                    const connections = findStrongestConnections(color);
                    if (connections.length > 0) {
                        formContent += "Resonant connections:\n";
                        connections.forEach(([connectedColor, strength]) => {
                            const connectedData = getColorData().find(c => c.color === connectedColor);
                            formContent += `  - ${connectedData.color.toUpperCase()} (${(strength * 100).toFixed(1)}% resonance): ${connectedData.direction}\n`;
                        });
                    }
                    formContent += "\n";
                }
            });
        }
        
        formContent += `Color Relationships:\n\n`;
        
        const colorData = getColorData();
        colorData.forEach(data => {
            const input = form.querySelector(`input[name="${data.color}-input"]`);
            let userInput = input.value || input.placeholder;
            
            formContent += `${data.color.toUpperCase()}:\nDirection: ${data.direction}\nYour interpretation: ${userInput}\n\n`;
        });
        
        let resultText = 'Awaiting your journey through color...';
        if (pathway !== '[no pathway selected]') {
            const pathwaySequences = getPathwaySequences();
            const sequence = pathwaySequences[pathway] || [];
            if (sequence.length >= 2) {
                const similarity = similarityMatrix[sequence[0]][sequence[1]];
                const resonanceType = similarity > 0.9 ? 'harmonious' : similarity > 0.5 ? 'balanced' : 'transformative';
                resultText = `Exploring "${pathway}" pathway - a ${resonanceType} journey from ${sequence[0]} to ${sequence[1]}`;
            }
        }
        resultSpan.innerText = resultText;
        
        let comparisonText = 'Ready to transmute challenges into chromatic wisdom.';
        if (obstacle !== '[no obstacle entered]') {
            comparisonText = `Transforming "${obstacle}" through the wisdom of color relationships`;
        }
        comparisonSpan.innerText = comparisonText;
        
        formContentPre.innerText = formContent;
    });
});
