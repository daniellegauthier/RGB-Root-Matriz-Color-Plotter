// scripts/export.js

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadPDF');

  downloadBtn.addEventListener('click', function () {
    const resultContent = document.getElementById('resultContent');
    
    if (!resultContent || resultContent.innerText.trim() === '') {
      alert('Please generate a result before saving!');
      return;
    }

    const options = {
      margin: 0.5,
      filename: 'pathway-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(resultContent).set(options).save();
  });
});
