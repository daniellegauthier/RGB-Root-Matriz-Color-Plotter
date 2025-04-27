// scripts/export.js

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadPDF');

  downloadBtn.addEventListener('click', function () {
    const element = document.getElementById('resultContent');
    
    if (!element || element.innerText.trim() === '') {
      alert('Please generate a result before saving!');
      return;
    }

    import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js')
      .then(({ default: html2pdf }) => {
        const opt = {
          margin:       0.5,
          filename:     'pathway-report.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
      })
      .catch((err) => {
        console.error('Error loading html2pdf library', err);
        alert('PDF download failed. Try again.');
      });
  });
});
