from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "0f1b73c9dbc516d1201102fc0ed8366d"


@app.route("/api/weather")
def get_weather():
    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if city:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    else:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"

    res = requests.get(url)
    data = res.json()

    if data.get("cod") != 200:
        return jsonify({"error": "City not found"}), 404

    weather_data = {
        "city": data["name"],
        "temp": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "wind": data["wind"]["speed"],
        "visibility": data.get("visibility", 0) / 1000,
        "description": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"]
    }

    return jsonify(weather_data)


if __name__ == "__main__":
    app.run(debug=True)