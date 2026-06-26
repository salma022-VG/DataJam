// Handle form submission
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const reportData = {
        type: document.getElementById('reportType').value,
        location: document.getElementById('reportLocation').value,
        date: document.getElementById('reportDate').value,
        time: document.getElementById('reportTime').value,
        description: document.getElementById('reportDescription').value
    };

    // Validate
    if (!reportData.type || !reportData.location || !reportData.date || !reportData.time) {
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

    // Add to map
    addReport(reportData);

    // Show success modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    // Reset form
    document.getElementById('reportForm').reset();

    // Close accordion
    document.querySelector('[data-bs-target="#report"]').click();
});

// Load saved reports on page load
window.addEventListener('load', () => {
    const reports = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
    reports.forEach(report => {
        addReport(report);
    });
});
