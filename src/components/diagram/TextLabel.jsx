import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function TextLabel({ label, selected, editing, removing, onBodyMouseDown, onEdit, onEndEdit, onTextChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <div className="absolute z-20" style={{ left: label.x, top: label.y - 10 }}>
        <input
          ref={inputRef}
          value={label.text}
          onChange={(e) => onTextChange(label.id, e.target.value)}
          onBlur={onEndEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
          }}
          placeholder="Type label…"
          className="rounded border border-sky-400 bg-white px-1 py-0.5 text-xs font-semibold text-slate-800 shadow-sm outline-none"
          style={{ width: Math.max(70, (label.text.length + 2) * 7) }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseDown={(e) => onBodyMouseDown(e, label)}
      onDoubleClick={() => onEdit(label.id)}
      className={cn(
        "absolute max-w-[240px] cursor-move whitespace-pre rounded px-1 py-0.5 text-xs font-semibold text-slate-800",
        selected
          ? "bg-sky-100 ring-1 ring-sky-400"
          : removing
          ? "hover:bg-red-50 hover:line-through"
          : "hover:bg-slate-100"
      )}
      style={{ left: label.x, top: label.y }}
    >
      {label.text || 'Label'}
    </div>
  );
}