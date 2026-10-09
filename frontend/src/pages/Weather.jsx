import { useEffect, useState } from "react";
import "./Weather.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const WEATHER_TIPS = [
  {
    icon: "☀️",
    cond: "Cerah",
    tip: "Waktu ideal untuk pemupukan dan penyemprotan pestisida.",
  },
  {
    icon: "🌦️",
    cond: "Hujan Ringan",
    tip: "Manfaatkan untuk menanam benih. Pastikan drainase lahan berfungsi baik.",
  },
  {
    icon: "⛈️",
    cond: "Hujan Lebat",
    tip: "Tunda pemupukan. Periksa kondisi saluran irigasi dan drainase.",
  },
  {
    icon: "🌫️",
    cond: "Berkabut",
    tip: "Waspadai risiko penyakit jamur. Tingkatkan ventilasi untuk tanaman dalam greenhouse.",
  },
];

function Weather() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET WEATHER BY COORDINATES
  // ==========================================
  const getWeatherByCoordinates = async (latitude, longitude) => {
    try {
      setLoading(true);
      setError("");

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(
          weatherData.message || "Gagal mengambil data cuaca."
        );
      }

      setWeather(weatherData);
      setCity(weatherData.name);

      // Ambil forecast berdasarkan koordinat
      await getForecastByCoordinates(latitude, longitude);
    } catch (err) {
      console.error("Weather error:", err);
      setError(err.message || "Gagal mengambil data cuaca.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET WEATHER BY CITY
  // ==========================================
  const getWeatherByCity = async (cityName) => {
    if (!cityName.trim()) {
      setError("Masukkan nama kota terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(
          weatherData.message || "Kota tidak ditemukan."
        );
      }

      setWeather(weatherData);
      setCity(weatherData.name);

      // Ambil forecast berdasarkan koordinat kota
      await getForecastByCoordinates(
        weatherData.coord.lat,
        weatherData.coord.lon
      );
    } catch (err) {
      console.error("City weather error:", err);
      setError(
        err.message === "city not found"
          ? "Kota tidak ditemukan."
          : err.message || "Gagal mencari kota."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET FORECAST
  // ==========================================
  const getForecastByCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data prakiraan."
        );
      }

      /*
       * API forecast memberikan data setiap 3 jam.
       * Kita ambil satu data per hari sekitar pukul 12:00.
       */
      const dailyForecast = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyForecast);
    } catch (err) {
      console.error("Forecast error:", err);
      setForecast([]);
    }
  };

  // ==========================================
  // GET USER LOCATION
  // ==========================================
  useEffect(() => {
    if (!API_KEY) {
      setError(
        "API key OpenWeatherMap belum ditemukan. Periksa file .env."
      );
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      // Jika browser tidak mendukung geolocation
      getWeatherByCity("Jakarta");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        getWeatherByCoordinates(latitude, longitude);
      },
      (geoError) => {
        console.warn("Geolocation error:", geoError);

        // Jika user menolak akses lokasi,
        // gunakan Jakarta sebagai lokasi default.
        getWeatherByCity("Jakarta");
      }
    );
  }, []);

  // ==========================================
  // SEARCH HANDLER
  // ==========================================
  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchCity.trim()) {
      setError("Masukkan nama kota terlebih dahulu.");
      return;
    }

    getWeatherByCity(searchCity);
  };

  // ==========================================
  // ENTER KEY
  // ==========================================
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (dateText) => {
    const date = new Date(dateText);

    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // ==========================================
  // FORMAT WEATHER DESCRIPTION
  // ==========================================
  const formatDescription = (description) => {
    if (!description) return "-";

    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading && !weather) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1>🌤️ Weather Forecast</h1>
            <p>
              Pantau kondisi cuaca untuk mendukung keputusan pertanian Anda
            </p>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <h3>🌍 Mengambil data cuaca...</h3>
            <p>
              Sedang mendeteksi lokasi dan mengambil data dari OpenWeatherMap.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="page-header">
          <h1>🌤️ Weather Forecast</h1>
          <p>
            Pantau kondisi cuaca untuk mendukung keputusan pertanian Anda
          </p>
        </div>

        {/* ======================================
            SEARCH
        ====================================== */}
        <div
          className="card"
          style={{
            marginBottom: "24px",
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Cari nama kota, contoh: Jakarta"
              style={{
                flex: "1",
                minWidth: "220px",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />

            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔎 Search
            </button>
          </form>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}
        {error && (
          <div
            className="alert alert-info"
            style={{
              marginBottom: "24px",
              color: "#b42318",
            }}
          >
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* ======================================
            CURRENT WEATHER
        ====================================== */}
        {weather && (
          <div className="weather__main card">

            {/* LEFT */}
            <div className="weather__main-left">

              <div className="weather__city-row">
                <span className="weather__city-icon">📍</span>

                <div>
                  <h2 style={{ margin: 0 }}>
                    {weather.name}
                    {weather.sys?.country
                      ? `, ${weather.sys.country}`
                      : ""}
                  </h2>

                  <small>
                    Data real-time dari OpenWeatherMap
                  </small>
                </div>
              </div>

              {/* TEMPERATURE */}
              <div className="weather__temp">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || "Weather"}
                  className="weather__temp-icon"
                />

                <span className="weather__temp-val">
                  {Math.round(weather.main.temp)}°C
                </span>
              </div>

              <p className="weather__desc">
                {formatDescription(weather.weather?.[0]?.description)}
              </p>

              {/* WEATHER META */}
              <div
                className="weather__meta"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <span>
                  💧 Kelembaban: {weather.main.humidity}%
                </span>

                <span>
                  💨 Angin:{" "}
                  {Math.round((weather.wind?.speed || 0) * 3.6)} km/h
                </span>

                <span>
                  🎚️ Tekanan: {weather.main.pressure} hPa
                </span>

                <span>
                  🌧️ Curah hujan:{" "}
                  {weather.rain?.["1h"] ??
                    weather.rain?.["3h"] ??
                    0}{" "}
                  mm
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="weather__main-right">
              <h3>🌤️ Prakiraan Cuaca</h3>

              {forecast.length > 0 ? (
                <div className="weather__forecast">
                  {forecast.map((item) => (
                    <div
                      key={item.dt}
                      className="weather__forecast-day"
                    >
                      <span className="weather__forecast-name">
                        {formatDate(item.dt_txt)}
                      </span>

                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}.png`}
                        alt={item.weather?.[0]?.description || "Weather"}
                        className="weather__forecast-icon"
                      />

                      <span className="weather__forecast-high">
                        {Math.round(item.main.temp)}°
                      </span>

                      <span className="weather__forecast-low">
                        {formatDescription(
                          item.weather?.[0]?.description
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Data prakiraan belum tersedia.</p>
              )}
            </div>
          </div>
        )}

        {/* ======================================
            TIPS
        ====================================== */}
        <div className="weather__tips-section">
          <h2>🌱 Tips Pertanian Berdasarkan Cuaca</h2>

          <div className="grid-2 weather__tips-grid">
            {WEATHER_TIPS.map((t) => (
              <div
                key={t.cond}
                className="card weather__tip-card"
              >
                <div className="weather__tip-head">
                  <span className="weather__tip-icon">
                    {t.icon}
                  </span>

                  <h3>{t.cond}</h3>
                </div>

                <p>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================
            INFO
        ====================================== */}
        <div className="alert alert-info weather__info">
          <strong>ℹ️ Sumber Data:</strong>{" "}
          Data cuaca diambil secara real-time dari
          OpenWeatherMap API berdasarkan lokasi pengguna
          atau kota yang dicari.
        </div>

      </div>
    </div>
  );
}

export default Weather;