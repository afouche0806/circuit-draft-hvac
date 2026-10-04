import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Zap, Fan, Archive as ArchiveIcon, LayoutTemplate, Copy } from 'lucide-react';
import { CATEGORY_STYLE } from '@/lib/categoryStyle';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allDiagrams, setAllDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  const templates = allDiagrams.filter((d) => d.is_template);
  const diagrams = allDiagrams.filter((d) => !d.is_template && !d.archived);

  const load = () => {
    setLoading(true);
    base44.entities.WiringDiagram
      .list('-created_date', 100)
      .then(setAllDiagrams)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this diagram?')) return;
    await base44.entities.WiringDiagram.delete(id);
    setAllDiagrams((d) => d.filter((x) => x.id !== id));
    toast({ title: 'Diagram deleted' });
  };

  const handleArchive = async (id) => {
    await base44.entities.WiringDiagram.update(id, { archived: true });
    setAllDiagrams((d) => d.map((x) => (x.id === id ? { ...x, archived: true } : x)));
    toast({ title: 'Moved to archive' });
  };

  const handleNewFromTemplate = async (t) => {
    try {
      const rec = await base44.entities.WiringDiagram.create({
        title: t.title.replace(/\s*\(Template\)\s*$/, '') + ' copy',
        category: t.category,
        diagram_data: t.diagram_data,
        is_template: false
      });
      navigate(`/editor/${rec.id}`);
    } catch (err) {
      toast({ title: 'Failed to create from template', description: err.message, variant: 'destructive' });
    }
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
          <Button variant="outline" onClick={() => navigate('/archive')} className="gap-1.5">
            <ArchiveIcon className="h-4 w-4" /> Archive
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          </div>
        ) : (
          <>
            {templates.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  <LayoutTemplate className="h-4 w-4" /> Templates
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map((t) => {
                    const style = CATEGORY_STYLE[t.category] || CATEGORY_STYLE.hvac;
                    const Icon = style.icon;
                    let count = 0;
                    try { count = JSON.parse(t.diagram_data || '{}').nodes?.length || 0; } catch { /* ignore */ }
                    return (
                      <div key={t.id} className="group relative rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', style.bg)}>
                            <LayoutTemplate className="h-5 w-5" style={{ color: style.color }} />
                          </div>
                          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide', style.bg, style.text)}>
                            {t.category}
                          </span>
                        </div>
                        <h3 className="mt-4 truncate text-base font-semibold text-slate-900">{t.title}</h3>
                        <p className="mt-0.5 text-xs text-slate-400">{count} component{count === 1 ? '' : 's'}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button size="sm" onClick={() => handleNewFromTemplate(t)} className="gap-1.5">
                            <Copy className="h-3.5 w-3.5" /> New from template
                          </Button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="ml-auto rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete template"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {diagrams.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
                <p className="text-slate-400 mb-4">No diagrams yet.</p>
                <Button onClick={() => navigate('/editor')} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Create your first diagram
                </Button>
              </div>
            ) : (
              <section>
                {templates.length > 0 && (
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    <Fan className="h-4 w-4" /> Your Diagrams
                  </h2>
                )}
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
                            onClick={() => handleArchive(d.id)}
                            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            title="Move to archive"
                          >
                            <ArchiveIcon className="h-4 w-4" />
                          </button>
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
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}