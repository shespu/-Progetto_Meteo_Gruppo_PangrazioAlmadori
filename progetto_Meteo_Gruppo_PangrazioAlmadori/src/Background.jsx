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
      
  
      <g filter="url(#cloudBlur)">
        {/* Nuvola 1 */}
        <ellipse cx="200" cy="200" rx="120" ry="60" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="270" cy="240" rx="100" ry="50" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="240" cy="280" rx="90" ry="40" fill="rgba(255,255,255,0.6)" />
  
        {/* Nuvola 3 */}
        <ellipse cx="400" cy="350" rx="100" ry="50" fill="rgba(255,255,255,0.8)" />
        <ellipse cx="460" cy="340" rx="90" ry="45" fill="rgba(255,255,255,0.65)" />
        <ellipse cx="420" cy="380" rx="80" ry="40" fill="rgba(255,255,255,0.5)" />
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
    <svg className="bg-svg night" xmlns="http://www.w3.org/2000/svg">
      {[...Array(70)].map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 2 + 1}
          fill="white"
          opacity={Math.random()}
        />
      ))}
      <circle cx="80%" cy="20%" r="40" fill="#eee" opacity="0.8" />
    </svg>
  ),
};