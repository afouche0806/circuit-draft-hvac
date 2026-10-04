import React from 'react';

export default function Wire({ d, from, to, selected, onClick, color }) {
  const isEarth = color === 'earth';
  const strokeColor = isEarth ? 'url(#wire-earth)' : (color || '#334155');
  const dotColor = isEarth ? '#16a34a' : (color || '#334155');
  return (
    <g onClick={onClick} className="cursor-pointer">
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
      <path
        d={d}
        fill="none"
        stroke="#0f172a"
        strokeOpacity={0.25}
        strokeWidth={selected ? 4.5 : 3.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={selected ? '#0ea5e9' : strokeColor}
        strokeWidth={selected ? 3 : 2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={from.x} cy={from.y} r={3} fill={selected ? '#0ea5e9' : dotColor} stroke="#0f172a" strokeOpacity={0.25} />
      <circle cx={to.x} cy={to.y} r={3} fill={selected ? '#0ea5e9' : dotColor} stroke="#0f172a" strokeOpacity={0.25} />
    </g>
  );
}