import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFixedCost, PERSONAL_BIZ_ID } from "../contexts/Fixedcostcontext";
import {
  T, sharedCss, AuthLogo, AuthInput,
  UserIcon, AlertIcon, CheckIcon, ArrowRightIcon, BuildingIcon,
  validateEmail, validatePassword, pwStrength,
} from "../components/Authshared";

// ── オンボーディング＋設定画面共通CSS ────────────────────────────
const obCss = `
  /* オーバーレイ・モーダル */
  .ob-overlay {
    position: fixed; inset: 0; background: rgba(28,30,46,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; padding: 20px; animation: fadeIn 0.2s ease;
  }
  .ob-modal {
    background: ${T.surface}; border-radius: 16px;
    width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 12px 48px rgba(28,30,46,0.18); animation: slideUp 0.22s ease;
  }
  .ob-header {
    padding: 20px 24px 16px; border-bottom: 1px solid ${T.border};
    position: sticky; top: 0; background: ${T.surface}; z-index: 1;
  }
  .ob-step-bar { display: flex; gap: 6px; margin-bottom: 12px; }
  .ob-step-seg { height: 3px; flex: 1; border-radius: 2px; background: ${T.border}; transition: background 0.3s; }
  .ob-step-seg.done { background: ${T.primary}; }
  .ob-title { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; }
  .ob-sub   { font-size: 12.5px; color: ${T.textSecondary}; margin-top: 3px; }
  .ob-body  { padding: 20px 24px; }
  .ob-footer {
    padding: 14px 24px; border-top: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: space-between;
    background: ${T.bg}; border-radius: 0 0 16px 16px; position: sticky; bottom: 0;
  }

  /* セクションタイトル */
  .ob-sec-title {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    color: ${T.textMuted}; margin-bottom: 12px; margin-top: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .ob-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .ob-divider { border: none; border-top: 1px solid ${T.border}; margin: 16px 0; }
  .ob-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* フォーム */
  .ob-label { display: block; font-size: 12px; font-weight: 500; color: ${T.textSecondary}; margin-bottom: 5px; }
  .ob-input {
    width: 100%; height: 40px; padding: 0 12px;
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary}; background: ${T.surface};
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .ob-input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .ob-input::placeholder { color: ${T.textMuted}; }
  .ob-input.has-suffix { padding-right: 42px; }
  .ob-input-wrap { position: relative; }
  .ob-suffix {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 12px; color: ${T.textMuted}; pointer-events: none;
  }
  .ob-hint { font-size: 11px; color: ${T.textMuted}; margin-top: 4px; }
  .ob-field { margin-bottom: 0; }
  .ob-net {
    padding: 10px 14px; border-radius: ${T.radiusSm};
    font-size: 12px; color: ${T.textSecondary}; margin-top: 2px;
  }

  /* 文字数カウンター */
  .ob-char-count {
    font-size: 10.5px; margin-top: 3px; text-align: right;
  }
  .ob-char-count.ok   { color: ${T.textMuted}; }
  .ob-char-count.warn { color: #E8921A; }
  .ob-char-count.over { color: ${T.danger}; font-weight: 600; }

  /* エラーメッセージ（ob-input用） */
  .ob-error {
    font-size: 11px; color: ${T.danger}; margin-top: 3px;
    display: flex; align-items: center; gap: 3px;
  }

  /* ボタン */
  .ob-btn {
    height: 38px; padding: 0 20px; border-radius: ${T.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500;
    cursor: pointer; border: none; transition: background 0.15s, transform 0.1s;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .ob-btn:active { transform: scale(0.98); }
  .ob-btn-primary { background: ${T.primary}; color: white; }
  .ob-btn-primary:hover { background: ${T.primaryHover}; }
  .ob-btn-ghost { background: none; border: 1px solid ${T.border}; color: ${T.textSecondary}; }
  .ob-btn-ghost:hover { background: ${T.bg}; color: ${T.textPrimary}; }
  .ob-btn-skip { background: none; border: none; color: ${T.textMuted}; font-size: 12px; cursor: pointer; font-family: 'Noto Sans JP', sans-serif; }
  .ob-error-box {
    background: ${T.dangerLight}; border: 1px solid #F7C1C1;
    border-radius: ${T.radiusSm}; padding: 10px 14px;
    font-size: 12px; color: ${T.danger}; line-height: 1.8;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ob-error-title { font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 5px; }
  .ob-btn-skip:hover { color: ${T.textSecondary}; }
  .ob-btn-add {
    height: 36px; padding: 0 14px; border-radius: ${T.radiusSm};
    font-size: 12.5px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500;
    cursor: pointer; border: 1px dashed ${T.borderMid};
    background: ${T.bg}; color: ${T.primary};
    display: inline-flex; align-items: center; gap: 5px;
    width: 100%; justify-content: center; transition: background 0.12s, border-color 0.12s;
  }
  .ob-btn-add:hover { background: ${T.primaryLight}; border-color: ${T.primary}; }
  .ob-btn-del {
    width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0;
    border: 1px solid ${T.border}; background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: ${T.textMuted}; transition: background 0.12s, color 0.12s, border-color 0.12s;
  }
  .ob-btn-del:hover { background: ${T.dangerLight}; color: ${T.danger}; border-color: #F7C1C1; }

  /* 事業カード */
  .ob-biz-card {
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    overflow: hidden;
  }
  .ob-biz-card-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 14px; background: ${T.bg}; border-bottom: 1px solid ${T.border};
    font-size: 12px; font-weight: 600; color: ${T.textSecondary};
    gap: 8px;
  }
  .ob-biz-card-hdr-left { display: flex; align-items: center; gap: 6px; }
  .ob-biz-card-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

  @media (max-width: 480px) {
    .ob-grid2  { grid-template-columns: 1fr; }
    .ob-header { padding: 16px 18px 12px; }
    .ob-body   { padding: 16px 18px; }
    .ob-footer { padding: 12px 18px; }
  }
`;

// ── 入力制御ユーティリティ ────────────────────────────────────────

/** 半角英数字・記号のみ許可（メール・パスワード用） */
function toHalfWidth(v: string) {
  return v.replace(/[^\x20-\x7E]/g, "");
}

/**
 * 金額入力（万円・小数第1位）
 * ルール: 整数6桁 + 小数1桁 → maxlength 8 (例: 999999.9)
 * - 数値と小数点のみ許可
 * - 小数点は1つのみ
 * - 小数部は1桁まで
 * - 整数部は6桁まで
 */
function sanitizeAmount(v: string): string {
  // 数値と小数点以外を除去
  let s = v.replace(/[^\d.]/g, "");
  // 小数点が複数あれば最初だけ残す
  const parts = s.split(".");
  if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
  const [intPart, decPart] = s.split(".");
  // 整数部6桁まで
  const trimInt = (intPart ?? "").slice(0, 6);
  if (decPart === undefined) return trimInt;
  // 小数部1桁まで
  const trimDec = decPart.slice(0, 1);
  return trimInt + "." + trimDec;
}

/**
 * 顧客数（整数のみ・8桁まで）
 * ルール: 数値のみ・最大8桁（9999万）
 */
function sanitizeInteger(v: string, maxDigits = 8): string {
  return v.replace(/\D/g, "").slice(0, maxDigits);
}

/** 文字数カウンタークラス */
function charCountClass(len: number, max: number): string {
  if (len > max) return "over";
  if (len >= max * 0.9) return "warn";
  return "ok";
}

/**
 * 万円単位の数値を読みやすい表記に変換
 * 例:
 *   100        → "100万円"
 *   10000      → "1億円"
 *   15000.5    → "1億5000.5万円"
 *   100000000  → "100億円"
 *   負数も対応
 */
function formatManyen(value: number): string {
  if (!isFinite(value)) return "0万円";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs === 0) return "0万円";

  const oku = Math.floor(abs / 10000);       // 億の部分（整数）
  const man = abs - oku * 10000;             // 残りの万円部分

  if (oku === 0) {
    // 1億未満 → 万円のみ
    return `${sign}${man.toLocaleString("ja-JP")}万円`;
  }

  if (man === 0) {
    // ぴったり億単位
    return `${sign}${oku.toLocaleString("ja-JP")}億円`;
  }

  // 億 + 万円の組み合わせ
  // 万円部分は小数があれば表示、なければ整数
  const manStr = Number.isInteger(man)
    ? man.toLocaleString("ja-JP")
    : man.toLocaleString("ja-JP", { maximumFractionDigits: 1 });
  return `${sign}${oku.toLocaleString("ja-JP")}億${manStr}万円`;
}

// ── 型定義 ───────────────────────────────────────────────────────
interface FixedCostRow {
  id: string;
  content:    string; // 内容
  start_date: string; // 計上期間（開始）YYYY-MM-DD
  end_date:   string; // 計上期間（終了）YYYY-MM-DD（空=無期限）
  amount:     string; // 金額
  memo:       string; // メモ
}

interface BizEntry {
  id: string;
  name: string;
  type: string;
  capital:      string;
  deposit:      string;
  equipment:    string;
  liab:         string;
  customers:    string;
  newCustomers: string;
  unitPrice:    string;
  variableRate: string; // 変動費率（%）: NUMBER(5,2) → 最大100.00
  fixedCosts:   FixedCostRow[];
}

const BIZ_TYPES = ["飲食・小売", "IT・コンサルティング", "製造・建設", "医療・介護", "不動産", "その他サービス"] as const;
type BizType = typeof BIZ_TYPES[number];

const VARIABLE_RATE: Record<BizType, { rate: number; desc: string }> = {
  "飲食・小売":           { rate: 35, desc: "仕入・材料費が売上の約35%" },
  "IT・コンサルティング": { rate: 15, desc: "外注費・ライセンスが売上の約15%" },
  "製造・建設":           { rate: 45, desc: "材料費・外注費が売上の約45%" },
  "医療・介護":           { rate: 20, desc: "消耗品・委託費が売上の約20%" },
  "不動産":               { rate: 10, desc: "管理費・修繕費が売上の約10%" },
  "その他サービス":       { rate: 25, desc: "外注・消耗品費が売上の約25%" },
};

function newFixedCost(): FixedCostRow {
  return { id: crypto.randomUUID(), content: "", start_date: "", end_date: "", amount: "", memo: "" };
}
function newBiz(): BizEntry {
  return {
    id: crypto.randomUUID(), name: "", type: "飲食・小売",
    capital: "", deposit: "", equipment: "", liab: "",
    customers: "", newCustomers: "", unitPrice: "",
    variableRate: String(VARIABLE_RATE["飲食・小売"].rate),
    fixedCosts: [newFixedCost()],
  };
}

// ── 小コンポーネント ─────────────────────────────────────────────

function OField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="ob-field">
      <label className="ob-label">{label}</label>
      {children}
      {hint && <div className="ob-hint">{hint}</div>}
    </div>
  );
}

/** テキスト入力（文字数カウンター付き） */
function OInputText({ label, value, onChange, maxLength, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  maxLength: number; placeholder?: string; hint?: string;
}) {
  const len = value.length;
  const cls = charCountClass(len, maxLength);
  return (
    <OField label={label} hint={hint}>
      <input
        className="ob-input"
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <div className={`ob-char-count ${cls}`}>{len} / {maxLength}</div>
    </OField>
  );
}

/** 金額入力（整数6桁＋小数1桁、maxlength=8） */
function OInputAmount({ label, value, onChange, suffix = "万円", hint, placeholder = "0" }: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; hint?: string; placeholder?: string;
}) {
  return (
    <OField label={label} hint={hint}>
      <div className="ob-input-wrap">
        <input
          className="ob-input has-suffix"
          type="text"
          inputMode="decimal"
          value={value}
          maxLength={8}
          placeholder={placeholder}
          onChange={e => onChange(sanitizeAmount(e.target.value))}
        />
        <span className="ob-suffix">{suffix}</span>
      </div>
      <div className="ob-hint">最大 999999.9（小数点第1位）</div>
    </OField>
  );
}

/** 整数入力（顧客数など、最大8桁） */
function OInputInteger({ label, value, onChange, suffix, hint, placeholder = "0", maxDigits = 8 }: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; hint?: string; placeholder?: string; maxDigits?: number;
}) {
  return (
    <OField label={label} hint={hint}>
      <div className="ob-input-wrap">
        <input
          className={`ob-input${suffix ? " has-suffix" : ""}`}
          type="text"
          inputMode="numeric"
          value={value}
          maxLength={maxDigits}
          placeholder={placeholder}
          onChange={e => onChange(sanitizeInteger(e.target.value, maxDigits))}
        />
        {suffix && <span className="ob-suffix">{suffix}</span>}
      </div>
    </OField>
  );
}

function OSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <OField label={label}>
      <div className="ob-input-wrap">
        <select className="ob-input" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="ob-suffix" style={{ pointerEvents: "none" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </OField>
  );
}

// ── オンボーディングモーダル ──────────────────────────────────────
function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const TOTAL = 2;

  const { masters, addMaster, updateMaster, deleteMaster } = useFixedCost();
  const personalMasters = masters.filter(m => m.bizId === PERSONAL_BIZ_ID);

  // Step1: 個人資産
  const [pCash,   setPCash]   = useState("");
  const [pInvest, setPInvest] = useState("");
  const [pLiab,   setPLiab]   = useState("");

  // バリデーションエラー（インライン表示用）
  // キー: "personal-{id}-content" | "personal-{id}-amount"
  //      "biz-{bizId}-name" | "biz-{bizId}-fixed-{rowId}-content" | "biz-{bizId}-fixed-{rowId}-amount"
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Step2: 事業情報
  const [businesses, setBusinesses] = useState<BizEntry[]>([newBiz()]);

  const pNet = parseFloat(pCash||"0") + parseFloat(pInvest||"0") - parseFloat(pLiab||"0");

  /** Step1 バリデーション */
  function validateStep1(): Record<string, string> {
    const errs: Record<string, string> = {};
    personalMasters.forEach(row => {
      if (!row.name.trim() && !row.amount.trim()) return; // 完全空行はスキップ
      if (!row.name.trim())   errs[`personal-${row.id}-content`] = "内容を入力してください";
      if (!row.amount.trim()) errs[`personal-${row.id}-amount`]  = "金額を入力してください";
    });
    return errs;
  }

  /** Step2 バリデーション */
  function validateStep2(): Record<string, string> {
    const errs: Record<string, string> = {};
    businesses.forEach(biz => {
      const hasAnyBizInput = biz.name.trim() || biz.capital.trim() || biz.deposit.trim()
        || biz.equipment.trim() || biz.liab.trim() || biz.customers.trim()
        || biz.newCustomers.trim() || biz.unitPrice.trim();
      const hasAnyFixedInput = biz.fixedCosts.some(r => r.content.trim() || r.amount.trim());
      if (!hasAnyBizInput && !hasAnyFixedInput) return; // 完全空はスキップOK

      if (!biz.name.trim()) errs[`biz-${biz.id}-name`] = "事業名を入力してください";

      biz.fixedCosts.forEach(row => {
        if (!row.content.trim() && !row.amount.trim()) return;
        if (!row.content.trim()) errs[`biz-${biz.id}-fixed-${row.id}-content`] = "内容を入力してください";
        if (!row.amount.trim())  errs[`biz-${biz.id}-fixed-${row.id}-amount`]  = "金額を入力してください";
      });
    });
    return errs;
  }

  function updateBiz(id: string, field: keyof Omit<BizEntry, "fixedCosts">, value: string) {
    setBusinesses(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, [field]: value };
      // 業種変更時は変動費率を自動リセット
      if (field === "type") {
        const vrate = VARIABLE_RATE[value as BizType] ?? VARIABLE_RATE["その他サービス"];
        updated.variableRate = String(vrate.rate);
      }
      return updated;
    }));
  }
  function updateFixed(bizId: string, rowId: string, field: keyof FixedCostRow, value: string) {
    setStepErrors({});
    setBusinesses(prev => prev.map(b => b.id === bizId
      ? { ...b, fixedCosts: b.fixedCosts.map(r => r.id === rowId ? { ...r, [field]: value } : r) }
      : b
    ));
  }
  function addFixed(bizId: string) {
    setBusinesses(prev => prev.map(b => b.id === bizId
      ? { ...b, fixedCosts: [...b.fixedCosts, newFixedCost()] }
      : b
    ));
  }
  function removeFixed(bizId: string, rowId: string) {
    setBusinesses(prev => prev.map(b => b.id === bizId
      ? { ...b, fixedCosts: b.fixedCosts.length > 1 ? b.fixedCosts.filter(r => r.id !== rowId) : b.fixedCosts }
      : b
    ));
  }
  function addBiz() { setBusinesses(prev => [...prev, newBiz()]); }
  function removeBiz(id: string) {
    setBusinesses(prev => prev.length > 1 ? prev.filter(b => b.id !== id) : prev);
  }

  const stepTitles = ["個人資産", "事業情報"];
  const stepSubs   = [
    "現在の個人資産の概算を入力してください（後から設定画面で変更可能）",
    "事業の情報を入力してください。複数の事業を追加できます",
  ];

  return (
    <div className="ob-overlay">
      <div className="ob-modal">

        {/* ヘッダー */}
        <div className="ob-header">
          <div className="ob-step-bar">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className={`ob-step-seg ${i < step ? "done" : ""}`} />
            ))}
          </div>
          <div className="ob-title">{stepTitles[step - 1]}</div>
          <div className="ob-sub">ステップ {step}/{TOTAL} · {stepSubs[step - 1]}</div>
        </div>

        {/* ボディ */}
        <div className="ob-body">

          {/* ── Step1: 個人資産 ── */}
          {step === 1 && (
            <>
              <div className="ob-sec-title">
                <span className="ob-dot" style={{ background: T.teal }} />
                個人資産
              </div>
              <div className="ob-grid2">
                <OInputAmount label="現金・預金" value={pCash} onChange={v => { setStepErrors({}); setPCash(v); }}
                  hint="銀行口座・現金など" placeholder="300" />
                <OInputAmount label="投資・運用資産" value={pInvest} onChange={v => { setStepErrors({}); setPInvest(v); }}
                  hint="株・投信・iDeCoなど" placeholder="0" />
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="ob-sec-title">
                  <span className="ob-dot" style={{ background: T.danger }} />
                  個人負債
                </div>
                <OInputAmount label="負債（ローン等）" value={pLiab} onChange={v => { setStepErrors({}); setPLiab(v); }}
                  hint="住宅ローン・奨学金など" placeholder="0" />
              </div>
              <div className="ob-net" style={{ background: T.primaryLight, marginTop: 14 }}>
                <span style={{ fontWeight: 600, color: T.primary }}>個人純資産: </span>
                <span style={{ fontWeight: 700, color: pNet >= 0 ? T.primary : T.danger }}>
                  {formatManyen(pNet)}
                </span>
                <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                  （資産 {formatManyen(parseFloat(pCash||"0")+parseFloat(pInvest||"0"))} − 負債 {formatManyen(parseFloat(pLiab||"0"))}）
                </span>
              </div>

              {/* 個人固定費 */}
              <div style={{ marginTop: 14 }}>
                <div className="ob-sec-title">
                  <span className="ob-dot" style={{ background: T.purple }} />
                  個人固定費
                  <span style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 400, marginLeft: 4 }}>
                    毎月自動生成されるコスト
                  </span>
                </div>
                {personalMasters.length === 0 && (
                  <div style={{ fontSize: 11.5, color: T.textMuted, marginBottom: 8 }}>
                    固定費が登録されていません。
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {personalMasters.map((row, fi) => (
                    <div key={row.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted }}>項目 {fi + 1}</span>
                        <button onClick={() => deleteMaster(row.id)}
                          style={{ fontSize: 11.5, color: T.danger, border: "none", background: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
                          削除
                        </button>
                      </div>
                      <OInputText label="内容" value={row.name}
                        onChange={v => { setStepErrors(prev => { const n: Record<string, string> = {...prev}; delete n[`personal-${row.id}-content`]; return n; }); updateMaster(row.id, { name: v }); }}
                        maxLength={80} placeholder="家賃、保険料 など" />
                      {stepErrors[`personal-${row.id}-content`] && (
                        <div style={{ fontSize: 11.5, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          {stepErrors[`personal-${row.id}-content`]}
                        </div>
                      )}
                      <div className="ob-grid2" style={{ marginTop: 8, marginBottom: 8 }}>
                        <OField label="計上期間（開始）" hint="空欄で無期限">
                          <input type="date" className="ob-input" value={row.start_date}
                            onChange={e => updateMaster(row.id, { start_date: e.target.value })} />
                        </OField>
                        <OField label="計上期間（終了）" hint="空欄で無期限">
                          <input type="date" className="ob-input" value={row.end_date}
                            onChange={e => updateMaster(row.id, { end_date: e.target.value })} />
                        </OField>
                      </div>
                      <OInputAmount label="金額" value={row.amount}
                        onChange={v => { setStepErrors(prev => { const n: Record<string, string> = {...prev}; delete n[`personal-${row.id}-amount`]; return n; }); updateMaster(row.id, { amount: v }); }} placeholder="0" />
                      {stepErrors[`personal-${row.id}-amount`] && (
                        <div style={{ fontSize: 11.5, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          {stepErrors[`personal-${row.id}-amount`]}
                        </div>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <OInputText label="メモ" value={row.memo}
                          onChange={v => updateMaster(row.id, { memo: v })}
                          maxLength={80} placeholder="補足事項など（任意）" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addMaster({ bizId: PERSONAL_BIZ_ID, name: "", amount: "", start_date: "", end_date: "", memo: "" })}
                  style={{
                    marginTop: 8, width: "100%", height: 32,
                    border: `1px dashed ${T.borderMid}`, borderRadius: T.radiusSm,
                    background: "none", cursor: "pointer", fontSize: 12,
                    color: T.primary, fontFamily: "'Noto Sans JP', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  追加
                </button>
              </div>
            </>
          )}

          {/* ── Step2: 事業情報 ── */}
          {step === 2 && (
            <>
              <div className="ob-sec-title">
                <span className="ob-dot" style={{ background: T.primary }} />
                事業情報
                <span style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 400 }}>
                  {businesses.length}件登録中
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {businesses.map((biz, idx) => (
                  <div key={biz.id} className="ob-biz-card">
                    <div className="ob-biz-card-hdr">
                      <div className="ob-biz-card-hdr-left">
                        <BuildingIcon />
                        <span>事業 {idx + 1}</span>
                        {biz.name && (
                          <span style={{ color: T.textPrimary, fontWeight: 600 }}>
                            · {biz.name}
                          </span>
                        )}
                      </div>
                      {businesses.length > 1 && (
                        <button className="ob-btn-del" onClick={() => removeBiz(biz.id)}
                          title="この事業を削除">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="ob-biz-card-body">
                      <div className="ob-grid2">
                        {/* 事業名: 80文字・文字数カウンター */}
                        <div>
                          <OInputText label="事業名" value={biz.name}
                            onChange={v => { setStepErrors(prev => { const n: Record<string, string> = {...prev}; delete n[`biz-${biz.id}-name`]; return n; }); updateBiz(biz.id, "name", v); }}
                            maxLength={80} placeholder="例: カフェ経営" />
                          {stepErrors[`biz-${biz.id}-name`] && (
                            <div style={{ fontSize: 11.5, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                              {stepErrors[`biz-${biz.id}-name`]}
                            </div>
                          )}
                        </div>
                        <OSelect label="業種" value={biz.type}
                          onChange={v => updateBiz(biz.id, "type", v)} options={[...BIZ_TYPES]} />
                      </div>

                      {/* 事業資産 */}
                      <div className="ob-sec-title" style={{ marginTop: 10 }}>
                        <span className="ob-dot" style={{ background: T.teal }} />事業資産
                      </div>
                      <div className="ob-grid2">
                        <OInputAmount label="資本金・元手" value={biz.capital}
                          onChange={v => updateBiz(biz.id, "capital", v)}
                          placeholder="100" hint="設立時の出資額・個人事業の元手" />
                        <OInputAmount label="事業用預金" value={biz.deposit}
                          onChange={v => updateBiz(biz.id, "deposit", v)}
                          placeholder="50" hint="事業口座の現在残高" />
                      </div>
                      <OInputAmount label="設備・機材" value={biz.equipment}
                        onChange={v => updateBiz(biz.id, "equipment", v)}
                        placeholder="0" hint="店舗設備・PC・機材など" />

                      {/* 事業負債 */}
                      <div className="ob-sec-title" style={{ marginTop: 10 }}>
                        <span className="ob-dot" style={{ background: T.danger }} />事業負債
                      </div>
                      <OInputAmount label="事業用ローン・買掛金" value={biz.liab}
                        onChange={v => updateBiz(biz.id, "liab", v)}
                        placeholder="0" hint="設備投資ローン・未払い仕入れ代など" />
                      {(() => {
                        const asset = parseFloat(biz.capital||"0") + parseFloat(biz.deposit||"0") + parseFloat(biz.equipment||"0");
                        const liab  = parseFloat(biz.liab||"0");
                        const net   = asset - liab;
                        return (
                          <div className="ob-net" style={{ background: T.tealLight }}>
                            <span style={{ fontWeight: 600, color: T.teal }}>事業純資産: </span>
                            <span style={{ fontWeight: 700, color: net >= 0 ? T.teal : T.danger }}>
                              {formatManyen(net)}
                            </span>
                            <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                              （資産 {formatManyen(asset)} − 負債 {formatManyen(liab)}）
                            </span>
                          </div>
                        );
                      })()}

                      {/* 売上モデル */}
                      <div className="ob-sec-title" style={{ marginTop: 10 }}>
                        <span className="ob-dot" style={{ background: T.primary }} />売上モデル
                      </div>
                      <div className="ob-grid2">
                        {/* 顧客数: 整数のみ・8桁（最大9999万） */}
                        <OInputInteger label="現在の顧客数" value={biz.customers}
                          onChange={v => updateBiz(biz.id, "customers", v)}
                          suffix="人" placeholder="100" maxDigits={8} />
                        <OInputInteger label="月間増加顧客数" value={biz.newCustomers}
                          onChange={v => updateBiz(biz.id, "newCustomers", v)}
                          suffix="人" placeholder="5" maxDigits={8} />
                      </div>
                      <div className="ob-grid2">
                        <OInputAmount label="顧客平均単価" value={biz.unitPrice}
                          onChange={v => updateBiz(biz.id, "unitPrice", v)}
                          placeholder="0.5" hint="月あたりの1顧客の平均売上" />
                        <div>
                          <label className="ob-label">自動計算結果（月次売上）</label>
                          <div className="ob-input-wrap">
                            <input className="ob-input has-suffix"
                              readOnly
                              value={(() => {
                                const c = parseFloat(biz.customers||"0");
                                const p = parseFloat(biz.unitPrice||"0");
                                return (c && p) ? formatManyen(c * p) : "";
                              })()}
                              placeholder="顧客数 × 単価で自動計算"
                              style={{ background: T.bg, color: T.textSecondary }}
                            />
                          </div>
                          <div className="ob-hint">顧客数 × 顧客平均単価</div>
                        </div>
                      </div>

                      {/* 固定費 */}
                      <div className="ob-sec-title" style={{ marginTop: 10 }}>
                        <span className="ob-dot" style={{ background: T.purple }} />固定費
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {biz.fixedCosts.map((row, fi) => (
                          <div key={row.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "10px 12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted }}>項目 {fi + 1}</span>
                              {biz.fixedCosts.length > 1 && (
                                <button onClick={() => removeFixed(biz.id, row.id)}
                                  style={{ fontSize: 11.5, color: T.danger, border: "none", background: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
                                  削除
                                </button>
                              )}
                            </div>
                            <OInputText label="内容" value={row.content}
                              onChange={v => { setStepErrors(prev => { const n: Record<string, string> = {...prev}; delete n[`biz-${biz.id}-fixed-${row.id}-content`]; return n; }); updateFixed(biz.id, row.id, "content", v); }}
                              maxLength={80} placeholder="家賃、人件費 など" />
                            {stepErrors[`biz-${biz.id}-fixed-${row.id}-content`] && (
                              <div style={{ fontSize: 11.5, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                {stepErrors[`biz-${biz.id}-fixed-${row.id}-content`]}
                              </div>
                            )}
                            <div className="ob-grid2" style={{ marginTop: 8, marginBottom: 8 }}>
                                <OField label="計上期間（開始）" hint="空欄で無期限">
                                <input
                                  type="date"
                                  className="ob-input"
                                  value={row.start_date}
                                  onChange={e => updateFixed(biz.id, row.id, "start_date", e.target.value)}
                                />
                              </OField>
                              <OField label="計上期間（終了）" hint="空欄で無期限">
                                <input
                                  type="date"
                                  className="ob-input"
                                  value={row.end_date}
                                  onChange={e => updateFixed(biz.id, row.id, "end_date", e.target.value)}
                                />
                              </OField>
                            </div>
                            <div style={{ marginTop: 8, marginBottom: 8 }}>
                              <OInputAmount label="金額" value={row.amount}
                                onChange={v => { setStepErrors(prev => { const n: Record<string, string> = {...prev}; delete n[`biz-${biz.id}-fixed-${row.id}-amount`]; return n; }); updateFixed(biz.id, row.id, "amount", v); }}
                                placeholder="0" />
                              {stepErrors[`biz-${biz.id}-fixed-${row.id}-amount`] && (
                                <div style={{ fontSize: 11.5, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  {stepErrors[`biz-${biz.id}-fixed-${row.id}-amount`]}
                                </div>
                              )}
                            </div>
                            <OInputText label="メモ" value={row.memo}
                              onChange={v => updateFixed(biz.id, row.id, "memo", v)}
                              maxLength={80} placeholder="補足事項など（任意）" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addFixed(biz.id)}
                        style={{
                          marginTop: 8, width: "100%", height: 32,
                          border: `1px dashed ${T.borderMid}`, borderRadius: T.radiusSm,
                          background: "none", cursor: "pointer", fontSize: 12,
                          color: T.primary, fontFamily: "'Noto Sans JP', sans-serif",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        追加
                      </button>

                      {/* 変動費率（業種から自動設定・手動編集可） */}
                      <div className="ob-sec-title" style={{ marginTop: 10 }}>
                        <span className="ob-dot" style={{ background: T.amber ?? "#EF9F27" }} />変動費率
                        <span style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 400, marginLeft: 4 }}>業種から自動設定・手動変更可</span>
                      </div>
                      {(() => {
                        const vrate = VARIABLE_RATE[biz.type as BizType] ?? VARIABLE_RATE["その他サービス"];
                        // sanitize: 整数3桁＋小数2桁（NUMBER(5,2)、最大100.00）
                        const sanitizeRate = (v: string): string => {
                          let s = v.replace(/[^\d.]/g, "");
                          const parts = s.split(".");
                          if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
                          const [intPart, decPart] = s.split(".");
                          const trimInt = (intPart ?? "").slice(0, 3);
                          if (decPart === undefined) return trimInt;
                          return trimInt + "." + decPart.slice(0, 2);
                        };
                        const isCustom = biz.variableRate !== String(vrate.rate);
                        return (
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className="ob-input-wrap" style={{ width: 110 }}>
                                <input
                                  className="ob-input has-suffix"
                                  type="text"
                                  inputMode="decimal"
                                  maxLength={6}
                                  value={biz.variableRate}
                                  onChange={e => updateBiz(biz.id, "variableRate", sanitizeRate(e.target.value))}
                                  style={{ fontWeight: 700, fontSize: 16, color: T.primary }}
                                />
                                <span className="ob-suffix">%</span>
                              </div>
                              {isCustom && (
                                <button
                                  onClick={() => updateBiz(biz.id, "variableRate", String(vrate.rate))}
                                  style={{
                                    fontSize: 11, color: T.textMuted, border: `1px solid ${T.border}`,
                                    background: T.bg, borderRadius: 6, padding: "3px 8px",
                                    cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
                                    whiteSpace: "nowrap",
                                  }}
                                  title="業種のデフォルト値に戻す"
                                >
                                  ↩ {vrate.rate}%に戻す
                                </button>
                              )}
                            </div>
                            <div style={{ fontSize: 11.5, color: isCustom ? T.primary : T.textSecondary, marginTop: 5 }}>
                              {isCustom
                                ? `手動設定中（業種デフォルト: ${vrate.rate}%）`
                                : vrate.desc}
                            </div>
                            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>
                              ※ 業種を変更するとデフォルト値に自動更新されます（0.00〜100.00）
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 事業を追加ボタン */}
              <button className="ob-btn-add" style={{ marginTop: 12 }} onClick={addBiz}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                事業を追加する
              </button>

              <div style={{ marginTop: 12, fontSize: 11.5, color: T.textMuted, lineHeight: 1.6 }}>
                ※ 事業をお持ちでない場合はスキップできます。後から設定画面で追加・変更が可能です。
              </div>
            </>
          )}
        </div>

        {/* フッター */}
        <div className="ob-footer">
          <button className="ob-btn-skip" onClick={() => { setStepErrors({}); onComplete(); }}>スキップ</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && (
              <button className="ob-btn ob-btn-ghost" onClick={() => { setStepErrors({}); setStep(s => s - 1); }}>
                戻る
              </button>
            )}
            {step < TOTAL ? (
              <button className="ob-btn ob-btn-primary" onClick={() => {
                const errs = validateStep1();
                if (Object.keys(errs).length > 0) { setStepErrors(errs); return; }
                setStepErrors({});
                setStep(s => s + 1);
              }}>
                次へ <ArrowRightIcon />
              </button>
            ) : (
              <button className="ob-btn ob-btn-primary" onClick={() => {
                const errs = validateStep2();
                if (Object.keys(errs).length > 0) { setStepErrors(errs); return; }
                setStepErrors({});
                onComplete();
              }}>
                <CheckIcon /> 登録を完了する
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 会員登録画面 ─────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showPw2,   setShowPw2]   = useState(false);
  const [agree,     setAgree]     = useState(false);
  const [nameErr,   setNameErr]   = useState("");
  const [emailErr,  setEmailErr]  = useState("");
  const [pwErr,     setPwErr]     = useState("");
  const [pw2Err,    setPw2Err]    = useState("");
  const [agreeErr,  setAgreeErr]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOb,    setShowOb]    = useState(false);

  const strength = pwStrength(password);

  // 名前: 30文字・文字数カウンター
  const nameLen = name.length;
  const nameCls = charCountClass(nameLen, 30);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ne = name.trim() ? "" : "お名前を入力してください";
    const ne2 = name.length > 30 ? "お名前は30文字以内で入力してください" : "";
    const ee = validateEmail(email);
    const pe = validatePassword(password);
    const p2 = password !== password2 ? "パスワードが一致しません" : "";
    const ae = agree ? "" : "利用規約への同意が必要です";
    setNameErr(ne || ne2);
    setEmailErr(ee);
    setPwErr(pe);
    setPw2Err(p2);
    setAgreeErr(ae);
    if (ne || ne2 || ee || pe || p2 || ae) return;

    setIsLoading(true);
    try {
      // await api.register({ name, email, password });
      setShowOb(true);
    } catch (err) {
      setEmailErr("登録処理中にエラーが発生しました。");
      console.error("登録エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{sharedCss + obCss}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
            <AuthLogo />
          </div>
          <h1 className="auth-title">新規登録</h1>
          <p className="auth-subtitle">アカウントを作成して資産管理をはじめましょう</p>

          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            {/* 名前: 30文字・文字数カウンター */}
            <div>
              <AuthInput
                label="お名前" required placeholder="山田 太郎"
                value={name}
                onChange={v => setName(v.slice(0, 30))}
                error={nameErr}
              />
              <div className={`ob-char-count ${nameCls}`} style={{ marginTop: -10, marginBottom: 10 }}>
                {nameLen} / 30
              </div>
            </div>

            {/* メールアドレス: 半角のみ・254文字 */}
            {/* メールアドレス: 半角のみ・254文字・文字数カウンター */}
            <div>
              <AuthInput
                label="メールアドレス" required type="email"
                placeholder="your@email.com"
                value={email}
                onChange={v => setEmail(toHalfWidth(v).slice(0, 254))}
                error={emailErr}
              />
              <div className={`ob-char-count ${charCountClass(email.length, 254)}`} style={{ marginTop: -10, marginBottom: 10 }}>
                {email.length} / 254
              </div>
            </div>

            {/* パスワード: 半角のみ・8〜128文字 */}
            <AuthInput
              label="パスワード" required
              type={showPw ? "text" : "password"}
              placeholder="8〜128文字・半角英数字混在"
              value={password}
              onChange={v => setPassword(toHalfWidth(v).slice(0, 128))}
              error={pwErr}
              showToggle={showPw} onToggle={() => setShowPw(v => !v)}
            />
            {password && (
              <div style={{ marginTop: -10, marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{
                      height: 3, flex: 1, borderRadius: 2,
                      background: n <= strength.level ? strength.color : T.border,
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 10.5, color: strength.color }}>強度: {strength.label}</div>
                  <div className={`ob-char-count ${charCountClass(password.length, 128)}`} style={{ marginTop: 0 }}>
                    {password.length} / 128
                  </div>
                </div>
              </div>
            )}

            {/* パスワード確認: 半角のみ・128文字 */}
            <AuthInput
              label="パスワード（確認）" required
              type={showPw2 ? "text" : "password"} placeholder="もう一度入力"
              value={password2}
              onChange={v => setPassword2(toHalfWidth(v).slice(0, 128))}
              error={pw2Err}
              showToggle={showPw2} onToggle={() => setShowPw2(v => !v)}
            />

            <div className="auth-check-row">
              <input type="checkbox" className="auth-check" id="agree"
                checked={agree} onChange={e => setAgree(e.target.checked)} />
              <label className="auth-check-label" htmlFor="agree">
                <span className="auth-link">利用規約</span>および
                <span className="auth-link">プライバシーポリシー</span>に同意します
              </label>
            </div>
            {agreeErr && (
              <div className="auth-error-msg" style={{ marginTop: -10, marginBottom: 8 }}>
                <AlertIcon />{agreeErr}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="auth-btn auth-btn-primary">
              {isLoading ? "登録中…" : <><UserIcon /> アカウントを作成</>}
            </button>
          </form>

          <div className="auth-link-row">
            すでにアカウントをお持ちの方は
            <span className="auth-link" onClick={() => navigate("/login")}> ログイン</span>
          </div>
        </div>

        {showOb && (
          <OnboardingModal onComplete={() => { setShowOb(false); navigate("/"); }} />
        )}
      </div>
    </div>
  );
}