let map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            let latitude = feature.geometry.coordinates[1];
            let longitude = feature.geometry.coordinates[0];
            let title = feature.properties.title;
            let markerSize = magnitude * 5;
            let markerColor = getColor(depth);
            let circle = L.circleMarker([latitude, longitude], {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            circle.bindPopup(`<b>${title}</b><br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);
        });

        let legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            let div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<i style="background:' + getColor(0) + '"></i> 0 km<br>';
            div.innerHTML += '<i style="background:' + getColor(10) + '"></i> 10 km<br>';
            div.innerHTML += '<i style="background:' + getColor(20) + '"></i> 20 km<br>';
            return div;
        };
        legend.addTo(map);
    });

function getColor(depth) {
    return depth > 20 ? '#FF5733' :
           depth > 10 ? '#FFC300' :
                        '#DAF7A6';
}