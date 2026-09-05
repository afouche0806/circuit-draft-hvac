import React from 'react';
import { Trash2, PenLine, Type } from 'lucide-react';
import { componentLibrary } from '@/components/diagram/componentLibrary';
import WireColorPicker from '@/components/diagram/WireColorPicker';
import { cn } from '@/lib/utils';

export default function ComponentPalette({ tool, setTool, wireColor, setWireColor, removing, setRemoving }) {
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
      <div className="p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Palette</p>
        <p className="text-[11px] text-slate-400 mb-3">Click a part, then click the canvas to place it.</p>
        <button
          onClick={() => { setTool(null); setRemoving(false); }}
          className={cn(
            "w-full mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition",
            tool === null && !removing
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          Select / Move
        </button>
        <button
          onClick={() => { setTool('line'); setRemoving(false); }}
          className={cn(
            "w-full mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition",
            tool === 'line'
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          <PenLine className="h-4 w-4" /> Draw Line
        </button>
        <button
          onClick={() => { setTool('text'); setRemoving(false); }}
          className={cn(
            "w-full mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition",
            tool === 'text'
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          <Type className="h-4 w-4" /> Add Text
        </button>
        <button
          onClick={() => { setTool(null); setRemoving(!removing); }}
          className={cn(
            "w-full mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition",
            removing
              ? "border-red-600 bg-red-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600"
          )}
        >
          <Trash2 className="h-4 w-4" /> Remove Parts
        </button>

        {componentLibrary.map((cat) => (
          <div key={cat.category} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full" style={{ background: cat.accent }} />
              <h3 className="text-xs font-semibold text-slate-700">{cat.category}</h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {cat.components.map((c) => {
                const Icon = c.icon;
                const active = tool === c.type;
                return (
                  <button
                    key={c.type}
                    onClick={() => { setTool(c.type); setRemoving(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition",
                      active
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="h-5 w-5" style={{ color: c.color }} />
                    <span className="text-[10px] font-medium text-slate-600 leading-tight text-center">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <WireColorPicker value={wireColor} onChange={setWireColor} />
      </div>
    </aside>
  );
}