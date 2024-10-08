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

let allDotProducts = [];

// Pathways and their associated RGB color sequences
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

// Helper to calculate all dot products
function calculateAllDotProducts() {
    const sequences = getColorSequences();
    allDotProducts = sequences.map(seq1 => {
        return {
            name: seq1.name,
            products: sequences.map(seq2 => {
                return {
                    name: seq2.name,
                    dotProduct: calculateDotProduct(seq1.colors, seq2.colors)
                };
            })
        };
    });
}

// Function to optimize pathways
function optimize(selectedPathway) {
    const sequences = getColorSequences();
    const selectedSequence = sequences.find(seq => seq.name === selectedPathway);

    if (!selectedSequence) {
        console.error(`Selected pathway "${selectedPathway}" not found`);
        return {
            bestMatch: "Invalid pathway selected",
            comparison: "N/A",
            graphDescription: "N/A"
        };
    }

    const selectedDotProducts = allDotProducts.find(dp => dp.name === selectedPathway);

    if (!selectedDotProducts || !selectedDotProducts.products) {
        console.error(`Dot products not found for "${selectedPathway}"`);
        return {
            bestMatch: "Error in calculation",
            comparison: "N/A",
            graphDescription: "N/A"
        };
    }

    let bestMatch = null;
    let highestDotProduct = -Infinity;

    selectedDotProducts.products.forEach(product => {
        if (product.name !== selectedPathway && product.dotProduct > highestDotProduct) {
            highestDotProduct = product.dotProduct;
            bestMatch = product.name;
        }
    });

    const sortedProducts = [...selectedDotProducts.products].sort((a, b) => b.dotProduct - a.dotProduct);
    let selectedIndex = sortedProducts.findIndex(item => item.name === selectedPathway);
    let percentile = ((sequences.length - selectedIndex - 1) / (sequences.length - 1)) * 100;

    let graphDescription = "Line Graph of Dot Products:\n";
    graphDescription += "X-axis: Pathways\n";
    graphDescription += "Y-axis: Normalized Dot Product Values\n\n";
    graphDescription += "Data points:\n";
    sortedProducts.forEach(item => {
        graphDescription += `${item.name}: ${item.dotProduct.toFixed(4)}${item.name === selectedPathway ? " (Selected)" : ""}\n`;
    });
    graphDescription += "\nThis graph shows the relative similarity of each pathway to the selected pathway.";

    return {
        bestMatch: `Best match for "${selectedPathway}" is "${bestMatch}" with a normalized dot product of ${highestDotProduct.toFixed(4)}`,
        comparison: `"${selectedPathway}" has a normalized dot product of ${sortedProducts[0].dotProduct.toFixed(4)} with itself. Percentile: ${percentile.toFixed(2)}%`,
        graphDescription: graphDescription
    };
}

// Function to initialize the app
function initializeApp() {
    calculateAllDotProducts();

    const form = document.getElementById('colorForm');
    const resultSpan = document.getElementById('result');
    const comparisonSpan = document.getElementById('comparison');
    const formContentPre = document.getElementById('formResults');
    const graphDescriptionPre = document.getElementById('graphDescription');
    const pathwaySelect = document.getElementById('pathway');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedPathway = pathwaySelect.value;

        if (!selectedPathway) {
            console.error('No pathway selected');
            return;
        }
        
        const result = optimize(selectedPathway);
        resultSpan.innerText = result.bestMatch;
        comparisonSpan.innerText = result.comparison;
        graphDescriptionPre.innerText = result.graphDescription;
        
        formContentPre.innerText = `Selected Pathway: ${selectedPathway}`;
    });
}

// Ensure the app initializes when the window loads
window.onload = initializeApp;
