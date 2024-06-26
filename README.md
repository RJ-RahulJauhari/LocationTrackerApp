# LocationTrackerApp

---

# Geolocation Tracker App

The Geolocation Tracker App is a web-based application that tracks the user's current location, allows setting a destination on the map, and provides alerts based on the distance from the destination. The app uses Leaflet.js for mapping and geocoding functionality.

## Features

1. **Track User's Location**: The app tracks the user's current location and updates it on the map at regular intervals.
2. **Set Destination**: Users can set a destination by clicking on the map or using the search bar.
3. **Alert Radius**: Users can set an alert radius around the destination, and the app provides alerts when the user is within this radius.
4. **Enable/Disable Logging**: Users can enable or disable logging of location updates for debugging purposes.

## JavaScript Module (LT.js)

The JavaScript module (`LT.js`) contains all the core functions used in the app. Below are the functions and their descriptions:

### Variables

- `map`: The Leaflet map instance.
- `marker`: The marker representing the user's current location.
- `destinationMarker`: The marker representing the destination.
- `destinationCircle`: The circle representing the alert radius around the destination.
- `geocoder`: The geocoder control for address search.
- `trackingInterval`: The interval ID for location tracking.
- `alertRadius`: The radius in meters for alerts (default is 50 meters).
- `trackingActive`: Boolean indicating whether tracking is active.
- `loggingEnabled`: Boolean indicating whether logging is enabled.

### Functions

#### `initializeMap(latitude, longitude)`
Initializes the Leaflet map with the given latitude and longitude.

```javascript
export function initializeMap(latitude, longitude) {
    // Implementation...
}
```

#### `handleDestinationSelection(latitude, longitude)`
Handles the selection of a destination by the user and updates the map accordingly.

```javascript
export function handleDestinationSelection(latitude, longitude) {
    // Implementation...
}
```

#### `sendLocation(latitude, longitude)`
Sends the user's current location to the server and updates the map.

```javascript
export function sendLocation(latitude, longitude) {
    // Implementation...
}
```

#### `getLocation()`
Gets the user's current location using the browser's geolocation API.

```javascript
export function getLocation() {
    // Implementation...
}
```

#### `toggleTracking()`
Toggles the tracking of the user's location.

```javascript
export function toggleTracking() {
    // Implementation...
}
```

#### `toggleLogging(enabled)`
Enables or disables logging of location updates.

```javascript
export function toggleLogging(enabled) {
    // Implementation...
}
```

#### `setAlertRadius()`
Sets the alert radius around the destination and updates the map.

```javascript
export function setAlertRadius() {
    // Implementation...
}
```

## How the App Works

1. **Initialization**: The app initializes the map centered on the user's current location. If geolocation fails, it defaults to a known location (e.g., London).
   
2. **Tracking Location**: When the user clicks the "Start Tracking" button, the app starts tracking the user's location and updates the map at regular intervals (every 5 seconds).

3. **Setting Destination**: The user can set a destination by clicking on the map or using the search bar. The destination marker and alert radius circle are updated on the map.

4. **Alert Radius**: The user can set an alert radius using the input field and the "Set" button. This radius determines when the app provides an alert based on the user's proximity to the destination.

5. **Logging**: The user can enable or disable logging of location updates by checking the "Enable Logging" checkbox.

## Usage

1. Open the app in a web browser.
2. Allow the browser to access your location.
3. Use the map to set a destination by clicking on it or using the search bar.
4. Set an alert radius in meters.
5. Click "Start Tracking" to begin tracking your location.
6. Monitor the map and alert messages as you move.

## Example HTML File

```html
<!DOCTYPE html>
<html>
<head>
    <title>Geolocation Tracker</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <h1>Geolocation Tracker</h1>
    <div id="map"></div>
    <div id="search-bar" class="leaflet-control leaflet-control-geocoder"></div>
    <div class="btn-container">
        <button id="trackButton" class="styled-button start">Start Tracking</button>
        <label for="toggleLogging">Enable Logging:</label>
        <input type="checkbox" id="toggleLogging">
    </div>
    <div id="radius-input">
        <label for="radius">Alert Radius (meters):</label>
        <input type="number" id="radius" name="radius" value="50">
        <button id="setRadiusButton">Set</button>
    </div>
    <p id="status">Waiting for location...</p>
    <p id="alert"></p>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script type="module">
        import { getLocation, toggleTracking, toggleLogging, setAlertRadius } from './LT.js';

        // Initialize the application
        getLocation();

        // Event listeners
        document.getElementById('trackButton').addEventListener('click', toggleTracking);
        document.getElementById('toggleLogging').addEventListener('change', (event) => toggleLogging(event.target.checked));
        document.getElementById('setRadiusButton').addEventListener('click', setAlertRadius);
    </script>
</body>
</html>
```

## Example CSS File (styles.css)

```css
body {
    font-family: Arial, sans-serif;
    margin: 20px;
    padding: 0;
    background-color: #f0f0f0;
}

h1 {
    text-align: center;
    color: #333;
}

.styled-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.styled-button:hover {
    background-color: #45a049;
}

#map {
    height: 500px;
    width: 100%;
    margin-bottom: 20px;
}

.leaflet-control-geocoder-form {
    width: 300px;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.leaflet-control-geocoder-form input[type="text"] {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.leaflet-control-geocoder-form button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.leaflet-control-geocoder-form button:hover {
    background-color: #45a049;
}

.btn-container {
    text-align: center;
    margin-bottom: 20px;
}

#status {
    text-align: center;
    margin-bottom: 10px;
}

#alert {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: #333;
}

#radius-input {
    text-align: center;
    margin-bottom: 10px;
}

#radius-input input[type="number"] {
    width: 80px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

#radius-input button {
    margin-left: 10px;
    padding: 8px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

#radius-input button:hover {
    background-color: #45a049;
}
```

---

This Markdown document provides a comprehensive overview of the Geolocation Tracker app, detailing its features, the functions in the JavaScript module, and how to use the app.