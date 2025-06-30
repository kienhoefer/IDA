// Southwest and Northeast corners of Austria as [lat, lon] pairs
const austriaBounds = [[46.372, 9.530], [49.020, 17.160]];

// Customise the Leaflet markers
L.Icon.Default.mergeOptions({
  iconSize:    [20, 30],
  iconAnchor:  [10, 30],
  popupAnchor: [0, -28],
  shadowSize:  [30, 30]
});

// Create the Leaflet map in the <div id="map">
const map = L.map('map', {
  maxBounds: austriaBounds,
  minZoom: 5,
  maxZoom: 10,
  zoomSnap: 0.5,    // allow half-step zooms
  zoomDelta: 0.5    // mousewheel/buttons also use 0.5
});

// Fit the full country into view
map.fitBounds(austriaBounds);

// Add OpenStreetMap map as the base layer
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }
).addTo(map);

// Show all countries and highlight the borders of Austria
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(world => {
    L.geoJSON(world, {
      style: feature => {
        // If it is Austria then use a black thick line, no fill
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
        // Otherwise use light thin line and gray fill 
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

// Prepare an array for the list
let allFeatures = [];
// Create a layer group for markers and add it to the map
const markerLayer = L.layerGroup().addTo(map);
// Create a reference to the HTML element for listing entries
const listContainer = document.getElementById('list');

// Function to populate the filters
function populateFilter(id, values) {
  const sel = document.getElementById(id);
  [...new Set(values)].sort().forEach(v => {
    const opt = document.createElement('option');
    opt.value = v; opt.text = v;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', updateDashboard);
}

// Update map markers and rebuild the list based on the current filter selections
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

  // Clears existing markers and draws a circle marker with a popup for each filtered entry
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
  });

  // Rebuild the HTML list to display each filtered entry or show a message if no matches
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

// // Defines the ArcGIS Feature Service API that returns all Austrian study programmes
const arcgisUrl = 'https://kienhoefer.github.io/IDA/data/courses.geojson';

// 1. Fetch the API
// 2. Save the entries into allFeatures
// 2. Populate filters
// 3. Render the initial map markers and list
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