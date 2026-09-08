import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArchiveRestore, Trash2, Pencil, Archive as ArchiveIcon, ArrowLeft } from 'lucide-react';
import { CATEGORY_STYLE } from '@/lib/categoryStyle';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function Archive() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.WiringDiagram
      .list('-created_date', 100)
      .then((all) => setArchived(all.filter((d) => d.archived && !d.is_template)))
      .finally(() => setLoading(false));
  }, []);

  const handleRestore = async (id) => {
    await base44.entities.WiringDiagram.update(id, { archived: false });
    setArchived((d) => d.filter((x) => x.id !== id));
    toast({ title: 'Project restored to dashboard' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this diagram permanently?')) return;
    await base44.entities.WiringDiagram.delete(id);
    setArchived((d) => d.filter((x) => x.id !== id));
    toast({ title: 'Diagram deleted' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <Link to="/" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
            <ArchiveIcon className="h-4 w-4" /> Project Archive
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Archived Projects</h1>
          <p className="mt-1 text-slate-500">Completed projects kept out of your main dashboard. Restore one anytime.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          </div>
        ) : archived.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-slate-400 mb-4">Nothing archived yet.</p>
            <p className="text-xs text-slate-400">Use the archive button on a diagram card to move it here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((d) => {
              const style = CATEGORY_STYLE[d.category] || CATEGORY_STYLE.hvac;
              const Icon = style.icon;
              let count = 0;
              try { count = JSON.parse(d.diagram_data || '{}').nodes?.length || 0; } catch { /* ignore */ }
              return (
                <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
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
                    <Button size="sm" onClick={() => handleRestore(d.id)} className="gap-1.5">
                      <ArchiveRestore className="h-3.5 w-3.5" /> Restore
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/editor/${d.id}`)} className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" /> Open
                    </Button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="ml-auto rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete permanently"
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