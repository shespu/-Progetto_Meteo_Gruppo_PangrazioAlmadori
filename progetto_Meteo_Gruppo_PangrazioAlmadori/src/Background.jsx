import React from "react";

export const BackgroundSVGs = {
  clear: (
    <svg
      className="bg-svg clear"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Blur per le nuvole */}
        <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>

      <defs>
        {/* Gradiente radiale più intenso e colorato */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8800" stopOpacity="1" />
          <stop offset="15%" stopColor="#FF9900" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#FFB347" stopOpacity="0.65" />
          <stop offset="75%" stopColor="#FFB347" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
        </radialGradient>

        {/* Blur per ammorbidire il sole nello sfondo */}
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
        </filter>
      </defs>

      <g transform="translate(900 150)"> {/* Centro dello schermo */}
        {/* Sole principale */}
        <circle r="160" fill="url(#sunGlow)" filter="url(#softBlur)" />

        {/* Raggi sottili e trasparenti */}
        {[...Array(36)].map((_, i) => {
          const angle = (i * 360) / 36;
          return (
            <rect
              key={i}
              x="-3"
              y="-100"
              width="6"
              height="60"
              rx="3"
              fill="rgba(255,170,50,0.12)"
              transform={`rotate(${angle})`}
            />
          );
        })}
      </g>
      <g filter="url(#cloudBlur)">
        <ellipse cx="650" cy="130" rx="120" ry="60" fill="rgba(255,255,255,0.8)" />
        <ellipse cx="720" cy="120" rx="100" ry="50" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="680" cy="160" rx="90" ry="40" fill="rgba(255,255,255,0.6)" />

        <ellipse cx="500" cy="80" rx="130" ry="65" fill="rgba(255,255,255,0.8)" />
        <ellipse cx="580" cy="90" rx="110" ry="55" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="540" cy="130" rx="100" ry="50" fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  ),

  cloudy: (
    <svg className="bg-svg cloudy" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
  
      <g filter="url(#cloudBlur)">
        {/* Nuvola 1 */}
        <ellipse cx="200" cy="200" rx="120" ry="60" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="270" cy="240" rx="100" ry="50" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="240" cy="280" rx="90" ry="40" fill="rgba(255,255,255,0.6)" />
  
        {/* Nuvola 2 */}
        <ellipse cx="600" cy="200" rx="130" ry="65" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="680" cy="210" rx="110" ry="55" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="640" cy="250" rx="100" ry="50" fill="rgba(255,255,255,0.6)" />
  
      </g>
    </svg>
  ),

  rain: (
    <svg
      className="bg-svg rain"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Blur nuvole */}
        <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
  
        <style>
          {`
            .raindrop {
              animation: fall linear infinite;
            }
  
            @keyframes fall {
              0% { transform: translateY(0); opacity: 0.6; }
              80% { opacity: 1; }
              100% { transform: translateY(600px); opacity: 0; }
            }
          `}
        </style>
      </defs>
  
      {/* PIoggia (sotto) */}
      <g className="raindrops" pointerEvents="none">
        {[...Array(80)].map((_, i) => {
          const x = Math.random() * 1000;
          const yStart = Math.random() * 600;
          const length = 10 + Math.random() * 20;
          const delay = Math.random() * 2;
          const opacity = 0.3 + Math.random() * 0.7;
          const width = 1 + Math.random() * 2;
  
          return (
            <line
              key={i}
              x1={x}
              y1={yStart}
              x2={x}
              y2={yStart + length}
              stroke="rgba(120,170,255,0.8)"
              strokeWidth={width}
              className="raindrop"
              style={{
                animationDuration: `${0.8 + Math.random()}s`,
                animationDelay: `${delay}s`,
                opacity,
              }}
            />
          );
        })}
      </g>
  
      {/* NUVOLE (sopra la pioggia) */}
      <g filter="url(#cloudBlur)">
        <ellipse cx="200" cy="150" rx="120" ry="60" fill="rgba(100,100,120,0.9)" />
        <ellipse cx="270" cy="140" rx="100" ry="50" fill="rgba(120,120,140,0.8)" />
        <ellipse cx="240" cy="180" rx="90" ry="40" fill="rgba(140,140,160,0.7)" />
  
        <ellipse cx="600" cy="100" rx="130" ry="65" fill="rgba(100,100,120,0.9)" />
        <ellipse cx="680" cy="110" rx="110" ry="55" fill="rgba(120,120,140,0.8)" />
        <ellipse cx="640" cy="150" rx="100" ry="50" fill="rgba(140,140,160,0.7)" />
      </g>
    </svg>
  ),

  night: (
    <svg
      className="bg-svg night"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sfondo sfumato */}
      <defs>
        <radialGradient id="nightGradient" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#0b0c2a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
  
        {/* Glow luna */}
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
  
      <rect width="100%" height="100%" fill="url(#nightGradient)" />
  
      {/* Stelle */}
      {[...Array(100)].map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 1.5 + 0.3} // dimensioni variabili
          fill="white"
          opacity={Math.random() * 0.8 + 0.2} // luminosità variabile
        />
      ))}
  
      {/* Luna */}
      <g transform="translate(925, 100)">
        <circle r="35" fill="#f5f3ce" filter="url(#moonGlow)" />
        <circle r="20" fill="#fef9c3" opacity="0.6" />
      </g>
    </svg>
  ),  
};
