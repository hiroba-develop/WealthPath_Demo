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
function fmtSign(n: number): string { return (n >= 0 ? "+" : "") + fmt(n); }

// ── Entry type (mirrors DataEntry) ───────────────────────────────
type DataTab = "asset" | "liability" | "revenue" | "cost";
interface Entry {
  id: string; tab: DataTab; business: string; content: string;
  occurred_at: string; due_at: string; amount: string; yield_rate: string; memo: string;
}
function parseAmt(s: string): number { return parseInt(s.replace(/,/g, ""), 10) || 0; }
function toYM(d: string): string { return d ? d.slice(0, 7) : ""; }

// ── Sample entries (same as DataEntry) ───────────────────────────
const TM  = currentYM();
const PM  = shiftYM(TM, -1);
const PM2 = shiftYM(TM, -2);

const ALL_ENTRIES: Entry[] = [
  // 個人
  { id:"p01", tab:"asset",     business:"", content:"三菱UFJ定期預金",           occurred_at:`${TM}-05`,  due_at:`${shiftYM(TM,12)}-05`, amount:"500",  yield_rate:"0.2", memo:"" },
  { id:"p02", tab:"asset",     business:"", content:"SBI証券 S&P500インデックス", occurred_at:`${TM}-10`,  due_at:"",                     amount:"320",  yield_rate:"7.0", memo:"" },
  { id:"p03", tab:"asset",     business:"", content:"自宅マンション（評価額）",    occurred_at:`${TM}-01`,  due_at:"",                     amount:"4200", yield_rate:"",    memo:"" },
  { id:"p04", tab:"asset",     business:"", content:"iDeCo 全世界株式",           occurred_at:`${TM}-25`,  due_at:"",                     amount:"280",  yield_rate:"5.5", memo:"" },
  { id:"p05", tab:"liability", business:"", content:"住宅ローン残高",             occurred_at:`${TM}-01`,  due_at:`${shiftYM(TM,300)}-01`,amount:"2800", yield_rate:"",    memo:"変動金利 0.475%" },
  { id:"p06", tab:"liability", business:"", content:"カーローン",                 occurred_at:`${TM}-15`,  due_at:`${shiftYM(TM,36)}-15`, amount:"180",  yield_rate:"",    memo:"残り3年" },
  { id:"p07", tab:"revenue",   business:"", content:"給与（今月）",               occurred_at:`${TM}-25`,  due_at:"",                     amount:"55",   yield_rate:"",    memo:"" },
  { id:"p08", tab:"revenue",   business:"", content:"副業 Webライティング",        occurred_at:`${TM}-20`,  due_at:"",                     amount:"8",    yield_rate:"",    memo:"" },
  { id:"p09", tab:"revenue",   business:"", content:"配当収入（国内株）",           occurred_at:`${TM}-28`,  due_at:"",                     amount:"12",   yield_rate:"",    memo:"" },
  { id:"p10", tab:"cost",      business:"", content:"家賃",                       occurred_at:`${TM}-01`,  due_at:"",                     amount:"12",   yield_rate:"",    memo:"" },
  { id:"p11", tab:"cost",      business:"", content:"生命保険・医療保険",          occurred_at:`${TM}-05`,  due_at:"",                     amount:"3",    yield_rate:"",    memo:"" },
  { id:"p12", tab:"asset",     business:"", content:"楽天証券 日本株",             occurred_at:`${PM}-08`,  due_at:"",                     amount:"210",  yield_rate:"3.2", memo:"" },
  { id:"p13", tab:"liability", business:"", content:"奨学金残高",                 occurred_at:`${PM}-01`,  due_at:`${shiftYM(TM,24)}-01`, amount:"130",  yield_rate:"",    memo:"" },
  { id:"p14", tab:"revenue",   business:"", content:"給与（先月）",               occurred_at:`${PM}-25`,  due_at:"",                     amount:"55",   yield_rate:"",    memo:"" },
  { id:"p15", tab:"cost",      business:"", content:"食費・日用品",               occurred_at:`${PM}-31`,  due_at:"",                     amount:"8",    yield_rate:"",    memo:"" },
  { id:"p16", tab:"cost",      business:"", content:"書籍・学習費",               occurred_at:`${PM}-15`,  due_at:"",                     amount:"2",    yield_rate:"",    memo:"" },
  { id:"p17", tab:"asset",     business:"", content:"外貨預金（USD）",             occurred_at:`${PM2}-15`, due_at:"",                     amount:"95",   yield_rate:"1.5", memo:"" },
  { id:"p18", tab:"cost",      business:"", content:"年間保険料（一括）",          occurred_at:`${PM2}-05`, due_at:"",                     amount:"18",   yield_rate:"",    memo:"" },
  // 事業
  { id:"b01", tab:"asset",     business:"A事業",           content:"店舗設備一式",          occurred_at:`${TM}-01`,  due_at:"",                      amount:"800",  yield_rate:"", memo:"" },
  { id:"b02", tab:"asset",     business:"A事業",           content:"運転資金（普通預金）",   occurred_at:`${TM}-01`,  due_at:"",                      amount:"200",  yield_rate:"", memo:"" },
  { id:"b03", tab:"asset",     business:"Bコンサルティング", content:"業務用PC・機材",        occurred_at:`${TM}-05`,  due_at:"",                      amount:"150",  yield_rate:"", memo:"" },
  { id:"b04", tab:"liability", business:"A事業",           content:"設備投資ローン",         occurred_at:`${TM}-01`,  due_at:`${shiftYM(TM,60)}-01`,  amount:"600",  yield_rate:"", memo:"金利1.2%" },
  { id:"b05", tab:"liability", business:"Bコンサルティング", content:"事業用クレジット残高",  occurred_at:`${TM}-15`,  due_at:`${shiftYM(TM,1)}-25`,   amount:"45",   yield_rate:"", memo:"" },
  { id:"b06", tab:"revenue",   business:"A事業",           content:"店舗売上（今月）",       occurred_at:`${TM}-30`,  due_at:"",                      amount:"320",  yield_rate:"", memo:"" },
  { id:"b07", tab:"revenue",   business:"Bコンサルティング", content:"C社 月次顧問料",        occurred_at:`${TM}-20`,  due_at:"",                      amount:"50",   yield_rate:"", memo:"" },
  { id:"b08", tab:"revenue",   business:"Bコンサルティング", content:"D社 プロジェクト費用",  occurred_at:`${TM}-25`,  due_at:"",                      amount:"120",  yield_rate:"", memo:"" },
  { id:"b09", tab:"cost",      business:"A事業",           content:"食材・仕入原価",         occurred_at:`${TM}-30`,  due_at:"",                      amount:"95",   yield_rate:"", memo:"" },
  { id:"b10", tab:"cost",      business:"A事業",           content:"人件費（パート2名）",    occurred_at:`${TM}-25`,  due_at:"",                      amount:"48",   yield_rate:"", memo:"" },
  { id:"b11", tab:"cost",      business:"Bコンサルティング", content:"外注費（デザイン）",    occurred_at:`${TM}-18`,  due_at:"",                      amount:"30",   yield_rate:"", memo:"" },
  { id:"b12", tab:"revenue",   business:"A事業",           content:"店舗売上（先月）",       occurred_at:`${PM}-31`,  due_at:"",                      amount:"296",  yield_rate:"", memo:"" },
  { id:"b13", tab:"revenue",   business:"Bコンサルティング", content:"C社 月次顧問料",        occurred_at:`${PM}-20`,  due_at:"",                      amount:"50",   yield_rate:"", memo:"" },
  { id:"b14", tab:"cost",      business:"A事業",           content:"食材・仕入原価",         occurred_at:`${PM}-31`,  due_at:"",                      amount:"88",   yield_rate:"", memo:"" },
  { id:"b15", tab:"cost",      business:"Bコンサルティング", content:"SaaS各種サブスク",      occurred_at:`${PM}-01`,  due_at:"",                      amount:"4",    yield_rate:"", memo:"" },
];

{/*
// ── Compute summary figures ───────────────────────────────────────
function sumTab(tab: DataTab, ym?: string): number {
  return ALL_ENTRIES
    .filter(e => e.tab === tab && (ym ? toYM(e.occurred_at) === ym : true))
    .reduce((s, e) => s + parseAmt(e.amount), 0);
}
function countTab(tab: DataTab, ym: string): number {
  return ALL_ENTRIES.filter(e => e.tab === tab && toYM(e.occurred_at) === ym).length;
}
*/}
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

  // #1 返済期日が今月以内（danger）
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

  // #2 純資産マイナス（debt超過）- 個人・事業・統合それぞれ
  if (cNet < 0) result.push({ level: "danger", message: "純資産合計がマイナスです（債務超過）", detail: `純資産: ¥${fmt(cNet)}万` });
  if (pNet < 0) result.push({ level: "danger", message: "個人の純資産がマイナスです", detail: `資産 ¥${fmt(pAsset)}万 ／ 負債 ¥${fmt(pLiab)}万` });
  if (bNet < 0) result.push({ level: "danger", message: "事業の純資産がマイナスです", detail: `資産 ¥${fmt(bAsset)}万 ／ 負債 ¥${fmt(bLiab)}万` });

  // #3 今月収支マイナス
  if (pProfit < 0) result.push({ level: "danger", message: "個人の今月収支がマイナスです", detail: `収入 ¥${fmt(pRevTM)}万 ／ 支出 ¥${fmt(pCostTM)}万` });
  if (bProfit < 0) result.push({ level: "danger", message: "事業の今月収支がマイナスです", detail: `売上 ¥${fmt(bRevTM)}万 ／ コスト ¥${fmt(bCostTM)}万` });

  // #4 返済期日が翌月以内（warning）
  ALL_ENTRIES
    .filter(e => e.tab === "liability" && e.due_at && e.due_at > `${TM}-31` && e.due_at <= nextMonthEnd)
    .forEach(e => {
      result.push({
        level: "warning",
        message: `${e.business || "個人"} 「${e.content}」の返済期日が翌月に迫っています`,
        detail: `期日: ${e.due_at} ／ 残高: ¥${fmt(parseAmt(e.amount))}万`,
      });
    });

  // #5 負債比率が資産の80%超（warning）
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

  // #6 今月データが0件のカテゴリ（warning）
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

  // #7 前月比収入20%以上減（warning）
  if (prevCRev > 0 && cRev < prevCRev * 0.8) result.push({
    level: "warning",
    message: "今月の収入が先月より20%以上減少しています",
    detail: `今月 ¥${fmt(cRev)}万 ／ 先月 ¥${fmt(prevCRev)}万（${fmtSign(revGrowth)}%）`,
  });

  // #8 利回り未設定の個人資産（info）
  const noYield = ALL_ENTRIES.filter(e => e.tab === "asset" && e.business === "" && !e.yield_rate && toYM(e.occurred_at) === TM);
  if (noYield.length > 0) result.push({
    level: "info",
    message: `利回りが未設定の個人資産があります（${noYield.length}件）`,
    detail: noYield.map(e => e.content).join("、"),
  });

  return result;
}

const ALERTS = computeAlerts();

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

  /* 個人: teal */
  .db-col.personal { border-color: #9FE1CB; }
  .db-col.personal .db-col-hdr { background: ${tokens.tealLight}; border-bottom-color: #9FE1CB; }
  .db-col.personal .db-col-mode { color: #0F6E56; }
  .db-col.personal .db-col-stripe { background: ${tokens.teal}; }

  /* 事業: blue/primary */
  .db-col.business { border-color: #B5D4F4; }
  .db-col.business .db-col-hdr { background: ${tokens.primaryLight}; border-bottom-color: #B5D4F4; }
  .db-col.business .db-col-mode { color: #185FA5; }
  .db-col.business .db-col-stripe { background: ${tokens.primary}; }

  /* 統合: amber */
  .db-col.combined { border-color: #FAC775; }
  .db-col.combined .db-col-hdr { background: #FAEEDA; border-bottom-color: #FAC775; }
  .db-col.combined .db-col-mode { color: #633806; }
  .db-col.combined .db-col-stripe { background: #EF9F27; }

  /* 左上カラーバー */
  .db-col-stripe {
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 4px; border-radius: 12px 0 0 12px;
  }

  .db-col-hdr {
    padding: 14px 18px 12px 22px;
    border-bottom: 1px solid ${tokens.border};
  }
  .db-col-mode { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 4px; }
  .db-col-net  { font-size: 26px; font-weight: 700; letter-spacing: -0.8px; }
  .db-col-net-label { font-size: 11px; color: ${tokens.textSecondary}; margin-top: 1px; }

  .db-rows { padding: 4px 0; }
  .db-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 18px 9px 22px;
    border-bottom: 1px solid ${tokens.border};
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

  /* progress */
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

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .db-top  { grid-template-columns: repeat(3, 1fr); }
    .db-grid { grid-template-columns: 1fr; }
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

// ── Simulation forecast chart (embedded in Dashboard) ────────────

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
  const W = 660; const H = 240;
  const PL = 64; const PR = 20; const PT = 16; const PB = 32;
  const cW = W - PL - PR; const cH = H - PT - PB;

  // シミュレーション初期値に合わせた3シナリオ（Δ=3%）
  const scenarios = [
    { key: "low",  aR: Math.max(SIM_RATE_A - 0.03, 0), gR: Math.max(SIM_RATE_G - 0.03, 0), color: tokens.teal,    label: `低成長（${((SIM_RATE_A-0.03)*100).toFixed(0)}%）`, w: 2 },
    { key: "mid",  aR: SIM_RATE_A,                       gR: SIM_RATE_G,                      color: tokens.primary, label: `平均（${(SIM_RATE_A*100).toFixed(0)}%）`,           w: 2.5 },
    { key: "high", aR: SIM_RATE_A + 0.03,                gR: SIM_RATE_G + 0.03,               color: tokens.purple,  label: `高成長（${((SIM_RATE_A+0.03)*100).toFixed(0)}%）`,  w: 2 },
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

      {/* grid lines */}
      {ticks.map(v => {
        const yv = yPos(v);
        const label = v === 0 ? "0" : v >= 10000 ? `${(v/10000).toFixed(1)}億` : `${Math.round(v/100)*100}万`;
        return (
          <g key={v}>
            <line x1={PL} y1={yv} x2={W - PR} y2={yv}
              stroke={tokens.border} strokeWidth="1" strokeDasharray="4,4" />
            <text x={PL - 8} y={yv + 4} textAnchor="end" fontSize="8" fill={tokens.textMuted}
              fontFamily="'Noto Sans JP', sans-serif">{label}</text>
          </g>
        );
      })}

      {/* x-axis labels */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
        <text key={y} x={xPos(y)} y={H - PB + 16} textAnchor="middle"
          fontSize="8" fill={tokens.textMuted} fontFamily="'Noto Sans JP', sans-serif">
          {y === 0 ? "0年" : `${y}年`}
        </text>
      ))}

      {/* area fills */}
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

      {/* target line */}
      {(() => {
        const ty = yPos(target);
        return (
          <>
            <line x1={PL} y1={ty} x2={W - PR} y2={ty}
              stroke={tokens.danger} strokeWidth="1.2" strokeDasharray="6,4" opacity="0.6" />
            <text x={W - PR + 2} y={ty + 4} fontSize="10" fill={tokens.danger}
              fontFamily="'Noto Sans JP', sans-serif" fontWeight="500">目標</text>
          </>
        );
      })()}

      {/* lines */}
      {resolvedPaths.map(sc => (
        <path key={`line-${sc.key}`} d={smoothPath(sc.coords)}
          fill="none" stroke={sc.color} strokeWidth={sc.w}
          strokeLinecap="round" strokeLinejoin="round"
          opacity={sc.key === "mid" ? 1 : 0.85} />
      ))}

      {/* dots on each data point for mid line */}
      {resolvedPaths.find(s => s.key === "mid")?.coords.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 5 : 3}
          fill={i === 0 ? tokens.primary : tokens.surface}
          stroke={tokens.primary} strokeWidth="1.5" />
      ))}

      {/* current label */}
      <text x={xPos(0) + 8} y={yPos(currentNet) - 8} fontSize="10"
        fill={tokens.primary} fontFamily="'Noto Sans JP', sans-serif" fontWeight="600">現在</text>
    </svg>
  );
};

// ── Monthly trend sample data (12 months) ────────────────────────
const MONTHLY_DATA: { ym: string; asset: number; liability: number; revenue: number; cost: number }[] = [
  { ym: shiftYM(TM,-11), asset:4200, liability:3200, revenue:55,  cost:18 },
  { ym: shiftYM(TM,-10), asset:4280, liability:3180, revenue:58,  cost:20 },
  { ym: shiftYM(TM,-9),  asset:4350, liability:3160, revenue:62,  cost:17 },
  { ym: shiftYM(TM,-8),  asset:4420, liability:3140, revenue:60,  cost:22 },
  { ym: shiftYM(TM,-7),  asset:4500, liability:3120, revenue:65,  cost:19 },
  { ym: shiftYM(TM,-6),  asset:4600, liability:3100, revenue:68,  cost:21 },
  { ym: shiftYM(TM,-5),  asset:4750, liability:3090, revenue:70,  cost:20 },
  { ym: shiftYM(TM,-4),  asset:4900, liability:3080, revenue:72,  cost:23 },
  { ym: shiftYM(TM,-3),  asset:5050, liability:3070, revenue:69,  cost:18 },
  { ym: shiftYM(TM,-2),  asset:5200, liability:3060, revenue:75,  cost:28 },
  { ym: PM,              asset:5400, liability:3050, revenue:401, cost:102 },
  { ym: TM,              asset:Math.round(cAsset), liability:Math.round(cLiab), revenue:Math.round(cRev), cost:Math.round(cCost) },
];

type TrendUnit = "monthly" | "yearly";

function toYearlyData(monthly: typeof MONTHLY_DATA) {
  const map = new Map<string, typeof MONTHLY_DATA[0]>();
  monthly.forEach(d => {
    const y = d.ym.slice(0, 4);
    const cur = map.get(y);
    map.set(y, {
      ym: y,
      asset:     Math.max(cur?.asset ?? 0, d.asset),
      liability: Math.max(cur?.liability ?? 0, d.liability),
      revenue:   (cur?.revenue ?? 0) + d.revenue,
      cost:      (cur?.cost ?? 0) + d.cost,
    });
  });
  return Array.from(map.values());
}

// 汎用SVGグラフ（複数ライン対応）
function MultiLineChart({ data, lines, unit, H = 180 }: {
  data: typeof MONTHLY_DATA;
  lines: { key: keyof typeof MONTHLY_DATA[0]; label: string; color: string }[];
  unit: TrendUnit;
  H?: number;
}) {
  const W = 640; const PL = 58; const PR = 18; const PT = 12; const PB = 28;
  const cW = W - PL - PR; const cH = H - PT - PB;

  const allVals = data.flatMap(d => lines.map(l => d[l.key] as number));
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals) * 1.15 || 1;
  const hasNeg = minV < 0;
  const yMin = hasNeg ? minV * 1.2 : 0;
  const yRange = maxV - yMin;

  const xPos = (i: number) => PL + (i / (data.length - 1)) * cW;
  const yPos = (v: number) => PT + cH - ((v - yMin) / yRange) * cH;

  function smoothBez(pts: [number, number][]): string {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i];
      const cpx = (x0 + x1) / 2;
      d += ` C${cpx.toFixed(1)},${y0.toFixed(1)} ${cpx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return d;
  }

  const tickVals = Array.from({ length: 5 }, (_, i) => yMin + (yRange / 4) * i);
  const xLabels = data.map((d, i) => {
    if (unit === "yearly") return { i, label: `${d.ym}年` };
    if (i % 3 === 0 || i === data.length - 1) {
      const m = d.ym.split("-")[1];
      return { i, label: `${parseInt(m)}月` };
    }
    return null;
  }).filter(Boolean) as { i: number; label: string }[];

  //const zero = hasNeg ? yPos(0) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        {lines.map(l => (
          <linearGradient key={l.key} id={`mg-${String(l.key)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={l.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>

      {/* grid */}
      {tickVals.map((v, ti) => {
        const yv = yPos(v);
        const lbl = v === 0 ? "0" : Math.abs(v) >= 10000
          ? `${(v / 10000).toFixed(1)}億`
          : `${Math.round(v)}万`;
        return (
          <g key={ti}>
            <line x1={PL} y1={yv} x2={W - PR} y2={yv}
              stroke={v === 0 && hasNeg ? tokens.borderMid : tokens.border}
              strokeWidth={v === 0 && hasNeg ? 1.5 : 1} strokeDasharray="4,4" />
            <text x={PL - 6} y={yv + 3.5} textAnchor="end" fontSize="8"
              fill={tokens.textMuted} fontFamily="'Noto Sans JP',sans-serif">{lbl}</text>
          </g>
        );
      })}

      {/* x labels */}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={xPos(i)} y={H - PB + 14} textAnchor="middle"
          fontSize="8" fill={tokens.textMuted} fontFamily="'Noto Sans JP',sans-serif">{label}</text>
      ))}

      {/* area + line per series */}
      {lines.map(l => {
        const coords: [number, number][] = data.map((d, i) => [xPos(i), yPos(d[l.key] as number)]);
        const linePath = smoothBez(coords);
        const bottom = yPos(hasNeg ? 0 : yMin);
        const area = linePath
          + ` L${coords[coords.length - 1][0].toFixed(1)},${bottom.toFixed(1)}`
          + ` L${coords[0][0].toFixed(1)},${bottom.toFixed(1)} Z`;
        return (
          <g key={String(l.key)}>
            <path d={area} fill={`url(#mg-${String(l.key)})`} stroke="none" />
            <path d={linePath} fill="none" stroke={l.color}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {coords.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy}
                r={i === coords.length - 1 ? 4.5 : 2.5}
                fill={i === coords.length - 1 ? l.color : tokens.surface}
                stroke={l.color} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

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
  const [alertOpen,  setAlertOpen]  = useState(true);
  const [trendUnit,  setTrendUnit]  = useState<TrendUnit>("monthly");

  return (
    <div className="db">
      <style>{css}</style>

      {/* Heading */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>ダッシュボード</h1>
        <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>サマリー 現在値・{formatYM(TM)}</div>
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
            <div className="db-col-net" style={{ color: tokens.teal }}>¥{fmt(pNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span></div>
            <div className="db-col-net-label">純資産（資産 − 負債）</div>
          </div>
          <div className="db-rows">
            <Row label="資産合計"   value={pAsset}   color={tokens.teal} />
            <Row label="負債合計"   value={pLiab}    color={tokens.danger} />
            <Row label="今月 収入"  value={pRevTM}   color={tokens.primary} />
            <Row label="今月 支出"  value={pCostTM}  color={tokens.purple} />
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
            <div className="db-col-net" style={{ color: tokens.primary }}>¥{fmt(bNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span></div>
            <div className="db-col-net-label">純資産（資産 − 負債）</div>
          </div>
          <div className="db-rows">
            <Row label="資産合計"    value={bAsset}   color={tokens.teal} />
            <Row label="負債合計"    value={bLiab}    color={tokens.danger} />
            <Row label="今月 売上"   value={bRevTM}   color={tokens.primary} />
            <Row label="今月 コスト" value={bCostTM}  color={tokens.purple} />
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
            <div className="db-col-net" style={{ color: "#BA7517" }}>¥{fmt(cNet)}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: tokens.textSecondary }}>万</span></div>
            <div className="db-col-net-label">純資産合計（個人 + 事業）</div>
          </div>
          <div className="db-rows">
            <Row label="総資産合計"  value={cAsset}  color={tokens.teal} />
            <Row label="総負債合計"  value={cLiab}   color={tokens.danger} />
            <Row label="今月 収入計" value={cRev}    color={tokens.primary} />
            <Row label="今月 支出計" value={cCost}   color={tokens.purple} />
          </div>
          <div className="db-row-profit">
            <span className="db-row-profit-label">収支差額</span>
            <span className="db-row-profit-value" style={{ color: cProfit >= 0 ? tokens.teal : tokens.danger }}>
              {fmtSign(cProfit)}万円
            </span>
          </div>

          {/* 目標進捗 */}
          <div className="db-progress">
            <div className="db-progress-meta">
              <span className="db-progress-meta-label">純資産目標達成率（目標 ¥5,000万）</span>
              <span className="db-progress-meta-value">{targetPct}%</span>
            </div>
            <div className="db-progress-track">
              <div className="db-progress-fill" style={{ width: `${targetPct}%`, background: "#EF9F27" }} />
            </div>
          </div>

          {/* 10年予測 */}
          <div className="db-forecast">
            <div className="db-forecast-label">10年後予測（年率5%）</div>
            <div className="db-forecast-value">¥{fmt(tenYear)}<span className="db-forecast-unit">万</span></div>
          </div>
        </div>

      </div>
      {/* ── 推移グラフ（2グラフ） ── */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* 月次・年次切り替え（共通） */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
          {(["monthly", "yearly"] as TrendUnit[]).map(u => (
            <button key={u} onClick={() => setTrendUnit(u)} style={{
              padding: "4px 12px", fontSize: 11, fontWeight: 500, borderRadius: 6,
              background: trendUnit === u ? tokens.primaryLight : "none",
              color: trendUnit === u ? tokens.primary : tokens.textMuted,
              border: trendUnit === u ? `1px solid ${tokens.borderMid}` : `1px solid ${tokens.border}`,
              cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif",
            }}>
              {u === "monthly" ? "月次" : "年次"}
            </button>
          ))}
        </div>

        {/* ① ストック：純資産 / 資産 / 負債 */}
        <div className="db-alert-wrap" style={{ marginBottom: 0 }}>
          <div className="db-alert-hdr" style={{ cursor: "default" }}>
            <div className="db-alert-hdr-left" style={{ fontSize: 13 }}>
              ストック推移
              <span style={{ fontSize: 11, color: tokens.textMuted, fontWeight: 400, marginLeft: 6 }}>純資産 / 資産 / 負債</span>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { label: "純資産", color: tokens.primary },
                { label: "資産",   color: tokens.teal },
                { label: "負債",   color: tokens.danger },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: tokens.textSecondary }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px 16px 14px" }}>
            <MultiLineChart
              data={(trendUnit === "yearly" ? toYearlyData(MONTHLY_DATA) : MONTHLY_DATA).map(d => ({
                ...d,
                netasset: d.asset - d.liability,
              }) as any)}
              lines={[
                { key: "netasset" as any, label: "純資産", color: tokens.primary },
                { key: "asset",           label: "資産",   color: tokens.teal },
                { key: "liability",       label: "負債",   color: tokens.danger },
              ]}
              unit={trendUnit}
            />
          </div>
        </div>

        {/* ② フロー：売上 / コスト / 収支差額 */}
        <div className="db-alert-wrap" style={{ marginBottom: 0 }}>
          <div className="db-alert-hdr" style={{ cursor: "default" }}>
            <div className="db-alert-hdr-left" style={{ fontSize: 13 }}>
              フロー推移
              <span style={{ fontSize: 11, color: tokens.textMuted, fontWeight: 400, marginLeft: 6 }}>売上 / コスト / 収支差額</span>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { label: "売上",     color: tokens.primary },
                { label: "コスト",   color: tokens.purple },
                { label: "収支差額", color: tokens.teal },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: tokens.textSecondary }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px 16px 14px" }}>
            <MultiLineChart
              data={(trendUnit === "yearly" ? toYearlyData(MONTHLY_DATA) : MONTHLY_DATA).map(d => ({
                ...d,
                profit: d.revenue - d.cost,
              }) as any)}
              lines={[
                { key: "revenue" as any, label: "売上",     color: tokens.primary },
                { key: "cost",           label: "コスト",   color: tokens.purple },
                { key: "profit" as any,  label: "収支差額", color: tokens.teal },
              ]}
              unit={trendUnit}
            />
          </div>
        </div>
      </div>

      {/* ── 10年後シミュレーション グラフ ── */}
      <div style={{ marginTop: 20 }}>
        <div className="db-alert-wrap">
          <div className="db-alert-hdr" style={{ cursor: "default" }}>
            <div className="db-alert-hdr-left" style={{ fontSize: 14 }}>
              10年後シミュレーション
              <span className="db-badge info" style={{ marginLeft: 4 }}>平均シナリオ（年率5%）</span>
            </div>
            <span style={{ fontSize: 11, color: tokens.textMuted }}>
              目標 ¥{fmt(5000)}万 ／ 予測 ¥{fmt(tenYear)}万
            </span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {/* 凡例 */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              {[
                { label: "低成長（0%）",  color: tokens.teal },
                { label: "平均（3%）",    color: tokens.primary },
                { label: "高成長（6%）",  color: tokens.purple },
                { label: "目標ライン", color: tokens.danger, dashed: true },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: tokens.textSecondary }}>
                  {l.dashed ? (
                    <svg width="20" height="8">
                      <line x1="0" y1="4" x2="20" y2="4" stroke={l.color} strokeWidth="1.8" strokeDasharray="4,2" />
                    </svg>
                  ) : (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
                  )}
                  {l.label}
                </div>
              ))}
            </div>
            {/* SVGグラフ */}
            <SimForecastChart
              currentNet={cNet}
              personalNet={pNet}
              businessNet={bNet}
              target={5000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;