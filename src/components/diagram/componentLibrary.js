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
      { type: 'compressor', label: 'Compressor', icon: Cpu, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'compressor_3phase', label: '3-Phase Compressor', icon: Cpu, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 }
      ] },
      { type: 'condenser_fan', label: 'Condenser Fan', icon: Fan, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'x2_fan_condenser', label: 'x2 Fan Condenser', icon: Fan, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.3 },
        { id: 'L2', side: 'top', offset: 0.7 },
        { id: 'T1', side: 'bottom', offset: 0.3 },
        { id: 'T2', side: 'bottom', offset: 0.7 }
      ] },
      { type: 'x3_fan_condenser', label: 'x3 Fan Condenser', icon: Fan, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'condenser_3phase', label: '3-Phase Condenser', icon: Fan, color: '#0ea5e9', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'evaporator', label: 'Evaporator', icon: AirVent, color: '#0ea5e9', width: 50, terminals: [
        { id: 'L', side: 'top', offset: 0.33 },
        { id: 'R', side: 'top', offset: 0.66 },
        { id: 'B1', side: 'bottom', offset: 0.33 },
        { id: 'B2', side: 'bottom', offset: 0.66 }
      ] },
      { type: 'heating_element', label: 'Heating Element', icon: Zap, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'solenoid_valve', label: 'Solenoid Valve', icon: Zap, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'drain_heater', label: 'Drain Heater', icon: Zap, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'blower_motor', label: 'Blower Motor', icon: Fan, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'thermostat', label: 'Thermostat', icon: Thermometer, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'digital_controller', label: 'Digital Controller', icon: Cpu, color: '#0ea5e9', width: 50, terminals: [
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
        { id: 'NO', side: 'top', offset: 0.05 },
        { id: 'NC', side: 'top', offset: 0.95 },
        { id: 'NO', side: 'bottom', offset: 0.05 },
        { id: 'NC', side: 'bottom', offset: 0.95 }
      ] },
      { type: 'auxiliary', label: 'Auxiliary', icon: ToggleLeft, color: '#0ea5e9', width: 50, terminals: [
        { id: 'NO', side: 'top', offset: 0.3 },
        { id: 'NC', side: 'bottom', offset: 0.3 }
      ] },
      { type: 'capacitor', label: 'Capacitor', icon: BatteryCharging, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'relay', label: 'Relay', icon: ToggleLeft, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'transformer', label: 'Transformer', icon: ArrowLeftRight, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'phase_failure_relay', label: 'Phase Failure Relay', icon: ZapOff, color: '#0ea5e9', width: 50, terminals: [
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
        { id: 'T3', side: 'bottom', offset: 0.8 },
        { id: '95', side: 'top', offset: 0.05 },
        { id: '96', side: 'top', offset: 0.95 }
      ] },
      { type: 'pressure_switch', label: 'Pressure Switch', icon: Gauge, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'crankcase_heater', label: 'Crankcase Heater', icon: Zap, color: '#0ea5e9', width: 50, terminals: LR },
      { type: 'precision_timer', label: 'Precision Timer (Defrost)', icon: Timer, color: '#0ea5e9', width: 50, terminals: [
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
      { type: 'stove', label: 'Stove', icon: Cog, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'geyser', label: 'Geyser', icon: Cog, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'inverter', label: 'Inverter', icon: ArrowLeftRight, color: '#f59e0b', width: 50, terminals: [
        { id: 'DC_IN', side: 'top', offset: 0.3 },
        { id: 'AC_OUT', side: 'bottom', offset: 0.5 }
      ] },
      { type: 'solar_panels', label: 'Solar Panels', icon: Zap, color: '#f59e0b', terminals: [
        { id: 'POS', side: 'top', offset: 0.3 },
        { id: 'NEG', side: 'top', offset: 0.7 }
      ] },
      { type: 'battery_12v', label: '12V Battery', icon: Battery, color: '#f59e0b', width: 50, terminals: [
        { id: 'POS', side: 'top', offset: 0.3 },
        { id: 'NEG', side: 'bottom', offset: 0.3 }
      ] },
      { type: 'battery_24v', label: '24V Battery', icon: Battery, color: '#f59e0b', width: 50, terminals: [
        { id: 'POS', side: 'top', offset: 0.3 },
        { id: 'NEG', side: 'bottom', offset: 0.3 }
      ] },
      { type: 'single_plug', label: 'Single Plug', icon: Plug, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'double_plug', label: 'Double Plug', icon: Plug, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'downlighter', label: 'Downlighter', icon: Lightbulb, color: '#f59e0b', width: 50, terminals: LR },
      { type: '2way_light_switch', label: '2-Way Switch', icon: ToggleLeft, color: '#f59e0b', width: 50, terminals: [
        { id: 'COM', side: 'top', offset: 0.5 },
        { id: 'L1', side: 'bottom', offset: 0.3 },
        { id: 'L2', side: 'bottom', offset: 0.7 }
      ] },
      { type: 'dimmer_switch', label: 'Dimmer Switch', icon: ToggleLeft, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'ceiling_fan', label: 'Ceiling Fan', icon: Fan, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'extractor_fan', label: 'Extractor Fan', icon: Fan, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'breaker', label: 'Breaker', icon: Shield, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'breaker_1phase', label: '1-Phase Breaker', icon: Shield, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'breaker_3phase', label: '3-Phase Breaker', icon: Layers, color: '#f59e0b', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'light', label: 'Light', icon: Lightbulb, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'light_switch', label: 'Light Switch', icon: ToggleLeft, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'breaker_10a', label: '10A Breaker', icon: Shield, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'breaker_20a', label: '20A Breaker', icon: Shield, color: '#f59e0b', width: 50, terminals: LR },
      { type: 'main_3phase_breaker', label: 'Main 3P Breaker', icon: Layers, color: '#f59e0b', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 }
      ] },
      { type: 'earth_leakage_63a', label: '63A ELCB', icon: Shield, color: '#f59e0b', terminals: [
        { id: 'L1', side: 'top', offset: 0.2 },
        { id: 'L2', side: 'top', offset: 0.5 },
        { id: 'L3', side: 'top', offset: 0.8 },
        { id: 'N', side: 'top', offset: 0.95 },
        { id: 'T1', side: 'bottom', offset: 0.2 },
        { id: 'T2', side: 'bottom', offset: 0.5 },
        { id: 'T3', side: 'bottom', offset: 0.8 },
        { id: 'TN', side: 'bottom', offset: 0.95 }
      ] },
      { type: 'connecting_strip_10', label: '10-Point Strip', icon: AlignJustify, color: '#1f2937', width: 50, terminals: [
        { id: 'T1', side: 'top', offset: 0.1 }, { id: 'T2', side: 'top', offset: 0.3 },
        { id: 'T3', side: 'top', offset: 0.5 }, { id: 'T4', side: 'top', offset: 0.7 },
        { id: 'T5', side: 'top', offset: 0.9 },
        { id: 'B1', side: 'bottom', offset: 0.1 }, { id: 'B2', side: 'bottom', offset: 0.3 },
        { id: 'B3', side: 'bottom', offset: 0.5 }, { id: 'B4', side: 'bottom', offset: 0.7 },
        { id: 'B5', side: 'bottom', offset: 0.9 }
      ] },
      { type: 'junction', label: 'Junction', icon: CircleDot, color: '#f59e0b', width: 50, terminals: [
        { id: 'T1', side: 'top', offset: 0.25 }, { id: 'T2', side: 'top', offset: 0.75 },
        { id: 'B1', side: 'bottom', offset: 0.25 }, { id: 'B2', side: 'bottom', offset: 0.75 }
      ] },
      { type: 'neutral_bar', label: '8-Point Neutral Bar', icon: AlignJustify, color: '#1f2937', width: 104, terminals: [
        { id: '1', side: 'top', offset: 0.15 },
        { id: '2', side: 'top', offset: 0.25 },
        { id: '3', side: 'top', offset: 0.35 },
        { id: '4', side: 'top', offset: 0.45 },
        { id: '5', side: 'top', offset: 0.55 },
        { id: '6', side: 'top', offset: 0.65 },
        { id: '7', side: 'top', offset: 0.75 },
        { id: '8', side: 'top', offset: 0.85 }
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