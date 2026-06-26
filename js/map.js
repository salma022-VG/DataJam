// Initialize map centered on Bogotá
const map = L.map('map').setView([4.7110, -74.0721], 11);

// Base layers from Catastro Bogotá
const baseLayers = {
    'Mapa Base': L.tileLayer(
        'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Catastro Bogotá' }
    ),
    'Mapa Gris': L.tileLayer(
        'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_gris/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Catastro Bogotá' }
    ),
    'Mapa Oscuro': L.tileLayer(
        'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_oscuro_3857/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Catastro Bogotá' }
    ),
    'Híbrido': L.tileLayer(
        'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_hibrido/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Catastro Bogotá' }
    )
};

// Add default layer
baseLayers['Mapa Base'].addTo(map);

// Layer control
L.control.layers(baseLayers, {}, { position: 'bottomright' }).addTo(map);

// Data storage
let heatmapData = [];
let reportsLayer = L.layerGroup().addTo(map);
let heatmapLayer = null;

// Load example data
function loadExampleData() {
    // Sample crime data for Bogotá (demo data)
    const exampleDelitos = [
        { lat: 4.7110, lng: -74.0721, intensity: 0.8, type: 'Robo' },
        { lat: 4.7200, lng: -74.0650, intensity: 0.9, type: 'Hurto' },
        { lat: 4.6800, lng: -74.0800, intensity: 0.7, type: 'Robo' },
        { lat: 4.7500, lng: -74.1000, intensity: 0.5, type: 'Asalto' },
        { lat: 4.6500, lng: -74.0500, intensity: 0.6, type: 'Robo' },
        { lat: 4.7300, lng: -74.0900, intensity: 0.8, type: 'Hurto' },
        { lat: 4.6900, lng: -74.0400, intensity: 0.7, type: 'Robo' }
    ];

    // Create heatmap layer
    heatmapData = exampleDelitos.map(d => [d.lat, d.lng, d.intensity]);
    updateHeatmap();

    // Add markers for example data
    exampleDelitos.forEach((delito, idx) => {
        const marker = L.circleMarker([delito.lat, delito.lng], {
            radius: 8,
            fillColor: delito.intensity > 0.7 ? '#dc3545' : '#ffc107',
            color: '#000',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.7
        }).bindPopup(`<b>${delito.type}</b><br>Riesgo: ${(delito.intensity * 100).toFixed(0)}%`);
        reportsLayer.addLayer(marker);
    });

    updateStats();
}

// Update heatmap layer
function updateHeatmap() {
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
    }
    heatmapLayer = L.heatLayer(heatmapData, {
        radius: 40,
        blur: 35,
        maxZoom: 17,
        max: 1.0,
        gradient: { 0.0: '#00ff00', 0.5: '#ffff00', 1.0: '#ff0000' }
    }).addTo(map);
}

// Add report from form
function addReport(data) {
    // Convert address to approximate coordinates (in real app, use geocoding)
    const lat = 4.7110 + (Math.random() - 0.5) * 0.1;
    const lng = -74.0721 + (Math.random() - 0.5) * 0.1;

    const marker = L.circleMarker([lat, lng], {
        radius: 7,
        fillColor: '#dc3545',
        color: '#000',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.7
    }).bindPopup(`
        <b>${data.type}</b><br>
        Ubicación: ${data.location}<br>
        Fecha: ${data.date}<br>
        Hora: ${data.time}
    `);

    reportsLayer.addLayer(marker);
    heatmapData.push([lat, lng, 0.8]);
    updateHeatmap();
    updateStats();
}

// Update statistics
function updateStats() {
    const reports = reportsLayer.getLayers();
    document.getElementById('totalReports').textContent = reports.length;

    const today = new Date().toISOString().split('T')[0];
    const todayCount = reports.length; // In real app, filter by date
    document.getElementById('todayReports').textContent = todayCount;
}

// Layer toggle handlers
document.getElementById('layerHeatmap').addEventListener('change', (e) => {
    if (e.target.checked) {
        updateHeatmap();
    } else if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
    }
});

document.getElementById('layerReports').addEventListener('change', (e) => {
    if (e.target.checked) {
        reportsLayer.addTo(map);
    } else {
        reportsLayer.removeFrom(map);
    }
});

// Download data
document.getElementById('downloadBtn').addEventListener('click', () => {
    const data = reportsLayer.getLayers().map((layer) => {
        const popup = layer.getPopup();
        return {
            lat: layer.getLatLng().lat,
            lng: layer.getLatLng().lng
        };
    });

    const csv = 'lat,lng\n' + data.map(d => `${d.lat},${d.lng}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes_seguridad.csv';
    a.click();
});

// Initialize with example data
loadExampleData();
