import { useState } from "react";
// ── Design Tokens ────────────────────────────────────────────────
const tokens = {
  bg: "#F7F8FC",
  surface: "#FFFFFF",
  border: "#E5E7EF",
  borderMid: "#D0D4E8",
  primary: "#4F63E7",
  primaryLight: "#EEF1FD",
  teal: "#3CC9A0",
  tealLight: "#E1F5EE",
  purple: "#9B7EF8",
  purpleLight: "#F0ECFE",
  textPrimary: "#1C1E2E",
  textSecondary: "#7A7D94",
  textMuted: "#A8ABBA",
  danger: "#E05252",
  dangerLight: "#FEF0F0",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  success: "#10B981",
  successLight: "#ECFDF5",
  radius: "12px",
  radiusSm: "8px",
};

// ── Simulation constants & calcForecast ──────────────────────────
const SIM_RATE_A  = 0.03;
const SIM_RATE_G  = 0.10;
const SIM_MONTHLY = 20;

function calcForecast(assetP: number, assetB: number, rateA: number, rateG: number, monthly: number, years: number): number {
  const p = assetP * Math.pow(1 + rateA, years);
  const b = assetB * Math.pow(1 + rateG, years);
  const m = rateA > 0 ? monthly * 12 * (Math.pow(1 + rateA, years) - 1) / rateA : monthly * 12 * years;
  return Math.round(p + b + m);
}

// ── Helpers ──────────────────────────────────────────────────────
function currentYM(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function shiftYM(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatYM(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${parseInt(m)}月`;
}
function fmt(n: number): string { return n.toLocaleString("ja-JP"); }
function fmtShort(n: number): string {
  if (Math.abs(n) >= 10000) return (n / 10000).toFixed(1) + "億";
  return fmt(n) + "万";
}
function fmtSign(n: number): string { return (n >= 0 ? "+" : "") + fmt(n); }

// ── Entry type ───────────────────────────────────────────────────
type DataTab = "asset" | "liability" | "revenue" | "cost";
interface Entry {
  id: string; tab: DataTab; business: string; content: string;
  occurred_at: string; due_at: string; amount: string; yield_rate: string; memo: string;
}
function parseAmt(s: string): number { return parseInt(s.replace(/,/g, ""), 10) || 0; }
function toYM(d: string): string { return d ? d.slice(0, 7) : ""; }

// ── Sample entries ───────────────────────────────────────────────
const TM  = currentYM();
const PM  = shiftYM(TM, -1);
const PM2 = shiftYM(TM, -2);

const ALL_ENTRIES: Entry[] = [
  // 個人 今月 — 資産430万・負債130万 → 純資産300万
  { id:"p01", tab:"asset",     business:"", content:"楽天銀行 普通預金",            occurred_at:`${TM}-05`,  due_at:"",                     amount:"180", yield_rate:"0.1", memo:"" },
  { id:"p02", tab:"asset",     business:"", content:"SBI証券 S&P500インデックス",    occurred_at:`${TM}-10`,  due_at:"",                     amount:"95",  yield_rate:"7.0", memo:"" },
  { id:"p03", tab:"asset",     business:"", content:"iDeCo 全世界株式",              occurred_at:`${TM}-25`,  due_at:"",                     amount:"55",  yield_rate:"5.5", memo:"" },
  { id:"p04", tab:"asset",     business:"", content:"外貨預金（USD）",               occurred_at:`${TM}-15`,  due_at:"",                     amount:"30",  yield_rate:"1.5", memo:"" },
  { id:"p05", tab:"liability", business:"", content:"奨学金残高",                    occurred_at:`${TM}-01`,  due_at:`${shiftYM(TM,48)}-01`, amount:"90",  yield_rate:"",    memo:"毎月返済中" },
  { id:"p06", tab:"liability", business:"", content:"カーローン",                    occurred_at:`${TM}-15`,  due_at:`${shiftYM(TM,30)}-15`, amount:"40",  yield_rate:"",    memo:"残り2.5年" },
  { id:"p07", tab:"revenue",   business:"", content:"給与（今月）",                  occurred_at:`${TM}-25`,  due_at:"",                     amount:"28",  yield_rate:"",    memo:"" },
  { id:"p08", tab:"revenue",   business:"", content:"副業 Webライティング",           occurred_at:`${TM}-20`,  due_at:"",                     amount:"4",   yield_rate:"",    memo:"" },
  { id:"p09", tab:"cost",      business:"", content:"家賃",                          occurred_at:`${TM}-01`,  due_at:"",                     amount:"7",   yield_rate:"",    memo:"" },
  { id:"p10", tab:"cost",      business:"", content:"生命保険・医療保険",             occurred_at:`${TM}-05`,  due_at:"",                     amount:"2",   yield_rate:"",    memo:"" },
  // 個人 先月
  { id:"p11", tab:"asset",     business:"", content:"楽天銀行 普通預金",             occurred_at:`${PM}-05`,  due_at:"",                     amount:"168", yield_rate:"0.1", memo:"" },
  { id:"p12", tab:"asset",     business:"", content:"SBI証券 S&P500インデックス",    occurred_at:`${PM}-10`,  due_at:"",                     amount:"90",  yield_rate:"7.0", memo:"" },
  { id:"p13", tab:"asset",     business:"", content:"iDeCo 全世界株式",              occurred_at:`${PM}-25`,  due_at:"",                     amount:"52",  yield_rate:"5.5", memo:"" },
  { id:"p14", tab:"liability", business:"", content:"奨学金残高",                    occurred_at:`${PM}-01`,  due_at:`${shiftYM(TM,48)}-01`, amount:"92",  yield_rate:"",    memo:"" },
  { id:"p15", tab:"liability", business:"", content:"カーローン",                    occurred_at:`${PM}-15`,  due_at:`${shiftYM(TM,30)}-15`, amount:"41",  yield_rate:"",    memo:"" },
  { id:"p16", tab:"revenue",   business:"", content:"給与（先月）",                  occurred_at:`${PM}-25`,  due_at:"",                     amount:"28",  yield_rate:"",    memo:"" },
  { id:"p17", tab:"cost",      business:"", content:"家賃",                          occurred_at:`${PM}-01`,  due_at:"",                     amount:"7",   yield_rate:"",    memo:"" },
  { id:"p18", tab:"cost",      business:"", content:"食費・日用品",                  occurred_at:`${PM}-31`,  due_at:"",                     amount:"5",   yield_rate:"",    memo:"" },
  // 個人 2ヶ月前
  { id:"p19", tab:"cost",      business:"", content:"年間保険料（一括）",             occurred_at:`${PM2}-05`, due_at:"",                     amount:"8",   yield_rate:"",    memo:"" },
  // 事業 今月 — 資産80万・負債50万 → 純資産30万
  { id:"b01", tab:"asset",     business:"A事業",            content:"運転資金（普通預金）", occurred_at:`${TM}-01`,  due_at:"",                     amount:"50",  yield_rate:"", memo:"" },
  { id:"b02", tab:"asset",     business:"Bコンサルティング", content:"業務用PC・機材",      occurred_at:`${TM}-05`,  due_at:"",                     amount:"30",  yield_rate:"", memo:"" },
  { id:"b03", tab:"liability", business:"A事業",            content:"開業準備ローン",       occurred_at:`${TM}-01`,  due_at:`${shiftYM(TM,36)}-01`, amount:"45",  yield_rate:"", memo:"金利1.5%" },
  { id:"b04", tab:"liability", business:"Bコンサルティング", content:"事業用クレジット残高", occurred_at:`${TM}-15`,  due_at:`${shiftYM(TM,1)}-25`,  amount:"5",   yield_rate:"", memo:"" },
  { id:"b05", tab:"revenue",   business:"A事業",            content:"店舗売上（今月）",     occurred_at:`${TM}-30`,  due_at:"",                     amount:"18",  yield_rate:"", memo:"初月" },
  { id:"b06", tab:"revenue",   business:"Bコンサルティング", content:"C社 初回顧問料",       occurred_at:`${TM}-20`,  due_at:"",                     amount:"10",  yield_rate:"", memo:"" },
  { id:"b07", tab:"cost",      business:"A事業",            content:"仕入原価",             occurred_at:`${TM}-30`,  due_at:"",                     amount:"8",   yield_rate:"", memo:"" },
  { id:"b08", tab:"cost",      business:"A事業",            content:"家賃（店舗）",         occurred_at:`${TM}-01`,  due_at:"",                     amount:"6",   yield_rate:"", memo:"" },
  { id:"b09", tab:"cost",      business:"Bコンサルティング", content:"SaaS各種サブスク",     occurred_at:`${TM}-01`,  due_at:"",                     amount:"2",   yield_rate:"", memo:"" },
  // 事業 先月（開業準備中）
  { id:"b10", tab:"revenue",   business:"A事業",            content:"店舗売上（先月）",     occurred_at:`${PM}-31`,  due_at:"",                     amount:"8",   yield_rate:"", memo:"プレオープン" },
  { id:"b11", tab:"cost",      business:"A事業",            content:"開業準備費用",         occurred_at:`${PM}-15`,  due_at:"",                     amount:"12",  yield_rate:"", memo:"内装・備品" },
];

// ── Compute summary figures ───────────────────────────────────────
const pAsset   = ALL_ENTRIES.filter(e => e.tab==="asset"     && e.business==="" ).reduce((s,e)=>s+parseAmt(e.amount),0);
const pLiab    = ALL_ENTRIES.filter(e => e.tab==="liability"  && e.business==="" ).reduce((s,e)=>s+parseAmt(e.amount),0);
const pRevTM   = ALL_ENTRIES.filter(e => e.tab==="revenue"    && e.business==="" && toYM(e.occurred_at)===TM).reduce((s,e)=>s+parseAmt(e.amount),0);
const pRevPM   = ALL_ENTRIES.filter(e => e.tab==="revenue"    && e.business==="" && toYM(e.occurred_at)===PM).reduce((s,e)=>s+parseAmt(e.amount),0);
const pCostTM  = ALL_ENTRIES.filter(e => e.tab==="cost"       && e.business==="" && toYM(e.occurred_at)===TM).reduce((s,e)=>s+parseAmt(e.amount),0);
const bAsset   = ALL_ENTRIES.filter(e => e.tab==="asset"      && e.business!=="" ).reduce((s,e)=>s+parseAmt(e.amount),0);
const bLiab    = ALL_ENTRIES.filter(e => e.tab==="liability"  && e.business!=="" ).reduce((s,e)=>s+parseAmt(e.amount),0);
const bRevTM   = ALL_ENTRIES.filter(e => e.tab==="revenue"    && e.business!=="" && toYM(e.occurred_at)===TM).reduce((s,e)=>s+parseAmt(e.amount),0);
const bRevPM   = ALL_ENTRIES.filter(e => e.tab==="revenue"    && e.business!=="" && toYM(e.occurred_at)===PM).reduce((s,e)=>s+parseAmt(e.amount),0);
const bCostTM  = ALL_ENTRIES.filter(e => e.tab==="cost"       && e.business!=="" && toYM(e.occurred_at)===TM).reduce((s,e)=>s+parseAmt(e.amount),0);

const pNet    = pAsset  - pLiab;
const bNet    = bAsset  - bLiab;
const cNet    = pNet + bNet;
const cAsset  = pAsset  + bAsset;
const cLiab   = pLiab   + bLiab;
const cRev    = pRevTM  + bRevTM;
const cCost   = pCostTM + bCostTM;
const cProfit = cRev - cCost;
const pProfit = pRevTM - pCostTM;
const bProfit = bRevTM - bCostTM;
const prevCRev   = pRevPM + bRevPM;
const revGrowth  = prevCRev > 0 ? Math.round(((cRev - prevCRev) / prevCRev) * 100) : 0;
const targetPct  = Math.min(Math.round((cNet / 5000) * 100), 100);
const tenYear    = calcForecast(pNet, bNet, SIM_RATE_A, SIM_RATE_G, SIM_MONTHLY, 10);

// ── Alert engine ─────────────────────────────────────────────────
type AlertLevel = "danger" | "warning" | "info";
interface Alert { level: AlertLevel; message: string; detail: string; }

function computeAlerts(): Alert[] {
  const result: Alert[] = [];
  const nextMonthEnd = `${shiftYM(TM, 1)}-31`;

  ALL_ENTRIES
    .filter(e => e.tab === "liability" && e.due_at && e.due_at <= `${TM}-31`)
    .forEach(e => {
      const past = e.due_at < `${TM}-01`;
      result.push({
        level: "danger",
        message: `${e.business || "個人"} 「${e.content}」の返済期日${past ? "を過ぎています" : "が今月です"}`,
        detail: `期日: ${e.due_at} ／ 残高: ¥${fmt(parseAmt(e.amount))}万`,
      });
    });

  if (cNet < 0) result.push({ level: "danger", message: "純資産合計がマイナスです（債務超過）", detail: `純資産: ¥${fmt(cNet)}万` });
  if (pNet < 0) result.push({ level: "danger", message: "個人の純資産がマイナスです", detail: `資産 ¥${fmt(pAsset)}万 ／ 負債 ¥${fmt(pLiab)}万` });
  if (bNet < 0) result.push({ level: "danger", message: "事業の純資産がマイナスです", detail: `資産 ¥${fmt(bAsset)}万 ／ 負債 ¥${fmt(bLiab)}万` });

  if (pProfit < 0) result.push({ level: "danger", message: "個人の今月収支がマイナスです", detail: `収入 ¥${fmt(pRevTM)}万 ／ 支出 ¥${fmt(pCostTM)}万` });
  if (bProfit < 0) result.push({ level: "danger", message: "事業の今月収支がマイナスです", detail: `売上 ¥${fmt(bRevTM)}万 ／ コスト ¥${fmt(bCostTM)}万` });

  ALL_ENTRIES
    .filter(e => e.tab === "liability" && e.due_at && e.due_at > `${TM}-31` && e.due_at <= nextMonthEnd)
    .forEach(e => {
      result.push({
        level: "warning",
        message: `${e.business || "個人"} 「${e.content}」の返済期日が翌月に迫っています`,
        detail: `期日: ${e.due_at} ／ 残高: ¥${fmt(parseAmt(e.amount))}万`,
      });
    });

  if (pAsset > 0 && pLiab / pAsset >= 0.8) result.push({
    level: "warning",
    message: "個人の負債が資産の80%を超えています",
    detail: `負債比率: ${Math.round((pLiab/pAsset)*100)}% ／ 資産 ¥${fmt(pAsset)}万 負債 ¥${fmt(pLiab)}万`,
  });
  if (bAsset > 0 && bLiab / bAsset >= 0.8) result.push({
    level: "warning",
    message: "事業の負債が資産の80%を超えています",
    detail: `負債比率: ${Math.round((bLiab/bAsset)*100)}% ／ 資産 ¥${fmt(bAsset)}万 負債 ¥${fmt(bLiab)}万`,
  });

  const tabs: { tab: DataTab; label: string }[] = [
    { tab: "asset", label: "資産" }, { tab: "liability", label: "負債" },
    { tab: "revenue", label: "売上・収入" }, { tab: "cost", label: "支出・コスト" },
  ];
  tabs.forEach(({ tab, label }) => {
    const cnt = ALL_ENTRIES.filter(e => e.tab === tab && toYM(e.occurred_at) === TM).length;
    if (cnt === 0) result.push({
      level: "warning",
      message: `今月の「${label}」データが未入力です`,
      detail: `${formatYM(TM)} に${label}のデータが登録されていません`,
    });
  });

  if (prevCRev > 0 && cRev < prevCRev * 0.8) result.push({
    level: "warning",
    message: "今月の収入が先月より20%以上減少しています",
    detail: `今月 ¥${fmt(cRev)}万 ／ 先月 ¥${fmt(prevCRev)}万（${fmtSign(revGrowth)}%）`,
  });

  const noYield = ALL_ENTRIES.filter(e => e.tab === "asset" && e.business === "" && !e.yield_rate && toYM(e.occurred_at) === TM);
  if (noYield.length > 0) result.push({
    level: "info",
    message: `利回りが未設定の個人資産があります（${noYield.length}件）`,
    detail: noYield.map(e => e.content).join("、"),
  });

  return result;
}

const ALERTS = computeAlerts();

// ── Monthly trend data ────────────────────────────────────────────
// 2025年3月サービス開始。個人300万・事業0万スタート。
const SVC_START = "2026-03";
function buildMonthRange(from: string, to: string): string[] {
  const months: string[] = [];
  let cur = from;
  while (cur <= to) { months.push(cur); cur = shiftYM(cur, 1); }
  return months;
}
const CHART_MONTHS = buildMonthRange(SVC_START, TM);

// 各月の pNet・bNet サンプル値（3月〜、末尾がTMの実値で上書き）
const CHART_PRESET: { pNet: number; bNet: number }[] = [
  { pNet: 300, bNet:  30 },  // 3月
  { pNet: 298, bNet:  28 },  // 4月
  { pNet: 297, bNet:  25 },  // 5月
  { pNet: 299, bNet:  26 },  // 6月
  { pNet: 302, bNet:  28 },  // 7月
  { pNet: 305, bNet:  30 },  // 8月
  { pNet: 308, bNet:  32 },  // 9月
  { pNet: 310, bNet:  33 },  // 10月
  { pNet: 312, bNet:  32 },  // 11月
  { pNet: 315, bNet:  31 },  // 12月
  { pNet: 317, bNet:  30 },  // 1月
  { pNet: 319, bNet:  31 },  // 2月
];

const MONTHLY_DATA = CHART_MONTHS.map((ym, i) => {
  const isTM = ym === TM;
  const preset = CHART_PRESET[i] ?? CHART_PRESET[CHART_PRESET.length - 1];
  const p = isTM ? pNet : preset.pNet;
  const b = isTM ? bNet : preset.bNet;
  return { ym, pNet: p, bNet: b, cNet: p + b };
});

function toYearlyData(monthly: typeof MONTHLY_DATA) {
  const map = new Map<string, { ym: string; pNet: number; bNet: number; cNet: number; _n: number }>();
  monthly.forEach(d => {
    const y = d.ym.slice(0, 4);
    const cur = map.get(y) ?? { ym: y, pNet: 0, bNet: 0, cNet: 0, _n: 0 };
    cur.pNet += d.pNet; cur.bNet += d.bNet; cur.cNet += d.cNet; cur._n++;
    map.set(y, cur);
  });
  return Array.from(map.values()).map(d => ({
    ym: d.ym,
    pNet: Math.round(d.pNet / d._n),
    bNet: Math.round(d.bNet / d._n),
    cNet: Math.round(d.cNet / d._n),
  }));
}

// ── Styles ───────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap');
  .db { font-family: 'Noto Sans JP', sans-serif; color: ${tokens.textPrimary}; }

  /* ── Top summary ── */
  .db-top { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
  .db-top-card {
    background: ${tokens.surface}; border: 1px solid ${tokens.border};
    border-radius: ${tokens.radius}; padding: 14px 16px;
  }
  .db-top-label { font-size: 11px; color: ${tokens.textMuted}; margin-bottom: 5px; }
  .db-top-value { font-size: 21px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1; }
  .db-top-unit  { font-size: 11px; font-weight: 400; margin-left: 2px; color: ${tokens.textSecondary}; }
  .db-top-sub   { font-size: 10.5px; color: ${tokens.textMuted}; margin-top: 4px; }
  .db-top-sub.up   { color: ${tokens.teal}; }
  .db-top-sub.down { color: ${tokens.danger}; }

  /* ── Alert ── */
  .db-alert-wrap {
    background: ${tokens.surface}; border: 1px solid ${tokens.border};
    border-radius: ${tokens.radius}; margin-bottom: 20px; overflow: hidden;
  }
  .db-alert-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 16px; cursor: pointer; user-select: none;
    transition: background 0.12s;
  }
  .db-alert-hdr:hover { background: ${tokens.bg}; }
  .db-alert-hdr.open { border-bottom: 1px solid ${tokens.border}; }
  .db-alert-hdr-left { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
  .db-chevron { color: ${tokens.textMuted}; transition: transform 0.2s; display: flex; }
  .db-chevron.open { transform: rotate(180deg); }

  .db-alert-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 9px 16px; border-bottom: 1px solid ${tokens.border};
  }
  .db-alert-row:last-child { border-bottom: none; }
  .db-alert-dot { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; flex-shrink: 0; margin-top: 1px; }
  .db-alert-dot.danger  { background: ${tokens.danger}; }
  .db-alert-dot.warning { background: ${tokens.warning}; }
  .db-alert-dot.info    { background: ${tokens.primary}; }
  .db-alert-msg    { font-size: 12.5px; font-weight: 500; }
  .db-alert-detail { font-size: 11px; color: ${tokens.textMuted}; margin-top: 1px; }

  .db-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
  .db-badge.danger  { background: ${tokens.dangerLight};  color: ${tokens.danger}; }
  .db-badge.warning { background: ${tokens.warningLight}; color: ${tokens.warning}; }
  .db-badge.info    { background: ${tokens.primaryLight}; color: ${tokens.primary}; }
  .db-badge.ok      { background: ${tokens.successLight}; color: ${tokens.success}; }

  /* ── 3-column grid ── */
  .db-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

  .db-col {
    background: ${tokens.surface}; border: 1px solid ${tokens.border};
    border-radius: ${tokens.radius}; overflow: hidden;
    position: relative;
  }
  .db-col.personal { border-color: #9FE1CB; }
  .db-col.personal .db-col-hdr { background: ${tokens.tealLight}; border-bottom-color: #9FE1CB; }
  .db-col.personal .db-col-mode { color: #0F6E56; }
  .db-col.personal .db-col-stripe { background: ${tokens.teal}; }
  .db-col.business { border-color: #B5D4F4; }
  .db-col.business .db-col-hdr { background: ${tokens.primaryLight}; border-bottom-color: #B5D4F4; }
  .db-col.business .db-col-mode { color: #185FA5; }
  .db-col.business .db-col-stripe { background: ${tokens.primary}; }
  .db-col.combined { border-color: #FAC775; }
  .db-col.combined .db-col-hdr { background: #FAEEDA; border-bottom-color: #FAC775; }
  .db-col.combined .db-col-mode { color: #633806; }
  .db-col.combined .db-col-stripe { background: #EF9F27; }

  .db-col-stripe {
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 4px; border-radius: 12px 0 0 12px;
  }
  .db-col-hdr { padding: 14px 18px 12px 22px; border-bottom: 1px solid ${tokens.border}; }
  .db-col-mode { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 4px; }
  .db-col-net  { font-size: 26px; font-weight: 700; letter-spacing: -0.8px; }
  .db-col-net-label { font-size: 11px; color: ${tokens.textSecondary}; margin-top: 1px; }
  .db-rows { padding: 4px 0; }
  .db-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 18px 9px 22px; border-bottom: 1px solid ${tokens.border};
  }
  .db-row:last-child { border-bottom: none; }
  .db-row-left { display: flex; align-items: center; gap: 8px; }
  .db-row-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .db-row-label { font-size: 13px; color: ${tokens.textSecondary}; }
  .db-row-value { font-size: 14px; font-weight: 600; letter-spacing: -0.2px; }
  .db-row-profit {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 18px 10px 22px; background: ${tokens.bg};
    border-top: 1px solid ${tokens.border};
  }
  .db-row-profit-label { font-size: 12px; font-weight: 500; color: ${tokens.textSecondary}; }
  .db-row-profit-value { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }

  .db-progress { padding: 12px 18px 12px 22px; border-top: 1px solid ${tokens.border}; }
  .db-progress-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .db-progress-meta-label { font-size: 11px; color: ${tokens.textMuted}; }
  .db-progress-meta-value { font-size: 12px; font-weight: 600; color: #BA7517; }
  .db-progress-track { height: 6px; background: ${tokens.border}; border-radius: 4px; overflow: hidden; }
  .db-progress-fill  { height: 100%; border-radius: 4px; transition: width 0.7s ease; }
  .db-forecast { padding: 10px 18px 14px 22px; border-top: 1px solid ${tokens.border}; }
  .db-forecast-label { font-size: 11px; color: ${tokens.textMuted}; margin-bottom: 3px; }
  .db-forecast-value { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #BA7517; }
  .db-forecast-unit  { font-size: 11px; font-weight: 400; margin-left: 3px; color: ${tokens.textSecondary}; }

  /* ── Net Worth Chart ── */
  .nw-panel {
    background: ${tokens.surface}; border: 1px solid ${tokens.border};
    border-radius: ${tokens.radius}; overflow: hidden; margin-top: 20px;
  }
  .nw-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid ${tokens.border};
    flex-wrap: wrap; gap: 8px;
  }
  .nw-hdr-left { display: flex; align-items: center; gap: 14px; }
  .nw-title { font-size: 13px; font-weight: 600; }
  .nw-legend { display: flex; gap: 14px; flex-wrap: wrap; }
  .nw-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: ${tokens.textSecondary}; }
  .nw-legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .nw-legend-dash { width: 18px; height: 0; border-top: 2px dashed; flex-shrink: 0; }

  .nw-metrics { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid ${tokens.border}; }
  .nw-metric { padding: 12px 18px; border-right: 1px solid ${tokens.border}; }
  .nw-metric:last-child { border-right: none; }
  .nw-metric-label { font-size: 11px; color: ${tokens.textMuted}; margin-bottom: 3px; }
  .nw-metric-value { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .nw-metric-delta { font-size: 11px; margin-top: 2px; }

  .nw-tabs { display: flex; gap: 4px; flex-shrink: 0; }
  .nw-tab {
    padding: 4px 12px; font-size: 11px; font-weight: 500; border-radius: 6px;
    border: 1px solid ${tokens.border}; background: none;
    color: ${tokens.textMuted}; cursor: pointer; font-family: 'Noto Sans JP', sans-serif;
    transition: background 0.12s, color 0.12s;
  }
  .nw-tab.active {
    background: ${tokens.primaryLight}; color: ${tokens.primary};
    border-color: ${tokens.borderMid};
  }

  .nw-body { padding: 14px 16px; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .db-top  { grid-template-columns: repeat(3, 1fr); }
    .db-grid { grid-template-columns: 1fr; }
    .nw-metrics { grid-template-columns: 1fr; }
    .nw-metric { border-right: none; border-bottom: 1px solid ${tokens.border}; }
    .nw-metric:last-child { border-bottom: none; }
  }
  @media (max-width: 540px) {
    .db-top { grid-template-columns: repeat(2, 1fr); }
    .db-col-net { font-size: 22px; }
  }
`;

// ── Icons ────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Net Worth Chart (SVG) ────────────────────────────────────────
type ChartDataPoint = { ym: string; pNet: number; bNet: number; cNet: number };
type TrendUnit = "monthly" | "yearly";

function smoothBez(pts: [number,number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i-1]; const [x1, y1] = pts[i];
    const cx = (x0+x1)/2;
    d += ` C${cx.toFixed(1)},${y0.toFixed(1)} ${cx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

const NetWorthChart = ({ data, unit }: { data: ChartDataPoint[]; unit: TrendUnit }) => {
  const W = 620; const H = 200;
  const PL = 60; const PR = 72; const PT = 12; const PB = 26;
  const cW = W-PL-PR; const cH = H-PT-PB;

  const series = [
    { key: "cNet" as const, color: "#EF9F27", label: "統合", w: 2.5, dash: "0" },
    { key: "pNet" as const, color: "#1D9E75", label: "個人", w: 2,   dash: "0" },
    { key: "bNet" as const, color: "#378ADD", label: "事業", w: 2,   dash: "5,3" },
  ];

  const allVals = data.flatMap(d => [d.pNet, d.bNet, d.cNet]);
  const maxV = Math.max(...allVals) * 1.15 || 1;
  const minV = Math.min(0, Math.min(...allVals));
  const range = maxV - minV;

  const xPos = (i: number) => data.length <= 1 ? PL + cW / 2 : PL + (i / (data.length-1)) * cW;
  const yPos = (v: number) => PT + cH - ((v-minV)/range)*cH;

  const ticks = Array.from({length: 5}, (_,i) => minV + (range/4)*i);

  const xLabels = data.map((d,i) => {
    if (unit === "yearly") return { i, label: `${d.ym.slice(0,4)}年` };
    if (i % 3 === 0 || i === data.length-1) return { i, label: `${parseInt(d.ym.split("-")[1])}月` };
    return null;
  }).filter(Boolean) as { i: number; label: string }[];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        {series.map(s => (
          <linearGradient key={s.key} id={`nw-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* grid */}
      {ticks.map((v,ti) => {
        const yv = yPos(v);
        const lbl = v === 0 ? "0" : Math.abs(v) >= 10000 ? `${(v/10000).toFixed(1)}億` : `${Math.round(v)}万`;
        return (
          <g key={ti}>
            <line x1={PL} y1={yv} x2={W-PR} y2={yv}
              stroke={tokens.border} strokeWidth="1" strokeDasharray="4,4" />
            <text x={PL-6} y={yv+3.5} textAnchor="end" fontSize="8" fill={tokens.textMuted}
              fontFamily="'Noto Sans JP',sans-serif">{lbl}</text>
          </g>
        );
      })}

      {/* x labels */}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={xPos(i)} y={H-PB+12} textAnchor="middle"
          fontSize="8" fill={tokens.textMuted} fontFamily="'Noto Sans JP',sans-serif">{label}</text>
      ))}

      {/* area + line per series */}
      {series.map(s => {
        const pts: [number,number][] = data.map((d,i) => [xPos(i), yPos(d[s.key])]);
        const linePath = smoothBez(pts);
        const bottom = yPos(Math.max(minV, 0));
        const areaPath = pts.length > 1
          ? linePath
            + ` L${pts[pts.length-1][0].toFixed(1)},${bottom.toFixed(1)}`
            + ` L${pts[0][0].toFixed(1)},${bottom.toFixed(1)} Z`
          : "";
        return (
          <g key={s.key}>
            {areaPath && <path d={areaPath} fill={`url(#nw-grad-${s.key})`} stroke="none" />}
            {pts.length > 1 && (
              <path d={linePath} fill="none" stroke={s.color}
                strokeWidth={s.w} strokeDasharray={s.dash}
                strokeLinecap="round" strokeLinejoin="round" />
            )}
            {/* dots */}
            {pts.map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy}
                r={i === pts.length-1 ? 4.5 : 2.5}
                fill={i === pts.length-1 ? s.color : tokens.surface}
                stroke={s.color} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}

      {/* latest value labels — PR領域内に右揃えで表示 */}
      {series.map((s, si) => {
        const last = data[data.length-1];
        const cx = xPos(data.length-1);
        const cy = yPos(last[s.key]);
        // 3系列を縦にずらして重なりを防ぐ（間隔13px）
        const offsetY = (si - 1) * 13;
        return (
          <text key={`lbl-${s.key}`}
            x={cx + 8} y={cy + offsetY + 4}
            fontSize="8" fill={s.color} fontFamily="'Noto Sans JP',sans-serif" fontWeight="600">
            {fmtShort(last[s.key])}
          </text>
        );
      })}
    </svg>
  );
};

// ── Simulation Forecast Chart ────────────────────────────────────
function smoothPath(pts: [number, number][]): string {
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

const SimForecastChart = ({ currentNet, personalNet, businessNet, target }: {
  currentNet: number; personalNet: number; businessNet: number; target: number;
}) => {
  const W = 660; const H = 200;
  const PL = 60; const PR = 20; const PT = 12; const PB = 26;
  const cW = W - PL - PR; const cH = H - PT - PB;

  const scenarios = [
    { key: "low",  aR: Math.max(SIM_RATE_A - 0.03, 0), gR: Math.max(SIM_RATE_G - 0.03, 0), color: tokens.teal,    w: 2 },
    { key: "mid",  aR: SIM_RATE_A,                       gR: SIM_RATE_G,                      color: tokens.primary, w: 2.5 },
    { key: "high", aR: SIM_RATE_A + 0.03,                gR: SIM_RATE_G + 0.03,               color: tokens.purple,  w: 2 },
  ];

  const allV: number[] = [0, target];
  const pathData = scenarios.map(sc => {
    const pts: [number, number][] = Array.from({ length: 11 }, (_, y) => {
      const v = calcForecast(personalNet, businessNet, sc.aR, sc.gR, SIM_MONTHLY, y);
      allV.push(v);
      return [0, v] as [number, number];
    });
    return { ...sc, pts };
  });

  const maxV = Math.max(...allV) * 1.12;
  const xPos = (y: number) => PL + (y / 10) * cW;
  const yPos = (v: number) => PT + cH - (Math.max(v, 0) / maxV) * cH;

  const resolvedPaths = pathData.map(sc => ({
    ...sc,
    coords: sc.pts.map((_, i) => [xPos(i), yPos(sc.pts[i][1])] as [number, number]),
  }));

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (maxV / tickCount) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        {resolvedPaths.map(sc => (
          <linearGradient key={`grad-${sc.key}`} id={`db-grad-${sc.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sc.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={sc.color} stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>

      {ticks.map(v => {
        const yv = yPos(v);
        const label = v === 0 ? "0" : v >= 10000 ? `${(v/10000).toFixed(1)}億` : `${Math.round(v/100)*100}万`;
        return (
          <g key={v}>
            <line x1={PL} y1={yv} x2={W - PR} y2={yv}
              stroke={tokens.border} strokeWidth="1" strokeDasharray="4,4" />
            <text x={PL - 6} y={yv + 3.5} textAnchor="end" fontSize="8" fill={tokens.textMuted}
              fontFamily="'Noto Sans JP', sans-serif">{label}</text>
          </g>
        );
      })}

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
        <text key={y} x={xPos(y)} y={H - PB + 13} textAnchor="middle"
          fontSize="8" fill={tokens.textMuted} fontFamily="'Noto Sans JP', sans-serif">
          {y === 0 ? "0年" : `${y}年`}
        </text>
      ))}

      {resolvedPaths.map(sc => {
        const bottom = yPos(0);
        const areaD = smoothPath(sc.coords)
          + ` L${sc.coords[sc.coords.length - 1][0].toFixed(1)},${bottom.toFixed(1)}`
          + ` L${sc.coords[0][0].toFixed(1)},${bottom.toFixed(1)} Z`;
        return (
          <path key={`area-${sc.key}`} d={areaD}
            fill={`url(#db-grad-${sc.key})`} stroke="none" />
        );
      })}

      {(() => {
        const ty = yPos(target);
        return (
          <>
            <line x1={PL} y1={ty} x2={W - PR} y2={ty}
              stroke={tokens.danger} strokeWidth="1.2" strokeDasharray="6,4" opacity="0.6" />
            <text x={W - PR - 4} y={ty - 5} textAnchor="end" fontSize="10" fill={tokens.danger}
              fontFamily="'Noto Sans JP', sans-serif" fontWeight="500">目標</text>
          </>
        );
      })()}

      {resolvedPaths.map(sc => (
        <path key={`line-${sc.key}`} d={smoothPath(sc.coords)}
          fill="none" stroke={sc.color} strokeWidth={sc.w}
          strokeLinecap="round" strokeLinejoin="round"
          opacity={sc.key === "mid" ? 1 : 0.85} />
      ))}

      {resolvedPaths.find(s => s.key === "mid")?.coords.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 5 : 3}
          fill={i === 0 ? tokens.primary : tokens.surface}
          stroke={tokens.primary} strokeWidth="1.5" />
      ))}

      <text x={xPos(0) + 8} y={yPos(currentNet) - 8} fontSize="10"
        fill={tokens.primary} fontFamily="'Noto Sans JP', sans-serif" fontWeight="600">現在</text>
    </svg>
  );
};

// ── Row item ─────────────────────────────────────────────────────
const Row = ({ label, value, color, positive }: { label: string; value: number; color: string; positive?: boolean }) => (
  <div className="db-row">
    <div className="db-row-left">
      <div className="db-row-dot" style={{ background: color }} />
      <span className="db-row-label">{label}</span>
    </div>
    <span className="db-row-value" style={{ color }}>
      {positive !== undefined ? fmtSign(value) : fmt(value)}万円
    </span>
  </div>
);

// ── Dashboard ────────────────────────────────────────────────────
const Dashboard = () => {
  const [alertOpen, setAlertOpen] = useState(true);
  const [trendUnit, setTrendUnit] = useState<TrendUnit>("monthly");

  const chartData = trendUnit === "yearly" ? toYearlyData(MONTHLY_DATA) : MONTHLY_DATA;
  const latest = chartData[chartData.length-1];
  const prev   = chartData[chartData.length-2] ?? latest;

  const metrics = [
    { label: "個人 純資産",   value: latest.pNet, delta: latest.pNet - prev.pNet, color: "#1D9E75" },
    { label: "事業 純資産",   value: latest.bNet, delta: latest.bNet - prev.bNet, color: "#378ADD" },
    { label: "統合 純資産",   value: latest.cNet, delta: latest.cNet - prev.cNet, color: "#EF9F27" },
  ];

  return (
    <div className="db">
      <style>{css}</style>

      {/* Heading */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>ダッシュボード</h1>
        <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
          サマリー 現在値・{formatYM(TM)}
        </div>
      </div>

      {/* Top summary bar */}
      <div className="db-top">
        <div className="db-top-card">
          <div className="db-top-label">純資産合計</div>
          <div className="db-top-value" style={{ color: tokens.teal }}>¥{fmt(cNet)}<span className="db-top-unit">万</span></div>
          <div className="db-top-sub">個人 + 事業</div>
        </div>
        <div className="db-top-card">
          <div className="db-top-label">今月 収入</div>
          <div className="db-top-value" style={{ color: tokens.primary }}>¥{fmt(cRev)}<span className="db-top-unit">万</span></div>
          <div className={`db-top-sub ${revGrowth >= 0 ? "up" : "down"}`}>前月比 {fmtSign(revGrowth)}%</div>
        </div>
        <div className="db-top-card">
          <div className="db-top-label">今月 支出</div>
          <div className="db-top-value" style={{ color: tokens.purple }}>¥{fmt(cCost)}<span className="db-top-unit">万</span></div>
          <div className="db-top-sub">個人 + 事業</div>
        </div>
        <div className="db-top-card">
          <div className="db-top-label">目標達成率</div>
          <div className="db-top-value" style={{ color: tokens.primary }}>{targetPct}<span className="db-top-unit">%</span></div>
          <div className="db-top-sub">目標 ¥5,000万</div>
        </div>
        <div className="db-top-card">
          <div className="db-top-label">10年後予測</div>
          <div className="db-top-value" style={{ color: tokens.teal }}>¥{fmt(tenYear)}<span className="db-top-unit">万</span></div>
          <div className="db-top-sub">年率5%想定</div>
        </div>
      </div>

      {/* Alert */}
      <div className="db-alert-wrap">
        <div className={`db-alert-hdr ${alertOpen ? "open" : ""}`} onClick={() => setAlertOpen(v => !v)}>
          <div className="db-alert-hdr-left">
            アラート
            {ALERTS.filter(a => a.level === "danger").length  > 0 && <span className="db-badge danger">危険 {ALERTS.filter(a=>a.level==="danger").length}件</span>}
            {ALERTS.filter(a => a.level === "warning").length > 0 && <span className="db-badge warning">注意 {ALERTS.filter(a=>a.level==="warning").length}件</span>}
            {ALERTS.filter(a => a.level === "info").length    > 0 && <span className="db-badge info">情報 {ALERTS.filter(a=>a.level==="info").length}件</span>}
            {ALERTS.length === 0 && <span className="db-badge ok">正常</span>}
          </div>
          <span className={`db-chevron ${alertOpen ? "open" : ""}`}><ChevronDown /></span>
        </div>
        {alertOpen && ALERTS.map((a, i) => (
          <div key={i} className="db-alert-row">
            <div className={`db-alert-dot ${a.level}`}>{a.level === "info" ? "i" : "!"}</div>
            <div>
              <div className="db-alert-msg">{a.message}</div>
              <div className="db-alert-detail">{a.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3 columns */}
      <div className="db-grid">
        {/* 個人 */}
        <div className="db-col personal">
          <div className="db-col-stripe" />
          <div className="db-col-hdr">
            <div className="db-col-mode">個人</div>
            <div className="db-col-net" style={{ color: tokens.teal }}>
              ¥{fmt(pNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span>
            </div>
            <div className="db-col-net-label">純資産（資産 − 負債）</div>
          </div>
          <div className="db-rows">
            <Row label="資産合計"  value={pAsset}  color={tokens.teal} />
            <Row label="負債合計"  value={pLiab}   color={tokens.danger} />
            <Row label="今月 収入" value={pRevTM}  color={tokens.primary} />
            <Row label="今月 支出" value={pCostTM} color={tokens.purple} />
          </div>
          <div className="db-row-profit">
            <span className="db-row-profit-label">収支差額</span>
            <span className="db-row-profit-value" style={{ color: pProfit >= 0 ? tokens.teal : tokens.danger }}>
              {fmtSign(pProfit)}万円
            </span>
          </div>
        </div>

        {/* 事業 */}
        <div className="db-col business">
          <div className="db-col-stripe" />
          <div className="db-col-hdr">
            <div className="db-col-mode">事業</div>
            <div className="db-col-net" style={{ color: tokens.primary }}>
              ¥{fmt(bNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span>
            </div>
            <div className="db-col-net-label">純資産（資産 − 負債）</div>
          </div>
          <div className="db-rows">
            <Row label="資産合計"    value={bAsset}  color={tokens.teal} />
            <Row label="負債合計"    value={bLiab}   color={tokens.danger} />
            <Row label="今月 売上"   value={bRevTM}  color={tokens.primary} />
            <Row label="今月 コスト" value={bCostTM} color={tokens.purple} />
          </div>
          <div className="db-row-profit">
            <span className="db-row-profit-label">営業利益</span>
            <span className="db-row-profit-value" style={{ color: bProfit >= 0 ? tokens.teal : tokens.danger }}>
              {fmtSign(bProfit)}万円
            </span>
          </div>
        </div>

        {/* 統合 */}
        <div className="db-col combined">
          <div className="db-col-stripe" />
          <div className="db-col-hdr">
            <div className="db-col-mode">統合</div>
            <div className="db-col-net" style={{ color: "#BA7517" }}>
              ¥{fmt(cNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span>
            </div>
            <div className="db-col-net-label">純資産合計（個人 + 事業）</div>
          </div>
          <div className="db-rows">
            <Row label="総資産合計"  value={cAsset} color={tokens.teal} />
            <Row label="総負債合計"  value={cLiab}  color={tokens.danger} />
            <Row label="今月 収入計" value={cRev}   color={tokens.primary} />
            <Row label="今月 支出計" value={cCost}  color={tokens.purple} />
          </div>
          <div className="db-row-profit">
            <span className="db-row-profit-label">収支差額</span>
            <span className="db-row-profit-value" style={{ color: cProfit >= 0 ? tokens.teal : tokens.danger }}>
              {fmtSign(cProfit)}万円
            </span>
          </div>
          <div className="db-progress">
            <div className="db-progress-meta">
              <span className="db-progress-meta-label">純資産目標達成率（目標 ¥5,000万）</span>
              <span className="db-progress-meta-value">{targetPct}%</span>
            </div>
            <div className="db-progress-track">
              <div className="db-progress-fill" style={{ width: `${targetPct}%`, background: "#EF9F27" }} />
            </div>
          </div>
          <div className="db-forecast">
            <div className="db-forecast-label">10年後予測（年率5%）</div>
            <div className="db-forecast-value">
              ¥{fmt(tenYear)}<span className="db-forecast-unit">万</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 純資産推移グラフ ── */}
      <div className="nw-panel">
        <div className="nw-hdr">
          <div className="nw-hdr-left">
            <span className="nw-title">純資産の推移</span>
            <div className="nw-legend">
              {[
                { label: "個人", color: "#1D9E75", dash: false },
                { label: "事業", color: "#378ADD", dash: true  },
                { label: "統合", color: "#EF9F27", dash: false },
              ].map(l => (
                <div key={l.label} className="nw-legend-item">
                  {l.dash
                    ? <div className="nw-legend-dash" style={{ borderColor: l.color }} />
                    : <div className="nw-legend-dot"  style={{ background: l.color }} />}
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div className="nw-tabs">
            {(["monthly", "yearly"] as TrendUnit[]).map(u => (
              <button key={u} className={`nw-tab ${trendUnit === u ? "active" : ""}`}
                onClick={() => setTrendUnit(u)}>
                {u === "monthly" ? "月次" : "年次"}
              </button>
            ))}
          </div>
        </div>

        {/* メトリクス行 */}
        <div className="nw-metrics">
          {metrics.map(m => {
            const sign = m.delta >= 0 ? "+" : "";
            const deltaColor = m.delta >= 0 ? tokens.success : tokens.danger;
            return (
              <div key={m.label} className="nw-metric">
                <div className="nw-metric-label">{m.label}</div>
                <div className="nw-metric-value" style={{ color: m.color }}>
                  ¥{fmt(m.value)}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 3, color: tokens.textSecondary }}>万</span>
                </div>
                <div className="nw-metric-delta" style={{ color: deltaColor }}>
                  {sign}{fmtShort(m.delta)} 前期比
                </div>
              </div>
            );
          })}
        </div>

        {/* グラフ */}
        <div className="nw-body">
          <NetWorthChart data={chartData} unit={trendUnit} />
        </div>
      </div>

      {/* ── 10年後シミュレーショングラフ ── */}
      <div className="nw-panel">
        <div className="nw-hdr">
          <div className="nw-hdr-left">
            <span className="nw-title">10年後シミュレーション</span>
            <span className="db-badge info">平均シナリオ（年率5%）</span>
            <div className="nw-legend">
              {[
                { label: "低成長（0%）", color: tokens.teal,    dash: false },
                { label: "平均（3%）",   color: tokens.primary, dash: false },
                { label: "高成長（6%）", color: tokens.purple,  dash: false },
                { label: "目標ライン",   color: tokens.danger,  dash: true  },
              ].map(l => (
                <div key={l.label} className="nw-legend-item">
                  {l.dash
                    ? <div className="nw-legend-dash" style={{ borderColor: l.color }} />
                    : <div className="nw-legend-dot"  style={{ background: l.color }} />}
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 11, color: tokens.textMuted, flexShrink: 0 }}>
            目標 ¥{fmt(5000)}万 ／ 予測 ¥{fmt(tenYear)}万
          </span>
        </div>
        <div className="nw-body">
          <SimForecastChart
            currentNet={cNet}
            personalNet={pNet}
            businessNet={bNet}
            target={5000}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;