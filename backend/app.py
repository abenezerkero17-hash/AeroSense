from flask import Flask, jsonify, request
import requests
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "AeroSense Backend is Running! 🌤️"


@app.route("/api/weather")
def weather():

    city = request.args.get("city", "Addis Ababa")

    # 1. Find city coordinates
    geo_url = "https://geocoding-api.open-meteo.com/v1/search"

    geo_params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:
        geo_response = requests.get(
            geo_url,
            params=geo_params,
            timeout=10
        )

        geo_data = geo_response.json()

        if "results" not in geo_data:
            return jsonify({
                "error": "City not found"
            }), 404

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]
        city_name = location["name"]

        # 2. Get real weather
        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "apparent_temperature,"
                "relative_humidity_2m,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m"
            ),
            "hourly": (
                "precipitation_probability,"
                "visibility"
            ),
            "forecast_days": 1,
            "timezone": "auto"
        }

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=10
        )

        weather_data = weather_response.json()

        current = weather_data["current"]
        rain_probability = weather_data["hourly"]["precipitation_probability"][0]
        # 3. Weather condition
        weather_code = current["weather_code"]

        if weather_code == 0:
            condition = "Clear Sky"
        elif weather_code in [1, 2, 3]:
            condition = "Partly Cloudy"
        elif weather_code in [45, 48]:
            condition = "Fog"
        elif weather_code in [51, 53, 55, 56, 57]:
            condition = "Drizzle"
        elif weather_code in [61, 63, 65, 66, 67]:
            condition = "Rain"
        elif weather_code in [71, 73, 75, 77]:
            condition = "Snow"
        elif weather_code in [80, 81, 82]:
            condition = "Rain Showers"
        elif weather_code in [95, 96, 99]:
            condition = "Thunderstorm"
        else:
            condition = "Unknown"

        # 4. Prepare response
        result = {
            "city": city_name,
            "temperature": current["temperature_2m"],
            "feels_like": current["apparent_temperature"],
            "condition": condition,
            "humidity": current["relative_humidity_2m"],
            "wind": current["wind_speed_10m"],
            "rain": rain_probability,
            "visibility": weather_data["hourly"]["visibility"][0],
            "weather_code": weather_code
        }

        return jsonify(result)

    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Unable to connect to weather service"
        }), 503

    except Exception as e:
        return jsonify({
            "error": "Something went wrong",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )