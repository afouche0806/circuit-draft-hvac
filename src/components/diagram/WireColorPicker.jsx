import React from 'react';
import { cn } from '@/lib/utils';

export const PHASE_COLORS = [
  { value: '#ef4444', label: 'Red' },
  { value: '#ffffff', label: 'White' },
  { value: '#3b82f6', label: 'Blue' }
];

export default function WireColorPicker({ value, onChange }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        <h3 className="text-xs font-semibold text-slate-700">Wire Color</h3>
      </div>
      <div className="flex items-center gap-2">
        {PHASE_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.label}
            className={cn(
              'h-7 w-7 rounded-full border-2 transition',
              value === c.value ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
            )}
            style={{ background: c.value }}
          />
        ))}
      </div>
    </div>
  );
}