import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Text, Fill, Stroke } from "ol/style";

const WeatherMap = ({ lon, lat, selectedDate }) => {
  const mapRef = useRef();
  const mapInstance = useRef();
  const precipitationLayerRef = useRef();
  const [hourlyData, setHourlyData] = useState(null);
  const [precipitationData, setPrecipitationData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  useEffect(() => {
    if (!lon || !lat) return;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=true&hourly=weathercode`
        );
        const data = await res.json();
        setHourlyData(data.hourly);
      } catch (err) {
        console.error("Errore Open-Meteo:", err);
      }
    };

    fetchWeather();
  }, [lon, lat]);

  useEffect(() => {
    if (!hourlyData || !hourlyData.weathercode) return;
    let startIndex = 0;
    if (selectedDate) {
      startIndex = hourlyData.time.findIndex((t) => t.startsWith(selectedDate));
      if (startIndex === -1) startIndex = 0;
    }

    const centerFeature = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [lon, lat] },
      properties: { weathercode: hourlyData.weathercode[startIndex] },
    };

    const delta = 0.25; 
    const nearbyCoords = [
      { lat: lat + delta, lon: lon + delta },
      { lat: lat - delta, lon: lon - delta },
      { lat: lat + delta, lon: lon - delta },
      { lat: lat - delta, lon: lon + delta },
    ];

    const nearbyFeatures = nearbyCoords.map((p) => {
      const idx = Math.min(
        startIndex + Math.floor(Math.random() * 3),
        hourlyData.weathercode.length - 1
      );
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lon, p.lat] },
        properties: { weathercode: hourlyData.weathercode[idx] },
      };
    });

    setPrecipitationData({
      type: "FeatureCollection",
      features: [centerFeature, ...nearbyFeatures],
    });
  }, [hourlyData, lon, lat, selectedDate]);

  // --- Inizializza la mappa e il layer solo una volta ---
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initMap = () => {
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([lon || 10, lat || 42]),
          zoom: 6,
        }),
      });

      // Crea il layer dei punti una sola volta
      precipitationLayerRef.current = new VectorLayer({
        source: new VectorSource(),
        style: (feature) =>
          new Style({
            text: new Text({
              text: getWeatherEmoji(feature.get("weathercode")),
              font: "24px serif",
              fill: new Fill({ color: "#000" }),
              stroke: new Stroke({ color: "#fff", width: 2 }),
            }),
          }),
      });

      mapInstance.current.addLayer(precipitationLayerRef.current);

      const resizeObserver = new ResizeObserver(() =>
        mapInstance.current.updateSize()
      );
      resizeObserver.observe(mapRef.current);
    };

    initMap();
  }, []);

  // --- Aggiorna il layer dei punti senza ricrearlo ---
  useEffect(() => {
    if (!mapInstance.current || !precipitationData) return;

    const source = new VectorSource({
      features: new GeoJSON().readFeatures(precipitationData, {
        featureProjection: "EPSG:3857",
      }),
    });

    precipitationLayerRef.current.setSource(source);

    if (precipitationData.features.length > 0) {
      const [centerLon, centerLat] = precipitationData.features[0].geometry.coordinates;
      mapInstance.current.getView().animate({
        center: fromLonLat([centerLon, centerLat]),
        zoom: 10,
        duration: 500,
      });
    }
  }, [precipitationData]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        minHeight: "400px",
        borderRadius: "16px",
      }}
    />
  );
};

export default WeatherMap;