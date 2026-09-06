/* ========================================
   AEROSENSE — APP.JS
======================================== */


/* ========================================
   DARK MODE
======================================== */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const button = document.querySelector(".theme-btn");

    if (document.body.classList.contains("dark")) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}


/* ========================================
   SEARCH WEATHER
======================================== */

async function searchWeather() {

    const input = document.getElementById("cityInput");
    const city = input.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        /* Loading */

        document.getElementById("cityName").textContent =
            "Loading...";


        /* ========================================
           CONNECT TO FLASK BACKEND
        ======================================== */

        const response = await fetch(
            `http://127.0.0.1:5000/api/weather?city=${encodeURIComponent(city)}`
        );


        /* Convert response to JSON */

        const data = await response.json();


        /* ========================================
           CHECK BACKEND ERROR
        ======================================== */

        if (!response.ok) {

            alert(
                data.error || "Unable to get weather data."
            );

            return;
        }


        /* ========================================
           CITY
        ======================================== */

        document.getElementById("cityName").textContent =
            data.city;


        /* ========================================
           TEMPERATURE
        ======================================== */

        document.getElementById("temperature").textContent =
            data.temperature;


        /* ========================================
           FEELS LIKE
        ======================================== */

        document.getElementById("feelsLike").textContent =
            data.feels_like;


        /* ========================================
           WEATHER CONDITION
        ======================================== */

        document.getElementById("condition").textContent =
            data.condition;


        /* ========================================
           WEATHER ICON
        ======================================== */

        const weatherIcon =
            document.getElementById("weatherIcon");


        if (data.weather_code === 0) {

            weatherIcon.textContent = "☀️";

        }

        else if ([1, 2, 3].includes(data.weather_code)) {

            weatherIcon.textContent = "🌤️";

        }

        else if ([45, 48].includes(data.weather_code)) {

            weatherIcon.textContent = "🌫️";

        }

        else if (
            [51, 53, 55, 56, 57].includes(data.weather_code)
        ) {

            weatherIcon.textContent = "🌦️";

        }

        else if (
            [61, 63, 65, 66, 67, 80, 81, 82]
                .includes(data.weather_code)
        ) {

            weatherIcon.textContent = "🌧️";

        }

        else if (
            [71, 73, 75, 77].includes(data.weather_code)
        ) {

            weatherIcon.textContent = "❄️";

        }

        else if (
            [95, 96, 99].includes(data.weather_code)
        ) {

            weatherIcon.textContent = "⛈️";

        }

        else {

            weatherIcon.textContent = "🌤️";

        }


        /* ========================================
           HUMIDITY
        ======================================== */

        document.getElementById("humidity").textContent =
            data.humidity + "%";


        /* ========================================
           WIND
        ======================================== */

        document.getElementById("wind").textContent =
            data.wind + " km/h";


        /* ========================================
           RAIN PROBABILITY
        ======================================== */

        document.getElementById("rain").textContent =
            data.rain + "%";


        /* ========================================
           VISIBILITY
        ======================================== */

        document.getElementById("visibility").textContent =
            (data.visibility / 1000).toFixed(1) + " km";

    }


    /* ========================================
       ERROR HANDLING
    ======================================== */

    catch (error) {

        console.error(error);

        alert(
            "AeroSense Error: " + error.message
        );

    }

}


/* ========================================
   ENTER KEY SEARCH
======================================== */

document
    .getElementById("cityInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    });