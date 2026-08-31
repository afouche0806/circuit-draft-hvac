import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Zap, Fan, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const CATEGORY_STYLE = {
  hvac: { color: '#0ea5e9', bg: 'bg-sky-50', text: 'text-sky-700', icon: Fan },
  electrical: { color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', icon: Zap },
  mixed: { color: '#8b5cf6', bg: 'bg-violet-50', text: 'text-violet-700', icon: Zap }
};

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.WiringDiagram
      .list('-created_date', 100)
      .then(setDiagrams)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this diagram?')) return;
    await base44.entities.WiringDiagram.delete(id);
    setDiagrams((d) => d.filter((x) => x.id !== id));
    toast({ title: 'Diagram deleted' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
            <Zap className="h-4 w-4" /> Wiring Studio
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wiring Diagrams</h1>
          <p className="mt-1 text-slate-500">Design and save HVAC and electrical wiring diagrams.</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate('/editor')} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Diagram
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          </div>
        ) : diagrams.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-slate-400 mb-4">No diagrams yet.</p>
            <Button onClick={() => navigate('/editor')} className="gap-1.5">
              <Plus className="h-4 w-4" /> Create your first diagram
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((d) => {
              const style = CATEGORY_STYLE[d.category] || CATEGORY_STYLE.hvac;
              const Icon = style.icon;
              let count = 0;
              try { count = JSON.parse(d.diagram_data || '{}').nodes?.length || 0; } catch { /* ignore */ }
              return (
                <div
                  key={d.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', style.bg)}>
                      <Icon className="h-5 w-5" style={{ color: style.color }} />
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide', style.bg, style.text)}>
                      {d.category}
                    </span>
                  </div>
                  <h3 className="mt-4 truncate text-base font-semibold text-slate-900">{d.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{count} component{count === 1 ? '' : 's'}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/editor/${d.id}`)} className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" /> Open
                    </Button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="ml-auto rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}