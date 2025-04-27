// scripts/export.js

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadPDF');

  downloadBtn.addEventListener('click', function () {
    const pdfContent = document.getElementById('pdfContent');
    
    if (!pdfContent || pdfContent.innerHTML.trim() === '') {
      alert('Please generate a result first!');
      return;
    }

    const options = {
      margin: 0.5,
      filename: 'pathway-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(pdfContent).set(options).save();
  });
});
