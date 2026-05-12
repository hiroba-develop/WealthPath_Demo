import { useState, useRef, useEffect } from "react";
import { T as tokens } from "../components/Authshared";
import { useFixedCost, type FixedCostMaster, PERSONAL_BIZ_ID } from "../contexts/Fixedcostcontext";

// ── Types ────────────────────────────────────────────────────────
type Mode    = "business" | "personal";
type DataTab = "asset" | "liability" | "revenue" | "cost";

interface Entry {
  id: string;
  tab: DataTab;
  business: string;
  content: string;
  occurred_at: string;
  due_at: string;
  amount: string;
  yield_rate: string;
  memo: string;
  isAuto?: boolean;   // 自動生成フラグ（仮・未確定）
  autoId?: string;    // 固定費マスタのID（重複生成防止用）
}

// FixedCostMaster 型は FixedCostContext から import

// ── Styles ───────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap');
  .de-wrap { font-family: 'Noto Sans JP', sans-serif; }

  .de-summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .de-summary-card {
    background: ${tokens.surface}; border: 2px solid ${tokens.border};
    border-radius: ${tokens.radius}; padding: 16px 18px; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .de-summary-card:hover { border-color: #c8ccdc; box-shadow: 0 2px 8px rgba(28,30,46,0.07); }
  .de-summary-card.active-asset      { border-color: ${tokens.teal};    background: ${tokens.tealLight}; }
  .de-summary-card.active-liability  { border-color: ${tokens.danger};  background: ${tokens.dangerLight}; }
  .de-summary-card.active-revenue    { border-color: ${tokens.primary}; background: ${tokens.primaryLight}; }
  .de-summary-card.active-cost       { border-color: ${tokens.purple};  background: ${tokens.purpleLight}; }
  .de-summary-label { font-size: 12px; color: ${tokens.textSecondary}; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .de-summary-card.active-asset .de-summary-label,
  .de-summary-card.active-liability .de-summary-label,
  .de-summary-card.active-revenue .de-summary-label,
  .de-summary-card.active-cost .de-summary-label { color: ${tokens.textPrimary}; font-weight: 500; }
  .de-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .de-summary-amount { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; }
  .de-summary-unit { font-size: 12px; color: ${tokens.textSecondary}; margin-left: 4px; font-weight: 400; }
  .de-month-total { font-size: 11px; margin-top: 8px; padding-top: 7px; border-top: 1px solid rgba(0,0,0,0.07); color: ${tokens.textMuted}; }
  .de-month-total .mv { font-weight: 600; color: ${tokens.textSecondary}; }

  .de-panel { background: ${tokens.surface}; border: 1px solid ${tokens.border}; border-radius: ${tokens.radius}; overflow: hidden; margin-bottom: 24px; }

  .de-accordion-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; cursor: pointer; user-select: none; transition: background 0.12s; }
  .de-accordion-header:hover { background: ${tokens.bg}; }
  .de-accordion-header.open { border-bottom: 1px solid ${tokens.border}; }
  .de-accordion-title { font-size: 14px; font-weight: 600; color: ${tokens.textPrimary}; display: flex; align-items: center; gap: 8px; }
  .de-accordion-right { display: flex; align-items: center; gap: 8px; }
  .de-chevron { color: ${tokens.textMuted}; transition: transform 0.2s; display: flex; align-items: center; }
  .de-chevron.open { transform: rotate(180deg); }

  .de-form-body { padding: 20px; }
  .de-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .de-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .de-group { display: flex; flex-direction: column; gap: 6px; }
  .de-group.span2 { grid-column: span 2; }
  .de-label { font-size: 12px; font-weight: 500; color: ${tokens.textSecondary}; }
  .de-req { color: ${tokens.danger}; margin-left: 2px; }

  .de-input, .de-select {
    height: 38px; padding: 0 12px; border: 1px solid ${tokens.border}; border-radius: ${tokens.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif; color: ${tokens.textPrimary};
    background: ${tokens.surface}; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%; appearance: none;
  }
  .de-input:focus, .de-select:focus { border-color: ${tokens.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .de-input::placeholder { color: ${tokens.textMuted}; }
  .de-textarea {
    padding: 10px 12px; border: 1px solid ${tokens.border}; border-radius: ${tokens.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif; color: ${tokens.textPrimary};
    background: ${tokens.surface}; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%; resize: vertical; min-height: 72px;
  }
  .de-textarea:focus { border-color: ${tokens.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .de-select-wrap { position: relative; }
  .de-select-wrap::after { content: ''; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid ${tokens.textSecondary}; pointer-events: none; }
  .de-input-suffix { position: relative; }
  .de-input-suffix .de-input { padding-right: 36px; }
  .de-input-suffix-label { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: ${tokens.textMuted}; pointer-events: none; }

  .de-divider { border: none; border-top: 1px solid ${tokens.border}; margin: 20px 0; }
  .de-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid ${tokens.border}; background: ${tokens.bg}; }

  .de-btn { height: 36px; padding: 0 18px; border-radius: ${tokens.radiusSm}; font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500; cursor: pointer; border: none; transition: background 0.15s, transform 0.1s; display: inline-flex; align-items: center; gap: 6px; }
  .de-btn:active { transform: scale(0.98); }
  .de-btn-primary { background: ${tokens.primary}; color: white; }
  .de-btn-primary:hover { background: ${tokens.primaryHover}; }
  .de-btn-ghost { background: none; border: 1px solid ${tokens.border}; color: ${tokens.textSecondary}; }
  .de-btn-ghost:hover { background: ${tokens.bg}; color: ${tokens.textPrimary}; }
  .de-btn-danger { background: ${tokens.dangerLight}; color: ${tokens.danger}; border: 1px solid transparent; }
  .de-btn-danger:hover { background: #fcd9d9; }
  .de-btn-sm { height: 28px; padding: 0 10px; font-size: 12px; border-radius: 6px; }

  .de-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
  .de-badge-liability { background: ${tokens.dangerLight}; color: ${tokens.danger}; }
  .de-badge-asset     { background: ${tokens.tealLight};   color: #0F6E56; }
  .de-badge-revenue   { background: ${tokens.primaryLight}; color: ${tokens.primary}; }
  .de-badge-cost      { background: ${tokens.purpleLight}; color: #7B50D6; }
  /* 自動生成バッジ */
  .de-badge-auto {
    font-size: 10.5px; font-weight: 500; padding: 1px 7px; border-radius: 20px;
    background: ${tokens.bg}; color: ${tokens.textMuted};
    border: 1px solid ${tokens.border};
  }

  /* 自動生成バナー */
  .de-auto-banner {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 16px; background: #FFFBEB; border-bottom: 1px solid #F5C87A;
    font-size: 12px; color: #7A4A00;
  }
  .de-auto-banner-title { font-weight: 600; margin-bottom: 2px; }
  .de-auto-banner-sub { font-size: 11px; color: #9A6010; line-height: 1.6; }

  /* 自動生成行のスタイル */
  .de-row-item.is-auto { background: #FFFDF5; }
  .de-row-item.is-auto:hover { background: #FFF8E6; }

  .de-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .de-list-title { font-size: 14px; font-weight: 600; color: ${tokens.textPrimary}; }

  .de-pager { display: flex; align-items: center; gap: 4px; }
  .de-pager-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid ${tokens.border}; background: ${tokens.surface}; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${tokens.textSecondary}; transition: background 0.15s, color 0.15s; }
  .de-pager-btn:hover { background: ${tokens.primaryLight}; color: ${tokens.primary}; border-color: transparent; }
  .de-pager-btn:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
  .de-pager-month { font-size: 13px; font-weight: 500; color: ${tokens.textPrimary}; min-width: 90px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .de-pager-now { font-size: 11px; background: ${tokens.primaryLight}; color: ${tokens.primary}; padding: 1px 7px; border-radius: 20px; font-weight: 500; }

  .de-group-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px 8px; background: ${tokens.bg};
    border-bottom: 1px solid ${tokens.border};
  }
  .de-group-header:not(:first-child) { border-top: 1px solid ${tokens.border}; }
  .de-group-name { font-size: 12px; font-weight: 600; color: ${tokens.textSecondary}; display: flex; align-items: center; gap: 6px; }
  .de-group-count { font-size: 11px; color: ${tokens.textMuted}; }
  .de-group-total { font-size: 12px; font-weight: 600; color: ${tokens.textPrimary}; }

  .de-row-list { display: flex; flex-direction: column; }
  .de-row-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid ${tokens.border}; transition: background 0.12s; }
  .de-row-item:last-child { border-bottom: none; }
  .de-row-item:hover { background: ${tokens.bg}; }
  .de-row-bar { width: 4px; height: 38px; border-radius: 3px; flex-shrink: 0; }
  .de-row-info { flex: 1; min-width: 0; }
  .de-row-content { font-size: 13.5px; font-weight: 500; color: ${tokens.textPrimary}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
  .de-row-sub { font-size: 11.5px; color: ${tokens.textMuted}; margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .de-row-due { color: ${tokens.danger}; }
  .de-row-yield { color: ${tokens.teal}; font-weight: 500; }
  .de-row-amount { font-size: 14px; font-weight: 600; letter-spacing: -0.3px; flex-shrink: 0; text-align: right; }
  .de-row-amount-unit { font-size: 11px; font-weight: 400; margin-left: 2px; }
  .de-row-chevron { color: ${tokens.textMuted}; flex-shrink: 0; }

  .de-empty { text-align: center; padding: 48px 20px; color: ${tokens.textMuted}; }
  .de-empty-icon { width: 48px; height: 48px; border-radius: 14px; background: ${tokens.bg}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
  .de-empty-text { font-size: 13px; }

  .de-overlay { position: fixed; inset: 0; background: rgba(28,30,46,0.4); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; animation: deFadeIn 0.15s ease; }
  @keyframes deFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .de-modal { background: ${tokens.surface}; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: deSlideUp 0.18s ease; }
  @keyframes deSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .de-modal-header { padding: 18px 24px 14px; border-bottom: 1px solid ${tokens.border}; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: ${tokens.surface}; z-index: 1; }
  .de-modal-title { font-size: 16px; font-weight: 600; color: ${tokens.textPrimary}; display: flex; align-items: center; gap: 8px; }
  .de-modal-close { width: 32px; height: 32px; border-radius: 8px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${tokens.textMuted}; transition: background 0.15s, color 0.15s; }
  .de-modal-close:hover { background: ${tokens.bg}; color: ${tokens.textPrimary}; }
  .de-modal-body { padding: 4px 24px 20px; }
  .de-modal-footer { padding: 14px 24px; border-top: 1px solid ${tokens.border}; display: flex; align-items: center; justify-content: space-between; background: ${tokens.bg}; border-radius: 0 0 16px 16px; }

  .de-detail-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${tokens.border}; align-items: flex-start; }
  .de-detail-row:last-child { border-bottom: none; }
  .de-detail-key { font-size: 12px; font-weight: 500; color: ${tokens.textSecondary}; width: 72px; flex-shrink: 0; padding-top: 2px; }
  .de-detail-val { font-size: 13.5px; color: ${tokens.textPrimary}; flex: 1; }
  .de-detail-amount { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }

  /* 固定費チェックボックス */
  .de-fixed-check-row {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: ${tokens.radiusSm};
    background: ${tokens.bg}; border: 1px solid ${tokens.border};
    cursor: pointer; transition: background 0.12s, border-color 0.12s;
    user-select: none;
  }
  .de-fixed-check-row:hover { background: ${tokens.primaryLight}; border-color: #C5CFF7; }
  .de-fixed-check-row.checked { background: ${tokens.primaryLight}; border-color: ${tokens.primary}; }
  .de-fixed-check-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: ${tokens.primary}; cursor: pointer; flex-shrink: 0; }
  .de-fixed-check-label { font-size: 13px; font-weight: 500; color: ${tokens.textSecondary}; }
  .de-fixed-check-row.checked .de-fixed-check-label { color: ${tokens.primary}; }
  .de-fixed-period-box {
    padding: 14px; border-radius: ${tokens.radiusSm};
    background: ${tokens.primaryLight}; border: 1px solid #C5CFF7;
    display: flex; flex-direction: column; gap: 12px;
  }

  .de-hint { font-size: 11px; color: ${tokens.textMuted}; margin-top: 4px; }

  /* 文字数カウンター */
  .de-char-count { font-size: 10.5px; margin-top: 3px; text-align: right; }
  .de-char-count.ok   { color: ${tokens.textMuted}; }
  .de-char-count.warn { color: #E8921A; }
  .de-char-count.over { color: ${tokens.danger}; font-weight: 600; }

  .de-toast { position: fixed; bottom: 24px; right: 24px; color: white; padding: 10px 16px; border-radius: ${tokens.radiusSm}; font-size: 13px; display: flex; align-items: center; gap: 8px; z-index: 1000; animation: deSlideUp 0.2s ease; box-shadow: 0 4px 12px rgba(28,30,46,0.2); }

  @media (max-width: 768px) {
    .de-summary-row { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
    .de-summary-amount { font-size: 18px; }
    .de-accordion-header { padding: 12px 16px; }
    .de-accordion-title { flex-wrap: wrap; }
    .de-form-body { padding: 16px; }
    .de-grid-3 { grid-template-columns: 1fr 1fr; }
    .de-footer { padding: 12px 16px; }
    .de-list-header { flex-wrap: wrap; gap: 8px; }
    .de-modal-header { padding: 14px 16px 12px; }
    .de-modal-body { padding: 4px 16px 16px; }
    .de-modal-footer { padding: 12px 16px; }
    .de-row-item { padding: 10px 12px; }
    .de-group-header { padding: 8px 12px; }
  }
  @media (max-width: 480px) {
    .de-summary-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .de-summary-card { padding: 12px; }
    .de-summary-amount { font-size: 16px; }
    .de-summary-unit { font-size: 11px; }
    .de-month-total { font-size: 10px; }
    .de-grid-3 { grid-template-columns: 1fr; }
    .de-grid-2 { grid-template-columns: 1fr; }
    .de-accordion-title { font-size: 13px; }
    .de-accordion-header { padding: 11px 14px; }
    .de-form-body { padding: 14px; }
    .de-btn { height: 40px; font-size: 14px; }
    .de-footer { padding: 10px 14px; }
    .de-list-header { flex-direction: column; align-items: flex-start; }
    .de-pager { align-self: flex-end; }
    .de-row-item { padding: 10px 12px; gap: 8px; }
    .de-row-content { font-size: 13px; }
    .de-row-amount { font-size: 13px; }
    .de-overlay { align-items: flex-end; padding: 0; }
    .de-modal { border-radius: 14px 14px 0 0; max-height: 92vh; }
    .de-modal-header { padding: 14px 16px 10px; }
    .de-modal-body { padding: 4px 16px 16px; }
    .de-modal-footer { padding: 10px 16px; border-radius: 0; }
    .de-detail-key { width: 60px; font-size: 11px; }
    .de-detail-amount { font-size: 17px; }
    .de-toast { bottom: 16px; right: 16px; left: 16px; }
  }
`;

// ── Icons ────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const DatabaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const ChevronRightSmIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const BuildingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
  </svg>
);
const SparkleIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
  </svg>
);

// ── Constants ────────────────────────────────────────────────────
const BUSINESS_OPTIONS = ["A事業", "Bコンサルティング", "その他"];

const tabColorMap: Record<DataTab, string> = {
  asset: tokens.teal, liability: tokens.danger, revenue: tokens.primary, cost: tokens.purple,
};
const tabLabelMap: Record<DataTab, string> = {
  asset: "資産の追加", liability: "負債の追加", revenue: "売上の追加", cost: "コストの追加",
};
const tabNameMap: Record<DataTab, string> = {
  asset: "資産", liability: "負債", revenue: "売上", cost: "コスト",
};
const badgeClassMap: Record<DataTab, string> = {
  asset: "de-badge-asset", liability: "de-badge-liability", revenue: "de-badge-revenue", cost: "de-badge-cost",
};
const summaryBase: { tab: DataTab; label: string; dotColor: string }[] = [
  { tab: "asset",     label: "資産",   dotColor: tokens.teal },
  { tab: "liability", label: "負債",   dotColor: tokens.danger },
  { tab: "revenue",   label: "売上",   dotColor: tokens.primary },
  { tab: "cost",      label: "コスト", dotColor: tokens.purple },
];

// ── 入力制御ユーティリティ ────────────────────────────────────────

/** 金額入力（整数6桁＋小数1桁、例: 999999.9） */
function sanitizeAmount(v: string): string {
  let s = v.replace(/[^\d.]/g, "");
  const parts = s.split(".");
  if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
  const [intPart, decPart] = s.split(".");
  const trimInt = (intPart ?? "").slice(0, 6);
  if (decPart === undefined) return trimInt;
  return trimInt + "." + decPart.slice(0, 1);
}

/** 文字数カウンタークラス */
function charCountClass(len: number, max: number): string {
  if (len > max) return "over";
  if (len >= max * 0.9) return "warn";
  return "ok";
}

// ── Helpers ──────────────────────────────────────────────────────
function emptyEntry(tab: DataTab): Entry {
  return { id: crypto.randomUUID(), tab, business: "", content: "", occurred_at: "", due_at: "", amount: "", yield_rate: "", memo: "" };
}
function formatAmount(val: string): string {
  const n = parseInt(val.replace(/,/g, ""), 10);
  return isNaN(n) ? "" : n.toLocaleString("ja-JP");
}
function toYM(dateStr: string): string { return dateStr ? dateStr.slice(0, 7) : ""; }
function formatYM(ym: string): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return `${y}年${parseInt(m)}月`;
}
function currentYM(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function shiftYM(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function parseAmount(s: string): number {
  return parseInt(s.replace(/,/g, ""), 10) || 0;
}

/**
 * 固定費マスタから当月の自動生成エントリを作成する
 * - start_date が設定されている場合、当月が start_date の月以降のみ生成
 * - end_date   が設定されている場合、当月が end_date   の月以前のみ生成（月途中終了は当月生成）
 * - autoId で重複チェックに使う（同じ月に同じ固定費を2重生成しない）
 */
function isInPeriod(ym: string, start_date: string, end_date: string): boolean {
  // ym は "YYYY-MM" 形式
  if (start_date) {
    const startYM = start_date.slice(0, 7); // "YYYY-MM"
    if (ym < startYM) return false;
  }
  if (end_date) {
    const endYM = end_date.slice(0, 7); // "YYYY-MM"（月途中終了でも当月は生成）
    if (ym > endYM) return false;
  }
  return true;
}

function generateAutoEntries(ym: string, masters: FixedCostMaster[], targetMode: "business" | "personal"): Entry[] {
  return masters
    .filter(m => {
      if (targetMode === "business") return m.bizId !== PERSONAL_BIZ_ID;
      return m.bizId === PERSONAL_BIZ_ID;
    })
    .filter(m => isInPeriod(ym, m.start_date, m.end_date))
    .map(m => ({
      id: crypto.randomUUID(),
      tab: "cost" as DataTab,
      business: m.bizId === PERSONAL_BIZ_ID ? "" : m.bizId,
      content: m.name,
      occurred_at: `${ym}-01`,
      due_at: "",
      amount: m.amount,
      yield_rate: "",
      memo: "",
      isAuto: true,
      autoId: `${ym}-${m.id}`,
    }));
}

// localStorage キー（業種別・個人別）
const LS_LAST_LOGIN_MONTH_BUSINESS = "de_lastLoginMonth_business";
const LS_LAST_LOGIN_MONTH_PERSONAL = "de_lastLoginMonth_personal";

// ── Sample Data ──────────────────────────────────────────────────
const TM  = currentYM();
const PM  = shiftYM(TM, -1);
const PM2 = shiftYM(TM, -2);

const BUSINESS_SAMPLE_ENTRIES: Entry[] = [
  { id:"b01", tab:"asset",     business:"A事業",            content:"運転資金（普通預金）",  occurred_at:`${TM}-01`, due_at:"",                     amount:"50",  yield_rate:"", memo:"" },
  { id:"b02", tab:"asset",     business:"Bコンサルティング", content:"業務用PC・機材",        occurred_at:`${TM}-05`, due_at:"",                     amount:"30",  yield_rate:"", memo:"MacBook Pro×2台" },
  { id:"b03", tab:"liability", business:"A事業",            content:"開業準備ローン",         occurred_at:`${TM}-01`, due_at:`${shiftYM(TM,36)}-01`, amount:"45",  yield_rate:"", memo:"金利1.5%" },
  { id:"b04", tab:"liability", business:"Bコンサルティング", content:"事業用クレジット残高",   occurred_at:`${TM}-15`, due_at:`${shiftYM(TM,1)}-25`,  amount:"5",   yield_rate:"", memo:"" },
  { id:"b05", tab:"revenue",   business:"A事業",            content:"店舗売上（今月）",       occurred_at:`${TM}-30`, due_at:"",                     amount:"18",  yield_rate:"", memo:"初月" },
  { id:"b06", tab:"revenue",   business:"Bコンサルティング", content:"C社 初回顧問料",         occurred_at:`${TM}-20`, due_at:"",                     amount:"10",  yield_rate:"", memo:"" },
  // 今月のコストは自動生成で表示するため手動サンプルは先月以前のみ
  { id:"b10", tab:"asset",     business:"A事業",            content:"運転資金（普通預金）",   occurred_at:`${PM}-01`, due_at:"",                     amount:"55",  yield_rate:"", memo:"" },
  { id:"b11", tab:"asset",     business:"Bコンサルティング", content:"業務用PC・機材",         occurred_at:`${PM}-05`, due_at:"",                     amount:"30",  yield_rate:"", memo:"" },
  { id:"b12", tab:"liability", business:"A事業",            content:"開業準備ローン",          occurred_at:`${PM}-01`, due_at:`${shiftYM(TM,36)}-01`, amount:"47",  yield_rate:"", memo:"金利1.5%" },
  { id:"b13", tab:"revenue",   business:"A事業",            content:"店舗売上（先月）",        occurred_at:`${PM}-31`, due_at:"",                     amount:"8",   yield_rate:"", memo:"プレオープン" },
  { id:"b14", tab:"cost",      business:"A事業",            content:"開業準備費用",            occurred_at:`${PM}-15`, due_at:"",                     amount:"12",  yield_rate:"", memo:"内装・備品" },
  { id:"b15", tab:"cost",      business:"Bコンサルティング", content:"SaaS各種サブスク",        occurred_at:`${PM}-01`, due_at:"",                     amount:"2",   yield_rate:"", memo:"" },
  { id:"b16", tab:"cost",      business:"A事業",            content:"家賃（店舗）",            occurred_at:`${PM}-01`, due_at:"",                     amount:"6",   yield_rate:"", memo:"" },
  { id:"b17", tab:"cost",      business:"A事業",            content:"仕入原価",                occurred_at:`${PM}-30`, due_at:"",                     amount:"8",   yield_rate:"", memo:"" },
];

const PERSONAL_SAMPLE_ENTRIES: Entry[] = [
  { id:"p01", tab:"asset",     business:"", content:"楽天銀行 普通預金",            occurred_at:`${TM}-05`, due_at:"",                     amount:"180", yield_rate:"0.1", memo:"" },
  { id:"p02", tab:"asset",     business:"", content:"SBI証券 S&P500インデックス",    occurred_at:`${TM}-10`, due_at:"",                     amount:"95",  yield_rate:"7.0", memo:"積立中" },
  { id:"p03", tab:"asset",     business:"", content:"iDeCo 全世界株式",              occurred_at:`${TM}-25`, due_at:"",                     amount:"55",  yield_rate:"5.5", memo:"" },
  { id:"p04", tab:"asset",     business:"", content:"外貨預金（USD）",               occurred_at:`${TM}-15`, due_at:"",                     amount:"30",  yield_rate:"1.5", memo:"150円換算" },
  { id:"p05", tab:"liability", business:"", content:"奨学金残高",                    occurred_at:`${TM}-01`, due_at:`${shiftYM(TM,48)}-01`, amount:"90",  yield_rate:"",    memo:"毎月返済中" },
  { id:"p06", tab:"liability", business:"", content:"カーローン",                    occurred_at:`${TM}-15`, due_at:`${shiftYM(TM,30)}-15`, amount:"40",  yield_rate:"",    memo:"残り2.5年" },
  { id:"p07", tab:"revenue",   business:"", content:"給与（今月）",                  occurred_at:`${TM}-25`, due_at:"",                     amount:"28",  yield_rate:"",    memo:"" },
  { id:"p08", tab:"revenue",   business:"", content:"副業 Webライティング",           occurred_at:`${TM}-20`, due_at:"",                     amount:"4",   yield_rate:"",    memo:"" },
  // p09/p10（家賃・保険料）は固定費マスタから自動生成されるためサンプルデータから除外
  { id:"p11", tab:"asset",     business:"", content:"楽天銀行 普通預金",             occurred_at:`${PM}-05`, due_at:"",                     amount:"168", yield_rate:"0.1", memo:"" },
  { id:"p12", tab:"asset",     business:"", content:"SBI証券 S&P500インデックス",    occurred_at:`${PM}-10`, due_at:"",                     amount:"90",  yield_rate:"7.0", memo:"" },
  { id:"p13", tab:"asset",     business:"", content:"iDeCo 全世界株式",              occurred_at:`${PM}-25`, due_at:"",                     amount:"52",  yield_rate:"5.5", memo:"" },
  { id:"p14", tab:"asset",     business:"", content:"外貨預金（USD）",               occurred_at:`${PM}-15`, due_at:"",                     amount:"30",  yield_rate:"1.5", memo:"" },
  { id:"p15", tab:"liability", business:"", content:"奨学金残高",                    occurred_at:`${PM}-01`, due_at:`${shiftYM(TM,48)}-01`, amount:"92",  yield_rate:"",    memo:"" },
  { id:"p16", tab:"liability", business:"", content:"カーローン",                    occurred_at:`${PM}-15`, due_at:`${shiftYM(TM,30)}-15`, amount:"41",  yield_rate:"",    memo:"" },
  { id:"p17", tab:"revenue",   business:"", content:"給与（先月）",                  occurred_at:`${PM}-25`, due_at:"",                     amount:"28",  yield_rate:"",    memo:"" },
  { id:"p18", tab:"cost",      business:"", content:"家賃",                          occurred_at:`${PM}-01`, due_at:"",                     amount:"7",   yield_rate:"",    memo:"" },
  { id:"p19", tab:"cost",      business:"", content:"食費・日用品",                  occurred_at:`${PM}-31`, due_at:"",                     amount:"5",   yield_rate:"",    memo:"" },
  { id:"p20", tab:"cost",      business:"", content:"年間保険料（一括）",             occurred_at:`${PM2}-05`, due_at:"",                   amount:"8",   yield_rate:"",    memo:"" },
];

// ── Component ────────────────────────────────────────────────────
const DataEntry = ({ mode }: { mode: Mode }) => {
  const modeLabel = mode === "business" ? "事業" : "個人";
  const thisYM    = currentYM();
  const sampleEntries = mode === "business" ? BUSINESS_SAMPLE_ENTRIES : PERSONAL_SAMPLE_ENTRIES;

  const { masters, addMaster } = useFixedCost();

  const [activeTab,     setActiveTab]     = useState<DataTab>("cost");
  const [form,          setForm]          = useState<Entry>(emptyEntry("cost"));
  const [formOpen,      setFormOpen]      = useState(true);
  const [entries,       setEntries]       = useState<Entry[]>(sampleEntries);

  // 固定費チェックボックス用 state
  const [isFixed,       setIsFixed]       = useState(false);
  const [fixedStartDate, setFixedStartDate] = useState("");
  const [fixedEndDate,   setFixedEndDate]   = useState("");

  // ── 自動生成エントリ（未確定・state のみ・DB未保存）────────────
  // useState の初期値で生成することで初回レンダー時から即表示される
  const [autoEntries,   setAutoEntries]   = useState<Entry[]>(() =>
    generateAutoEntries(thisYM, masters, mode)
  );

  const [viewMonth,     setViewMonth]     = useState<string>(thisYM);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isEditing,     setIsEditing]     = useState(false);
  const [editForm,      setEditForm]      = useState<Entry | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; type?: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCurrentMonth = viewMonth === thisYM;

  // ── 月初ログイン時に lastLoginMonth を更新 ────────────────────
  useEffect(() => {
    const key = mode === "business" ? LS_LAST_LOGIN_MONTH_BUSINESS : LS_LAST_LOGIN_MONTH_PERSONAL;
    localStorage.setItem(key, thisYM);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── masters が変わったとき（固定費追加・削除）autoEntries を再生成 ──
  useEffect(() => {
    setAutoEntries(prev => {
      // 別modeのエントリが混入していた場合は除去
      const prevFiltered = prev.filter(e =>
        mode === "personal"
          ? e.business === ""   // 個人: business が空のもののみ
          : e.business !== ""   // 事業: business がある（PERSONAL_BIZ_ID 由来でない）もののみ
      );
      const newAutos = generateAutoEntries(thisYM, masters, mode);

      // 除外1: すでに確定済み（entriesに移動済み）のもの
      const confirmedAutoIds = new Set(
        entries.filter(e => e.autoId).map(e => e.autoId as string)
      );
      // 除外2: 今月すでに手動でコスト登録されているマスタID（今月は手動登録を優先）
      const manuallyRegisteredMasterIds = new Set(
        entries
          .filter(e => e.tab === "cost" && !e.isAuto && (toYM(e.occurred_at) || thisYM) === thisYM)
          .map(e => masters.find(m => m.name === e.content && m.bizId === e.business)?.id)
          .filter(Boolean) as string[]
      );

      const filtered = newAutos.filter(e => {
        if (confirmedAutoIds.has(e.autoId!)) return false;
        // autoId は `${ym}-${masterId}` 形式なので masterId を取り出す
        const masterId = e.autoId?.replace(`${thisYM}-`, "");
        if (masterId && manuallyRegisteredMasterIds.has(masterId)) return false;
        return true;
      });

      // 既存の未確定分は保持しつつ、新しいマスタ分だけ追加
      const existingIds = new Set(prevFiltered.map(e => e.autoId));
      const toAdd = filtered.filter(e => !existingIds.has(e.autoId));
      // 削除されたマスタに対応する autoEntry は除去
      const validAutoIds = new Set(filtered.map(e => e.autoId));
      const kept = prevFiltered.filter(e => validAutoIds.has(e.autoId));
      return [...kept, ...toAdd];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masters]);

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function handleTabChange(tab: DataTab) {
    setActiveTab(tab);
    setForm(emptyEntry(tab));
    setIsFixed(false);
    setFixedStartDate("");
    setFixedEndDate("");
  }
  function handlePrevMonth() { setViewMonth(shiftYM(viewMonth, -1)); setFormOpen(false); }
  function handleNextMonth() {
    const m = shiftYM(viewMonth, 1);
    setViewMonth(m);
    if (m === thisYM) setFormOpen(true);
  }

  // 自動生成エントリを1件だけ確定（モーダルの「保存する」用）
  function handleConfirmAutoEntry(entry: Entry) {
    setEntries(prev => [{ ...entry, isAuto: false }, ...prev]);
    setAutoEntries(prev => prev.filter(e => e.id !== entry.id));
    setSelectedEntry(null);
    showToast("確定しました");
  }

  // 「保存する」→ 手動入力エントリのみ確定（自動生成とは無関係）
  function handleSave() {
    if (mode === "business" && !form.business) { showToast("事業を選択してください", "error"); return; }
    if (!form.content || !form.amount) { showToast("内容と金額は必須です", "error"); return; }

    // 通常コストとして登録
    const saved: Entry = { ...form, id: crypto.randomUUID(), tab: activeTab, isAuto: false };
    setEntries(prev => [saved, ...prev]);

    // 固定費チェックがある場合はマスタにも登録
    if (activeTab === "cost" && isFixed) {
      const newMaster = addMaster({
        bizId:      mode === "personal" ? PERSONAL_BIZ_ID : form.business,
        name:       form.content,
        amount:     form.amount.replace(/,/g, ""),
        start_date: fixedStartDate,
        end_date:   fixedEndDate,
        memo:       form.memo,
      });
      // 今月分は手動登録済みのため自動生成は不要。
      // masters の useEffect が走るが、下記の除外ロジックで今月分はスキップされる。
      showToast("コストを登録し、固定費マスタに追加しました");
    } else {
      showToast("保存しました");
    }

    setForm(emptyEntry(activeTab));
    setIsFixed(false);
    setFixedStartDate("");
    setFixedEndDate("");

    const savedMonth = toYM(saved.occurred_at) || thisYM;
    setViewMonth(savedMonth);
    if (savedMonth !== thisYM) setFormOpen(false);
  }

  function handleDelete(id: string) {
    // entries から削除
    setEntries(prev => prev.filter(e => e.id !== id));
    // autoEntries から削除（自動生成を削除＝今月は発生なし）
    setAutoEntries(prev => prev.filter(e => e.id !== id));
    setSelectedEntry(null);
    showToast("削除しました");
  }

  function handleEditSave() {
    if (!editForm || !editForm.content || !editForm.amount) { showToast("内容と金額は必須です", "error"); return; }

    // autoEntries の編集は autoEntries 内で更新（まだ未確定）
    if (editForm.isAuto) {
      setAutoEntries(prev => prev.map(e => e.id === editForm.id ? { ...editForm } : e));
    } else {
      setEntries(prev => prev.map(e => e.id === editForm.id ? editForm : e));
    }
    setSelectedEntry(editForm);
    setIsEditing(false);
    showToast("更新しました");
  }

  // 今月の自動生成エントリを取得（表示用）
  const currentMonthAutoEntries = autoEntries.filter(
    e => toYM(e.occurred_at) === viewMonth
  );

  // 今月表示中のエントリ（確定済み + 自動生成）
  // 自動生成はコストタブのみ表示
  const monthEntries = [
    ...(activeTab === "cost" ? currentMonthAutoEntries : []),
    ...entries.filter(e => {
      const em = toYM(e.occurred_at) || thisYM;
      return em === viewMonth && e.tab === activeTab;
    }),
  ];

  // 自動生成エントリが今月コストタブにある場合はバナー表示
  const hasAutoCosts = isCurrentMonth
    && activeTab === "cost"
    && currentMonthAutoEntries.length > 0;

  const groupedEntries: { name: string; items: Entry[] }[] = (() => {
    if (mode !== "business") return [{ name: "", items: monthEntries }];
    const map = new Map<string, Entry[]>();
    BUSINESS_OPTIONS.forEach(b => map.set(b, []));
    monthEntries.forEach(e => {
      const key = BUSINESS_OPTIONS.includes(e.business) ? e.business : "その他";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).filter(([, items]) => items.length > 0).map(([name, items]) => ({ name, items }));
  })();

  function monthTotal(tab: DataTab): number {
    // 未確定（自動生成）は合計に含めない
    return entries
      .filter(e => e.tab === tab && (toYM(e.occurred_at) || thisYM) === viewMonth)
      .reduce((s, e) => s + parseAmount(e.amount), 0);
  }
  function totalAmount(tab: DataTab): number {
    // 未確定（自動生成）は合計に含めない
    return entries.filter(e => e.tab === tab).reduce((s, e) => s + parseAmount(e.amount), 0);
  }

  // ── Form fields ──────────────────────────────────────────────
  const fBusiness = (
    <div className="de-group">
      <label className="de-label">事業<span className="de-req">*</span></label>
      <div className="de-select-wrap">
        <select className="de-select" value={form.business}
          onChange={e => setForm({ ...form, business: e.target.value })}
          style={{ color: form.business === "" ? tokens.textMuted : tokens.textPrimary }}>
          <option value="" disabled hidden>選択してください</option>
          {BUSINESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
  const fContent = (placeholder = "例: 三菱UFJ定期預金") => (
    <div className="de-group">
      <label className="de-label">内容<span className="de-req">*</span></label>
      <input className="de-input" placeholder={placeholder} value={form.content}
        maxLength={80}
        onChange={e => setForm({ ...form, content: e.target.value })} />
      <div className={`de-char-count ${charCountClass(form.content.length, 80)}`}>
        {form.content.length} / 80
      </div>
    </div>
  );
  const fAmount = (
    <div className="de-group">
      <label className="de-label">金額（万円）<span className="de-req">*</span></label>
      <input className="de-input" placeholder="0" value={form.amount}
        maxLength={8}
        inputMode="decimal"
        onChange={e => setForm({ ...form, amount: sanitizeAmount(e.target.value) })}
        style={{ textAlign: "right" }} />
      <div className="de-hint">最大 999999.9（小数点第1位）</div>
    </div>
  );
  const fOccurredAt = (
    <div className="de-group">
      <label className="de-label">日付</label>
      <input type="date" className="de-input" value={form.occurred_at}
        onChange={e => setForm({ ...form, occurred_at: e.target.value })} />
    </div>
  );
  const fDueAt = (
    <div className="de-group">
      <label className="de-label">返済期日</label>
      <input type="date" className="de-input" value={form.due_at}
        onChange={e => setForm({ ...form, due_at: e.target.value })} />
    </div>
  );
  const fMemo = (
    <div className="de-group">
      <label className="de-label">メモ</label>
      <textarea className="de-textarea" placeholder="補足事項など（任意）" value={form.memo}
        maxLength={80}
        onChange={e => setForm({ ...form, memo: e.target.value })} />
      <div className={`de-char-count ${charCountClass(form.memo.length, 80)}`}>
        {form.memo.length} / 80
      </div>
    </div>
  );
  const fYield = (
    <div className="de-group">
      <label className="de-label">利回り（年率）</label>
      <div className="de-input-suffix">
        <input className="de-input" placeholder="0.0" value={form.yield_rate}
          maxLength={6}
          inputMode="decimal"
          onChange={e => {
            let v = e.target.value.replace(/[^\d.]/g, "");
            const parts = v.split(".");
            if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
            const [i, d] = v.split(".");
            v = d !== undefined ? i.slice(0, 3) + "." + d.slice(0, 2) : i.slice(0, 3);
            setForm({ ...form, yield_rate: v });
          }} />
        <span className="de-input-suffix-label">%</span>
      </div>
    </div>
  );

  const formFields = (
    <div className="de-form-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {mode === "business" && activeTab !== "liability" && activeTab !== "cost" && (<>{fBusiness}{fContent("例: 店舗売上、設備一式 など")}<div className="de-grid-2">{fOccurredAt}{fAmount}</div>{fMemo}</>)}
      {mode === "business" && activeTab === "cost" && (
        <>
          {fBusiness}
          {fContent("例: 店舗売上、設備一式 など")}
          <div className="de-grid-2">{fOccurredAt}{fAmount}</div>
          {fMemo}
          {/* 固定費チェックボックス */}
          <label
            className={`de-fixed-check-row${isFixed ? " checked" : ""}`}
            htmlFor="de-fixed-checkbox"
          >
            <input
              id="de-fixed-checkbox"
              type="checkbox"
              checked={isFixed}
              onChange={e => setIsFixed(e.target.checked)}
            />
            <span className="de-fixed-check-label">固定費として登録（毎月自動生成）</span>
          </label>
          {isFixed && (
            <div className="de-fixed-period-box">
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.primary, marginBottom: 2 }}>
                計上期間
              </div>
              <div className="de-grid-2">
                <div className="de-group">
                  <label className="de-label">開始日 <span style={{ fontSize: 10.5, color: tokens.textMuted, fontWeight: 400 }}>（空欄で即時）</span></label>
                  <input type="date" className="de-input" value={fixedStartDate}
                    onChange={e => setFixedStartDate(e.target.value)} />
                </div>
                <div className="de-group">
                  <label className="de-label">終了日 <span style={{ fontSize: 10.5, color: tokens.textMuted, fontWeight: 400 }}>（空欄で無期限）</span></label>
                  <input type="date" className="de-input" value={fixedEndDate}
                    onChange={e => setFixedEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {mode === "business" && activeTab === "liability" && (<>{fBusiness}{fContent("例: 設備投資ローン")}<div className="de-grid-2">{fOccurredAt}{fDueAt}</div><div className="de-grid-2">{fAmount}<div /></div>{fMemo}</>)}
      {mode === "personal" && activeTab === "asset" && (<>{fContent("例: 楽天銀行 普通預金")}<div className="de-grid-2">{fOccurredAt}{fAmount}</div>{fMemo}<div className="de-grid-2">{fYield}<div /></div></>)}
      {mode === "personal" && activeTab === "liability" && (<>{fContent("例: 奨学金、カーローン")}<div className="de-grid-2">{fOccurredAt}{fDueAt}</div><div className="de-grid-2">{fAmount}<div /></div>{fMemo}</>)}
      {mode === "personal" && activeTab === "revenue" && (<>{fContent("例: 給与、副業収入 など")}<div className="de-grid-2">{fOccurredAt}{fAmount}</div>{fMemo}</>)}
      {mode === "personal" && activeTab === "cost" && (
        <>
          {fContent("例: 家賃、保険料 など")}
          <div className="de-grid-2">{fOccurredAt}{fAmount}</div>
          {fMemo}
          {/* 固定費チェックボックス（個人） */}
          <label
            className={`de-fixed-check-row${isFixed ? " checked" : ""}`}
            htmlFor="de-fixed-checkbox-personal"
          >
            <input
              id="de-fixed-checkbox-personal"
              type="checkbox"
              checked={isFixed}
              onChange={e => setIsFixed(e.target.checked)}
            />
            <span className="de-fixed-check-label">固定費として登録（毎月自動生成）</span>
          </label>
          {isFixed && (
            <div className="de-fixed-period-box">
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.primary, marginBottom: 2 }}>
                計上期間
              </div>
              <div className="de-grid-2">
                <div className="de-group">
                  <label className="de-label">開始日 <span style={{ fontSize: 10.5, color: tokens.textMuted, fontWeight: 400 }}>（空欄で即時）</span></label>
                  <input type="date" className="de-input" value={fixedStartDate}
                    onChange={e => setFixedStartDate(e.target.value)} />
                </div>
                <div className="de-group">
                  <label className="de-label">終了日 <span style={{ fontSize: 10.5, color: tokens.textMuted, fontWeight: 400 }}>（空欄で無期限）</span></label>
                  <input type="date" className="de-input" value={fixedEndDate}
                    onChange={e => setFixedEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderRow = (entry: Entry) => (
    <div key={entry.id}
      className={`de-row-item${entry.isAuto ? " is-auto" : ""}`}
      onClick={() => { setSelectedEntry(entry); setIsEditing(false); setEditForm(null); }}>
      <div className="de-row-bar" style={{ background: entry.isAuto ? tokens.textMuted : tabColorMap[entry.tab] }} />
      <div className="de-row-info">
        <div className="de-row-content">
          {entry.content}
          {entry.isAuto && (
            <span className="de-badge-auto" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <SparkleIcon />自動
            </span>
          )}
        </div>
        <div className="de-row-sub">
          {entry.occurred_at && <span>{entry.occurred_at}</span>}
          {entry.due_at      && <span className="de-row-due">期日 {entry.due_at}</span>}
          {entry.yield_rate  && <span className="de-row-yield">利回り {entry.yield_rate}%</span>}
          {entry.memo        && <span>メモあり</span>}
          {entry.isAuto      && <span style={{ color: "#9A6010" }}>未確定・保存で確定</span>}
        </div>
      </div>
      <div className="de-row-amount" style={{ color: entry.isAuto ? tokens.textMuted : tabColorMap[entry.tab] }}>
        {entry.amount}<span className="de-row-amount-unit">万円</span>
      </div>
      <span className="de-row-chevron"><ChevronRightSmIcon /></span>
    </div>
  );

  return (
    <div className="de-wrap">
      <style>{css}</style>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: tokens.textPrimary, margin: 0 }}>データ入力</h1>
        <span style={{
          fontSize: 13, fontWeight: 500,
          background: mode === "business" ? tokens.primaryLight : tokens.tealLight,
          color: mode === "business" ? tokens.primary : "#0F6E56",
          padding: "2px 10px", borderRadius: 20,
        }}>{modeLabel}</span>
      </div>

      <div className="de-summary-row">
        {summaryBase.map(({ tab, label, dotColor }) => (
          <div key={tab} className={`de-summary-card ${activeTab === tab ? `active-${tab}` : ""}`}
            onClick={() => handleTabChange(tab)}>
            <div className="de-summary-label"><span className="de-dot" style={{ background: dotColor }} />{label}</div>
            <div className="de-summary-amount" style={{ color: dotColor }}>
              {totalAmount(tab).toLocaleString("ja-JP")}<span className="de-summary-unit">万円</span>
            </div>
            <div className="de-month-total">
              {formatYM(viewMonth)}計&nbsp;<span className="mv">{monthTotal(tab).toLocaleString("ja-JP")}万円</span>
            </div>
          </div>
        ))}
      </div>

      <div className="de-panel">
        <div className={`de-accordion-header ${formOpen ? "open" : ""}`} onClick={() => setFormOpen(v => !v)}>
          <div className="de-accordion-title">
            {modeLabel} · {tabLabelMap[activeTab]}
            <span className={`de-badge ${badgeClassMap[activeTab]}`}>{tabNameMap[activeTab]}</span>
          </div>
          <div className="de-accordion-right">
            {formOpen && (
              <button className="de-btn de-btn-sm de-btn-ghost"
                onClick={e => { e.stopPropagation(); setForm(emptyEntry(activeTab)); }}>クリア</button>
            )}
            <span className={`de-chevron ${formOpen ? "open" : ""}`}><ChevronDownIcon /></span>
          </div>
        </div>
        {formOpen && (
          <>
            {formFields}
            <div className="de-footer">
              <button className="de-btn de-btn-ghost" onClick={() => setForm(emptyEntry(activeTab))}>キャンセル</button>
              <button className="de-btn de-btn-primary" onClick={handleSave}>
                <CheckIcon />保存する
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <div className="de-list-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="de-list-title">登録済み一覧</span>
            <span className="de-badge" style={{ background: `${tabColorMap[activeTab]}18`, color: tabColorMap[activeTab] }}>
              {tabNameMap[activeTab]}
            </span>
            <span style={{ fontSize: 12, color: tokens.textMuted }}>{monthEntries.length}件</span>
            {/* 自動生成件数バッジ */}
            {hasAutoCosts && (
              <span className="de-badge-auto" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <SparkleIcon />自動 {currentMonthAutoEntries.length}件
              </span>
            )}
          </div>
          <div className="de-pager">
            <button className="de-pager-btn" onClick={handlePrevMonth}><ChevronLeftIcon /></button>
            <span className="de-pager-month">
              {formatYM(viewMonth)}
              {isCurrentMonth && <span className="de-pager-now">今月</span>}
            </span>
            <button className="de-pager-btn" disabled={isCurrentMonth} onClick={handleNextMonth}><ChevronRightIcon /></button>
          </div>
        </div>

        <div className="de-panel">
          {/* 自動生成バナー（今月・コストタブ・事業モードのみ） */}
          {hasAutoCosts && (
            <div className="de-auto-banner">
              <SparkleIcon />
              <div>
                <div className="de-auto-banner-title">
                  固定費が自動生成されています（{currentMonthAutoEntries.length}件）
                </div>
                <div className="de-auto-banner-sub">
                  {mode === "business" ? "初期設定の固定費" : "個人の固定費"}を今月分として仮反映しました。内容を確認・編集し、「保存する」で確定してください。<br />
                  保存せずに月をまたぐとリセットされます。
                </div>
              </div>
            </div>
          )}

          {monthEntries.length === 0 ? (
            <div className="de-empty">
              <div className="de-empty-icon"><DatabaseIcon /></div>
              <p className="de-empty-text">{formatYM(viewMonth)}の{tabNameMap[activeTab]}データはありません</p>
            </div>
          ) : mode === "business" ? (
            <div className="de-row-list">
              {groupedEntries.map(({ name, items }) => {
                const groupTotal = items.filter(e => !e.isAuto).reduce((s, e) => s + parseAmount(e.amount), 0);
                return (
                  <div key={name}>
                    <div className="de-group-header">
                      <span className="de-group-name">
                        <BuildingIcon />{name}
                        <span className="de-group-count">{items.length}件</span>
                        {/* 自動生成件数 */}
                        {items.some(e => e.isAuto) && (
                          <span className="de-badge-auto" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                            <SparkleIcon />自動 {items.filter(e => e.isAuto).length}件
                          </span>
                        )}
                      </span>
                      <span className="de-group-total">{groupTotal.toLocaleString("ja-JP")}万円</span>
                    </div>
                    {items.map(renderRow)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="de-row-list">{monthEntries.map(renderRow)}</div>
          )}
        </div>
      </div>

      {/* 詳細・編集モーダル */}
      {selectedEntry && (
        <div className="de-overlay"
          onClick={e => { if (e.target === e.currentTarget) { setSelectedEntry(null); setIsEditing(false); } }}>
          <div className="de-modal">
            <div className="de-modal-header">
              <span className="de-modal-title">
                {isEditing ? "編集" : "詳細"}
                <span className={`de-badge ${badgeClassMap[selectedEntry.tab]}`}>{tabNameMap[selectedEntry.tab]}</span>
                {selectedEntry.isAuto && !isEditing && (
                  <span className="de-badge-auto" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <SparkleIcon />自動生成
                  </span>
                )}
              </span>
              <button className="de-modal-close" onClick={() => { setSelectedEntry(null); setIsEditing(false); }}><CloseIcon /></button>
            </div>
            <div className="de-modal-body">
              {/* 自動生成の注意書き */}
              {selectedEntry.isAuto && !isEditing && (
                <div style={{
                  background: "#FFFBEB", border: "1px solid #F5C87A", borderRadius: 8,
                  padding: "10px 14px", marginTop: 14, marginBottom: 4,
                  fontSize: 12, color: "#9A6010", lineHeight: 1.6,
                }}>
                  初期設定の固定費から自動生成されました。<br />
                  金額・内容を確認し、「保存する」で今月の実績として確定してください。
                </div>
              )}
              {isEditing && editForm ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 16 }}>
                  {mode === "business" && (
                    <div className="de-group">
                      <label className="de-label">事業</label>
                      <div className="de-select-wrap">
                        <select className="de-select" value={editForm.business}
                          onChange={e => setEditForm({ ...editForm, business: e.target.value })}>
                          {BUSINESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="de-group">
                    <label className="de-label">内容<span className="de-req">*</span></label>
                    <input className="de-input" value={editForm.content}
                      maxLength={80}
                      onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                    <div className={`de-char-count ${charCountClass(editForm.content.length, 80)}`}>
                      {editForm.content.length} / 80
                    </div>
                  </div>
                  <div className="de-group">
                    <label className="de-label">金額（万円）<span className="de-req">*</span></label>
                    <input className="de-input" value={editForm.amount}
                      maxLength={8}
                      inputMode="decimal"
                      onChange={e => setEditForm({ ...editForm, amount: sanitizeAmount(e.target.value) })}
                      style={{ textAlign: "right" }} />
                    <div className="de-hint">最大 999999.9（小数点第1位）</div>
                  </div>
                  {mode === "personal" && selectedEntry.tab === "asset" && (
                    <div className="de-group">
                      <label className="de-label">利回り（年率）</label>
                      <div className="de-input-suffix">
                        <input className="de-input" value={editForm.yield_rate}
                          maxLength={6}
                          inputMode="decimal"
                          onChange={e => {
                            let v = e.target.value.replace(/[^\d.]/g, "");
                            const parts = v.split(".");
                            if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
                            const [i2, d2] = v.split(".");
                            v = d2 !== undefined ? i2.slice(0, 3) + "." + d2.slice(0, 2) : i2.slice(0, 3);
                            setEditForm({ ...editForm, yield_rate: v });
                          }} />
                        <span className="de-input-suffix-label">%</span>
                      </div>
                    </div>
                  )}
                  <div className="de-grid-2">
                    <div className="de-group">
                      <label className="de-label">日付</label>
                      <input type="date" className="de-input" value={editForm.occurred_at}
                        onChange={e => setEditForm({ ...editForm, occurred_at: e.target.value })} />
                    </div>
                    {selectedEntry.tab === "liability" && (
                      <div className="de-group">
                        <label className="de-label">期日</label>
                        <input type="date" className="de-input" value={editForm.due_at}
                          onChange={e => setEditForm({ ...editForm, due_at: e.target.value })} />
                      </div>
                    )}
                  </div>
                  <div className="de-group">
                    <label className="de-label">メモ</label>
                    <textarea className="de-textarea" value={editForm.memo}
                      maxLength={80}
                      onChange={e => setEditForm({ ...editForm, memo: e.target.value })} />
                    <div className={`de-char-count ${charCountClass(editForm.memo.length, 80)}`}>
                      {editForm.memo.length} / 80
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {mode === "business" && (
                    <div className="de-detail-row">
                      <span className="de-detail-key">事業</span>
                      <span className="de-detail-val">{selectedEntry.business}</span>
                    </div>
                  )}
                  <div className="de-detail-row">
                    <span className="de-detail-key">内容</span>
                    <span className="de-detail-val">{selectedEntry.content}</span>
                  </div>
                  <div className="de-detail-row">
                    <span className="de-detail-key">金額</span>
                    <span className="de-detail-val de-detail-amount" style={{ color: tabColorMap[selectedEntry.tab] }}>
                      ¥{selectedEntry.amount}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4 }}>万円</span>
                    </span>
                  </div>
                  {mode === "personal" && selectedEntry.tab === "asset" && (
                    <div className="de-detail-row">
                      <span className="de-detail-key">利回り</span>
                      <span className="de-detail-val" style={{ color: selectedEntry.yield_rate ? tokens.teal : tokens.textMuted }}>
                        {selectedEntry.yield_rate ? `${selectedEntry.yield_rate}%（年率）` : "—"}
                      </span>
                    </div>
                  )}
                  <div className="de-detail-row">
                    <span className="de-detail-key">日付</span>
                    <span className="de-detail-val">{selectedEntry.occurred_at || "—"}</span>
                  </div>
                  {selectedEntry.tab === "liability" && (
                    <div className="de-detail-row">
                      <span className="de-detail-key">期日</span>
                      <span className="de-detail-val">{selectedEntry.due_at || "—"}</span>
                    </div>
                  )}
                  <div className="de-detail-row">
                    <span className="de-detail-key">メモ</span>
                    <span className="de-detail-val" style={{ whiteSpace: "pre-wrap", color: selectedEntry.memo ? tokens.textPrimary : tokens.textMuted }}>
                      {selectedEntry.memo || "—"}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="de-modal-footer">
              <button className="de-btn de-btn-danger" onClick={() => handleDelete(selectedEntry.id)}>
                <TrashIcon />削除{selectedEntry.isAuto ? "（今月は発生なし）" : ""}
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                {isEditing ? (
                  <>
                    <button className="de-btn de-btn-ghost" onClick={() => setIsEditing(false)}>キャンセル</button>
                    <button className="de-btn de-btn-primary" onClick={handleEditSave}><CheckIcon />更新する</button>
                  </>
                ) : (
                  <>
                    <button className="de-btn de-btn-ghost"
                      onClick={() => { setEditForm({ ...selectedEntry }); setIsEditing(true); }}>
                      <EditIcon />編集
                    </button>
                    {selectedEntry.isAuto && (
                      <button className="de-btn de-btn-primary"
                        onClick={() => handleConfirmAutoEntry(selectedEntry)}>
                        <CheckIcon />保存する
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="de-toast" style={{ background: toast.type === "error" ? tokens.danger : "#1a6e4f" }}>
          {toast.type !== "error" && <CheckIcon />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default DataEntry;