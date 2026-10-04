import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { componentMap, terminalPos, NODE_W, NODE_H } from '@/components/diagram/componentLibrary';
import { routeWire, pointsToPath, occupyPath } from '@/components/diagram/wireRouter';
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
  const [selectedNodes, setSelectedNodes] = useState(new Set());
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

  const canvasRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = (newNodes, newWires, newLines, newLabels) => {
    const newState = JSON.stringify({ nodes: newNodes, wires: newWires, lines: newLines, labels: newLabels });
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = JSON.parse(history[newIndex]);
      setNodes(state.nodes);
      setWires(state.wires);
      setLabels(state.labels);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = JSON.parse(history[newIndex]);
      setNodes(state.nodes);
      setWires(state.wires);
      setLabels(state.labels);
      setHistoryIndex(newIndex);
    }
  };

  useEffect(() => {
    if (!diagramId) {
      saveToHistory([], [], [], []);
      return;
    }
    setLoading(true);
    base44.entities.WiringDiagram.get(diagramId)
      .then((d) => {
        setTitle(d.title || 'Untitled diagram');
        setCategory(d.category || 'hvac');
        try {
          const parsed = JSON.parse(d.diagram_data || '{"nodes":[],"wires":[],"lines":[]}');
          setNodes(parsed.nodes || []);
          setWires(parsed.wires || []);
          setLines(parsed.lines || []);
          setLabels(parsed.labels || []);
          saveToHistory(parsed.nodes || [], parsed.wires || [], parsed.lines || [], parsed.labels || []);
        } catch {
          setNodes([]);
          setWires([]);
          setLines([]);
          saveToHistory([], [], [], []);
        }
      })
      .finally(() => setLoading(false));
  }, [diagramId]);

  // Dragging a node or label or line
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      if (dragging.kind === 'label') {
        setLabels((ls) =>
          ls.map((l) => (l.id === dragging.id ? { ...l, x: dragging.origX + dx, y: dragging.origY + dy } : l))
        );
      } else if (dragging.kind === 'line') {
        setLines((ls) =>
          ls.map((l) =>
            l.id === dragging.id
              ? { ...l, x1: dragging.origX1 + dx, y1: dragging.origY1 + dy, x2: dragging.origX2 + dx, y2: dragging.origY2 + dy }
              : l
          )
        );
      } else if (dragging.type === 'nodes') {
        setNodes((ns) =>
          ns.map((n) => {
            if (!dragging.ids.includes(n.id)) return n;
            const orig = dragging.origPositions[n.id];
            if (!orig) return n;
            return { ...n, x: orig.x + dx, y: orig.y + dy };
          })
        );
      }
    };
    const onUp = () => {
      setDragging(null);
      saveToHistory(nodes, wires, lines, labels);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, zoom, nodes, wires, lines, labels]);

  // Undo/Redo & Delete key
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.key === 'y' || e.key === 'Y') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedNodes.size > 0 || selectedWire || selectedLine || selectedLabel)) {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'Escape') {
        setPendingTerm(null);
        setSelectedNodes(new Set());
        setSelectedWire(null);
        setSelectedLine(null);
        setSelectedLabel(null);
        setEditingLabel(null);
        setTool(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNodes, selectedWire, selectedLine, selectedLabel, history, historyIndex]);

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

  // Wires and free-draw lines are re-routed around parts whenever parts move.
  // Each routed path claims its cells so the next one keeps its own space.
  const { wireRoutes } = useMemo(() => {
    const occupied = new Set();
    const wireRoutes = wires
      .map((w) => {
        const fromNode = nodes.find((n) => n.id === w.from.node);
        const toNode = nodes.find((n) => n.id === w.to.node);
        const from = fromNode ? getTerminalAbs(w.from.node, w.from.term) : null;
        const to = toNode ? getTerminalAbs(w.to.node, w.to.term) : null;
        if (!from || !to) return null;
        const pts = routeWire(from, fromNode, to, toNode, nodes, occupied);
        occupyPath(pts, occupied);
        return { id: w.id, color: w.color, from, to, d: pointsToPath(pts) };
      })
      .filter(Boolean);
    return { wireRoutes };
  }, [wires, nodes]);

  // Auto-connect a newly placed part to the nearest terminal of the closest existing part
  const autoConnect = (newNode, currentNodes, currentWires) => {
    if (currentNodes.length === 0) return { nodes: [...currentNodes, newNode], wires: currentWires };
    const newComp = componentMap[newNode.type];
    if (!newComp) return { nodes: [...currentNodes, newNode], wires: currentWires };
    const nw = newComp.width || NODE_W;
    let best = null;
    currentNodes.forEach((n) => {
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
      const newWire = { id: uid(), from: best.from, to: best.to, color: wireColor };
      return { nodes: [...currentNodes, newNode], wires: [...currentWires, newWire] };
    }
    return { nodes: [...currentNodes, newNode], wires: currentWires };
  };

  const onCanvasMouseDown = (e) => {
    if (!canvasRef.current.contains(e.target)) return;
    if (tool === 'text') {
      const pos = getCanvasPos(e);
      const nl = { id: uid(), x: pos.x, y: pos.y, text: 'Label' };
      const nextLabels = [...labels, nl];
      setLabels(nextLabels);
      setEditingLabel(nl.id);
      setSelectedLabel(nl.id);
      setSelectedNodes(new Set());
      setSelectedWire(null);
      setSelectedLine(null);
      saveToHistory(nodes, wires, lines, nextLabels);
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
      const result = autoConnect(newNode, nodes, wires);
      setNodes(result.nodes);
      setWires(result.wires);
      setSelectedNodes(new Set([newNode.id]));
      setSelectedWire(null);
      saveToHistory(result.nodes, result.wires, lines, labels);
    } else {
      setSelectedNodes(new Set());
      setSelectedWire(null);
      setPendingTerm(null);
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

    let newSelection = new Set(selectedNodes);

    if (e.shiftKey) {
      if (newSelection.has(node.id)) newSelection.delete(node.id);
      else newSelection.add(node.id);
    } else {
      if (!newSelection.has(node.id)) {
        newSelection = new Set([node.id]);
      }
    }
    setSelectedNodes(newSelection);

    setSelectedWire(null);
    setDragging({
      type: 'nodes',
      ids: Array.from(newSelection),
      startX: e.clientX,
      startY: e.clientY,
      origPositions: nodes.reduce((acc, n) => {
        if (newSelection.has(n.id)) {
          acc[n.id] = { x: n.x, y: n.y };
        }
        return acc;
      }, {})
    });
  };

  const onTerminalClick = (nodeId, termId) => {
    if (!pendingTerm) {
      setPendingTerm({ node: nodeId, term: termId });
      setSelectedNodes(new Set());
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
    setSelectedNodes(new Set());
    setSelectedLine(null);
    setPendingTerm(null);
  };

  const onLineClick = (e, lineId) => {
    e.stopPropagation();
    if (removing) {
      setLines((ls) => ls.filter((l) => l.id !== lineId));
      return;
    }
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;

    setSelectedLine(lineId);
    setSelectedNodes(new Set());
    setSelectedWire(null);
    setPendingTerm(null);

    setDragging({
      id: lineId,
      kind: 'line',
      startX: e.clientX,
      startY: e.clientY,
      origX1: line.x1,
      origY1: line.y1,
      origX2: line.x2,
      origY2: line.y2
    });
  };

  const onLabelBodyMouseDown = (e, label) => {
    e.stopPropagation();
    if (removing) {
      setLabels((ls) => ls.filter((l) => l.id !== label.id));
      return;
    }
    if (editingLabel) return;
    setSelectedLabel(label.id);
    setSelectedNodes(new Set());
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
    const nextLabels = labels.map((l) => (l.id === editingLabel && !l.text.trim() ? { ...l, text: 'Label' } : l)).filter((l) => l.text.trim() !== '');
    setLabels(nextLabels);
    saveToHistory(nodes, wires, lines, nextLabels);
  };

  const onLabelTextChange = (id, text) => {
    setLabels((ls) => ls.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const deleteSelected = () => {
    let nextNodes = nodes;
    let nextWires = wires;
    let nextLines = lines;
    let nextLabels = labels;
    
    if (selectedNodes.size > 0) {
      nextNodes = nodes.filter((n) => !selectedNodes.has(n.id));
      nextWires = wires.filter((w) => !selectedNodes.has(w.from.node) && !selectedNodes.has(w.to.node));
      setNodes(nextNodes);
      setWires(nextWires);
      setSelectedNodes(new Set());
    } else if (selectedWire) {
      nextWires = wires.filter((w) => w.id !== selectedWire);
      setWires(nextWires);
      setSelectedWire(null);
    } else if (selectedLine) {
      nextLines = lines.filter((l) => l.id !== selectedLine);
      setLines(nextLines);
      setSelectedLine(null);
    } else if (selectedLabel) {
      nextLabels = labels.filter((l) => l.id !== selectedLabel);
      setLabels(nextLabels);
      setSelectedLabel(null);
    }
    
    saveToHistory(nextNodes, nextWires, nextLines, nextLabels);
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

  const hasSelection = !!(selectedNodes.size > 0 || selectedWire || selectedLine || selectedLabel);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
    </div>
  );

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
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
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
              <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="none" pointerEvents="all" />
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
                selected={selectedNodes.has(node.id)}
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