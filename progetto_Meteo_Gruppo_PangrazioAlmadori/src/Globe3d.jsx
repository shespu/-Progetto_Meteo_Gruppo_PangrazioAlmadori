import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import { capitals } from "./Capitals";

const Globe3D = ({ onStateClick }) => {
  const globeRef = useRef();
  const containerRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // --- Fetch GeoJSON dei paesi ---
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  // --- Aggiorna dimensioni del container al resize ---
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000", // sfondo nero
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        polygonsData={countries.features}
        polygonCapColor={(d) => (capitals[d.properties.name] ? "orange" : "gray")}
        polygonSideColor={() => "rgba(0,0,0,0.2)"}
        polygonStrokeColor={() => "#111"}
        polygonAltitude={0.06}
        onPolygonClick={(d) => {
          const stateName = d.properties.name;
          if (capitals[stateName]) onStateClick(stateName);
        }}
      />
    </div>
  );
};

export default Globe3D;