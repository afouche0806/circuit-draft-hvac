import React from 'react';
import { componentMap, terminalPos, NODE_W, NODE_H } from '@/components/diagram/componentLibrary';
import { NodeSymbol } from '@/components/diagram/nodeSymbols';
import { cn } from '@/lib/utils';

export default function DiagramNode({ node, selected, pendingTerm, removing, onBodyMouseDown, onNodeMove, onTerminalClick }) {
  const comp = componentMap[node.type];
  if (!comp) return null;
  const Icon = comp.icon;
  const w = comp.width || NODE_W;

  return (
    <div
      className="absolute select-none"
      style={{ left: node.x, top: node.y, width: w, height: NODE_H }}
    >
      <div
        onMouseDown={(e) => {
          onBodyMouseDown(e);
        }}
        className={cn(
          "relative h-full w-full rounded-xl border-2 bg-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-move transition-shadow",
          selected ? "border-sky-500 ring-2 ring-sky-200 shadow-md" : removing ? "border-red-300 hover:border-red-500 hover:bg-red-50" : "border-slate-300 hover:shadow-md"
        )}
      >
        <svg className="absolute inset-0" viewBox="0 0 104 74" width="100%" height="100%">
          <NodeSymbol type={node.type} />
        </svg>
        <span className="absolute bottom-0.5 left-0 right-0 truncate px-1 text-center text-[9px] font-semibold leading-none text-slate-500">
          {comp.label}
        </span>
        <div className="absolute -right-1.5 -top-1.5 flex items-center gap-0.5 rounded border border-slate-300 bg-gradient-to-b from-white to-slate-300 px-1 py-0.5 shadow-sm">
          <Icon className="h-2.5 w-2.5" style={{ color: comp.color }} />
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-slate-400 to-slate-600 ring-1 ring-slate-500" />
        </div>
      </div>

      {comp.terminals.map((t) => {
        const p = terminalPos(t, w);
        const isPending = pendingTerm && pendingTerm.node === node.id && pendingTerm.term === t.id;
        return (
          <button
            key={t.id}
            title={`${comp.label} · ${t.id}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onTerminalClick(node.id, t.id); }}
            className={cn(
              "absolute h-3 w-3 rounded-full border-2 border-slate-700 bg-white hover:bg-sky-400 hover:border-sky-600 transition-colors z-10",
              isPending && "bg-sky-500 border-sky-600 scale-125"
            )}
            style={{ left: p.x - 6, top: p.y - 6 }}
          />
        );
      })}
    </div>
  );
}