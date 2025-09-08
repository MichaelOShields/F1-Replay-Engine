type Pt = { x: number; y: number };

export function fitPointsToViewport(
  pts: Pt[],
  width: number,
  height: number,
  padding = 20
) {
  if (pts.length === 0) return { points: [], scale: 1, tx: 0, ty: 0 };

  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
  for (const p of pts) {
    if (p.x < xmin) xmin = p.x;
    if (p.x > xmax) xmax = p.x;
    if (p.y < ymin) ymin = p.y;
    if (p.y > ymax) ymax = p.y;
  }

  const dx = Math.max(xmax - xmin, 1e-9);
  const dy = Math.max(ymax - ymin, 1e-9);

  const s = Math.min((width - 2 * padding) / dx, (height - 2 * padding) / dy);

  // center with padding; flip Y by using ymax
  const tx = padding + (width - 2 * padding - s * dx) / 2 - s * xmin;
  const ty = padding + (height - 2 * padding - s * dy) / 2 + s * ymax;

  const out = pts.map(p => ({
    X: s * p.x + tx,
    Y: -s * p.y + ty
  }));

  return { points: out, scale: s, tx, ty, bbox: { xmin, xmax, ymin, ymax } };
}