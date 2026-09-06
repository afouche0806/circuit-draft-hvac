import React from 'react';

const S = { stroke: '#475569', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
const T = (x, y, txt, size = 10) => (
  <text x={x} y={y} fontSize={size} textAnchor="middle" fontWeight="700" fill="#475569" stroke="none">{txt}</text>
);
const dot = (cx, cy, r = 2.5) => <circle cx={cx} cy={cy} r={r} fill="#475569" stroke="none" />;

const motorCircle = (txt) => (
  <g {...S}>
    <circle cx={52} cy={27} r={14} />
    {T(52, 31, txt, 11)}
  </g>
);

const threePhaseBox = (txt) => (
  <g {...S}>
    <circle cx={52} cy={24} r={14} />
    <path d="M52 13 L61 32 L43 32 Z" />
    {T(52, 48, txt, 9)}
  </g>
);

const breakerBase = (
  <g {...S}>
    {dot(16, 34)}
    {dot(88, 34)}
    <path d="M18 34 L70 22" />
    <path d="M72 27 L80 35 M72 35 L80 27" strokeWidth={1.4} />
  </g>
);

const symbols = {
  compressor: (
    <g {...S}>
      <circle cx={52} cy={27} r={15} />
      <path d="M52 15 L62 35 L42 35 Z" />
    </g>
  ),
  compressor_3phase: threePhaseBox('3~'),
  condenser_3phase: threePhaseBox('3~ FAN'),
  condenser_fan: (
    <g {...S}>
      <circle cx={52} cy={27} r={15} />
      <path d="M52 27 L52 14 M52 27 L63 33 M52 27 L41 33" strokeWidth={1.5} />
      {dot(52, 27, 3)}
    </g>
  ),
  blower_motor: motorCircle('M'),
  motor: motorCircle('M'),
  evaporator: (
    <g {...S}>
      <rect x={18} y={10} width={68} height={36} rx={3} />
      <path d="M26 46 L32 10 M38 46 L44 10 M50 46 L56 10 M62 46 L68 10" strokeWidth={1} />
    </g>
  ),
  thermostat: (
    <g {...S}>
      <path d="M52 8 V36" />
      <circle cx={52} cy={41} r={6} />
      <path d="M60 15 h6 M60 21 h6 M60 27 h6" strokeWidth={1.2} />
    </g>
  ),
  digital_controller: (
    <g {...S}>
      <rect x={20} y={8} width={64} height={42} rx={4} />
      <rect x={30} y={16} width={44} height={13} rx={1} strokeWidth={1.2} />
      {dot(38, 40, 1.8)}
      {dot(52, 40, 1.8)}
      {dot(66, 40, 1.8)}
    </g>
  ),
  contactor: (
    <g {...S}>
      {dot(14, 18)}
      {dot(90, 18)}
      <path d="M16 18 L64 12" />
      <rect x={40} y={28} width={24} height={16} rx={2} />
    </g>
  ),
  capacitor: (
    <g {...S}>
      <path d="M14 27 H46 M46 10 V44 M58 10 V44 M58 27 H90" />
    </g>
  ),
  relay: (
    <g {...S}>
      <rect x={34} y={10} width={36} height={32} rx={2} />
      {T(52, 30, 'CR', 9)}
    </g>
  ),
  transformer: (
    <g {...S}>
      <circle cx={45} cy={27} r={11} />
      <circle cx={59} cy={27} r={11} />
      <path d="M14 27 H34 M70 27 H90" />
    </g>
  ),
  pressure_switch: (
    <g {...S}>
      {dot(14, 40)}
      {dot(90, 40)}
      <path d="M16 40 L64 30" />
      {T(52, 20, 'PS', 9)}
    </g>
  ),
  precision_timer: (
    <g {...S}>
      <rect x={28} y={8} width={48} height={40} rx={4} />
      <circle cx={52} cy={26} r={11} strokeWidth={1.5} />
      <path d="M52 26 V20 M52 26 H57" strokeWidth={1.5} />
      {dot(36, 42, 1.8)}
      {dot(68, 42, 1.8)}
    </g>
  ),
  phase_failure_relay: (
    <g {...S}>
      <rect x={28} y={8} width={48} height={40} rx={4} />
      {T(52, 29, 'PFR', 8)}
    </g>
  ),
  battery: (
    <g {...S}>
      <path d="M30 16 H74 M46 25 H58 M30 34 H74 M46 43 H58" />
    </g>
  ),
  resistor: (
    <g {...S}>
      <path d="M14 27 H22 L28 15 L38 39 L48 15 L58 39 L68 15 L74 27 H90" />
    </g>
  ),
  switch: (
    <g {...S}>
      {dot(16, 34)}
      {dot(88, 34)}
      <path d="M18 34 L64 20" />
    </g>
  ),
  receptacle: (
    <g {...S}>
      <path d="M32 36 A20 20 0 0 1 72 36 M32 36 H72" />
      <path d="M44 36 V24 M60 36 V24" strokeWidth={1.5} />
    </g>
  ),
  breaker: breakerBase,
  breaker_1phase: (
    <g>
      <g {...S}>
        {dot(8, 26)}
        {dot(62, 26)}
        <path d="M10 26 L56 18" />
      </g>
      {T(35, 13, '1~', 8)}
    </g>
  ),
  breaker_3phase: (
    <g {...S}>
      {[12, 26, 40].map((y) => (
        <g key={y}>
          {dot(16, y)}
          {dot(88, y)}
          <path d={`M18 ${y} L74 ${y - 8}`} />
        </g>
      ))}
    </g>
  ),
  lamp: (
    <g {...S}>
      <circle cx={52} cy={27} r={14} />
      <path d="M44 19 L60 35 M60 19 L44 35" />
    </g>
  ),
  ground: (
    <g {...S}>
      <path d="M52 10 V22 M32 22 H72 M38 29 H66 M44 36 H60" />
    </g>
  ),
  neutral_bar: (
    <g {...S}>
      <rect x={18} y={26} width={68} height={10} rx={2} />
      {[26, 42, 58, 74].map((x) => dot(x, 31, 2.2))}
    </g>
  ),
  fuse: (
    <g {...S}>
      <path d="M14 27 H38 M66 27 H90" />
      <rect x={38} y={17} width={28} height={20} rx={2} />
      <path d="M38 27 H66" strokeWidth={1.2} />
    </g>
  ),
  junction: (
    <g {...S}>{dot(52, 27, 5)}</g>
  ),
  _default: (
    <g {...S}>
      <rect x={28} y={12} width={48} height={30} rx={4} />
      {T(52, 31, '?')}
    </g>
  )
};

export function NodeSymbol({ type }) {
  return symbols[type] || symbols._default;
}