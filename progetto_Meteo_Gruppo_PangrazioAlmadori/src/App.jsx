import { useEffect, useState } from "react";
import { BackgroundSVGs } from "./Background";

function App() {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(43.7874);
  const [lon, setLon] = useState(11.2499);
  const [cityInput, setCityInput] = useState("");
  const [cityName, setCityName] = useState("Firenze");
  const [selectedDateState, setSelectedDateState] = useState(null);

  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  const getBackgroundClass = () => {
    if (!meteo) return "night";
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const dateParam = searchParams.get("date");
    if (dateParam) setSelectedDateState(dateParam);
  }, []);

  useEffect(() => {
    const fetchMeteo = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=true&hourly=temperature_2m,precipitation,relative_humidity_2m,uv_index,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max`
        );
        const data = await res.json();
        setMeteo(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMeteo();
  }, [lat, lon]);

  const searchCity = async () => {
    if (!cityInput) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInput)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        setLat(parseFloat(place.lat));
        setLon(parseFloat(place.lon));
        setCityName(place.display_name.split(",")[0]);
        setSelectedDateState(null);
        setCityInput("");
        window.history.replaceState({}, "", window.location.pathname);
      } else {
        alert("Città non trovata");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ color: "white" }}>Caricamento...</p>;
  if (!meteo) return <p style={{ color: "white" }}>Nessun dato disponibile</p>;

  const { hourly, daily } = meteo;
  const dayIndex = selectedDateState ? daily.time.findIndex((d) => d === selectedDateState) : 0;
  const day = dayIndex !== -1 ? dayIndex : 0;
  const todayPrecipitationAvg = calculateDailyPrecipitationAverage(hourly)[day]?.avg || 0;
  const todayString = new Date().toISOString().split("T")[0];

  let startIndex;
  if (!selectedDateState || selectedDateState === todayString) {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const pad = (n) => n.toString().padStart(2, "0");
    const localTimeString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;
    startIndex = hourly.time.findIndex((t) => t === localTimeString);
    if (startIndex === -1) startIndex = 0;
  } else {
    startIndex = hourly.time.findIndex((t) => t.startsWith(selectedDateState));
    if (startIndex === -1) startIndex = 0;
  }

  const hourlySlice = hourly.time.slice(startIndex, startIndex + 24);
  const currentUV = hourly.uv_index?.[startIndex] ?? "-";
  const currentHumidity = hourly.relative_humidity_2m?.[startIndex] ?? "-";

  const openDay = (i) => {
    const date = daily.time[i];
    setSelectedDateState(date);
    const url = new URL(window.location);
    url.searchParams.set("date", date);
    window.history.replaceState({}, "", url);
  };

  const appStyles = {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    lineHeight: 1.5,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.87)",
    backgroundColor: "#242424",
    minHeight: "100vh",
    padding: "20px",
  };

  const cardStyle = {
    background: "#1f2937",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    marginBottom: "20px",
  };

  const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    padding: "10px",
    fontSize: "14px",
  };

  const buttonStyle = {
    background: "#3b82f6",
    border: "none",
    borderRadius: "50%",
    width: "38px",
    height: "38px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={appStyles}>
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        {BackgroundSVGs[getBackgroundClass()]}
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "28px", margin: 0 }}>{cityName}</h2>
        <div style={{ fontSize: "36px", margin: "6px 0" }}>
          {getWeatherEmoji(daily.weathercode[day])} {daily.temperature_2m_max[day]}°
        </div>

        <div style={{ display: "flex", alignItems: "center", background: "#111827", borderRadius: "999px", padding: "6px 10px", marginTop: "12px", maxWidth: "320px" }}>
          <input type="text" placeholder="Cerca città..." value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchCity()} style={inputStyle} />
          <button onClick={searchCity} style={buttonStyle}>🔍</button>
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
          <div>☀ UV {currentUV}</div>
          <div>🌧 {todayPrecipitationAvg} mm</div>
          <div>💧 {currentHumidity}%</div>
          <div>💨 {daily.windspeed_10m_max[day]} km/h</div>
        </div>
      </div>

      <div style={{ background: "#1f2937", borderRadius: "20px", padding: "16px", marginBottom: "20px", display: "flex", gap: "14px", overflowX: "auto" }}>
        {hourlySlice.map((time, i) => {
          const index = startIndex + i;
          return (
            <div key={index} style={{ minWidth: "80px", textAlign: "center", background: "#111827", borderRadius: "14px", padding: "10px" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{hourly.temperature_2m[index]}°</div>
              <div style={{ fontSize: "22px" }}>{getWeatherEmoji(hourly.weathercode[index])}</div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>{time.slice(11, 16)}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#1f2937", borderRadius: "20px", padding: "16px" }}>
          <h3>Meteo settimanale</h3>
          {daily.time.map((d, i) => (
            <div key={i} onClick={() => openDay(i)} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "12px", cursor: "pointer", background: i === day ? "#374151" : "transparent" }}>
              <span>{d}</span>
              <span>{daily.temperature_2m_min[i]}° / {daily.temperature_2m_max[i]}° {getWeatherEmoji(daily.weathercode[i])}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#1f2937", borderRadius: "20px", padding: "16px" }}>
          <h3>Dettagli meteo</h3>
          <p>🌡 Min: {daily.temperature_2m_min[day]}°</p>
          <p>🌡 Max: {daily.temperature_2m_max[day]}°</p>
          <p>🌧 Pioggia: {daily.precipitation_sum[day]} mm</p>
          <p>💨 Vento: {daily.windspeed_10m_max[day]} km/h</p>
        </div>
      </div>
    </div>
  );
}

export default App;
