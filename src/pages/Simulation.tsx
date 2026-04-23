import React, { useState, useMemo } from "react";

const T = {
  bg: "#F7F8FC", surface: "#FFFFFF", border: "#E5E7EF", borderMid: "#C8CCE0",
  primary: "#4F63E7", primaryLight: "#EEF1FD", primaryHover: "#3A4FC8",
  teal: "#3CC9A0", tealLight: "#E1F5EE", tealDark: "#0F6E56",
  amber: "#EF9F27", amberLight: "#FAEEDA", amberDark: "#BA7517",
  purple: "#9B7EF8", purpleLight: "#F0ECFE",
  textPrimary: "#1C1E2E", textSecondary: "#7A7D94", textMuted: "#A8ABBA",
  danger: "#E05252", dangerLight: "#FEF0F0",
  success: "#10B981", successLight: "#ECFDF5",
  radius: "12px", radiusSm: "8px",
};

function fmt(n: number): string {
  if (Math.abs(n) >= 10000) return (n / 10000).toFixed(1) + "億";
  return Math.round(n).toLocaleString("ja-JP");
}
function fmtSign(n: number): string { return (n >= 0 ? "+" : "") + fmt(n); }

function calcForecast(assetP: number, assetB: number, rateA: number, rateG: number, monthly: number, years: number): number {
  const p = assetP * Math.pow(1 + rateA, years);
  const b = assetB * Math.pow(1 + rateG, years);
  const m = rateA > 0 ? monthly * 12 * (Math.pow(1 + rateA, years) - 1) / rateA : monthly * 12 * years;
  return Math.round(p + b + m);
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

  .sim { font-family: 'Noto Sans JP', sans-serif; color: ${T.textPrimary}; }

  /* ── Layout ── */
  .sim-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 18px;
    align-items: start;
  }
  .sim-left  { display: flex; flex-direction: column; gap: 10px; }
  .sim-right { display: flex; flex-direction: column; gap: 14px; }

  /* ── Panel ── */
  .sim-panel {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    overflow: hidden;
  }
  .sim-panel-hdr {
    padding: 11px 16px;
    border-bottom: 1px solid ${T.border};
    font-size: 12.5px; font-weight: 600; color: ${T.textPrimary};
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    background: ${T.bg};
  }
  .sim-panel-body { padding: 16px; }

  /* ── Left controls ── */
  .sim-ctrl-title {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    color: ${T.textMuted}; margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .sim-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* slider block */
  .sim-sb { margin-bottom: 14px; }
  .sim-sb:last-child { margin-bottom: 0; }
  .sim-sb-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 5px;
  }
  .sim-sb-label { font-size: 12px; color: ${T.textSecondary}; line-height: 1.3; }
  .sim-sb-val {
    font-size: 14px; font-weight: 700; letter-spacing: -0.3px;
    min-width: 52px; text-align: right; flex-shrink: 0;
  }
  .sim-sb-hint { font-size: 10.5px; color: ${T.textMuted}; margin-top: 3px; line-height: 1.4; }

  input[type=range].sim-slider {
    width: 100%; height: 4px; cursor: pointer;
    appearance: none; border-radius: 2px;
    outline: none; background: ${T.border};
  }
  input[type=range].sim-slider::-webkit-slider-thumb {
    appearance: none; width: 16px; height: 16px;
    border-radius: 50%; cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }

  /* alloc bar */
  .sim-alloc-track { height: 8px; border-radius: 4px; overflow: hidden; display: flex; margin: 8px 0 4px; }
  .sim-alloc-p { background: ${T.teal};    transition: width 0.2s; }
  .sim-alloc-b { background: ${T.primary}; transition: width 0.2s; }
  .sim-alloc-legs {
    display: flex; justify-content: space-between;
    font-size: 10.5px; color: ${T.textMuted};
  }

  /* goal badge */
  .sim-goal { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; margin-top: 8px; }
  .sim-goal.ok      { background: ${T.successLight}; color: ${T.success}; }
  .sim-goal.missing { background: ${T.dangerLight};  color: ${T.danger}; }

  /* ── Right: highlight box ── */
  .sim-hl {
    background: linear-gradient(120deg, #3A4FC8 0%, #4F63E7 55%, #6B7FF5 100%);
    border-radius: ${T.radius};
    padding: 18px 22px;
    display: flex; align-items: center; justify-content: space-between;
    color: white;
  }
  .sim-hl-label  { font-size: 11.5px; opacity: 0.85; margin-bottom: 3px; }
  .sim-hl-value  { font-size: 36px; font-weight: 700; letter-spacing: -2px; line-height: 1; }
  .sim-hl-unit   { font-size: 15px; font-weight: 400; margin-left: 4px; opacity: 0.8; }
  .sim-hl-sub    { font-size: 11px; opacity: 0.7; margin-top: 5px; }
  .sim-hl-right  { text-align: right; }
  .sim-hl-rl     { font-size: 11px; opacity: 0.75; margin-bottom: 3px; }
  .sim-hl-rv     { font-size: 22px; font-weight: 700; letter-spacing: -0.8px; color: #A8F5D8; }

  /* ── Right: avg cards ── */
  .sim-avg-row  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
  .sim-avg-item { text-align: center; padding: 14px 10px; border-right: 1px solid ${T.border}; }
  .sim-avg-item:last-child { border-right: none; }
  .sim-avg-lbl  { font-size: 10.5px; color: ${T.textMuted}; margin-bottom: 4px; }
  .sim-avg-val  { font-size: 22px; font-weight: 700; letter-spacing: -0.8px; line-height: 1; }
  .sim-avg-unit { font-size: 11px; font-weight: 400; margin-left: 2px; color: ${T.textSecondary}; }
  .sim-avg-mult { font-size: 11px; color: ${T.textSecondary}; margin-top: 3px; }

  /* progress */
  .sim-prog-wrap  { padding: 10px 16px 12px; border-top: 1px solid ${T.border}; background: ${T.bg}; }
  .sim-prog-meta  { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px; }
  .sim-prog-track { height: 6px; background: ${T.border}; border-radius: 3px; overflow: hidden; }
  .sim-prog-fill  { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* ── Chart ── */
  .sim-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; }
  .sim-li { display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: ${T.textSecondary}; }

  /* ── Oneshot cards ── */
  .sim-oc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
  .sim-oc { border-radius: ${T.radiusSm}; padding: 14px; }
  .sim-oc.ok   { background: ${T.tealLight};   border: 1px solid #9FE1CB; }
  .sim-oc.fail { background: ${T.dangerLight}; border: 1px solid #F7C1C1; }
  .sim-oc-type { font-size: 11px; font-weight: 600; margin-bottom: 4px; }
  .sim-oc.ok   .sim-oc-type { color: ${T.tealDark}; }
  .sim-oc.fail .sim-oc-type { color: ${T.danger}; }
  .sim-oc-val  { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .sim-oc.ok   .sim-oc-val { color: ${T.teal}; }
  .sim-oc.fail .sim-oc-val { color: ${T.danger}; }
  .sim-oc-sub  { font-size: 11px; color: ${T.textMuted}; margin-top: 3px; }

  /* ── Scenario cards ── */
  .sim-sc-row  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .sim-sc-card {
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    padding: 13px; position: relative; overflow: hidden;
  }
  .sim-sc-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .sim-sc-card.low ::before { background: ${T.teal}; }
  .sim-sc-card.mid ::before { background: ${T.primary}; }
  .sim-sc-card.high::before { background: ${T.amber}; }
  .sim-sc-card.mid { border-color: ${T.primary}; background: ${T.primaryLight}; }
  .sim-sc-type  { font-size: 10.5px; font-weight: 600; color: ${T.textMuted}; margin-bottom: 3px; }
  .sim-sc-val   { font-size: 19px; font-weight: 700; letter-spacing: -0.5px; }
  .sim-sc-mult  { font-size: 10.5px; color: ${T.textSecondary}; margin-top: 2px; }
  .sim-sc-det   { margin-top: 8px; padding-top: 8px; border-top: 1px solid ${T.border}; }
  .sim-sc-row2  { display: flex; justify-content: space-between; font-size: 10.5px; margin-top: 2px; }
  .sim-sc-k     { color: ${T.textMuted}; }
  .sim-sc-v     { font-weight: 500; }
  .sim-badge    { display: inline-block; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 20px; margin-top: 7px; }
  .sim-badge.ok      { background: ${T.successLight}; color: ${T.success}; }
  .sim-badge.missing { background: ${T.dangerLight};  color: ${T.danger}; }

  /* ── Save btn ── */
  .sim-save {
    height: 38px; padding: 0 20px; border-radius: ${T.radiusSm};
    background: ${T.primary}; color: white; border: none;
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500;
    cursor: pointer; transition: background 0.15s, transform 0.1s;
    display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .sim-save:hover  { background: ${T.primaryHover}; }
  .sim-save:active { transform: scale(0.97); }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .sim-layout { grid-template-columns: 1fr; }
    .sim-sc-row { grid-template-columns: 1fr; }
    .sim-avg-row { grid-template-columns: 1fr; }
    .sim-avg-item { border-right: none; border-bottom: 1px solid ${T.border}; }
    .sim-avg-item:last-child { border-bottom: none; }
  }
`;

// ── smooth bezier path helper ─────────────────────────────────────
function smoothBezier(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cpx = (x0 + x1) / 2;
    d += ` C${cpx.toFixed(1)},${y0.toFixed(1)} ${cpx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

// ── Chart ─────────────────────────────────────────────────────────
const Chart = ({ assetP, assetB, rateA, rateG, monthly, target, delta, oneshotAmt, oneshotUp, oneshotDown }: {
  assetP: number; assetB: number; rateA: number; rateG: number;
  monthly: number; target: number; delta: number;
  oneshotAmt: number; oneshotUp: number; oneshotDown: number;
}) => {
  const W = 560; const H = 240;
  const PL = 64; const PR = 20; const PT = 16; const PB = 32;
  const cW = W - PL - PR; const cH = H - PT - PB;

  const lines = [
    { key: "mid",  color: T.primary, w: 2.5, dash: "0",   label: "平均",
      effectiveP: assetP,                                          effectiveA: rateA },
    { key: "succ", color: T.success, w: 1.6, dash: "2,2", label: "投資成功",
      effectiveP: assetP + oneshotAmt,                            effectiveA: rateA + oneshotUp / 100 },
    { key: "fail", color: T.danger,  w: 1.6, dash: "0",   label: "投資失敗",
      effectiveP: Math.max(assetP - Math.round(oneshotAmt * oneshotDown / 100), 0), effectiveA: rateA },
  ];

  const allV: number[] = [0, target];
  const resolved = lines.map(l => {
    const vals = Array.from({ length: 11 }, (_, y) =>
      calcForecast(l.effectiveP, assetB, l.effectiveA, rateG, monthly, y)
    );
    vals.forEach(v => allV.push(v));
    return { ...l, vals };
  });

  const maxV = Math.max(...allV) * 1.10;
  const xPos = (i: number) => PL + (i / 10) * cW;
  const yPos = (v: number) => PT + cH - (Math.max(v, 0) / maxV) * cH;

  const coords = resolved.map(l => ({
    ...l,
    pts: l.vals.map((v, i) => [xPos(i), yPos(v)] as [number, number]),
  }));

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (maxV / tickCount) * i);

  const mainCoords = assetP + assetB;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        {coords.filter(l => l.key === "mid").map(l => (
          <linearGradient key={`g-${l.key}`} id={`sim-grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={l.color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>

      {/* grid */}
      {ticks.map(v => {
        const yv = yPos(v);
        const lbl = v === 0 ? "0" : v >= 10000 ? `${(v/10000).toFixed(1)}億` : `${Math.round(v/100)*100}万`;
        return (
          <g key={v}>
            <line x1={PL} y1={yv} x2={W - PR} y2={yv}
              stroke={T.border} strokeWidth="1" strokeDasharray="4,4" />
            <text x={PL - 8} y={yv + 4} textAnchor="end" fontSize="8" fill={T.textMuted}
              fontFamily="'Noto Sans JP',sans-serif">{lbl}</text>
          </g>
        );
      })}

      {/* x labels */}
      {[0,1,2,3,4,5,6,7,8,9,10].map(y => (
        <text key={y} x={xPos(y)} y={H - PB + 16} textAnchor="middle"
          fontSize="8" fill={T.textMuted} fontFamily="'Noto Sans JP',sans-serif">
          {y}年
        </text>
      ))}

      {/* area fill for mid only */}
      {coords.filter(l => l.key === "mid").map(l => {
        const bottom = yPos(0);
        const area = smoothBezier(l.pts)
          + ` L${l.pts[l.pts.length-1][0].toFixed(1)},${bottom.toFixed(1)}`
          + ` L${l.pts[0][0].toFixed(1)},${bottom.toFixed(1)} Z`;
        return <path key={`area-${l.key}`} d={area} fill={`url(#sim-grad-${l.key})`} stroke="none" />;
      })}

      {/* target line */}
      {target > 0 && (() => {
        const ty = yPos(target);
        return <>
          <line x1={PL} y1={ty} x2={W - PR - 22} y2={ty}
            stroke={T.danger} strokeWidth="1.2" strokeDasharray="5,4" opacity="0.6" />
          <text x={W - PR - 20} y={ty + 3.5} fontSize="8" fill={T.danger}
            fontFamily="'Noto Sans JP',sans-serif" fontWeight="500">目標</text>
        </>;
      })()}

      {/* lines */}
      {coords.map(l => (
        <path key={`line-${l.key}`} d={smoothBezier(l.pts)}
          fill="none" stroke={l.color} strokeWidth={l.w}
          strokeDasharray={l.dash}
          strokeLinecap="round" strokeLinejoin="round"
          opacity={l.key === "mid" ? 1 : ["succ","fail"].includes(l.key) ? 0.65 : 0.88} />
      ))}

      {/* dots on mid line */}
      {coords.find(l => l.key === "mid")?.pts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 5 : 3}
          fill={i === 0 ? T.primary : T.surface}
          stroke={T.primary} strokeWidth="1.5" />
      ))}

      {/* current label */}
      <text x={xPos(0) + 8} y={yPos(mainCoords) - 7}
        fontSize="8" fill={T.primary} fontFamily="'Noto Sans JP',sans-serif" fontWeight="600">現在</text>
    </svg>
  );
};

// ── Component ─────────────────────────────────────────────────────
const DEFAULTS = {
  pPct:    30,
  rateA:   3.0,
  rateG:   10.0,
  monthly: 20,
  target:  6500,
  osAmt:   1000,
  osUp:    20,
  osDn:    30,
  delta:   3,
};

const Simulation = ({
  onSave,
  currentPersonalAsset = 2495,
  currentBusinessAsset = 505,
}: {
  onSave?: (r: { avgForecast: number; targetAmount: number }) => void;
  currentPersonalAsset?: number;
  currentBusinessAsset?: number;
}) => {
  const total = currentPersonalAsset + currentBusinessAsset;

  const [pPct,    setPPct]    = useState(DEFAULTS.pPct);
  const [rateA,   setRateA]   = useState(DEFAULTS.rateA);
  const [rateG,   setRateG]   = useState(DEFAULTS.rateG);
  const [monthly, setMonthly] = useState(DEFAULTS.monthly);
  const [target,  setTarget]  = useState(DEFAULTS.target);
  const [osAmt,   setOsAmt]   = useState(DEFAULTS.osAmt);
  const [osUp,    setOsUp]    = useState(DEFAULTS.osUp);
  const [osDn,    setOsDn]    = useState(DEFAULTS.osDn);
  const [delta,   setDelta]   = useState(DEFAULTS.delta);

  function handleClear() {
    setPPct(DEFAULTS.pPct);
    setRateA(DEFAULTS.rateA);
    setRateG(DEFAULTS.rateG);
    setMonthly(DEFAULTS.monthly);
    setTarget(DEFAULTS.target);
    setOsAmt(DEFAULTS.osAmt);
    setOsUp(DEFAULTS.osUp);
    setOsDn(DEFAULTS.osDn);
    setDelta(DEFAULTS.delta);
  }

  const bPct   = 100 - pPct;
  const assetP = Math.round(total * pPct / 100);
  const assetB = Math.round(total * bPct / 100);
  const a = rateA / 100; const g = rateG / 100; const d = delta / 100;

  const mid  = useMemo(() => calcForecast(assetP, assetB, a, g, monthly, 10), [assetP, assetB, a, g, monthly]);
  const low  = useMemo(() => calcForecast(assetP, assetB, Math.max(a-d,0), Math.max(g-d,0), monthly, 10), [assetP, assetB, a, g, d, monthly]);
  const high = useMemo(() => calcForecast(assetP, assetB, a+d, g+d, monthly, 10), [assetP, assetB, a, g, d, monthly]);

  const diff    = mid - target;
  const goalMet = diff >= 0;
  const prog    = Math.min(Math.round((mid / target) * 100), 100);

  const okForecast   = calcForecast(assetP + osAmt, assetB, a + osUp/100, g, monthly, 10);
  const failForecast = calcForecast(Math.max(assetP - Math.round(osAmt * osDn / 100), 0), assetB, a, g, monthly, 10);

  const reqMonthly = useMemo(() => {
    if (a <= 0) return 0;
    const needed = target - assetP * Math.pow(1+a,10) - assetB * Math.pow(1+g,10);
    return needed <= 0 ? 0 : Math.round(needed / (12 * (Math.pow(1+a,10) - 1) / a));
  }, [assetP, assetB, a, g, target]);

  const wAvg = ((rateA * pPct + rateG * bPct) / 100).toFixed(1);

  // スライダー共通コンポーネント
  const SB = ({ label, min, max, step, value, onChange, color, suffix, hint }: {
    label: string | React.ReactNode; min: number; max: number; step: number;
    value: number; onChange: (v: number) => void;
    color: string; suffix: string; hint?: string;
  }) => {
    const pct = ((value - min) / (max - min)) * 100;
    const trackStyle: React.CSSProperties = {
      background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${T.border} ${pct}%, ${T.border} 100%)`,
    };
    return (
      <div className="sim-sb">
        <div className="sim-sb-top">
          <span className="sim-sb-label">{label}</span>
          <span className="sim-sb-val" style={{ color }}>{value}{suffix}</span>
        </div>
        <input type="range" className="sim-slider" min={min} max={max} step={step}
          value={value} onChange={e => onChange(+e.target.value)}
          style={{ ...trackStyle, accentColor: color }} />
        {hint && <div className="sim-sb-hint">{hint}</div>}
      </div>
    );
  };

  return (
    <div className="sim">
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", letterSpacing: -0.5 }}>10年後シミュレーション</h1>
          <div style={{ fontSize: 12, color: T.textMuted }}>利回り・成長率・配分を変えて、10年後の資産を一緒に探そう</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleClear}
            style={{
              height: 38, padding: "0 16px", borderRadius: T.radiusSm,
              background: "none", border: `1px solid ${T.border}`,
              color: T.textSecondary, fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            クリア
          </button>
          <button className="sim-save" onClick={() => onSave?.({ avgForecast: mid, targetAmount: target })}>
            保存する
          </button>
        </div>
      </div>

      {/* ── 現在の資産カード ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: T.radius, padding: "14px 20px", marginBottom: 18,
        display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-end",
      }}>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>現在の総純資産</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -1 }}>
            {fmt(total)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 3, color: T.textSecondary }}>万円</span>
          </div>
          <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 1 }}>データ連携で自動反映</div>
        </div>
        {[
          { label: "個人資産", value: currentPersonalAsset, color: T.teal },
          { label: "事業資産", value: currentBusinessAsset, color: T.primary },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
            <div>
              <div style={{ fontSize: 10.5, color: T.textMuted }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: -0.5 }}>
                {fmt(value)}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2, color: T.textSecondary }}>万円</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2-col layout ── */}
      <div className="sim-layout">

        {/* ════ LEFT ════ */}
        <div className="sim-left">

          {/* 資産配分 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">資産配分を動かしてみよう</div>
            <div className="sim-panel-body">
              <div className="sim-alloc-track">
                <div className="sim-alloc-p" style={{ width: `${pPct}%` }} />
                <div className="sim-alloc-b" style={{ width: `${bPct}%` }} />
              </div>
              <div className="sim-alloc-legs">
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block" }} />
                  個人 {pPct}%
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  事業 {bPct}%
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.primary, display: "inline-block" }} />
                </span>
              </div>
              <input type="range" className="sim-slider" min={0} max={100} step={5}
                value={pPct} onChange={e => setPPct(+e.target.value)}
                style={{
                  width: "100%", marginTop: 10, accentColor: T.teal,
                  background: `linear-gradient(to right, ${T.teal} 0%, ${T.teal} ${pPct}%, ${T.primary} ${pPct}%, ${T.primary} 100%)`,
                }} />
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>
                個人への配分: <strong style={{ color: T.textPrimary }}>{pPct}%</strong>
              </div>
            </div>
          </div>

          {/* 個人の投資 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="sim-dot" style={{ background: T.teal }} />個人の投資
              </span>
            </div>
            <div className="sim-panel-body">
              <SB label="投資利回り（a）" min={0} max={15} step={0.5}
                value={rateA} onChange={setRateA} color={T.teal} suffix="%"
                hint="現在の個人資産 × (1+a)^n" />
              <SB label="月次積立" min={0} max={100} step={5}
                value={monthly} onChange={setMonthly} color={T.teal} suffix="万円" />
            </div>
          </div>

          {/* 事業の成長 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="sim-dot" style={{ background: T.primary }} />事業の成長
              </span>
            </div>
            <div className="sim-panel-body">
              <SB label="年間成長率（g）" min={-10} max={30} step={1}
                value={rateG} onChange={setRateG} color={T.primary} suffix="%"
                hint={"現在の事業資産 × (1+g)^n\n※マイナス可"} />
            </div>
          </div>

          {/* 10年後の目標 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="sim-dot" style={{ background: T.amberDark }} />10年後の目標
              </span>
            </div>
            <div className="sim-panel-body">
              <SB label="目標資産額" min={1000} max={9000} step={500}
                value={target} onChange={setTarget} color={T.amberDark} suffix="万円" />
              <div className={`sim-goal ${goalMet ? "ok" : "missing"}`}>
                {goalMet
                  ? `✓ 平均シナリオで目標達成！ ${fmtSign(diff)}万`
                  : `✗ 目標まであと ${fmt(Math.abs(diff))}万`}
              </div>
              {!goalMet && reqMonthly > 0 && (
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
                  達成に必要な積立: <strong style={{ color: T.primary }}>月 {fmt(reqMonthly)}万円</strong>
                </div>
              )}
            </div>
          </div>

          {/* 一発逆転 スライダー */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="sim-dot" style={{ background: T.purple }} />一発逆転投資
              </span>
            </div>
            <div className="sim-panel-body">
              <SB label="投資額" min={1000} max={9000} step={500}
                value={osAmt} onChange={setOsAmt} color={T.purple} suffix="万円" />
              <SB label="成功時の追加利回り" min={0} max={50} step={5}
                value={osUp} onChange={setOsUp} color={T.teal} suffix="%" />
              <SB label="失敗時の損失率" min={10} max={60} step={5}
                value={osDn} onChange={setOsDn} color={T.danger} suffix="%" />
              <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 4 }}>
                投資額を個人資産に加算して採算計算
              </div>
            </div>
          </div>

        </div>

        {/* ════ RIGHT ════ */}
        <div className="sim-right">

          {/* ① 必要月収ハイライト */}
          <div className="sim-hl">
            <div>
              <div className="sim-hl-label">このペースを維持するのに必要な月収</div>
              <div>
                <span className="sim-hl-value">{fmt(Math.max(reqMonthly, monthly))}</span>
                <span className="sim-hl-unit">万 / 月</span>
              </div>
              <div className="sim-hl-sub">加重平均利回り {wAvg}% で複利計算</div>
            </div>
            <div className="sim-hl-right">
              <div className="sim-hl-rl">10年後の達成金額</div>
              <div className="sim-hl-rv">{fmtSign(diff)}万</div>
            </div>
          </div>

          {/* ② 平均シナリオ内訳 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">10年後の資産（平均シナリオ）</div>
            <div className="sim-avg-row">
              {[
                { label: "総資産",   value: mid,                                         mult: (mid/total).toFixed(1),           color: T.textPrimary },
                { label: "個人資産", value: Math.round(assetP * Math.pow(1+a, 10)),     mult: Math.pow(1+a,10).toFixed(1),      color: T.teal },
                { label: "事業資産", value: Math.round(assetB * Math.pow(1+g, 10)),     mult: Math.pow(1+g,10).toFixed(1),      color: T.primary },
              ].map(({ label, value, mult, color }) => (
                <div key={label} className="sim-avg-item">
                  <div className="sim-avg-lbl">{label}</div>
                  <div className="sim-avg-val" style={{ color }}>{fmt(value)}<span className="sim-avg-unit">万円</span></div>
                  <div className="sim-avg-mult">× {mult}</div>
                </div>
              ))}
            </div>
            <div className="sim-prog-wrap">
              <div className="sim-prog-meta">
                <span style={{ color: T.textMuted }}>目標 ¥{fmt(target)}万</span>
                <span style={{ color: goalMet ? T.success : T.danger, fontWeight: 600 }}>{prog}%達成</span>
              </div>
              <div className="sim-prog-track">
                <div className="sim-prog-fill" style={{
                  width: `${prog}%`,
                  background: goalMet
                    ? `linear-gradient(90deg, ${T.teal}, ${T.primary})`
                    : T.primary,
                }} />
              </div>
            </div>
          </div>

          {/* ③ グラフ */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">10年後の資産（平均シナリオ）</div>
            <div className="sim-panel-body" style={{ paddingTop: 10 }}>
              <div className="sim-legend">
                {[
                  { label: "平均",     color: T.primary },
                  { label: "投資成功", color: T.success, dashed: true },
                  { label: "投資失敗", color: T.danger },
                  { label: "目標",     color: T.danger,  dashed: true },
                ].map(l => (
                  <div key={l.label} className="sim-li">
                    {l.dashed ? (
                      <svg width="18" height="8">
                        <line x1="0" y1="4" x2="18" y2="4" stroke={l.color} strokeWidth="1.6" strokeDasharray="4,2" />
                      </svg>
                    ) : (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
                    )}
                    {l.label}
                  </div>
                ))}
              </div>
              <Chart assetP={assetP} assetB={assetB} rateA={a} rateG={g}
                monthly={monthly} target={target} delta={d}
                oneshotAmt={osAmt} oneshotUp={osUp} oneshotDown={osDn} />
            </div>
          </div>

          {/* ④ 一発逆転結果 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">一発逆転投資のシナリオ</div>
            <div className="sim-panel-body">
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11.5, color: T.textSecondary, marginBottom: 4 }}>
                <span>投資額 <strong style={{ color: T.textPrimary }}>{fmt(osAmt)}万円</strong></span>
                <span>成功時の追加利回り <strong style={{ color: T.teal }}>+{osUp}%</strong></span>
                <span>失敗時の損失率 <strong style={{ color: T.danger }}>−{osDn}%</strong></span>
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8 }}>
                投資額を個人資産に加算した場合の10年後
              </div>
              <div className="sim-oc-row">
                <div className="sim-oc ok">
                  <div className="sim-oc-type">成功した場合</div>
                  <div className="sim-oc-val">¥{fmt(okForecast)}万</div>
                  <div className="sim-oc-sub">{fmtSign(okForecast - mid)}万（通常比）</div>
                </div>
                <div className="sim-oc fail">
                  <div className="sim-oc-type">失敗した場合</div>
                  <div className="sim-oc-val">¥{fmt(failForecast)}万</div>
                  <div className="sim-oc-sub">{fmtSign(failForecast - mid)}万（通常比）</div>
                </div>
              </div>
            </div>
          </div>

          {/* ⑤ シナリオ比較 */}
          <div className="sim-panel">
            <div className="sim-panel-hdr">
              シナリオ比較（低成長 / 平均 / 高成長）
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 10.5, color: T.textMuted }}>シナリオ幅 Δ</span>
                <input type="range" min={0} max={10} step={1} value={delta}
                  onChange={e => setDelta(+e.target.value)}
                  style={{
                    width: 64, accentColor: T.primary,
                    background: `linear-gradient(to right, ${T.primary} 0%, ${T.primary} ${delta/10*100}%, ${T.border} ${delta/10*100}%, ${T.border} 100%)`,
                  }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: T.primary, minWidth: 26 }}>±{delta}%</span>
              </div>
            </div>
            <div className="sim-panel-body">
              <div className="sim-sc-row">
                {([
                  { type: "低成長", cls: "low",  value: low,  ar: rateA-delta, gr: rateG-delta, color: T.teal },
                  { type: "平均",   cls: "mid",  value: mid,  ar: rateA,       gr: rateG,       color: T.primary },
                  { type: "高成長", cls: "high", value: high, ar: rateA+delta, gr: rateG+delta, color: T.amberDark },
                ] as const).map(sc => {
                  const pV = Math.round(assetP * Math.pow(1 + sc.ar/100, 10));
                  const bV = Math.round(assetB * Math.pow(1 + sc.gr/100, 10));
                  const met = sc.value >= target;
                  return (
                    <div key={sc.type} className={`sim-sc-card ${sc.cls}`}>
                      <div className="sim-sc-type">{sc.type}</div>
                      <div className="sim-sc-val" style={{ color: sc.color }}>
                        {fmt(sc.value)}<span style={{ fontSize: 10, fontWeight: 400, marginLeft: 2 }}>万円</span>
                      </div>
                      <div className="sim-sc-mult">× {(sc.value/total).toFixed(1)}（10年後）</div>
                      <div className="sim-sc-det">
                        <div className="sim-sc-row2"><span className="sim-sc-k">個人</span><span className="sim-sc-v">{fmt(pV)}万</span></div>
                        <div className="sim-sc-row2"><span className="sim-sc-k">a =</span><span className="sim-sc-v">{sc.ar.toFixed(1)}%</span></div>
                        <div className="sim-sc-row2"><span className="sim-sc-k">事業</span><span className="sim-sc-v">{fmt(bV)}万</span></div>
                        <div className="sim-sc-row2"><span className="sim-sc-k">g =</span><span className="sim-sc-v">{sc.gr.toFixed(1)}%</span></div>
                      </div>
                      <div className={`sim-badge ${met ? "ok" : "missing"}`}>
                        {met ? "✓ 目標達成" : "✗ 目標未達"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Simulation;