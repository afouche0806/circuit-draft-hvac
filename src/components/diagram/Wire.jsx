import React from 'react';

export default function Wire({ from, to, selected, onClick }) {
  const midX = (from.x + to.x) / 2;
  const d = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
  return (
    <g onClick={onClick} className="cursor-pointer">
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
      <path
        d={d}
        fill="none"
        stroke={selected ? '#0ea5e9' : '#334155'}
        strokeWidth={selected ? 3 : 2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={from.x} cy={from.y} r={3} fill={selected ? '#0ea5e9' : '#334155'} />
      <circle cx={to.x} cy={to.y} r={3} fill={selected ? '#0ea5e9' : '#334155'} />
    </g>
  );
}