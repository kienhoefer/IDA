// bounding box for Austria
const austriaBounds = [[46.372, 9.530], [49.020, 17.160]];

// shrink the default Leaflet marker
L.Icon.Default.mergeOptions({
  iconSize:    [20, 30],   // was [25, 41]
  iconAnchor:  [10, 30],   // was [12, 41]
  popupAnchor: [0, -28],   // you can tweak this if your popups look off
  shadowSize:  [30, 30]    // optional: shrink the drop-shadow too
});

// init map, fit to Austria
const map = L.map('map', {
  maxBounds: austriaBounds,
  minZoom: 6,
  maxZoom: 10
}).fitBounds(austriaBounds);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }
).addTo(map);

// 1) Mask everything outside Austria
// draw all countries, highlight Austria’s border
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(world => {
    L.geoJSON(world, {
      style: feature => {
        // if this is Austria → red thick line, no fill
        if (
          feature.properties.name === 'Austria' ||
          feature.id === 'AUT'
        ) {
          return {
            color: '#000',
            weight: 3,
            fill: false
          };
        }
        // otherwise → light gray fill, thin border
        return {
          color: '#666',
          weight: 1,
          fillColor: '#ccc',
          fillOpacity: 0.2
        };
      }
    }).addTo(map);
  })
  .catch(console.error);

let allFeatures = [];
const markerLayer = L.layerGroup().addTo(map);
const listContainer = document.getElementById('list');

function populateFilter(id, values) {
  const sel = document.getElementById(id);
  [...new Set(values)].sort().forEach(v => {
    const opt = document.createElement('option');
    opt.value = v; opt.text = v;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', updateDashboard);
}

function updateDashboard() {
  const locVal  = document.getElementById('filter-location').value;
  const typeVal = document.getElementById('filter-type').value;
  const langVal = document.getElementById('filter-language').value;
  const catVal  = document.getElementById('filter-category').value;

  const filtered = allFeatures.filter(f => {
    const p = f.properties;
    return (!locVal  || p.location         === locVal)
        && (!typeVal || p.type             === typeVal)
        && (!langVal || p.language         === langVal)
        && (!catVal  || p.main_category_en === catVal);
  });

  // redraw markers
  markerLayer.clearLayers();
  filtered.forEach(f => {
    const [lon, lat] = f.geometry.coordinates;
    L.circleMarker([lat, lon], {
      radius: 5,
      fillColor: '#0078A8',
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    .bindPopup(`<strong>${f.properties.name}</strong><br>${f.properties.institution}`)
    .addTo(markerLayer);
  });  // ← here was missing

  // rebuild list
  listContainer.innerHTML = filtered.length
    ? filtered.map(f => {
        const p = f.properties;
        return `
          <div class="entry">
            <h4>${p.name}</h4>
            <p><strong>Institution:</strong> ${p.institution}</p>
            <p><strong>Location:</strong> ${p.location}</p>
            <p><strong>Level of Study:</strong> ${p.type}</p>
            <p><strong>Language:</strong> ${p.language}</p>
            <p><strong>Field of Study:</strong> ${p.main_category_en}</p>
            ${p.url ? `<p><a href="${p.url}" target="_blank">View Study Plan</a></p>` : ''}
          </div>
        `;
      }).join('')
    : '<p>No entries match your filters.</p>';
}

const arcgisUrl = 
  'https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/study_programmes_austria/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson';

// load GeoJSON stream and initialize filters + dashboard
fetch(arcgisUrl)
  .then(r => r.json())
  .then(data => {
    allFeatures = data.features || [];
    populateFilter('filter-location', allFeatures.map(f => f.properties.location));
    populateFilter('filter-type',     allFeatures.map(f => f.properties.type));
    populateFilter('filter-language', allFeatures.map(f => f.properties.language));
    populateFilter('filter-category', allFeatures.map(f => f.properties.main_category_en));
    updateDashboard();
  })
  .catch(err => {
    console.error('Data load error:', err);
    listContainer.innerHTML = '<p>Error loading data.</p>';
  });