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

    const obstacleInput = document.getElementById('obstacleInput');
    const pathwaySelect = document.getElementById('pathwaySelect');
    const colorInputsContainer = document.getElementById('colorInputsContainer');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

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
