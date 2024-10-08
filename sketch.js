function rgbDistance(rgb1, rgb2) {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
}

function calculateSimilarityScore(sequence1, sequence2) {
    let score = 0;
    const minLength = Math.min(sequence1.length, sequence2.length);
    for (let i = 0; i < minLength; i++) {
        score += rgbDistance(sequence1[i], sequence2[i]);
    }
    return score;
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

function getColorSequences() {
    return [
        { name: 'pain', colors: [[250, 200, 0], [250, 130, 0]]},
        { name: 'practical', colors: [[255, 255, 0], [0, 255, 0]]},
        { name: 'spiritual', colors: [[0, 0, 255], [130, 50, 0]]},
        { name: 'prayer', colors: [[250, 180, 120], [255, 255, 255]]},
        { name: 'sad', colors: [[180, 50, 255], [180, 180, 180], [255, 0, 0]]},
        { name: 'precise', colors: [[250, 0, 50], [0, 0, 0]]},
        { name: 'fem', colors: [[130, 50, 0], [250, 200, 0], [250, 130, 0], [250, 0, 50]]},
        { name: 'masc', colors: [[255, 0, 0], [0, 0, 255], [250, 130, 0]]},
        { name: 'direct', colors: [[255, 0, 0], [250, 130, 0]]}
    ];
}

function optimize(selectedProblem) {
    const sequences = getColorSequences();
    const selectedSequence = sequences.find(seq => seq.name === selectedProblem);

    if (!selectedSequence) {
        return {
            bestMatch: "Invalid problem selected",
            comparison: "N/A"
        };
    }

    let bestMatch = null;
    let lowestScore = Infinity;
    let bestDotProduct = -Infinity;
    let selectedDotProduct = 0;
    let percentile = 0;

    sequences.forEach(sequence => {
        if (sequence.name !== selectedProblem) {
            let score = calculateSimilarityScore(selectedSequence.colors, sequence.colors);
            let dotProduct = calculateDotProduct(selectedSequence.colors, sequence.colors);

            if (score < lowestScore) {
                lowestScore = score;
                bestMatch = sequence;
            }

            if (dotProduct > bestDotProduct) {
                bestDotProduct = dotProduct;
            }
        }
    });

    // Calculate dot product for selected problem
    selectedDotProduct = calculateDotProduct(selectedSequence.colors, selectedSequence.colors);

    // Calculate percentile
    sequences.forEach(sequence => {
        let dotProduct = calculateDotProduct(selectedSequence.colors, sequence.colors);
        if (dotProduct <= selectedDotProduct) {
            percentile++;
        }
    });

    percentile = ((percentile - 1) / (sequences.length - 1)) * 100;

    return {
        bestMatch: `Best match for "${selectedProblem}" is "${bestMatch.name}" with a similarity score of ${lowestScore.toFixed(2)}`,
        comparison: `"${selectedProblem}" has a dot product of ${selectedDotProduct.toFixed(2)}. Percentile: ${percentile.toFixed(2)}%`
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colorForm');
    const resultSpan = document.getElementById('result');
    const comparisonSpan = document.getElementById('comparison');
    const formContentPre = document.getElementById('formResults');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedProblem = document.getElementById('pathway').value; // Capture selected pathway
        
        // Initialize form content for displaying user inputs
        let formContent = `Selected Problem/Pathway: ${selectedProblem}\n\nColor Relationships:\n\n`;
        
        // Get color data and loop through each color to fetch input by ID
        const colorData = getColorData();
        colorData.forEach(data => {
            const input = document.getElementById(`${data.color}-pathway`);
            let userInput = input ? input.value || input.placeholder : '[imagine the possibilities]';
            
            // Add the user's interpretation to form content
            formContent += `${data.color.toUpperCase()}:\nDirection: ${data.direction}\nYour interpretation: ${userInput}\n\n`;
        });
        
        // Display form content
        formContentPre.innerText = formContent;

        // Call the optimize function (pass selected problem/pathway for analysis)
        const result = optimize(selectedProblem);
        resultSpan.innerText = result.bestMatch;
        comparisonSpan.innerText = result.comparison;
    });
});
