export let map;
export let marker;
export let destinationMarker;
export let destinationCircle;
export let geocoder;
let trackingInterval;
let alertRadius = 50; // Default alert radius in meters
let trackingActive = false;
let loggingEnabled = false;

export function initializeMap(latitude, longitude) {
    if (!map) { // Check if map is already initialized
        map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Add marker for user's current location
        marker = L.marker([latitude, longitude]).addTo(map).bindPopup('You are here').openPopup();

        // Initialize Geocoder control
        geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
        }).on('markgeocode', function(e) {
            const { latlng } = e.geocode;
            const { lat, lng } = latlng;

            handleDestinationSelection(lat, lng);
        }).addTo(map);

        // Add Geocoder search bar to the #search-bar element
        document.getElementById('search-bar').appendChild(geocoder.onAdd(map));

        // Add event listener to handle map clicks for dropping pins
        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            handleDestinationSelection(lat, lng);
        });
    } else {
        // Update marker position if map is already initialized
        marker.setLatLng([latitude, longitude]).update();
    }
}

export function handleDestinationSelection(latitude, longitude) {
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
    }
    if (destinationCircle) {
        map.removeLayer(destinationCircle);
    }
    destinationMarker = L.marker([latitude, longitude], { draggable: true }).addTo(map).bindPopup('Destination').openPopup();
    destinationCircle = L.circle([latitude, longitude], {
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.3,
        radius: alertRadius,
    }).addTo(map);

    // Add dragend event to update destination when marker is moved
    destinationMarker.on('dragend', function(e) {
        const { lat, lng } = e.target.getLatLng();
        handleDestinationSelection(lat, lng);
    });

    // Send destination coordinates and alert radius to the server
    fetch('https://locationtrackerapp.onrender.com/set_destination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                alertRadius: alertRadius // Send alert radius with destination
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (loggingEnabled) {
                console.log('Destination set:', data.status);
            }
        });

    // Remove map re-centering line
    // map.setView([latitude, longitude], 13);
}

export function sendLocation(latitude, longitude) {
    fetch('https://locationtrackerapp.onrender.com/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                alertRadius: alertRadius // Send alert radius with location
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (loggingEnabled) {
                console.log(`Location sent: ${latitude} ${longitude}`);
            }
            document.getElementById('alert').innerText = data.alert;
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([latitude, longitude]).addTo(map).bindPopup('You are here').openPopup();
            // Remove map re-centering line
            // map.setView([latitude, longitude], 13);
        });
}

export function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('status').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
            initializeMap(latitude, longitude); // Initialize map with current location
            if (trackingActive) {
                sendLocation(latitude, longitude);
            }
        }, error => {
            document.getElementById('status').innerText = `Error: ${error.message}`;
            // Default to a known location (e.g., city center) if geolocation fails
            initializeMap(51.505, -0.09); // Default to London
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Default to a known location (e.g., city center) if geolocation is not supported
        initializeMap(51.505, -0.09); // Default to London
    }
}

export function toggleTracking() {
    if (!trackingActive) {
        startTracking();
    } else {
        stopTracking();
    }
}

function startTracking() {
    trackingActive = true;
    console.log('Tracking started.');
    document.getElementById('trackButton').innerText = 'Stop Tracking';

    // Start sending location updates
    trackingInterval = setInterval(() => {
        getLocation();
    }, 5000); // Update location every 5 seconds
}

function stopTracking() {
    trackingActive = false;
    console.log('Tracking stopped.');
    document.getElementById('trackButton').innerText = 'Start Tracking';

    // Clear the tracking interval
    clearInterval(trackingInterval);
    trackingInterval = null;
}

export function toggleLogging(enabled) {
    loggingEnabled = enabled;
    const logStatus = loggingEnabled ? 'enabled' : 'disabled';
    console.log(`Logging ${logStatus}.`);
}

export function setAlertRadius() {
    alertRadius = parseInt(document.getElementById('radius').value);
    if (destinationMarker) {
        const { lat, lng } = destinationMarker.getLatLng();
        handleDestinationSelection(lat, lng); // Update the circle with new radius
    }
}