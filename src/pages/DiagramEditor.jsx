import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { componentMap, terminalPos, NODE_W, NODE_H } from '@/components/diagram/componentLibrary';
import ComponentPalette from '@/components/diagram/ComponentPalette';
import DiagramNode from '@/components/diagram/DiagramNode';
import Wire from '@/components/diagram/Wire';
import Toolbar from '@/components/diagram/Toolbar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const CANVAS_W = 3000;
const CANVAS_H = 2000;

const uid = () => Math.random().toString(36).slice(2, 10);

export default function DiagramEditor() {
  const { diagramId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('Untitled diagram');
  const [category, setCategory] = useState('hvac');
  const [nodes, setNodes] = useState([]);
  const [wires, setWires] = useState([]);
  const [tool, setTool] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedWire, setSelectedWire] = useState(null);
  const [pendingTerm, setPendingTerm] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!diagramId);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!diagramId) return;
    setLoading(true);
    base44.entities.WiringDiagram.get(diagramId)
      .then((d) => {
        setTitle(d.title || 'Untitled diagram');
        setCategory(d.category || 'hvac');
        try {
          const parsed = JSON.parse(d.diagram_data || '{"nodes":[],"wires":[]}');
          setNodes(parsed.nodes || []);
          setWires(parsed.wires || []);
        } catch {
          setNodes([]);
          setWires([]);
        }
      })
      .finally(() => setLoading(false));
  }, [diagramId]);

  // Dragging a node
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      setNodes((ns) =>
        ns.map((n) =>
          n.id === dragging.id
            ? { ...n, x: dragging.origX + (e.clientX - dragging.startX), y: dragging.origY + (e.clientY - dragging.startY) }
            : n
        )
      );
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  // Delete key
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedNode || selectedWire)) {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'Escape') {
        setPendingTerm(null);
        setSelectedNode(null);
        setSelectedWire(null);
        setTool(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNode, selectedWire]);

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getTerminalAbs = (nodeId, termId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const comp = componentMap[node.type];
    const term = comp?.terminals.find((t) => t.id === termId);
    if (!term) return null;
    const p = terminalPos(term);
    return { x: node.x + p.x, y: node.y + p.y };
  };

  const onCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      if (tool) {
        const pos = getCanvasPos(e);
        const newNode = { id: uid(), type: tool, x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 };
        setNodes((ns) => [...ns, newNode]);
        setSelectedNode(newNode.id);
        setSelectedWire(null);
      } else {
        setSelectedNode(null);
        setSelectedWire(null);
        setPendingTerm(null);
      }
    }
  };

  const onCanvasMouseMove = (e) => {
    if (pendingTerm) setMousePos(getCanvasPos(e));
  };

  const onNodeBodyMouseDown = (e, node) => {
    e.stopPropagation();
    if (tool) return; // placing, not selecting
    setSelectedNode(node.id);
    setSelectedWire(null);
    setDragging({
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y
    });
  };

  const onTerminalClick = (nodeId, termId) => {
    if (!pendingTerm) {
      setPendingTerm({ node: nodeId, term: termId });
      setSelectedNode(null);
      setSelectedWire(null);
      return;
    }
    if (pendingTerm.node === nodeId && pendingTerm.term === termId) {
      setPendingTerm(null);
      return;
    }
    const exists = wires.some(
      (w) =>
        (w.from.node === pendingTerm.node && w.from.term === pendingTerm.term && w.to.node === nodeId && w.to.term === termId) ||
        (w.from.node === nodeId && w.from.term === termId && w.to.node === pendingTerm.node && w.to.term === pendingTerm.term)
    );
    if (!exists) {
      setWires((ws) => [...ws, { id: uid(), from: pendingTerm, to: { node: nodeId, term: termId } }]);
    }
    setPendingTerm(null);
  };

  const onWireClick = (e, wireId) => {
    e.stopPropagation();
    setSelectedWire(wireId);
    setSelectedNode(null);
    setPendingTerm(null);
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((ns) => ns.filter((n) => n.id !== selectedNode));
      setWires((ws) => ws.filter((w) => w.from.node !== selectedNode && w.to.node !== selectedNode));
      setSelectedNode(null);
    } else if (selectedWire) {
      setWires((ws) => ws.filter((w) => w.id !== selectedWire));
      setSelectedWire(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = JSON.stringify({ nodes, wires });
      if (diagramId) {
        await base44.entities.WiringDiagram.update(diagramId, {
          title: title.trim() || 'Untitled diagram',
          category,
          diagram_data: data
        });
      } else {
        const rec = await base44.entities.WiringDiagram.create({
          title: title.trim() || 'Untitled diagram',
          category,
          diagram_data: data
        });
        navigate(`/editor/${rec.id}`, { replace: true });
      }
      toast({ title: 'Diagram saved' });
    } catch (err) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const hasSelection = !!(selectedNode || selectedWire);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Toolbar
        title={title}
        category={category}
        onTitleChange={setTitle}
        onCategoryChange={setCategory}
        onBack={() => navigate('/')}
        onSave={handleSave}
        onDeleteSelected={deleteSelected}
        hasSelection={hasSelection}
        saving={saving}
      />

      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette tool={tool} setTool={setTool} />

        <div className="relative flex-1 overflow-auto">
          {/* hint bar */}
          <div className="pointer-events-none sticky top-0 z-20 flex justify-center">
            <div className="pointer-events-auto mt-2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-white shadow">
              {pendingTerm
                ? 'Click another terminal to connect — Esc to cancel'
                : tool
                ? `Placing ${componentMap[tool]?.label} — click the canvas`
                : 'Click a part in the palette, then click the canvas. Drag parts to move. Click terminals to wire.'}
            </div>
          </div>

          <div
            ref={canvasRef}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            className={cn('relative', tool && 'cursor-crosshair')}
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              backgroundImage:
                'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <svg className="absolute inset-0" width={CANVAS_W} height={CANVAS_H} style={{ overflow: 'visible' }}>
              <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="transparent" />
              {wires.map((w) => {
                const from = getTerminalAbs(w.from.node, w.from.term);
                const to = getTerminalAbs(w.to.node, w.to.term);
                if (!from || !to) return null;
                return (
                  <Wire key={w.id} from={from} to={to} selected={selectedWire === w.id} onClick={(e) => onWireClick(e, w.id)} />
                );
              })}
              {pendingTerm &&
                (() => {
                  const from = getTerminalAbs(pendingTerm.node, pendingTerm.term);
                  if (!from) return null;
                  return (
                    <path
                      d={`M ${from.x} ${from.y} L ${mousePos.x} ${mousePos.y}`}
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      strokeDasharray="5 4"
                    />
                  );
                })()}
            </svg>

            {nodes.map((node) => (
              <DiagramNode
                key={node.id}
                node={node}
                selected={selectedNode === node.id}
                pendingTerm={pendingTerm}
                onBodyMouseDown={(e) => onNodeBodyMouseDown(e, node)}
                onTerminalClick={onTerminalClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}