// Routes wires and free-draw lines around parts using A* pathfinding on a grid.
import { componentMap, NODE_W, NODE_H } from './componentLibrary';

const GRID = 12; // grid cell size in px
const PAD = 12; // clearance kept around every part
const LEAD = 28; // straight stub leaving a terminal before routing starts
const REGION = 6; // grid cells of search margin around the endpoints
const TURN = 3; // extra cost per direction change (keeps runs straight)
const AVOID = 5; // extra cost for cells already used by another path

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];

// Padded bounding rects of every part — paths must stay out of these
export function buildObstacles(nodes) {
  return nodes
    .filter((n) => componentMap[n.type])
    .map((n) => {
      const w = componentMap[n.type].width || NODE_W;
      return { x0: n.x - PAD, y0: n.y - PAD, x1: n.x + w + PAD, y1: n.y + NODE_H + PAD };
    });
}

// Point straight out from a terminal, clear of the part's padded rect
function stub(p, node) {
  if (!node) return p;
  const w = componentMap[node.type].width || NODE_W;
  if (Math.abs(p.y - node.y) < 0.5) return { x: p.x, y: p.y - LEAD };
  if (Math.abs(p.y - (node.y + NODE_H)) < 0.5) return { x: p.x, y: p.y + LEAD };
  if (Math.abs(p.x - node.x) < 0.5) return { x: p.x - LEAD, y: p.y };
  if (Math.abs(p.x - (node.x + w)) < 0.5) return { x: p.x + LEAD, y: p.y };
  return p;
}

class MinHeap {
  constructor() {
    this.a = [];
  }
  get size() {
    return this.a.length;
  }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= a[i].f) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l].f < a[m].f) m = l;
        if (r < a.length && a[r].f < a[m].f) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

function astar(A, B, minX, minY, W, H, blocked, penalty) {
  const total = W * H * 4;
  const g = new Float64Array(total).fill(Infinity);
  const parent = new Int32Array(total).fill(-1);
  const closed = new Uint8Array(total);
  const idx = (x, y, d) => ((y - minY) * W + (x - minX)) * 4 + d;
  const h = (x, y) => Math.abs(x - B.x) + Math.abs(y - B.y);

  const heap = new MinHeap();
  for (let d = 0; d < 4; d++) {
    const k = idx(A.x, A.y, d);
    g[k] = 0;
    heap.push({ f: h(A.x, A.y), k, x: A.x, y: A.y, d });
  }

  let goalKey = -1;
  while (heap.size) {
    const cur = heap.pop();
    if (closed[cur.k]) continue;
    closed[cur.k] = 1;
    if (cur.x === B.x && cur.y === B.y) {
      goalKey = cur.k;
      break;
    }
    for (let nd = 0; nd < 4; nd++) {
      const nx = cur.x + DIRS[nd][0];
      const ny = cur.y + DIRS[nd][1];
      if (nx < minX || nx > minX + W - 1 || ny < minY || ny > minY + H - 1) continue;
      const nk = idx(nx, ny, nd);
      if (closed[nk]) continue;
      // endpoints themselves are always allowed (line may start/end on a part)
      const isEndpoint = (nx === A.x && ny === A.y) || (nx === B.x && ny === B.y);
      if (blocked[(ny - minY) * W + (nx - minX)] && !isEndpoint) continue;
      const step = 1 + (nd !== cur.d ? TURN : 0) + penalty[(ny - minY) * W + (nx - minX)];
      const ng = g[cur.k] + step;
      if (ng < g[nk]) {
        g[nk] = ng;
        parent[nk] = cur.k;
        heap.push({ f: ng + h(nx, ny), k: nk, x: nx, y: ny, d: nd });
      }
    }
  }

  if (goalKey === -1) return null;
  const cells = [];
  let k = goalKey;
  while (k !== -1) {
    const base = k >> 2;
    cells.push({ x: minX + (base % W), y: minY + Math.floor(base / W) });
    k = parent[k];
  }
  return cells.reverse();
}

// Drop points that sit on a straight run
function simplify(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = out[out.length - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const cross = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
    if (Math.abs(cross) > 0.5) out.push(p1);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function findRoute(a, b, obstacles, occupied) {
  const A = { x: Math.round(a.x / GRID), y: Math.round(a.y / GRID) };
  const B = { x: Math.round(b.x / GRID), y: Math.round(b.y / GRID) };
  const minX = Math.min(A.x, B.x) - REGION;
  const maxX = Math.max(A.x, B.x) + REGION;
  const minY = Math.min(A.y, B.y) - REGION;
  const maxY = Math.max(A.y, B.y) + REGION;
  const W = maxX - minX + 1;
  const H = maxY - minY + 1;

  const blocked = new Uint8Array(W * H);
  for (let gy = 0; gy < H; gy++) {
    for (let gx = 0; gx < W; gx++) {
      const x = (minX + gx) * GRID;
      const y = (minY + gy) * GRID;
      for (const o of obstacles) {
        if (x > o.x0 && x < o.x1 && y > o.y0 && y < o.y1) {
          blocked[gy * W + gx] = 1;
          break;
        }
      }
    }
  }

  // cells taken by already-routed paths are expensive so each path keeps its own space
  const penalty = new Float32Array(W * H);
  if (occupied && occupied.size) {
    for (let gy = 0; gy < H; gy++) {
      for (let gx = 0; gx < W; gx++) {
        if (occupied.has(`${minX + gx},${minY + gy}`)) penalty[gy * W + gx] = AVOID;
      }
    }
  }

  const cells = astar(A, B, minX, minY, W, H, blocked, penalty);
  if (!cells) return [a, b]; // no way around — fall back to a direct line
  const pts = cells.map((c) => ({ x: c.x * GRID, y: c.y * GRID }));
  pts[0] = { x: a.x, y: a.y };
  pts[pts.length - 1] = { x: b.x, y: b.y };
  return simplify(pts);
}

// Route a terminal-to-terminal wire: stub out of each terminal, pathfind between
export function routeWire(from, fromNode, to, toNode, nodes, occupied) {
  const obstacles = buildObstacles(nodes);
  const s = stub(from, fromNode);
  const e = stub(to, toNode);
  const mid = findRoute(s, e, obstacles, occupied);
  return simplify([from, ...mid, to]);
}

// Route a free-draw line between two arbitrary points
export function routeLine(a, b, nodes, occupied) {
  const obstacles = buildObstacles(nodes);
  return findRoute(a, b, obstacles, occupied);
}

// Mark a routed path's cells so later paths keep their own space
export function occupyPath(pts, occupied) {
  pts.forEach((p, i) => {
    if (i === 0 || i === pts.length - 1) return;
    occupied.add(`${Math.round(p.x / GRID)},${Math.round(p.y / GRID)}`);
  });
}

export function pointsToPath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}