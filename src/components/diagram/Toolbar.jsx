import React from 'react';
import { ArrowLeft, Save, Trash2, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ExportButton from '@/components/diagram/ExportButton';

const CATEGORIES = [
  { value: 'hvac', label: 'HVAC', color: '#0ea5e9' },
  { value: 'electrical', label: 'Electrical', color: '#f59e0b' },
  { value: 'mixed', label: 'Mixed', color: '#8b5cf6' }
];

export default function Toolbar({ title, category, onTitleChange, onCategoryChange, onBack, onSave, onSaveAsTemplate, onDeleteSelected, hasSelection, saving, canvasRef, nodes }) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Diagrams
      </Button>

      <div className="h-6 w-px bg-slate-200" />

      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled diagram"
        className="min-w-0 flex-1 max-w-xs rounded-md border border-transparent px-2 py-1 text-sm font-medium text-slate-800 hover:border-slate-200 focus:border-slate-400 focus:outline-none"
      />

      <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
              category === c.value ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {hasSelection && (
        <Button variant="outline" size="sm" onClick={onDeleteSelected} className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      )}
      <ExportButton canvasRef={canvasRef} nodes={nodes} title={title} />
      <Button variant="outline" size="sm" onClick={onSaveAsTemplate} disabled={saving} className="gap-1.5">
        <LayoutTemplate className="h-4 w-4" /> Save as Template
      </Button>
      <Button size="sm" onClick={onSave} disabled={saving} className="gap-1.5">
        <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
      </Button>
    </header>
  );
}