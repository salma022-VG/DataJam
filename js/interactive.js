// Interactividad avanzada

let allReports = [];
let chartInstance = null;
let currentFilter = 'all';

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeSearch();
    loadStoredReports();
    updateChart();
    setupClearButton();
});

// ===== FILTROS =====
function initializeFilters() {
    document.querySelectorAll('.filter-chips .chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterReports();
        });
    });
}

function filterReports() {
    const filtered = currentFilter === 'all' 
        ? allReports 
        : allReports.filter(r => r.type === currentFilter);
    
    displayRecentReports(filtered.slice(-5).reverse());
    updateStats(filtered);
}

// ===== BÚSQUEDA =====
function initializeSearch() {
    document.getElementById('searchLocation').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allReports.filter(r => 
            r.location.toLowerCase().includes(query)
        );
        displayRecentReports(filtered.slice(-5).reverse());
    });
}

// ===== REPORTES RECIENTES =====
function displayRecentReports(reports) {
    const list = document.getElementById('recentList');
    
    if (reports.length === 0) {
        list.innerHTML = '<p class="text-muted small">No hay reportes</p>';
        return;
    }

    list.innerHTML = reports.map(r => `
        <div class="recent-item">
            <div class="recent-header">
                <span class="badge bg-danger">${r.type}</span>
                <small class="text-muted">${r.date} ${r.time}</small>
            </div>
            <div class="recent-location"><i class="fas fa-map-pin"></i> ${r.location}</div>
            ${r.description ? `<small class="text-muted">${r.description}</small>` : ''}
        </div>
    `).join('');
}

// ===== ESTADÍSTICAS =====
function updateStats(reports = allReports) {
    const today = new Date().toISOString().split('T')[0];
    const todayCount = reports.filter(r => r.date === today).length;
    
    document.getElementById('totalReports').textContent = reports.length;
    document.getElementById('todayReports').textContent = todayCount;
    
    // Zona crítica (más reportes)
    const zonaCounts = {};
    reports.forEach(r => {
        zonaCounts[r.location] = (zonaCounts[r.location] || 0) + 1;
    });
    const criticalZone = Object.entries(zonaCounts)
        .sort((a, b) => b[1] - a[1])[0];
    
    if (criticalZone) {
        document.getElementById('criticalZone').textContent = 
            `${criticalZone[0]} (${criticalZone[1]})`;
    }
}

// ===== GRÁFICO DE DELITOS =====
function updateChart() {
    const ctx = document.getElementById('chartDelitos');
    if (!ctx) return;

    const tipos = {};
    allReports.forEach(r => {
        tipos[r.type] = (tipos[r.type] || 0) + 1;
    });

    const labels = Object.keys(tipos);
    const data = Object.values(tipos);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Reportes por Tipo',
                data: data,
                backgroundColor: [
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(108, 117, 125, 0.7)',
                    'rgba(52, 58, 64, 0.7)'
                ],
                borderColor: [
                    '#dc3545',
                    '#ffc107',
                    '#17a2b8',
                    '#6c757d',
                    '#343a40'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// ===== CARGAR REPORTES GUARDADOS =====
function loadStoredReports() {
    const stored = JSON.parse(localStorage.getItem('mibarrioseguro_reports') || '[]');
    allReports = stored;
    displayRecentReports(allReports.slice(-5).reverse());
    updateStats();
    updateChart();
}

// ===== AGREGAR NUEVO REPORTE =====
window.addNewReport = function(data) {
    const report = {
        id: Date.now(),
        type: data.type,
        location: data.location,
        date: data.date,
        time: data.time,
        description: data.description || '',
        timestamp: new Date().toISOString()
    };

    allReports.push(report);
    
    // Guardar en localStorage
    localStorage.setItem('mibarrioseguro_reports', JSON.stringify(allReports));
    
    // Actualizar UI
    displayRecentReports(allReports.slice(-5).reverse());
    updateStats();
    updateChart();
    
    // Mostrar notificación
    showNotification('✅ Reporte enviado correctamente', 'success');
};

// ===== LIMPIAR DATOS =====
function setupClearButton() {
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas limpiar todos los datos locales?')) {
            localStorage.removeItem('mibarrioseguro_reports');
            allReports = [];
            loadStoredReports();
            showNotification('Datos limpiados', 'info');
        }
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// ===== INTEGRACIÓN CON MAPA =====
window.onMapReady = function() {
    // Se llamará desde map.js cuando el mapa esté listo
    loadStoredReports();
};
