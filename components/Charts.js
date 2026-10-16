import React, { useRef, useState } from 'react';
import './Charts.css';

/* Lightweight SVG charts - no extra npm packages needed. */

export const COLORS = {
  orange: '#F58634',
  navy: '#272E4B',
  lightOrange: '#FBC48F',
  slate: '#6B7599',
  mist: '#CBD1E6',
};
const PALETTE = [COLORS.orange, COLORS.navy, COLORS.lightOrange, COLORS.slate, COLORS.mist, '#E2A16B'];

// Round the top of an axis up to a "nice" number (4, 8, 10, 20, 50...)
const niceMax = (v) => {
  if (v <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
};

/* ---------------------------------------------------------------
   LineAreaChart - one or more series over time
   data:   [{ date:'2026-10-01', views: 10, visitors: 7 }, ...]
   series: [{ key:'views', label:'Page views', color:'#F58634' }]
---------------------------------------------------------------- */
export const LineAreaChart = ({ data = [], series = [], xKey = 'date', formatX = (v) => v, formatTip, height = 260 }) => {
  const W = 700, H = height;
  const pad = { l: 38, r: 14, t: 14, b: 28 };
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null);

  const n = data.length;
  const rawMax = Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const max = niceMax(rawMax);
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const x = (i) => pad.l + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v) => pad.t + innerH * (1 - v / max);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.max(1, Math.ceil(n / 7));

  const onMove = (e) => {
    const box = wrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - pad.l) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  if (!n) return <div className="chart-empty">No data yet</div>;

  const hd = hover != null ? data[hover] : null;

  return (
    <div className="chart-wrap" ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img">
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="chart-grid" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="chart-axis">{t}</text>
          </g>
        ))}

        {data.map((d, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="chart-axis">{formatX(d[xKey])}</text>
          ) : null
        )}

        {series.map((s, si) => {
          const pts = data.map((d, i) => `${x(i)},${y(d[s.key] || 0)}`);
          const area = `M ${x(0)},${y(0)} L ${pts.join(' L ')} L ${x(n - 1)},${y(0)} Z`;
          return (
            <g key={s.key}>
              {si === 0 && <path d={area} fill={`url(#grad-${s.key})`} />}
              <polyline points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {n <= 31 && data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d[s.key] || 0)} r="3" fill="#fff" stroke={s.color} strokeWidth="2" />)}
            </g>
          );
        })}

        {hd && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="chart-cursor" />
            {series.map((s) => <circle key={s.key} cx={x(hover)} cy={y(hd[s.key] || 0)} r="5" fill={s.color} stroke="#fff" strokeWidth="2" />)}
          </g>
        )}
      </svg>

      {hd && (
        <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > n / 2 ? 'translateX(-105%)' : 'translateX(5%)' }}>
          <strong>{formatTip ? formatTip(hd[xKey]) : formatX(hd[xKey])}</strong>
          {series.map((s) => (
            <div key={s.key}><i style={{ background: s.color }} />{s.label}: <b>{hd[s.key] || 0}</b></div>
          ))}
        </div>
      )}

      <div className="chart-legend">
        {series.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   BarChart - vertical bars (used for "visits by hour of the day")
   data: [{ hour: 0, views: 3 }, ...]
---------------------------------------------------------------- */
export const BarChart = ({ data = [], xKey, yKey, label = 'Visits', formatX = (v) => v, color = COLORS.orange, highlight, height = 220, width = 700 }) => {
  const W = width, H = height;
  const pad = { l: 38, r: 10, t: 14, b: 28 };
  const [hover, setHover] = useState(null);
  const n = data.length;
  const max = niceMax(Math.max(1, ...data.map((d) => d[yKey] || 0)));
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const slot = innerW / Math.max(n, 1);
  const bw = Math.max(4, slot * 0.62);
  const y = (v) => pad.t + innerH * (1 - v / max);
  const labelEvery = n > 12 ? 3 : 1;

  if (!n) return <div className="chart-empty">No data yet</div>;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img">
        {[0, 0.5, 1].map((f) => {
          const t = Math.round(max * f);
          return (
            <g key={f}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="chart-grid" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="chart-axis">{t}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const v = d[yKey] || 0;
          const bx = pad.l + i * slot + (slot - bw) / 2;
          const isNow = highlight != null && d[xKey] === highlight;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={innerH} fill="transparent" />
              <rect x={bx} y={y(v)} width={bw} height={Math.max(v ? 2 : 0, innerH - (y(v) - pad.t))} rx="3"
                fill={isNow ? COLORS.navy : color} opacity={hover === null || hover === i ? 1 : 0.55} />
              {i % labelEvery === 0 && <text x={bx + bw / 2} y={H - 8} textAnchor="middle" className="chart-axis">{formatX(d[xKey])}</text>}
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <div className="chart-tip" style={{ left: `${((pad.l + hover * slot + slot / 2) / W) * 100}%`, transform: 'translateX(-50%)', top: 0 }}>
          <strong>{formatX(data[hover][xKey])}</strong>
          <div><i style={{ background: color }} />{label}: <b>{data[hover][yKey] || 0}</b></div>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   HBarList - ranked horizontal bars (top pages, countries, sources)
   items: [{ name:'/about', views: 20 }, ...]
---------------------------------------------------------------- */
export const HBarList = ({ items = [], valueKey = 'views', color = COLORS.orange, formatName = (v) => v, suffix = '' }) => {
  if (!items.length) return <div className="chart-empty">No data yet</div>;
  const max = Math.max(1, ...items.map((i) => i[valueKey] || 0));
  return (
    <ul className="hbar-list">
      {items.map((it, i) => (
        <li key={`${it.name}-${i}`}>
          <div className="hbar-row">
            <span className="hbar-name" title={String(formatName(it.name))}>{formatName(it.name)}</span>
            <span className="hbar-val">{it[valueKey] || 0}{suffix}</span>
          </div>
          <div className="hbar-track"><div className="hbar-fill" style={{ width: `${((it[valueKey] || 0) / max) * 100}%`, background: color }} /></div>
        </li>
      ))}
    </ul>
  );
};

/* ---------------------------------------------------------------
   Donut - share of a total (devices, new vs returning)
   items: [{ name:'Mobile', value: 12 }, ...]
---------------------------------------------------------------- */
export const Donut = ({ items = [], centerLabel = 'Total' }) => {
  const total = items.reduce((a, i) => a + (i.value || 0), 0);
  if (!total) return <div className="chart-empty">No data yet</div>;
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 140 140" className="donut-svg" role="img">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {items.map((it, i) => {
          const len = (it.value / total) * C;
          const el = (
            <circle key={it.name} cx="70" cy="70" r={R} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="18"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="68" textAnchor="middle" className="donut-total">{total}</text>
        <text x="70" y="84" textAnchor="middle" className="donut-sub">{centerLabel}</text>
      </svg>
      <ul className="donut-legend">
        {items.map((it, i) => (
          <li key={it.name}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />
            <span>{it.name}</span>
            <b>{Math.round((it.value / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
};
