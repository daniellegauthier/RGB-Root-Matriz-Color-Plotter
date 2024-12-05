document.addEventListener('DOMContentLoaded', () => {
    const colorData = [
        { color: 'grey', rgb: [170,170,170], matrice1: 'Cover', 'english-words': 'respectful effective apposite precary', gnh: 'Economic Wellness' },
        { color: 'pink', rgb: [250,0,90], matrice1: 'Category', 'english-words': 'incredibily exquisite and ambitious', gnh: 'Mental Wellness' },
        { color: 'gold', rgb: [250,200,0], matrice1: 'Pull', 'english-words': 'undepartable preflorating technocracy lotiform', gnh: 'Workplace Wellness' },
        { color: 'nude', rgb: [250,180,120], matrice1: 'Approach', 'english-words': 'felicitously deft satisfied unextenuable', gnh: 'Physical Wellness' },
        { color: 'orange', rgb: [250,110,0], matrice1: 'Hit', 'english-words': 'blurry artesian awesome', gnh: 'Social Wellness' },
        { color: 'white', rgb: [255,255,255], matrice1: 'Hope', 'english-words': 'unlavish analeptical', gnh: 'Political Wellness' },
        { color: 'blue', rgb: [0,0,255], matrice1: 'Collect', 'english-words': 'daintily perfect, intelligent photopathy', gnh: 'Environmental Wellness' },
        { color: 'green', rgb: [0,255,0], matrice1: 'Transition', 'english-words': 'bulbous spontaneous heroic', gnh: 'Ecological Diversity' },
        { color: 'red', rgb: [255,0,0], matrice1: 'Limit', 'english-words': 'candid apophantic, distinct and radiant', gnh: 'Health' },
        { color: 'black', rgb: [0,0,0], matrice1: 'Order', 'english-words': 'undertreated paleoatavistic obeyable swabble', gnh: 'Good Governance' },
        { color: 'brown', rgb: [180,50,0], matrice1: 'Learn', 'english-words': 'abundantly notable and unique submissive', gnh: 'Education' },
        { color: 'yellow', rgb: [255,255,0], matrice1: 'Structure', 'english-words': 'exhilerating redressible authority plausible', gnh: 'Living Standards' },
        { color: 'purple', rgb: [180,50,255], matrice1: 'Free', 'english-words': 'perfectly great - imaginative, brave, gifted', gnh: 'Cultural Diversity' }
    ];

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

    let currentVersion = 'matrice1';
    let obstacle = '';
    let selectedPathway = '';
    let colorInputs = {};
    let result = '';
    let model = null;

    const obstacle = document.getElementById('obstacle');
    const pathway = document.getElementById('pathway');
    const colorForm = document.getElementById('colorForm');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    const similarityMatrix = {
    grey: {
       pink: 0.738781, gold: 0.811503, nude: 0.960488, orange: 0.760979, 
        white: 1.000000, blue: 0.577350, green: 0.577350, red: 0.577350, black: 0.000000,
        brown: 0.710812, yellow: 0.816497, purple: 0.885817
    },
    pink: {
      grey: 0.738781, gold: 0.734710, nude: 0.834433, orange: 0.861208,
        white: 0.738781, blue: 0.338719, green: 0.000000, red: 0.940887, black: 0.000000,
        brown: 0.906562, yellow: 0.665308, purple: 0.809003
    },
    gold: {
        grey: 0.811503, pink: 0.734710, nude: 0.930603, orange: 0.966330,
        white: 0.811503, blue: 0.000000, green: 0.624695, red: 0.780869, black: 0.000000,
        brown: 0.919577, yellow: 0.993884, purple: 0.543455
    },
    nude: {
        grey: 0.960488, pink: 0.834433, gold: 0.930603, orange: 0.911424,
        white: 0.960488, blue: 0.362970, green: 0.544456, red: 0.756188, black: 0.000000,
        brown: 0.874321, yellow: 0.919694, purple: 0.809512
    },
    orange: {
        grey: 0.760979, pink: 0.861208, gold: 0.966330, nude: 0.911424, 
        white: 0.760979, blue: 0.000000, green: 0.402739, red: 0.915315, black: 0.000000,
        brown: 0.989713, yellow: 0.932005, purple: 0.584904
    },
    white: {
        grey: 1.000000, pink: 0.738781, gold: 0.811503, nude: 0.960488, orange: 0.760979,
         blue: 0.577350, green: 0.577350, red: 0.577350, black: 0.000000,
        brown: 0.710812, yellow: 0.816497, purple: 0.885817
    },
    blue: {
        grey: 0.577350, pink: 0.338719, gold: 0.000000, nude: 0.362970, orange: 0.000000,
        white: 0.577350,  green: 0.000000, red: 0.000000, black: 0.000000,
        brown: 0.000000, yellow: 0.000000, purple: 0.806683
    },
    green: {
        grey: 0.577350, pink: 0.000000, gold: 0.624695, nude: 0.544456, orange: 0.402739,
        white: 0.577350, blue: 0.000000, red: 0.000000, black: 0.000000,
        brown: 0.267644, yellow: 0.707107, purple: 0.158173
    },
    red: {
        grey: 0.577350, pink: 0.940887, gold: 0.780869, nude: 0.756188, orange: 0.915315,
        white: 0.577350, blue: 0.000000, green: 0.000000,  black: 0.000000,
        brown: 0.963518, yellow: 0.707107, purple: 0.569424
    },
    black: {
        grey: 0.000000, pink: 0.000000, gold: 0.000000, nude: 0.000000, orange: 0.000000,
        white: 0.000000, blue: 0.000000, green: 0.000000, red: 0.000000, 
        brown: 0.000000, yellow: 0.000000, purple: 0.000000
    },
    brown: {
        grey: 0.710812, pink: 0.906562, gold: 0.919577, nude: 0.874321, orange: 0.989713,
        white: 0.710812, blue: 0.000000, green: 0.267644, red: 0.963518, black: 0.000000,
       yellow: 0.870563, purple: 0.590984
    },
    yellow: {
        grey: 0.816497, pink: 0.665308, gold: 0.993884, nude: 0.919694, orange: 0.932005,
        white: 0.816497, blue: 0.000000, green: 0.707107, red: 0.707107, black: 0.000000,
        brown: 0.870563,  purple: 0.514489
    },
    purple: {
        grey: 0.885817, pink: 0.809003, gold: 0.543455, nude: 0.809512, orange: 0.584904,
        white: 0.885817, blue: 0.806683, green: 0.158173, red: 0.569424, black: 0.000000,
        brown: 0.590984, yellow: 0.514489
    }
};

      // Global state
let currentVersion = 'matrice1';

// Function to get similar colors
function getSimilarColors(color) {
    if (!color || !similarityMatrix[color]) return [];
    return Object.entries(similarityMatrix[color])
        .filter(([c]) => c !== color)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([c]) => c);
}

// Function to get top similar colors
function getTopSimilarColors(color, count = 3) {
    if (!color || !similarityMatrix[color]) return [];
    return Object.entries(similarityMatrix[color])
        .filter(([c]) => c !== color)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([c, similarity]) => ({ color: c, similarity }));
}

// Function to highlight similar colors
function highlightSimilarColors(color) {
    const similarColors = getSimilarColors(color);
    const allColorDivs = document.querySelectorAll('#colorGrid > div');
    allColorDivs.forEach(div => {
        div.className = div.className.replace(' border-blue-500 border-2', '');
        if (similarColors.includes(div.dataset.color)) {
            div.className += ' border-blue-500 border-2';
        }
    });

    // Update similar colors list
    const similarColorsList = document.getElementById('similarColorsList');
    similarColorsList.innerHTML = '';
    similarColors.forEach(similarColor => {
        const colorData = colorData.find(c => c.color === similarColor);
        const div = document.createElement('div');
        div.className = 'w-8 h-8 rounded';
        div.style.backgroundColor = `rgb(${colorData.rgb.join(',')})`;
        if (similarColor === 'white') div.style.border = '1px solid black';
        similarColorsList.appendChild(div);
    });

    document.getElementById('similarColors').classList.remove('hidden');
}


    const createModel = () => {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 13, activation: 'relu', inputShape: [13] }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
        return model;
    };

    const initModel = async () => {
        const newModel = createModel();
        model = newModel;
    };

    const handleVersionChange = (version) => {
        currentVersion = version;
        renderColorInputs();
    };

    const handleColorInput = (color, value) => {
        colorInputs[color] = value;
    };

    const analyzeGNH = async () => {
        if (!model) return;

        const inputData = colorData.map(color => parseFloat(colorInputs[color.color]) || 0);
        const inputTensor = tf.tensor2d([inputData]);
        const prediction = await model.predict(inputTensor).data();
        return prediction[0] * 10; // Scale the output to 0-10 range
    };

    const generateFiscalAnalysis = (gnhScore) => {
        const baseGDP = 65020.35; // National average GDP
        const adjustedGDP = baseGDP * (1 + (gnhScore - 5) / 10);
        const economicGrowth = ((adjustedGDP / baseGDP) - 1) * 100;

        return `
        Fiscal Analysis based on GNH Score:
        
        GNH Score: ${gnhScore.toFixed(2)} / 10
        Estimated GDP Impact: $${adjustedGDP.toFixed(2)}
        Projected Economic Growth: ${economicGrowth.toFixed(2)}%
        
        Interpretation:
        ${gnhScore < 4 ? "Low GNH indicates potential economic challenges. Focus on improving all GNH indicators equally to boost overall well-being and economic performance." :
            gnhScore < 7 ? "Moderate GNH suggests stable conditions. Continue balancing all aspects of GNH for sustainable progress." :
            "High GNH indicates strong potential for sustainable growth. Maintain current policies while ensuring all GNH indicators remain balanced."}
        
        Key Areas for Fiscal Policy:
        ${colorData.map(({ color, gnh }) => {
            const value = parseFloat(colorInputs[color]) || 0;
            return `- ${gnh}: ${value > 5 ? "Maintain current policies" : "Consider improvements"}`
        }).join('\n        ')}
        `;
    };

    const generateResult = async () => {
        if (!selectedPathway) {
            result = "Please select a pathway before generating results.";
            resultContent.textContent = result;
            resultCard.classList.remove('hidden');
            return;
        }

        const relevantColors = pathways[selectedPathway] || [];
        let resultText = `Sequencing Result for Pathway "${selectedPathway}" with obstacle "${obstacle}":\n\n`;

        relevantColors.forEach(color => {
            const colorInfo = colorData.find(c => c.color === color);
            const input = colorInputs[color] || '[no input]';

            resultText += `${color.toUpperCase()}:\n`;
            resultText += `Your interpretation: ${input}\n`;
            resultText += `Matrice1: ${colorInfo.matrice1}\n`;
            resultText += `English words: ${colorInfo['english-words']}\n`;
            resultText += `GNH Indicator: ${colorInfo.gnh}\n`;
            resultText += `GNH Value: ${input}\n\n`;
        });

        const gnhScore = await analyzeGNH();
        resultText += generateFiscalAnalysis(gnhScore);

        result = resultText;
        resultContent.textContent = result;
        resultCard.classList.remove('hidden');
    };

    const clearInputs = () => {
        obstacle = '';
        selectedPathway = '';
        colorInputs = {};
        result = '';
        obstacleInput.value = '';
        pathwaySelect.value = '';
        renderColorInputs();
        resultCard.classList.add('hidden');
    };

    const renderColorInputs = () => {
        colorInputsContainer.innerHTML = '';
        colorData.forEach(({ color, rgb, matrice1, 'english-words': englishWords, gnh }) => {
            const div = document.createElement('div');
            div.className = 'flex items-center space-x-2';

            const colorDiv = document.createElement('div');
            colorDiv.className = 'w-8 h-8 rounded';
            colorDiv.style.backgroundColor = `rgb(${rgb.join(',')})`;
            if (color === 'white') colorDiv.style.border = '1px solid black';
            div.appendChild(colorDiv);

            const input = document.createElement('input');
            input.type = currentVersion === 'gnh' ? 'number' : 'text';
            if (currentVersion === 'gnh') {
                input.min = 0;
                input.max = 10;
                input.step = 0.1;
            }
            input.placeholder = currentVersion === 'matrice1' ? matrice1 : 
                                currentVersion === 'english-words' ? englishWords : 
                                `Enter ${gnh} value (0-10)`;
            input.value = colorInputs[color] || '';
            input.addEventListener('input', (e) => handleColorInput(color, e.target.value));
            div.appendChild(input);

            colorInputsContainer.appendChild(div);
        });
    };

    // Event listeners
    document.getElementById('matrice1Button').addEventListener('click', () => handleVersionChange('matrice1'));
    document.getElementById('englishWordsButton').addEventListener('click', () => handleVersionChange('english-words'));
    document.getElementById('gnhButton').addEventListener('click', () => handleVersionChange('gnh'));
    document.getElementById('generateButton').addEventListener('click', generateResult);
    document.getElementById('clearButton').addEventListener('click', clearInputs);

    // Initialize
    initModel();
    renderColorInputs();
    Object.keys(pathways).forEach(pathway => {
        const option = document.createElement('option');
        option.value = pathway;
        option.textContent = pathway;
        pathwaySelect.appendChild(option);
    });
});
