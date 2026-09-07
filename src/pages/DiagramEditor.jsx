import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { componentMap, terminalPos, NODE_W, NODE_H } from '@/components/diagram/componentLibrary';
import { routeWire, routeLine, pointsToPath } from '@/components/diagram/wireRouter';
import ComponentPalette from '@/components/diagram/ComponentPalette';
import DiagramNode from '@/components/diagram/DiagramNode';
import Wire from '@/components/diagram/Wire';
import TextLabel from '@/components/diagram/TextLabel';
import Toolbar from '@/components/diagram/Toolbar';
import ZoomControls from '@/components/diagram/ZoomControls';
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
  const [lines, setLines] = useState([]);
  const [labels, setLabels] = useState([]);
  const [tool, setTool] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedWire, setSelectedWire] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [pendingTerm, setPendingTerm] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!diagramId);
  const [zoom, setZoom] = useState(1);
  const [wireColor, setWireColor] = useState('#ef4444');
  const [removing, setRemoving] = useState(false);

  const [linePreview, setLinePreview] = useState(null);
  const canvasRef = useRef(null);
  const lineDraftRef = useRef(null);

  // Commit a drawn line when the mouse is released
  useEffect(() => {
    const onUp = () => {
      const d = lineDraftRef.current;
      if (!d) return;
      lineDraftRef.current = null;
      setLinePreview(null);
      if (Math.abs(d.x2 - d.x1) > 3 || Math.abs(d.y2 - d.y1) > 3) {
        setLines((ls) => [...ls, { id: uid(), x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2, color: wireColor }]);
      }
    };
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [wireColor]);

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
          setLines(parsed.lines || []);
          setLabels(parsed.labels || []);
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
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      if (dragging.kind === 'label') {
        setLabels((ls) =>
          ls.map((l) => (l.id === dragging.id ? { ...l, x: dragging.origX + dx, y: dragging.origY + dy } : l))
        );
      } else {
        setNodes((ns) =>
          ns.map((n) => (n.id === dragging.id ? { ...n, x: dragging.origX + dx, y: dragging.origY + dy } : n))
        );
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, zoom]);

  // Delete key
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedNode || selectedWire || selectedLine || selectedLabel)) {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'Escape') {
        setPendingTerm(null);
        setSelectedNode(null);
        setSelectedWire(null);
        setSelectedLine(null);
        setSelectedLabel(null);
        setEditingLabel(null);
        setTool(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNode, selectedWire, selectedLine, selectedLabel]);

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  };

  const getTerminalAbs = (nodeId, termId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const comp = componentMap[node.type];
    const term = comp?.terminals.find((t) => t.id === termId);
    if (!term) return null;
    const p = terminalPos(term, comp.width || NODE_W);
    return { x: node.x + p.x, y: node.y + p.y };
  };

  // Wires and free-draw lines are re-routed around parts whenever parts move
  const wireRoutes = useMemo(
    () =>
      wires
        .map((w) => {
          const fromNode = nodes.find((n) => n.id === w.from.node);
          const toNode = nodes.find((n) => n.id === w.to.node);
          const from = fromNode ? getTerminalAbs(w.from.node, w.from.term) : null;
          const to = toNode ? getTerminalAbs(w.to.node, w.to.term) : null;
          if (!from || !to) return null;
          return {
            id: w.id,
            color: w.color,
            from,
            to,
            d: pointsToPath(routeWire(from, fromNode, to, toNode, nodes))
          };
        })
        .filter(Boolean),
    [wires, nodes]
  );

  const lineRoutes = useMemo(
    () =>
      lines.map((l) => ({
        id: l.id,
        color: l.color,
        d: pointsToPath(routeLine({ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }, nodes))
      })),
    [lines, nodes]
  );

  // Auto-connect a newly placed part to the nearest terminal of the closest existing part
  const autoConnect = (newNode) => {
    if (nodes.length === 0) return;
    const newComp = componentMap[newNode.type];
    if (!newComp) return;
    const nw = newComp.width || NODE_W;
    let best = null;
    nodes.forEach((n) => {
      const comp = componentMap[n.type];
      if (!comp) return;
      const cw = comp.width || NODE_W;
      comp.terminals.forEach((t) => {
        const tp = terminalPos(t, cw);
        newComp.terminals.forEach((nt) => {
          const np = terminalPos(nt, nw);
          const d = Math.hypot(n.x + tp.x - (newNode.x + np.x), n.y + tp.y - (newNode.y + np.y));
          if (!best || d < best.d) {
            best = { d, from: { node: n.id, term: t.id }, to: { node: newNode.id, term: nt.id } };
          }
        });
      });
    });
    if (best) {
      setWires((ws) => [...ws, { id: uid(), from: best.from, to: best.to, color: wireColor }]);
    }
  };

  const onCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      if (tool === 'text') {
        const pos = getCanvasPos(e);
        const nl = { id: uid(), x: pos.x, y: pos.y, text: '' };
        setLabels((ls) => [...ls, nl]);
        setEditingLabel(nl.id);
        setSelectedLabel(nl.id);
        setSelectedNode(null);
        setSelectedWire(null);
        setSelectedLine(null);
        return;
      }
      if (tool === 'line') {
        const pos = getCanvasPos(e);
        const d = { x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y };
        lineDraftRef.current = d;
        setLinePreview(d);
        return;
      }
      if (tool) {
        const pos = getCanvasPos(e);
        const newNode = { id: uid(), type: tool, x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 };
        setNodes((ns) => [...ns, newNode]);
        autoConnect(newNode);
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
    if (lineDraftRef.current) {
      const pos = getCanvasPos(e);
      lineDraftRef.current = { ...lineDraftRef.current, x2: pos.x, y2: pos.y };
      setLinePreview(lineDraftRef.current);
    }
  };

  const onNodeBodyMouseDown = (e, node) => {
    e.stopPropagation();
    if (removing) {
      setNodes((ns) => ns.filter((n) => n.id !== node.id));
      setWires((ws) => ws.filter((w) => w.from.node !== node.id && w.to.node !== node.id));
      return;
    }
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
      setWires((ws) => [...ws, { id: uid(), from: pendingTerm, to: { node: nodeId, term: termId }, color: wireColor }]);
    }
    setPendingTerm(null);
  };

  const onWireClick = (e, wireId) => {
    e.stopPropagation();
    if (removing) {
      setWires((ws) => ws.filter((w) => w.id !== wireId));
      return;
    }
    setSelectedWire(wireId);
    setSelectedNode(null);
    setSelectedLine(null);
    setPendingTerm(null);
  };

  const onLineClick = (e, lineId) => {
    e.stopPropagation();
    if (removing) {
      setLines((ls) => ls.filter((l) => l.id !== lineId));
      return;
    }
    setSelectedLine(lineId);
    setSelectedNode(null);
    setSelectedWire(null);
    setPendingTerm(null);
  };

  const onLabelBodyMouseDown = (e, label) => {
    e.stopPropagation();
    if (removing) {
      setLabels((ls) => ls.filter((l) => l.id !== label.id));
      return;
    }
    if (editingLabel) return;
    setSelectedLabel(label.id);
    setSelectedNode(null);
    setSelectedWire(null);
    setSelectedLine(null);
    setPendingTerm(null);
    setDragging({ id: label.id, kind: 'label', startX: e.clientX, startY: e.clientY, origX: label.x, origY: label.y });
  };

  const startLabelEdit = (id) => {
    setEditingLabel(id);
    setSelectedLabel(id);
  };

  const endLabelEdit = () => {
    setEditingLabel(null);
    setLabels((ls) => ls.filter((l) => l.text.trim() !== ''));
  };

  const onLabelTextChange = (id, text) => {
    setLabels((ls) => ls.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((ns) => ns.filter((n) => n.id !== selectedNode));
      setWires((ws) => ws.filter((w) => w.from.node !== selectedNode && w.to.node !== selectedNode));
      setSelectedNode(null);
    } else if (selectedWire) {
      setWires((ws) => ws.filter((w) => w.id !== selectedWire));
      setSelectedWire(null);
    } else if (selectedLine) {
      setLines((ls) => ls.filter((l) => l.id !== selectedLine));
      setSelectedLine(null);
    } else if (selectedLabel) {
      setLabels((ls) => ls.filter((l) => l.id !== selectedLabel));
      setSelectedLabel(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = JSON.stringify({ nodes, wires, lines, labels });
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

  const handleSaveAsTemplate = async () => {
    setSaving(true);
    try {
      const data = JSON.stringify({ nodes, wires, lines, labels });
      await base44.entities.WiringDiagram.create({
        title: (title.trim() || 'Untitled diagram') + ' (Template)',
        category,
        diagram_data: data,
        is_template: true
      });
      toast({ title: 'Saved as template' });
    } catch (err) {
      toast({ title: 'Template save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const hasSelection = !!(selectedNode || selectedWire || selectedLine || selectedLabel);

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
        onSaveAsTemplate={handleSaveAsTemplate}
        onDeleteSelected={deleteSelected}
        hasSelection={hasSelection}
        saving={saving}
        canvasRef={canvasRef}
        nodes={nodes}
        lines={lines}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ComponentPalette tool={tool} setTool={setTool} wireColor={wireColor} setWireColor={setWireColor} removing={removing} setRemoving={setRemoving} />

        <div className="relative flex-1 overflow-auto">
          {/* hint bar */}
          <div className="pointer-events-none sticky top-0 z-20 flex justify-center">
            <div className="pointer-events-auto mt-2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-white shadow">
              {pendingTerm
                ? 'Click another terminal to connect — Esc to cancel'
                : removing
                ? 'Remove mode — click a part or wire to delete it. Click "Remove Parts" again to exit.'
                : tool === 'line'
                ? 'Draw a line — drag on the canvas; lines route around parts automatically. Pick the color below the palette.'
                : tool === 'text'
                ? 'Click the canvas to add a text label. Double-click a label to edit it later.'
                : tool
                ? `Placing ${componentMap[tool]?.label} — click the canvas`
                : 'Click a part in the palette, then click the canvas. Drag parts to move. Click terminals to wire.'}
            </div>
          </div>

          <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}>
          <div
            ref={canvasRef}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            className={cn('relative', tool && 'cursor-crosshair')}
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              backgroundImage:
                'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <svg className="absolute inset-0" width={CANVAS_W} height={CANVAS_H} style={{ overflow: 'visible' }}>
              <defs>
                <pattern id="wire-earth" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                  <rect width="8" height="8" fill="#16a34a" />
                  <rect width="4" height="8" fill="#facc15" />
                </pattern>
              </defs>
              <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="transparent" />
              {wireRoutes.map((r) => (
                <Wire
                  key={r.id}
                  d={r.d}
                  from={r.from}
                  to={r.to}
                  selected={selectedWire === r.id}
                  color={r.color}
                  onClick={(e) => onWireClick(e, r.id)}
                />
              ))}
              {lineRoutes.map((r) => (
                <g key={r.id} className="cursor-pointer" onClick={(e) => onLineClick(e, r.id)}>
                  <path d={r.d} stroke="transparent" strokeWidth={12} fill="none" />
                  <path
                    d={r.d}
                    stroke={r.color === 'earth' ? 'url(#wire-earth)' : r.color}
                    strokeWidth={selectedLine === r.id ? 4 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              ))}
              {linePreview && (
                <path
                  d={pointsToPath(routeLine({ x: linePreview.x1, y: linePreview.y1 }, { x: linePreview.x2, y: linePreview.y2 }, nodes))}
                  stroke={wireColor === 'earth' ? 'url(#wire-earth)' : wireColor}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {pendingTerm &&
                (() => {
                  const from = getTerminalAbs(pendingTerm.node, pendingTerm.term);
                  if (!from) return null;
                  return (
                    <path
                      d={`M ${from.x} ${from.y} L ${mousePos.x} ${mousePos.y}`}
                      fill="none"
                      stroke={wireColor === 'earth' ? 'url(#wire-earth)' : wireColor}
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
                removing={removing}
                onBodyMouseDown={(e) => onNodeBodyMouseDown(e, node)}
                onTerminalClick={onTerminalClick}
              />
            ))}

            {labels.map((label) => (
              <TextLabel
                key={label.id}
                label={label}
                selected={selectedLabel === label.id}
                editing={editingLabel === label.id}
                removing={removing}
                onBodyMouseDown={onLabelBodyMouseDown}
                onEdit={startLabelEdit}
                onEndEdit={endLabelEdit}
                onTextChange={onLabelTextChange}
              />
            ))}
          </div>
          </div>
        </div>
        <ZoomControls zoom={zoom} setZoom={setZoom} />
      </div>
    </div>
  );
}