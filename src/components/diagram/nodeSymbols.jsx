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

const breakerContact = (x) => (
  <g key={x}>
    <path d={`M${x} 6 L${x + 6} 56`} />
    <path d={`M${x - 2} 48 L${x + 6} 56 M${x + 6} 48 L${x - 2} 56`} strokeWidth={1.4} />
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
  heating_element: (
    <g {...S}>
      <path d="M20 37 L30 37 L35 47 L45 27 L55 47 L65 27 L75 47 L80 37 L90 37" strokeWidth={2} />
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
      <path d="M52 6 L58 20" />
      <rect x={40} y={26} width={24} height={16} rx={2} />
      <path d="M52 42 V68" />
    </g>
  ),
  capacitor: (
    <g {...S}>
      <path d="M52 6 V27 M36 27 H68 M36 35 H68 M52 35 V68" />
    </g>
  ),
  relay: (
    <g {...S}>
      <path d="M52 6 V22 M52 52 V68" />
      <rect x={36} y={22} width={32} height={30} rx={2} />
      {T(52, 41, 'CR', 9)}
    </g>
  ),
  transformer: (
    <g {...S}>
      <path d="M52 6 V16 M52 51 V68" />
      <circle cx={52} cy={27} r={11} />
      <circle cx={52} cy={40} r={11} />
    </g>
  ),
  pressure_switch: (
    <g {...S}>
      <path d="M52 10 L60 52" />
      {T(38, 42, 'PS', 9)}
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
      <path d="M52 6 V26 M34 26 H70 M46 36 H58 M52 36 V68" />
    </g>
  ),
  resistor: (
    <g {...S}>
      <path d="M52 6 V16 L40 24 L64 40 L40 56 L52 62 V68" />
    </g>
  ),
  switch: (
    <g {...S}>
      {dot(52, 12)}
      {dot(52, 62)}
      <path d="M52 14 L64 58" />
    </g>
  ),
  receptacle: (
    <g {...S}>
      <path d="M32 40 A20 20 0 0 1 72 40 M32 40 H72 M44 40 V28 M60 40 V28 M52 6 V20 M52 40 V68" />
    </g>
  ),
  breaker: (
    <g {...S}>{breakerContact(52)}</g>
  ),
  breaker_1phase: (
    <g {...S}>
      {breakerContact(35)}
      {T(50, 30, '1~', 8)}
    </g>
  ),
  breaker_3phase: (
    <g {...S}>
      {[24, 52, 80].map(breakerContact)}
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
      <path d="M52 6 V26 M52 48 V68" />
      <rect x={42} y={26} width={20} height={22} rx={2} />
      <path d="M42 37 H62" strokeWidth={1.2} />
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