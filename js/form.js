document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const reportData = {
                type: document.getElementById('reportType').value,
                location: document.getElementById('reportLocation').value,
                date: document.getElementById('reportDate').value,
                time: document.getElementById('reportTime')?.value || new Date().toLocaleTimeString(),
                description: document.getElementById('reportDesc')?.value || ''
            };

            // Validate
            if (!reportData.type || !reportData.location || !reportData.date || !reportData.time) {
                showFormAlert('Por favor completa todos los campos obligatorios', 'warning');
                return;
            }

            // Add report
            if (typeof addNewReport === 'function') {
                addNewReport(reportData);
            } else {
                // Fallback si interactive.js no está cargado
                saveReportToStorage(reportData);
            }

            // Add to map
            if (typeof addReport === 'function') {
                addReport(reportData);
            }

            // Reset form
            reportForm.reset();

            // Close accordion
            const reportBtn = document.querySelector('[data-bs-target="#report"]');
            if (reportBtn) {
                const accordion = bootstrap.Collapse.getInstance(reportBtn.closest('.accordion-collapse'));
                if (accordion) accordion.hide();
            }
        });
    }
});

function saveReportToStorage(data) {
    const reports = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
    reports.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    localStorage.setItem('mibarrioseguro_reports', JSON.stringify(reports));
}

function showFormAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const form = document.getElementById('reportForm');
    form.parentElement.insertBefore(alertDiv, form);

    setTimeout(() => alertDiv.remove(), 3000);
}

// Load saved reports when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
        reports.forEach(report => {
            if (typeof addReport === 'function') {
                addReport(report);
            }
        });
    }, 1000);
});
