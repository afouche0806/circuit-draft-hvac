import React from 'react';
import { componentMap, terminalPos, NODE_W, NODE_H } from '@/components/diagram/componentLibrary';
import { cn } from '@/lib/utils';

export default function DiagramNode({ node, selected, pendingTerm, onBodyMouseDown, onTerminalClick }) {
  const comp = componentMap[node.type];
  if (!comp) return null;
  const Icon = comp.icon;

  return (
    <div
      className="absolute select-none"
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
    >
      <div
        onMouseDown={onBodyMouseDown}
        className={cn(
          "relative h-full w-full rounded-xl border-2 bg-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-move transition-shadow",
          selected ? "border-sky-500 ring-2 ring-sky-200 shadow-md" : "border-slate-300 hover:shadow-md"
        )}
      >
        <Icon className="h-6 w-6" style={{ color: comp.color }} />
        <span className="text-[10px] font-semibold text-slate-600 leading-tight text-center px-1">{comp.label}</span>
      </div>

      {comp.terminals.map((t) => {
        const p = terminalPos(t);
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