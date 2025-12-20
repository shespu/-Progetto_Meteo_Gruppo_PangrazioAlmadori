import React, { useEffect, useState } from "react";
import "./App.css";
import Globe3D from "./Globe3D.jsx";
import WeatherMap from "./WeatherMap.jsx";
import { BackgroundSVGs } from "./Background.jsx";
import { capitals } from "./Capitals.jsx";
import { useTranslation } from "react-i18next";
import i18n, { addLanguage } from "./i18n";
import { translationsMap } from "./translations";

const formatDay = (date, lang) =>
  new Intl.DateTimeFormat(lang, {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(date));

function App() {
  const { t } = useTranslation();

  const [showGlobe, setShowGlobe] = useState(true);
  const [lat, setLat] = useState(43.7874);
  const [lon, setLon] = useState(11.2499);
  const [cityName, setCityName] = useState("Firenze");
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedDateState, setSelectedDateState] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStateClick = (stateName) => {
    const capital = capitals[stateName];
    if (!capital) return;

    setLat(capital.lat);
    setLon(capital.lon);
    setCityName(capital.name);
    setSelectedDateState(null);

    const lng = capital.language || "en";
    if (translationsMap[lng]) addLanguage(lng, translationsMap[lng]);
    i18n.changeLanguage(translationsMap[lng] ? lng : "en");
    setShowGlobe(false);
  };

  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  const calculateDailyPrecipitationAverage = (hourly) => {
    if (!hourly || !hourly.precipitation) return [];
    const dailyData = {};
    hourly.time.forEach((time, i) => {
      const date = time.split("T")[0];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(hourly.precipitation[i]);
    });
    return Object.keys(dailyData).map((date) => {
      const sum = dailyData[date].reduce((acc, val) => acc + val, 0);
      const avg = sum / dailyData[date].length;
      return { date, avg: parseFloat(avg.toFixed(2)) };
    });
  };

  const getBackgroundClass = () => {
    if (!meteo) return "night";
    const { daily } = meteo;
    const dayIndex = selectedDateState
      ? daily.time.findIndex((d) => d === selectedDateState)
      : 0;
    const day = dayIndex !== -1 ? dayIndex : 0;

    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 20;

    const code = daily?.weathercode?.[day] ?? 0;
    const dailyPrecip = daily?.precipitation_sum?.[day] ?? 0;

    if (isNight) return "night";
    if (dailyPrecip > 0) return "rain";
    if (code === 0) return "clear";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([45, 48].includes(code)) return "cloudy";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if (code >= 71 && code <= 77) return "cloudy";
    if (code >= 95) return "rain";

    return "clear";
  };

  useEffect(() => {
    if (showGlobe) return;
    const fetchMeteo = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=true&hourly=temperature_2m,precipitation,relative_humidity_2m,uv_index,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max`
        );
        const data = await res.json();
        setMeteo(data);
      } catch (err) {
        console.error("Errore meteo:", err);
      }
      setLoading(false);
    };
    fetchMeteo();
  }, [lat, lon, showGlobe]);

  const selectCity = (city) => {
    setLat(parseFloat(city.lat));
    setLon(parseFloat(city.lon));
    setCityName(city.display_name.split(",")[0]);
    setSelectedDateState(null);
    setCityInput("");
    setCitySuggestions([]);
  };

  const openDay = (i) => {
    const date = meteo.daily.time[i];
    setSelectedDateState(date);
  };

  if (loading) return <p className="loading">{t("loading")}</p>;
  if (!meteo && !showGlobe) return <p className="loading">{t("no_data")}</p>;

  const { hourly, daily } = meteo || {};

let hourlySlice = [];
if (hourly) {
  const todayDateStr = new Date().toLocaleDateString("en-CA", { timeZone: meteo.timezone }); // YYYY-MM-DD
  const selectedDateStr = selectedDateState || todayDateStr;

  if (selectedDateStr === todayDateStr) {
    const currentHour = new Date().toLocaleString("en-US", { timeZone: meteo.timezone, hour12: false, hour: "2-digit" });
    const startIndex = hourly.time.findIndex((t) =>
      t.startsWith(todayDateStr + "T" + String(currentHour).padStart(2, "0"))
    );
    hourlySlice = hourly.time
      .map((t, i) => ({ time: t, index: i }))
      .filter(({ time, index }) => index >= startIndex && time.startsWith(todayDateStr))
      .slice(0, 24);
  } else {
    hourlySlice = hourly.time
      .map((t, i) => ({ time: t, index: i }))
      .filter(({ time }) => time.startsWith(selectedDateStr));
    }
  }

  const dayIndex = selectedDateState
    ? daily?.time.findIndex((d) => d === selectedDateState)
    : 0;
  const day = dayIndex !== -1 ? dayIndex : 0;

  const todayPrecipitationAvg =
    hourly ? calculateDailyPrecipitationAverage(hourly)[day]?.avg || 0 : 0;
  const currentUV = hourly?.uv_index?.[0] ?? "-";
  const currentHumidity = hourly?.relative_humidity_2m?.[0] ?? "-";

  return (
    <div className="app-container">
      {!showGlobe && BackgroundSVGs[getBackgroundClass()]}
      <div className="content">
        {showGlobe ? (
          <Globe3D onStateClick={handleStateClick} />
        ) : (
          <>
            <div
              style={{
                background: "#1f2937",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "28px", margin: 0 }}>{cityName}</h2>
              <div style={{ fontSize: "36px", margin: "6px 0" }}>
                {getWeatherEmoji(daily.weathercode[day])} {daily.temperature_2m_max[day]}°
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "28px", margin: 0 }}>{cityName}</h2>
              {!showGlobe && (
                <button
                  onClick={() => setShowGlobe(true)}
                  style={{
                    background: "#111827",
                    border: "1px solid #3b82f6",
                    borderRadius: "999px",
                    padding: "8px 16px",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#3b82f6";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#111827";
                    e.target.style.color = "#3b82f6";
                  }}
                >
                  🌍 {t("back_to_globe")}
                </button>
              )}
            </div>
              <div style={{ position: "relative", maxWidth: "320px", marginTop: "12px" }}>
                <input
                  type="text"
                  placeholder={t("search_city")}
                  value={cityInput}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setCityInput(value);
                    if (!value) return setCitySuggestions([]);
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                          value
                        )}&limit=5`
                      );
                      const data = await res.json();
                      setCitySuggestions(data || []);
                    } catch {
                      setCitySuggestions([]);
                    }
                  }}
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                    borderRadius: "999px",
                    border: "none",
                    outline: "none",
                    background: "#111827",
                    color: "white",
                    width: "100%",
                  }}
                />
                {citySuggestions?.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "44px",
                      left: 0,
                      right: 0,
                      background: "#1f2937",
                      borderRadius: "12px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      zIndex: 10,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {citySuggestions.map((city, i) => (
                      <div
                        key={i}
                        onClick={() => selectCity(city)}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: i < citySuggestions.length - 1 ? "1px solid #374151" : "none",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#374151")}
                        onMouseLeave={(e) => (e.target.style.background = "#1f2937")}
                      >
                        {city.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <div>☀ {t("uv")}: {currentUV}</div>
                <div>💧 {t("humidity")}: {currentHumidity}%</div>
                <div>🌧 {t("rain")}: {todayPrecipitationAvg} {t("mm")}</div>
                <div>💨 {t("wind")}: {daily.windspeed_10m_max[day]} {t("kmh")}</div>
              </div>
            </div>
            <div
              className="hourly-container"
              style={{
                background: "#1f2937",
                borderRadius: "20px",
                padding: "16px",
                marginBottom: "20px",
                display: "flex",
                gap: "14px",
                overflowX: "auto",
              }}
            >
              {hourlySlice.map(({ time, index }) => (
                <div
                  key={index}
                  style={{
                    minWidth: "80px",
                    textAlign: "center",
                    background: "#111827",
                    borderRadius: "14px",
                    padding: "10px",
                  }}
                >
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {hourly.temperature_2m[index]}°
                  </div>
                  <div style={{ fontSize: "22px" }}>
                    {getWeatherEmoji(hourly.weathercode[index])}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {time.slice(11, 16)}
                  </div>
                </div>
              ))}
            </div>

            {/* GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "#1f2937",
                  borderRadius: "20px",
                  padding: "16px",
                }}
              >
                <h3>{t("weekly_weather")}</h3>
                {daily.time.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => openDay(i)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      background: i === day ? "#374151" : "transparent",
                    }}
                  >
                    <span>{formatDay(d, i18n.language)}</span>
                    <span>
                      {daily.temperature_2m_min[i]}° / {daily.temperature_2m_max[i]}°
                      {getWeatherEmoji(daily.weathercode[i])}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#1f2937",
                  borderRadius: "20px",
                  padding: "16px",
                }}
              >
                <h3>{t("weather_details")}</h3>
                <p>🌡 {t("min")}: {daily.temperature_2m_min[day]}°</p>
                <p>🌡 {t("max")}: {daily.temperature_2m_max[day]}°</p>
                <p>🌧 {t("rain")}: {daily.precipitation_sum[day]} mm</p>
                <p>💨 {t("wind")}: {daily.windspeed_10m_max[day]} km/h</p>
              </div>
            </div>
            <div
              style={{
                marginTop: "20px",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <WeatherMap
                lon={lon}
                lat={lat}
                hourly={hourly}
                selectedDate={selectedDateState}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;