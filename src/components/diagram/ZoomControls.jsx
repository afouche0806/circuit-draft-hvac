import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MIN = 0.2;
const MAX = 3;
const STEP = 0.15;

export default function ZoomControls({ zoom, setZoom }) {
  const clamp = (z) => Math.min(MAX, Math.max(MIN, Math.round(z * 100) / 100));
  return (
    <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-md">
      <Button variant="ghost" size="icon" onClick={() => setZoom(clamp(zoom - STEP))} title="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <button
        onClick={() => setZoom(1)}
        className="min-w-[3rem] rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        title="Reset to 100%"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button variant="ghost" size="icon" onClick={() => setZoom(clamp(zoom + STEP))} title="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}