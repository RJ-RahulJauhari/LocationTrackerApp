from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500","https://locationtrackerappui.onrender.com"]}})  # Allow requests from http://127.0.0.1:5500

# Your existing route definitions


destination_info = {
    'coords': None,
    'alert_radius': 50  # Default alert radius in meters
}

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/set_destination', methods=['POST'])
def set_destination():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    alert_radius = data.get('alertRadius', 50)  # Default to 50 meters if not provided

    destination_info['coords'] = (latitude, longitude)
    destination_info['alert_radius'] = alert_radius

    return jsonify({"status": "Destination set", "alertRadius": alert_radius})

@app.route('/location', methods=['POST'])
def location():
    if not destination_info['coords']:
        return jsonify({"alert": "No destination set"})

    data = request.json
    user_coords = (data['latitude'], data['longitude'])

    distance = geodesic(user_coords, destination_info['coords']).meters
    alert_radius = destination_info['alert_radius']

    if int(distance) < int(alert_radius):
        return jsonify({"alert": "You have reached your destination!"})
    else:
        return jsonify({"alert": "Keep going!"})

@app.route('/set_alert_radius', methods=['POST'])
def set_alert_radius():
    data = request.json
    alert_radius = data.get('alertRadius', 50)  # Default to 50 meters if not provided

    destination_info['alert_radius'] = alert_radius

    return jsonify({"status": "Alert radius updated", "alertRadius": alert_radius})

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify({'status': 'Server is running'}), 200

# if __name__ == '__main__':
#     app.run(debug=True)
