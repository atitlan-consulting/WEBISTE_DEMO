// scripts.js

// Smooth Scrolling for Internal Links
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Load Partials
    const partials = [
        { id: "header-placeholder", url: "partials/header.html" },
        { id: "footer-placeholder", url: "partials/footer.html" },
        { id: "about-placeholder", url: "partials/about.html" },
        { id: "services-placeholder", url: "partials/services.html" },
        { id: "resources-placeholder", url: "partials/resources.html" },       
        { id: "case-studies-placeholder", url: "partials/case-studies.html" },
        { id: "articles-placeholder", url: "partials/articles.html" },
        { id: "map-placeholder", url: "partials/map.html" },
        { id: "contact-placeholder", url: "partials/contact.html" },
    ];

    partials.forEach(partial => {
        const element = document.getElementById(partial.id);
        if (element) {
            fetch(partial.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${partial.url}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error(error));
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const myCarousel = new bootstrap.Carousel('#carouselExample', {
        interval: 3000, // Time between slides in ms
        ride: 'carousel'
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.classList.add('visible');
        }, index * 200); // Stagger each icon's animation by 200ms
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    const map = L.map('map').setView([51.5074, -0.1276], 10); // Center on London by default

    // Add CartoDB Light Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);

    // Load the GeoJSON data
    fetch('../data/merged_case_studies.geojson') // Path to your merged GeoJSON file
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON to the map
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: feature.properties.line_color || '#000000', // Line color
                        fillColor: feature.properties.fill_color || '#ffffff', // Fill color
                        fillOpacity: feature.properties.opacity || 0.5, // Opacity
                        weight: 2 // Line thickness
                    };
                },
                onEachFeature: function (feature, layer) {
                    // Add a popup with the case study description
                    if (feature.properties) {
                        const popupContent = `
                            <strong>${feature.properties.case_study}</strong><br>
                            ${feature.properties.description}
                        `;
                        layer.bindPopup(popupContent);

                        // Optional: Highlight on hover
                        layer.on('mouseover', function () {
                            this.setStyle({
                                weight: 4,
                                color: '#ff7800',
                                fillOpacity: 0.7
                            });
                        });

                        // Reset style on mouseout
                        layer.on('mouseout', function () {
                            geojsonLayer.resetStyle(this);
                        });
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
});

// Initialize the map
const map = L.map('map').setView([51.5074, -0.1276], 10);

// Add a CartoDB Light tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors © CARTO'
}).addTo(map);

// Fetch the GeoJSON file
fetch('data/merged_case_studies.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(geojsonData => {
        // Add GeoJSON data to the map
        L.geoJSON(geojsonData, {
            // Use the `style` option to dynamically style features
            style: function (feature) {
                return {
                    color: feature.properties.line_color, // Line color
                    fillColor: feature.properties.fill_color, // Fill color
                    fillOpacity: feature.properties.opacity, // Opacity
                    weight: 2 // Line weight
                };
            },
            // Bind popups to each feature
            onEachFeature: function (feature, layer) {
                const { case_study, description } = feature.properties;
                layer.bindPopup(`<strong>${case_study}</strong><br>${description}`);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
    });
