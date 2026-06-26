document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const reportData = {
                type: document.getElementById('reportType').value,
                location: document.getElementById('reportLocation').value,
                date: document.getElementById('reportDate').value,
                time: document.getElementById('reportTime')?.value || new Date().toLocaleTimeString()
            };

            // Validate
            if (!reportData.type || !reportData.location || !reportData.date) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            // Save to localStorage
            const reports = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
            reports.push({
                ...reportData,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('mibarrioseguro_reports', JSON.stringify(reports));

            // Add to map (wait for map to be initialized)
            if (typeof addReport === 'function') {
                addReport(reportData);
            }

            // Show success message
            alert('¡Reporte enviado! Gracias por ayudar a tu comunidad.');

            // Reset form
            reportForm.reset();

            // Close accordion
            const reportBtn = document.querySelector('[data-bs-target="#report"]');
            if (reportBtn) reportBtn.click();
        });
    }
});

// Load saved reports after map initializes
window.addEventListener('load', () => {
    setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
        reports.forEach(report => {
            if (typeof addReport === 'function') {
                addReport(report);
            }
        });
    }, 2000);
});
