import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const BASE_URL = "http://127.0.0.1:5000";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `${BASE_URL}/api/weather?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      setWeather(data);
    });
  };

  const searchCity = async () => {
    if (!city) return;

    const res = await fetch(`${BASE_URL}/api/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
      alert("City not found ❌");
      return;
    }

    setWeather(data);
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="container">

        <div className="top-bar">
          <h2>Weather</h2>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={searchCity}>Search</button>
          <button onClick={detectLocation}>📍</button>
        </div>

        {weather && (
          <div className="weather-card">
            <h2>{weather.city}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt="icon"
              className="weather-icon"
            />

            <h1>{Math.round(weather.temp)}°C</h1>
            <p>{weather.description}</p>

            <div className="details">
              <div>Feels: {Math.round(weather.feels_like)}°C</div>
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind: {weather.wind} km/h</div>
              <div>Pressure: {weather.pressure} mb</div>
              <div>Visibility: {weather.visibility} km</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;