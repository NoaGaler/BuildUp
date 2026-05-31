import React from 'react';

const Logo = ({ width = "200", height = "60" }) => {


  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g id="Architectural-Icon">
        <rect x="10" y="22" width="12" height="26" rx="6" fill="#60665D" opacity="0.85" />
        <rect x="26" y="10" width="14" height="38" rx="7" fill="#557A61" />

        <circle cx="33" cy="18" r="3.5" fill="#F7F7F4" />
      </g>

      <g id="Brand-Text">
        <text
          x="54"
          y="37"
          fontFamily="'Comfortaa', 'Assistant Rounded', 'Heebo', sans-serif"
          fontSize="27"
          fontWeight="400"
          fill="#222222"
          letterSpacing="-0.5px"
          stroke="#222222"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          build
        </text>

        <text
          x="128"
          y="37"
          fontFamily="'Comfortaa', sans-serif" fill="#557A61"
          fontSize="29"
          fontWeight="900"
          letterSpacing="-0.5px"
          stroke="#557A61"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          Up
        </text>
      </g>

      {/* קו תחתון ארכיטקטוני דקיק מנוקד */}
      <line x1="56" y1="46" x2="173" y2="46" stroke="#60665D" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="3 3" />
    </svg>
  );
};

export default Logo;