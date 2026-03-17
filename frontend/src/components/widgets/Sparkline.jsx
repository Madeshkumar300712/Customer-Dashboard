export default function Sparkline({ data = [], color = "#00d4aa", height = 40, width = 120 }) {
  if (!data.length || data.every(v => v === 0)) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2}
          stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      </svg>
    );
  }

  const min  = Math.min(...data);
  const max  = Math.max(...data);
  const range = max - min || 1;
  const pad  = 4;
  const w    = width  / (data.length - 1 || 1);
  const h    = height - pad * 2;

  const points = data.map((v, i) => ({
    x: i * w,
    y: pad + h - ((v - min) / range) * h,
  }));

  // Smooth bezier path
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx  = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
  }

  // Area fill
  const areaD = `${d} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

  const id = `spark-${Math.random().toString(36).slice(2)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d={areaD} fill={`url(#${id})`} />
      {/* Line */}
      <path
        className="sparkline-path"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={color}
      />
    </svg>
  );
}