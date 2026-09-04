import {
  Cpu, Fan, AirVent, Thermometer, Zap, BatteryCharging, ToggleLeft,
  ArrowLeftRight, Gauge, Battery, Minus, Plug, Shield, Lightbulb, Cog,
  CircleDot, Triangle, Layers
} from 'lucide-react';

const LR = [{ id: 'L', side: 'left' }, { id: 'R', side: 'right' }];

export const componentLibrary = [
  {
    category: 'HVAC',
    accent: '#0ea5e9',
    components: [
      { type: 'compressor', label: 'Compressor', icon: Cpu, color: '#0ea5e9', terminals: LR },
      { type: 'compressor_3phase', label: '3-Phase Compressor', icon: Cpu, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'condenser_fan', label: 'Condenser Fan', icon: Fan, color: '#0ea5e9', terminals: LR },
      { type: 'evaporator', label: 'Evaporator', icon: AirVent, color: '#0ea5e9', terminals: LR },
      { type: 'blower_motor', label: 'Blower Motor', icon: Fan, color: '#0ea5e9', terminals: LR },
      { type: 'thermostat', label: 'Thermostat', icon: Thermometer, color: '#0ea5e9', terminals: LR },
      { type: 'digital_controller', label: 'Digital Controller', icon: Cpu, color: '#0ea5e9', terminals: [
        { id: 'L', side: 'left', offset: 0.25 },
        { id: 'N', side: 'left', offset: 0.75 },
        { id: 'COM', side: 'right', offset: 0.2 },
        { id: 'NO', side: 'right', offset: 0.5 },
        { id: 'NC', side: 'right', offset: 0.8 },
        { id: 'TS', side: 'bottom', offset: 0.5 }
      ] },
      { type: 'contactor', label: 'Contactor', icon: Zap, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 },
        { id: 'A1', side: 'left', offset: 0.5 },
        { id: 'A2', side: 'right', offset: 0.5 }
      ] },
      { type: 'capacitor', label: 'Capacitor', icon: BatteryCharging, color: '#0ea5e9', terminals: LR },
      { type: 'relay', label: 'Relay', icon: ToggleLeft, color: '#0ea5e9', terminals: LR },
      { type: 'transformer', label: 'Transformer', icon: ArrowLeftRight, color: '#0ea5e9', terminals: LR },
      { type: 'pressure_switch', label: 'Pressure Switch', icon: Gauge, color: '#0ea5e9', terminals: LR }
    ]
  },
  {
    category: 'Electrical',
    accent: '#f59e0b',
    components: [
      { type: 'battery', label: 'Battery', icon: Battery, color: '#f59e0b', terminals: LR },
      { type: 'resistor', label: 'Resistor', icon: Minus, color: '#f59e0b', terminals: LR },
      { type: 'switch', label: 'Switch', icon: ToggleLeft, color: '#f59e0b', terminals: LR },
      { type: 'receptacle', label: 'Receptacle', icon: Plug, color: '#f59e0b', terminals: LR },
      { type: 'breaker', label: 'Breaker', icon: Shield, color: '#f59e0b', terminals: LR },
      { type: 'breaker_1phase', label: '1-Phase Breaker', icon: Shield, color: '#f59e0b', terminals: LR },
      { type: 'breaker_3phase', label: '3-Phase Breaker', icon: Layers, color: '#f59e0b', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'lamp', label: 'Lamp', icon: Lightbulb, color: '#f59e0b', terminals: LR },
      { type: 'ground', label: 'Ground', icon: Triangle, color: '#f59e0b', terminals: [{ id: 'T', side: 'top' }] },
      { type: 'fuse', label: 'Fuse', icon: Shield, color: '#f59e0b', terminals: LR },
      { type: 'motor', label: 'Motor', icon: Cog, color: '#f59e0b', terminals: LR },
      { type: 'junction', label: 'Junction', icon: CircleDot, color: '#f59e0b', terminals: [
        { id: 'L', side: 'left' }, { id: 'R', side: 'right' }, { id: 'T', side: 'top' }, { id: 'B', side: 'bottom' }
      ] }
    ]
  }
];

export const componentMap = Object.fromEntries(
  componentLibrary.flatMap(cat => cat.components.map(c => [c.type, c]))
);

export const NODE_W = 104;
export const NODE_H = 74;

export function terminalPos(term, w = NODE_W, h = NODE_H) {
  const o = term.offset ?? 0.5;
  switch (term.side) {
    case 'left': return { x: 0, y: o * h };
    case 'right': return { x: w, y: o * h };
    case 'top': return { x: o * w, y: 0 };
    case 'bottom': return { x: o * w, y: h };
    default: return { x: 0, y: 0 };
  }
}