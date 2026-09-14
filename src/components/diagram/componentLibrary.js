import {
  Cpu, Fan, AirVent, Thermometer, Zap, BatteryCharging, ToggleLeft,
  ArrowLeftRight, Gauge, Battery, Minus, Plug, Shield, Lightbulb, Cog,
  CircleDot, Triangle, Layers, AlignJustify, Timer, ZapOff
} from 'lucide-react';

const LR = [{ id: 'L', side: 'top' }, { id: 'R', side: 'bottom' }];

export const componentLibrary = [
  {
    category: 'HVAC',
    accent: '#0ea5e9',
    components: [
      { type: 'compressor', label: 'Compressor', icon: Cpu, color: '#0ea5e9', terminals: LR },
      { type: 'compressor_3phase', label: '3-Phase Compressor', icon: Cpu, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 }
      ] },
      { type: 'condenser_fan', label: 'Condenser Fan', icon: Fan, color: '#0ea5e9', terminals: LR },
      { type: 'condenser_3phase', label: '3-Phase Condenser', icon: Fan, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'evaporator', label: 'Evaporator', icon: AirVent, color: '#0ea5e9', terminals: LR },
      { type: 'heating_element', label: 'Heating Element', icon: Zap, color: '#0ea5e9', terminals: LR },
      { type: 'solenoid_valve', label: 'Solenoid Valve', icon: Zap, color: '#0ea5e9', terminals: LR },
      { type: 'drain_heater', label: 'Drain Heater', icon: Zap, color: '#0ea5e9', terminals: LR },
      { type: 'blower_motor', label: 'Blower Motor', icon: Fan, color: '#0ea5e9', terminals: LR },
      { type: 'thermostat', label: 'Thermostat', icon: Thermometer, color: '#0ea5e9', terminals: LR },
      { type: 'digital_controller', label: 'Digital Controller', icon: Cpu, color: '#0ea5e9', terminals: [
        { id: 'L', side: 'top', offset: 0.25 },
        { id: 'TS', side: 'top', offset: 0.5 },
        { id: 'N', side: 'top', offset: 0.75 },
        { id: 'COM', side: 'bottom', offset: 0.2 },
        { id: 'NO', side: 'bottom', offset: 0.5 },
        { id: 'NC', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'contactor', label: 'Contactor', icon: Zap, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 },
        { id: 'A1', side: 'top', offset: 0.05 },
        { id: 'A2', side: 'bottom', offset: 0.05 }
      ] },
      { type: 'capacitor', label: 'Capacitor', icon: BatteryCharging, color: '#0ea5e9', terminals: LR },
      { type: 'relay', label: 'Relay', icon: ToggleLeft, color: '#0ea5e9', terminals: LR },
      { type: 'transformer', label: 'Transformer', icon: ArrowLeftRight, color: '#0ea5e9', terminals: LR },
      { type: 'phase_failure_relay', label: 'Phase Failure Relay', icon: ZapOff, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: '95', side: 'bottom', offset: 0.25 },
        { id: '96', side: 'bottom', offset: 0.75 }
      ] },
      { type: '3-phase_overload', label: '3-Phase Overload', icon: Shield, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'pressure_switch', label: 'Pressure Switch', icon: Gauge, color: '#0ea5e9', terminals: LR },
      { type: 'precision_timer', label: 'Precision Timer (Defrost)', icon: Timer, color: '#0ea5e9', terminals: [
        { id: '1', side: 'top', offset: 0.25 },
        { id: '2', side: 'top', offset: 0.75 },
        { id: '3', side: 'bottom', offset: 0.25 },
        { id: '4', side: 'bottom', offset: 0.75 }
      ] }
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
      { type: 'breaker_1phase', label: '1-Phase Breaker', icon: Shield, color: '#f59e0b', width: 70, terminals: LR },
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
      { type: 'neutral_bar', label: 'Neutral Bar', icon: AlignJustify, color: '#1f2937', terminals: [
        { id: 'N1', side: 'top', offset: 0.15 },
        { id: 'N2', side: 'top', offset: 0.5 },
        { id: 'N3', side: 'top', offset: 0.85 },
        { id: 'N4', side: 'bottom', offset: 0.15 },
        { id: 'N5', side: 'bottom', offset: 0.5 },
        { id: 'N6', side: 'bottom', offset: 0.85 }
      ] },
      { type: 'fuse', label: 'Fuse', icon: Shield, color: '#f59e0b', terminals: LR },
      { type: 'motor', label: 'Motor', icon: Cog, color: '#f59e0b', terminals: LR },
      { type: 'junction', label: 'Junction', icon: CircleDot, color: '#f59e0b', terminals: [
        { id: 'T1', side: 'top', offset: 0.25 }, { id: 'T2', side: 'top', offset: 0.75 },
        { id: 'B1', side: 'bottom', offset: 0.25 }, { id: 'B2', side: 'bottom', offset: 0.75 }
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