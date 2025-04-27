// scripts/export.js

document.getElementById('saveBtn').addEventListener('click', async function() {
  const { jsPDF } = window.jspdf;  // Import jsPDF object

  const doc = new jsPDF(); // Create new PDF document

  // Load the Logo Image
  const logoImg = new Image();
  logoImg.src = 'la matriz consulting logo.png';  // Your logo
  await new Promise(resolve => {
    logoImg.onload = resolve;
  });

  // Add Logo Image to PDF
  doc.addImage(logoImg, 'PNG', 10, 10, 40, 15);

  // Add Main Title
  doc.setFontSize(18);
  doc.text('RGB Root Matrix Color Plotter', 60, 20);

  // Add Sentiment Score
  const sentiment = document.getElementById('sentimentScore').innerText;
  doc.setFontSize(12);
  doc.text(sentiment, 60, 28);

  // Add Results Content (Obstacle, Pathway, Colors, GNHs, Answers)
  const resultText = document.getElementById('resultContent').innerText;
  const lines = doc.splitTextToSize(resultText, 180); // Line wrapping
  doc.text(lines, 10, 50);

  // Save the document
  doc.save('rgb-root-matrix-results.pdf');
});
