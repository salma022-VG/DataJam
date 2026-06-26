require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/widgets/BasemapToggle",
    "esri/Color"
], function(Map, MapView, TileLayer, GraphicsLayer, Graphic, Point, SimpleMarkerSymbol, SimpleLineSymbol, BasemapToggle, Color) {

    // Create map with Catastro Bogotá base layers
    const map = new Map({
        basemap: "streets-vector"
    });

    // Create MapView centered on Bogotá
    const view = new MapView({
        container: "map",
        map: map,
        center: [-74.0721, 4.7110],
        zoom: 11
    });

    // Add Catastro Bogotá layers
    const mapaBaseTile = new TileLayer({
        url: "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer",
        title: "Mapa Base"
    });

    const mapaGrisTile = new TileLayer({
        url: "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_gris/MapServer",
        title: "Mapa Gris"
    });

    const mapaOscuroTile = new TileLayer({
        url: "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_oscuro_3857/MapServer",
        title: "Mapa Oscuro"
    });

    const mapaHibridoTile = new TileLayer({
        url: "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_hibrido/MapServer",
        title: "Mapa Híbrido"
    });

    // Add graphics layer for reports
    const reportsGraphicsLayer = new GraphicsLayer({
        title: "Reportes Ciudadanos"
    });
    map.add(reportsGraphicsLayer);

    // Data storage
    let reports = [];
    let heatmapPoints = [];

    // Load example data
    function loadExampleData() {
        const exampleDelitos = [
            { lat: 4.7110, lng: -74.0721, intensity: 0.8, type: 'Robo', risk: 'Alto' },
            { lat: 4.7200, lng: -74.0650, intensity: 0.9, type: 'Hurto', risk: 'Crítico' },
            { lat: 4.6800, lng: -74.0800, intensity: 0.7, type: 'Robo', risk: 'Alto' },
            { lat: 4.7500, lng: -74.1000, intensity: 0.5, type: 'Asalto', risk: 'Moderado' },
            { lat: 4.6500, lng: -74.0500, intensity: 0.6, type: 'Robo', risk: 'Moderado' },
            { lat: 4.7300, lng: -74.0900, intensity: 0.8, type: 'Hurto', risk: 'Alto' },
            { lat: 4.6900, lng: -74.0400, intensity: 0.7, type: 'Robo', risk: 'Alto' }
        ];

        exampleDelitos.forEach((delito) => {
            const point = new Point({
                longitude: delito.lng,
                latitude: delito.lat
            });

            const color = delito.intensity > 0.7 ? new Color([220, 53, 69, 0.8]) : new Color([255, 193, 7, 0.8]);

            const markerSymbol = new SimpleMarkerSymbol({
                color: color,
                size: "12px",
                outline: new SimpleLineSymbol({
                    color: [0, 0, 0],
                    width: 1
                })
            });

            const graphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: {
                    type: delito.type,
                    risk: delito.risk,
                    intensity: (delito.intensity * 100).toFixed(0)
                },
                popupTemplate: {
                    title: "{type}",
                    content: "Riesgo: {intensity}% ({risk})"
                }
            });

            reportsGraphicsLayer.add(graphic);
            heatmapPoints.push(delito);
        });

        reports = exampleDelitos;
        updateStats();
    }

    // Add report from form
    window.addReport = function(data) {
        const lat = 4.7110 + (Math.random() - 0.5) * 0.1;
        const lng = -74.0721 + (Math.random() - 0.5) * 0.1;

        const point = new Point({
            longitude: lng,
            latitude: lat
        });

        const markerSymbol = new SimpleMarkerSymbol({
            color: new Color([220, 53, 69, 0.9]),
            size: "10px",
            outline: new SimpleLineSymbol({
                color: [0, 0, 0],
                width: 1
            })
        });

        const graphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: {
                type: data.type,
                location: data.location,
                date: data.date,
                time: data.time
            },
            popupTemplate: {
                title: "{type}",
                content: "<p><b>Ubicación:</b> {location}<br><b>Fecha:</b> {date}<br><b>Hora:</b> {time}</p>"
            }
        });

        reportsGraphicsLayer.add(graphic);
        reports.push({ lat, lng, type: data.type, location: data.location });
        updateStats();
    };

    // Update statistics
    function updateStats() {
        document.getElementById('totalReports').textContent = reports.length;
    }

    // Download data
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const csvContent = "lat,lng,type,location\n" +
            reports.map(r => `${r.lat},${r.lng},"${r.type}","${r.location}"`).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reportes_seguridad.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Layer visibility toggles
    const layerHeatmapCheckbox = document.getElementById('layerHeatmap');
    const layerReportsCheckbox = document.getElementById('layerReports');

    if (layerReportsCheckbox) {
        layerReportsCheckbox.addEventListener('change', (e) => {
            reportsGraphicsLayer.visible = e.target.checked;
        });
    }

    // Initialize with example data
    loadExampleData();

    // Basemap toggle
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite"
    });
    view.ui.add(basemapToggle, "bottom-right");
});

