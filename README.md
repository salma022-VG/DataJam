# Mi Barrio Seguro 🗺️

Plataforma interactiva de análisis y reportes de seguridad ciudadana en Bogotá.

## 🎯 Objetivo

Mi Barrio Seguro es una aplicación web que permite:
- Visualizar zonas de riesgo de robos en Bogotá mediante un mapa interactivo
- Reportar incidentes de seguridad (robos, hurtos, asaltos)
- Analizar tendencias de delitos por zona y horario
- Acceder a datos públicos de delincuencia

## 🌟 Características

- **Mapa Interactivo**: Visualización de Bogotá con múltiples capas base
- **Mapa de Calor**: Identificación de zonas críticas de riesgo
- **Reportes Ciudadanos**: Formulario para denunciar incidentes
- **Estadísticas en Tiempo Real**: Total de reportes y zonas críticas
- **Capas Personalizables**: Activar/desactivar diferentes tipos de visualizaciones
- **Descarga de Datos**: Exportar reportes en formato CSV

## 🏗️ Estructura del Proyecto

```
mi-barrio-seguro/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos del dashboard
├── js/
│   ├── map.js          # Lógica del mapa (Leaflet)
│   └── form.js         # Manejo de formularios y reportes
├── data/
│   └── delitos_example.json  # Datos de ejemplo
├── docs/
│   └── (documentación adicional)
└── README.md
```

## 🚀 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para mapas base del Catastro Bogotá)

## 💻 Uso

1. Clonar o descargar el repositorio
2. Abrir `index.html` en un navegador
3. El mapa se cargará automáticamente

### Reportar un Incidente

1. Click en "Reportar Incidente" en la barra lateral
2. Completar formulario:
   - Tipo de delito (Robo, Hurto, Asalto)
   - Ubicación (barrio/calle)
   - Fecha y hora
   - Descripción (opcional)
3. Click en "Enviar"
4. El reporte aparece en el mapa

### Cambiar Capas

- En "Capas de Mapa" puedes activar/desactivar:
  - Mapa de Calor
  - Reportes Ciudadanos
  - Localidades

## 📊 Datos Utilizados

### Fuentes Actualmente Integradas

1. **Catastro de Bogotá** - Mapas base
   - Mapa Base (EPSG:3857)
   - Mapa Gris
   - Mapa Oscuro
   - Mapa Híbrido

### Fuentes a Integrar

1. **Portal de Datos Abiertos Bogotá**
   - Datos de delitos por localidad
   - Datos por tipo de delito
   - Series históricas

2. **DANE**
   - Información demográfica
   - Datos socioeconómicos

3. **Reportes Ciudadanos**
   - Información enviada por usuarios

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Mapas**: ArcGIS JavaScript API v4.27
- **UI Framework**: Bootstrap 5
- **Iconos**: Font Awesome
- **Almacenamiento**: LocalStorage (temporal)
- **Mapas Base**: ArcGIS Services (Catastro de Bogotá - Alcaldía Mayor)

## 📈 Próximas Funcionalidades

- [ ] Geocoding de direcciones automático
- [ ] Predicción de zonas de riesgo futuro (ML)
- [ ] Análisis de horarios críticos
- [ ] Filtrado por tipo de delito
- [ ] Gráficos de tendencias
- [ ] Integración con API REST
- [ ] Autenticación de usuarios
- [ ] Panel administrativo
- [ ] Exportación a Power BI / QGIS

## 👥 Equipo DataJam

- Analista de Datos
- Analista de Políticas Públicas
- Experto Temático en Seguridad

## 📝 Notas

- Los datos de ejemplo están ubicados en /data
- Los reportes se almacenan en localStorage del navegador
- Para versión producción, se requiere backend para persistencia

## 📧 Contacto

Para reportes de bugs o sugerencias, contacta con el equipo del proyecto.

## 📄 Licencia

Este proyecto es parte de la iniciativa Bogotá DataJam 2026.

---

**Creado para: Bogotá DataJam - Edición 2 (2026)**
