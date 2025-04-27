// scripts/export.js

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadPDF');

  downloadBtn.addEventListener('click', function () {
    const resultContent = document.getElementById('results');
    
    if (!resultContent || resultContent.classList.contains('hidden')) {
      alert('Please generate a result first!');
      return;
    }

    const options = {
      margin: 0.5,
      filename: 'pathway-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(resultContent).set(options).save();
  });
});
