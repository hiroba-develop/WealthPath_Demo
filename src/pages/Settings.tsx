import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  T, sharedCss,
  EyeIcon, EyeOffIcon, CheckIcon, AlertIcon,
  UserIcon, LockIcon, BuildingIcon, WalletIcon, SettingsIcon,
  validatePassword, pwStrength,
} from "../components/Authshared";

// ── CSS ──────────────────────────────────────────────────────────
const css = `
  .st-wrap {
    font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary};
  }

  /* ページタイトル */
  .st-page-hdr   { margin-bottom: 24px; }
  .st-page-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 3px; }
  .st-page-sub   { font-size: 12.5px; color: ${T.textMuted}; }

  /* タブ */
  .st-tabs {
    display: flex; gap: 2px;
    border-bottom: 2px solid ${T.border};
    margin-bottom: 24px; overflow-x: auto;
  }
  .st-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px; font-size: 13px; font-weight: 500;
    font-family: 'Noto Sans JP', sans-serif;
    border: none; background: none; cursor: pointer;
    color: ${T.textSecondary}; white-space: nowrap;
    border-bottom: 2px solid transparent; margin-bottom: -2px;
    transition: color 0.15s, border-color 0.15s;
  }
  .st-tab:hover { color: ${T.textPrimary}; }
  .st-tab.active { color: ${T.primary}; border-bottom-color: ${T.primary}; font-weight: 600; }
  .st-tab-icon {
    width: 18px; height: 18px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0.7;
  }
  .st-tab.active .st-tab-icon { opacity: 1; }

  /* セクション */
  .st-section {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: ${T.radius}; overflow: hidden; margin-bottom: 16px;
  }
  .st-section-hdr {
    padding: 12px 20px; border-bottom: 1px solid ${T.border};
    font-size: 13px; font-weight: 600; color: ${T.textPrimary};
    background: ${T.bg}; display: flex; align-items: center; gap: 8px;
  }
  .st-section-icon {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .st-body   { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
  .st-grid2  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .st-grid3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  /* フォーム部品 */
  .st-label {
    display: block; font-size: 12px; font-weight: 500;
    color: ${T.textSecondary}; margin-bottom: 5px;
  }
  .st-input {
    width: 100%; height: 40px; padding: 0 12px;
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary}; background: ${T.surface};
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .st-input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .st-input::placeholder { color: ${T.textMuted}; }
  .st-input.readonly { background: ${T.bg}; color: ${T.textSecondary}; cursor: default; }
  .st-input.has-icon { padding-right: 40px; }
  .st-iwrap { position: relative; }
  .st-iicon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: ${T.textMuted}; cursor: pointer; display: flex; align-items: center; transition: color 0.12s;
  }
  .st-iicon:hover { color: ${T.textSecondary}; }
  .st-hint { font-size: 11px; color: ${T.textMuted}; margin-top: 4px; }
  .st-net  { padding: 10px 14px; border-radius: ${T.radiusSm}; font-size: 12.5px; }

  /* ボタン */
  .st-save-row {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 12px 20px; border-top: 1px solid ${T.border}; background: ${T.bg};
  }
  .st-btn {
    height: 36px; padding: 0 18px; border-radius: ${T.radiusSm};
    font-size: 13px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500;
    cursor: pointer; border: none; transition: background 0.15s, transform 0.1s;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .st-btn:active { transform: scale(0.98); }
  .st-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .st-btn-primary { background: ${T.primary}; color: white; }
  .st-btn-primary:hover:not(:disabled) { background: ${T.primaryHover}; }
  .st-btn-ghost { background: none; border: 1px solid ${T.border}; color: ${T.textSecondary}; }
  .st-btn-ghost:hover:not(:disabled) { background: ${T.bg}; color: ${T.textPrimary}; }
  .st-btn-danger { background: ${T.dangerLight}; color: ${T.danger}; }
  .st-btn-danger:hover { background: #fcd9d9; }
  .st-btn-sm { height: 30px; padding: 0 12px; font-size: 12px; }
  .st-btn-icon {
    width: 28px; height: 28px; padding: 0; border-radius: 6px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* トグル行 */
  .st-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid ${T.border};
  }
  .st-toggle-row:last-child { border-bottom: none; }

  /* エラー */
  .st-error { font-size: 11.5px; color: ${T.danger}; display: flex; align-items: center; gap: 4px; }

  /* パスワード強度 */
  .pw-bar { display: flex; gap: 3px; margin-bottom: 4px; margin-top: 6px; }
  .pw-seg { height: 3px; flex: 1; border-radius: 2px; background: ${T.border}; transition: background 0.2s; }
  .pw-lbl { font-size: 10.5px; }

  /* ── 事業タブ専用 ── */
  .biz-add-btn {
    height: 36px; padding: 0 16px; border-radius: ${T.radiusSm};
    font-size: 13px; font-family: 'Noto Sans JP', sans-serif; font-weight: 500;
    border: 1px solid ${T.border}; background: ${T.surface}; color: ${T.textPrimary};
    cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    transition: background 0.12s; margin-bottom: 16px;
  }
  .biz-add-btn:hover { background: ${T.bg}; }

  .biz-card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: ${T.radius}; overflow: hidden; margin-bottom: 16px;
  }

  /* カードヘッダー（基本情報ラベル＋削除編集） */
  .biz-card-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 16px; background: ${T.bg}; border-bottom: 1px solid ${T.border};
  }
  .biz-card-hdr-title { font-size: 13px; font-weight: 600; color: ${T.textPrimary}; }
  .biz-card-hdr-actions { display: flex; gap: 8px; align-items: center; }
  .biz-hdr-action-btn {
    font-size: 12px; font-weight: 500;
    font-family: 'Noto Sans JP', sans-serif;
    border: none; background: none; cursor: pointer; padding: 4px 8px; border-radius: 5px;
    transition: background 0.12s;
  }
  .biz-hdr-action-btn.del   { color: ${T.danger}; }
  .biz-hdr-action-btn.del:hover   { background: ${T.dangerLight}; }
  .biz-hdr-action-btn.edit  { color: ${T.primary}; }
  .biz-hdr-action-btn.edit:hover  { background: ${T.primaryLight}; }

  /* カード内セクション */
  .biz-section { padding: 16px; border-bottom: 1px solid ${T.border}; }
  .biz-section:last-child { border-bottom: none; }
  .biz-section-title {
    font-size: 12px; font-weight: 600; color: ${T.textSecondary};
    margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
  }

  /* 固定費リスト */
  .fixed-cost-row {
    display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px;
    align-items: end; margin-bottom: 10px;
  }
  .fixed-cost-row:last-child { margin-bottom: 0; }
  .fixed-cost-full { grid-column: 1 / 3; }

  /* 変動費率バッジ */
  .vrate-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: ${T.radiusSm};
    background: ${T.primaryLight}; border: 1px solid #C5CFF7;
  }
  .vrate-value { font-size: 22px; font-weight: 700; color: ${T.primary}; letter-spacing: -0.5px; }
  .vrate-unit  { font-size: 13px; color: ${T.textSecondary}; }
  .vrate-desc  { font-size: 11.5px; color: ${T.textSecondary}; margin-top: 4px; }

  /* 保存行（カード下部） */
  .biz-save-row {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 12px 16px; background: ${T.bg}; border-top: 1px solid ${T.border};
  }

  /* トースト */
  .st-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #1a6e4f; color: white;
    padding: 10px 16px; border-radius: ${T.radiusSm};
    font-size: 13px; display: flex; align-items: center; gap: 8px;
    z-index: 1000; box-shadow: 0 4px 12px rgba(28,30,46,0.2);
    animation: stUp 0.2s ease; font-family: 'Noto Sans JP', sans-serif;
  }
  @keyframes stUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 640px) {
    .st-grid2 { grid-template-columns: 1fr; }
    .st-grid3 { grid-template-columns: 1fr 1fr; }
    .st-body  { padding: 16px; }
    .st-save-row { padding: 10px 16px; }
    .st-tab { padding: 8px 12px; font-size: 12px; }
    .fixed-cost-row { grid-template-columns: 1fr auto; }
    .fixed-cost-full { grid-column: 1 / 2; }
  }
`;

// ── 事業タイプと変動費率のマッピング ────────────────────────────
const BIZ_TYPES = [
  "飲食・小売",
  "IT・コンサルティング",
  "製造・建設",
  "医療・介護",
  "不動産",
  "その他サービス",
] as const;
type BizType = typeof BIZ_TYPES[number];

const VARIABLE_RATE: Record<BizType, { rate: number; desc: string }> = {
  "飲食・小売":          { rate: 35, desc: "仕入・材料費が売上の約35%" },
  "IT・コンサルティング": { rate: 15, desc: "外注費・ライセンスが売上の約15%" },
  "製造・建設":          { rate: 45, desc: "材料費・外注費が売上の約45%" },
  "医療・介護":          { rate: 20, desc: "消耗品・委託費が売上の約20%" },
  "不動産":              { rate: 10, desc: "管理費・修繕費が売上の約10%" },
  "その他サービス":      { rate: 25, desc: "外注・消耗品費が売上の約25%" },
};

// ── 型定義 ───────────────────────────────────────────────────────
interface FixedCostRow {
  id: string;
  name: string;
  memo: string;
  amount: string;
}

interface BizCard {
  id: string;
  name:         string;
  type:         BizType;
  // 資産（内訳）
  capital:      string;  // 資本金・元手（万円）
  deposit:      string;  // 事業用預金（万円）
  equipment:    string;  // 設備・機材（万円）
  // 負債
  liab:         string;  // 事業用ローン・買掛金（万円）
  // 売上モデル
  customers:    string;
  newCustomers: string;
  unitPrice:    string;
  fixedCosts:   FixedCostRow[];
  isEditing:    boolean;
}

function newFixedCost(): FixedCostRow {
  return { id: crypto.randomUUID(), name: "", memo: "", amount: "" };
}
function newBizCard(): BizCard {
  return {
    id: crypto.randomUUID(),
    name: "", type: "飲食・小売",
    capital: "", deposit: "", equipment: "", liab: "",
    customers: "", newCustomers: "", unitPrice: "",
    fixedCosts: [newFixedCost()],
    isEditing: true,
  };
}

// 資産合計
function calcBizAsset(c: BizCard): number {
  return parseFloat(c.capital||"0") + parseFloat(c.deposit||"0") + parseFloat(c.equipment||"0");
}

// 自動計算売上（万円/月）
function calcRevenue(customers: string, unitPrice: string): string {
  const c = parseFloat(customers  || "0");
  const p = parseFloat(unitPrice  || "0");
  if (!c || !p) return "";
  return (c * p).toLocaleString("ja-JP");
}

// ── 小コンポーネント ─────────────────────────────────────────────
function SField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="st-label">{label}</label>
      {children}
      {hint && <div className="st-hint">{hint}</div>}
    </div>
  );
}

function SInput({ label, value, onChange, suffix, hint, placeholder, type = "text", readOnly }: {
  label: string; value: string; onChange?: (v: string) => void;
  suffix?: string; hint?: string; placeholder?: string; type?: string; readOnly?: boolean;
}) {
  return (
    <SField label={label} hint={hint}>
      <div className="st-iwrap">
        <input
          className={`st-input${readOnly ? " readonly" : ""}${suffix ? "" : ""}`}
          type={type} value={value} placeholder={placeholder}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          style={suffix ? { paddingRight: 42 } : {}}
        />
        {suffix && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: T.textMuted, pointerEvents: "none" }}>
            {suffix}
          </span>
        )}
      </div>
    </SField>
  );
}

function SSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: readonly string[];
}) {
  return (
    <SField label={label}>
      <div className="st-iwrap">
        <select className="st-input" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.textSecondary }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </SField>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 11,
      background: checked ? T.primary : T.border,
      position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: checked ? 20 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "white", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

function SectionHdr({ icon, label, iconBg }: { icon: React.ReactNode; label: string; iconBg: string }) {
  return (
    <div className="st-section-hdr">
      <div className="st-section-icon" style={{ background: iconBg }}>{icon}</div>
      {label}
    </div>
  );
}

// ── 事業カードコンポーネント ─────────────────────────────────────
function BizCardView({
  card,
  onUpdate,
  onDelete,
  onSave,
}: {
  card: BizCard;
  onUpdate: (patch: Partial<BizCard>) => void;
  onDelete: () => void;
  onSave: () => void;
}) {
  const vrate   = VARIABLE_RATE[card.type];
  const revenue = calcRevenue(card.customers, card.unitPrice);

  function updateFixed(id: string, field: keyof FixedCostRow, value: string) {
    onUpdate({
      fixedCosts: card.fixedCosts.map(r => r.id === id ? { ...r, [field]: value } : r),
    });
  }
  function addFixed() {
    onUpdate({ fixedCosts: [...card.fixedCosts, newFixedCost()] });
  }
  function removeFixed(id: string) {
    if (card.fixedCosts.length <= 1) return;
    onUpdate({ fixedCosts: card.fixedCosts.filter(r => r.id !== id) });
  }

  // 読み取りモードの表示
  if (!card.isEditing) {
    const asset = calcBizAsset(card);
    const liab  = parseFloat(card.liab||"0");
    const net   = asset - liab;
    return (
      <div className="biz-card">
        <div className="biz-card-hdr">
          <div className="biz-card-hdr-title">
            {card.name || "（事業名未入力）"}
            <span style={{ fontSize: 11, fontWeight: 400, color: T.textMuted, marginLeft: 8 }}>
              {card.type}
            </span>
          </div>
          <div className="biz-card-hdr-actions">
            <button className="biz-hdr-action-btn del" onClick={onDelete}>削除</button>
            <button className="biz-hdr-action-btn edit" onClick={() => onUpdate({ isEditing: true })}>編集</button>
          </div>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: T.textSecondary }}>
          {card.capital   && <span>資本金 <strong style={{ color: T.textPrimary }}>{card.capital}万</strong></span>}
          {card.deposit   && <span>事業預金 <strong style={{ color: T.textPrimary }}>{card.deposit}万</strong></span>}
          {card.equipment && <span>設備 <strong style={{ color: T.textPrimary }}>{card.equipment}万</strong></span>}
          {card.liab      && <span>負債 <strong style={{ color: T.danger }}>{card.liab}万</strong></span>}
          <span>純資産 <strong style={{ color: net >= 0 ? T.teal : T.danger }}>{net.toLocaleString("ja-JP")}万</strong></span>
          {revenue && <span>月次売上 <strong style={{ color: T.primary }}>{revenue}万円</strong></span>}
          <span>変動費率 <strong style={{ color: T.primary }}>{vrate.rate}%</strong></span>
        </div>
      </div>
    );
  }

  // 編集モード
  return (
    <div className="biz-card">
      {/* ヘッダー */}
      <div className="biz-card-hdr">
        <span className="biz-card-hdr-title">基本情報</span>
        <div className="biz-card-hdr-actions">
          <button className="biz-hdr-action-btn del" onClick={onDelete}>削除</button>
          <button className="biz-hdr-action-btn edit" onClick={() => onUpdate({ isEditing: false })}>閉じる</button>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="biz-section">
        <div className="st-grid2">
          <SInput label="事業名" value={card.name} onChange={v => onUpdate({ name: v })}
            placeholder="例: カフェ経営" />
          <SSelect label="業種" value={card.type}
            onChange={v => onUpdate({ type: v as BizType })} options={BIZ_TYPES} />
        </div>
      </div>

      {/* 事業資産 */}
      <div className="biz-section">
        <div className="biz-section-title">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block" }} />
          事業資産
        </div>
        <div className="st-grid2" style={{ marginBottom: 12 }}>
          <SInput label="資本金・元手" value={card.capital}
            onChange={v => onUpdate({ capital: v })} placeholder="100"
            suffix="万円" hint="設立時の出資額・個人事業の元手" />
          <SInput label="事業用預金" value={card.deposit}
            onChange={v => onUpdate({ deposit: v })} placeholder="50"
            suffix="万円" hint="事業口座の現在残高" />
        </div>
        <SInput label="設備・機材" value={card.equipment}
          onChange={v => onUpdate({ equipment: v })} placeholder="0"
          suffix="万円" hint="店舗設備・PC・機材など" />
      </div>

      {/* 事業負債 */}
      <div className="biz-section">
        <div className="biz-section-title">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.danger, display: "inline-block" }} />
          事業負債
        </div>
        <SInput label="事業用ローン・買掛金" value={card.liab}
          onChange={v => onUpdate({ liab: v })} placeholder="0"
          suffix="万円" hint="設備投資ローン・未払い仕入れ代など" />
        {(() => {
          const asset = calcBizAsset(card);
          const liab  = parseFloat(card.liab||"0");
          const net   = asset - liab;
          return (
            <div className="st-net" style={{ background: T.tealLight, marginTop: 8 }}>
              <span style={{ fontWeight: 600, color: T.teal }}>事業純資産: </span>
              <span style={{ fontWeight: 700, color: net >= 0 ? T.teal : T.danger }}>
                {net.toLocaleString("ja-JP")}万円
              </span>
              <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                （資産 {asset.toLocaleString("ja-JP")}万 − 負債 {liab.toLocaleString("ja-JP")}万）
              </span>
            </div>
          );
        })()}
      </div>

      {/* 売上モデル */}
      <div className="biz-section">
        <div className="biz-section-title">売上モデル</div>
        <div className="st-grid2" style={{ marginBottom: 12 }}>
          <SInput label="現在の顧客数" value={card.customers}
            onChange={v => onUpdate({ customers: v })} placeholder="100" suffix="人" />
          <SInput label="月間増加顧客数" value={card.newCustomers}
            onChange={v => onUpdate({ newCustomers: v })} placeholder="5" suffix="人" />
        </div>
        <div className="st-grid2">
          <SInput label="顧客平均単価" value={card.unitPrice}
            onChange={v => onUpdate({ unitPrice: v })} placeholder="0.5" suffix="万円"
            hint="月あたりの1顧客の平均売上" />
          <SInput label="自動計算結果（月次売上）"
            value={revenue ? revenue + " 万円" : ""}
            readOnly placeholder="顧客数 × 単価で自動計算"
            hint="顧客数 × 顧客平均単価" />
        </div>
      </div>

      {/* 固定費 */}
      <div className="biz-section">
        <div className="biz-section-title">固定費</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {card.fixedCosts.map((row, idx) => (
            <div key={row.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted }}>項目 {idx + 1}</span>
                {card.fixedCosts.length > 1 && (
                  <button
                    onClick={() => removeFixed(row.id)}
                    style={{ fontSize: 11.5, color: T.danger, border: "none", background: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    削除
                  </button>
                )}
              </div>
              <div className="st-grid2" style={{ marginBottom: 8 }}>
                <SInput label="項目名" value={row.name}
                  onChange={v => updateFixed(row.id, "name", v)} placeholder="家賃、人件費 など" />
                <SInput label="内容" value={row.memo}
                  onChange={v => updateFixed(row.id, "memo", v)} placeholder="補足・詳細" />
              </div>
              <SInput label="金額" value={row.amount}
                onChange={v => updateFixed(row.id, "amount", v)} placeholder="0" suffix="万円" />
            </div>
          ))}
        </div>
        <button
          onClick={addFixed}
          style={{
            marginTop: 10, width: "100%", height: 34,
            border: `1px dashed ${T.borderMid}`, borderRadius: T.radiusSm,
            background: "none", cursor: "pointer", fontSize: 12.5,
            color: T.primary, fontFamily: "'Noto Sans JP', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "background 0.12s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = T.primaryLight)}
          onMouseOut={e => (e.currentTarget.style.background = "none")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          追加
        </button>
      </div>

      {/* 変動費率（業種から自動設定） */}
      <div className="biz-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="biz-section-title" style={{ marginBottom: 0 }}>変動費率</div>
          <span style={{ fontSize: 10.5, color: T.textMuted }}>業種から自動設定</span>
        </div>
        <div className="vrate-badge">
          <span className="vrate-value">{vrate.rate}</span>
          <span className="vrate-unit">%</span>
        </div>
        <div className="vrate-desc">{vrate.desc}</div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
          ※ 業種を変更すると自動で更新されます
        </div>
      </div>

      {/* 保存 */}
      <div className="biz-save-row">
        <button className="st-btn st-btn-ghost" onClick={() => onUpdate({ isEditing: false })}>
          キャンセル
        </button>
        <button className="st-btn st-btn-primary" onClick={onSave}>
          <CheckIcon /> 保存
        </button>
      </div>
    </div>
  );
}

// ── タブ定義 ────────────────────────────────────────────────────
type TabId = "account" | "asset" | "business" | "notif" | "danger";
const TABS: { id: TabId; label: string; icon: React.ReactNode; iconBg: string }[] = [
  { id: "account",  label: "アカウント",    icon: <UserIcon />,     iconBg: T.primaryLight },
  { id: "asset",    label: "個人資産",      icon: <WalletIcon />,   iconBg: T.tealLight },
  { id: "business", label: "事業情報",      icon: <BuildingIcon />, iconBg: T.primaryLight },
  //{ id: "notif",    label: "通知設定",      icon: <SettingsIcon />, iconBg: "#FEF3C7" },
  { id: "danger",   label: "アカウント削除", icon: <AlertIcon />,   iconBg: T.dangerLight },
];

// ── Settings ─────────────────────────────────────────────────────
const Settings = () => {
  const navigate          = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("account");

  // ① アカウント
  const [name,  setName]  = useState<string>(user?.name  ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");

  // ② パスワード
  const [curPw,    setCurPw]    = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [newPw2,   setNewPw2]   = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showNew2, setShowNew2] = useState(false);
  const [pwErr,    setPwErr]    = useState("");

  // ③ 個人資産
  const [pCash,   setPCash]   = useState<string>(user?.personalAsset?.cash   ?? "");
  const [pInvest, setPInvest] = useState<string>(user?.personalAsset?.invest ?? "");
  const [pLiab,   setPLiab]   = useState<string>(user?.personalAsset?.liab   ?? "");

  // ④ 事業情報（複数カード）
  // DataEntryのサンプルデータと整合させた初期値
  // A事業:           飲食・小売      / 資本金100万・預金50万・設備80万 / 負債45万
  // Bコンサルティング: IT・コンサル   / 資本金50万・預金30万・設備30万  / 負債5万
  const [bizCards, setBizCards] = useState<BizCard[]>([
    {
      id: "sample-a",
      name: "A事業",
      type: "飲食・小売",
      capital:      "100",  // 開業時の元手
      deposit:      "50",   // 運転資金（普通預金）← DataEntry b01と整合
      equipment:    "80",   // 店舗設備一式（厨房機器・什器）
      liab:         "45",   // 開業準備ローン ← DataEntry b03と整合
      customers:    "36",
      newCustomers: "3",
      unitPrice:    "0.5",
      fixedCosts: [
        { id: "fa1", name: "家賃（店舗）", memo: "月額固定",    amount: "6" },
        { id: "fa2", name: "仕入原価",     memo: "食材・消耗品", amount: "8" },
      ],
      isEditing: false,
    },
    {
      id: "sample-b",
      name: "Bコンサルティング",
      type: "IT・コンサルティング",
      capital:      "50",   // 設立時の元手
      deposit:      "30",   // 事業用預金 ← DataEntry b02（PC・機材と合算）
      equipment:    "30",   // 業務用PC・機材（MacBook Pro×2台）← DataEntry b02と整合
      liab:         "5",    // 事業用クレジット残高 ← DataEntry b04と整合
      customers:    "2",
      newCustomers: "1",
      unitPrice:    "5",
      fixedCosts: [
        { id: "fb1", name: "SaaS各種サブスク", memo: "Notion, Slack等", amount: "2" },
      ],
      isEditing: false,
    },
  ]);

  // ⑤ 通知
  const [notifAlert,   setNotifAlert]   = useState<boolean>(user?.notif?.alert   ?? true);
  const [notifMonthly, setNotifMonthly] = useState<boolean>(user?.notif?.monthly ?? true);

  const [toast,     setToast]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pNet     = parseFloat(pCash||"0") + parseFloat(pInvest||"0") - parseFloat(pLiab||"0");
  const strength = pwStrength(newPw);

  function showSaved(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  // 事業カード操作
  function addBizCard() { setBizCards(prev => [...prev, newBizCard()]); }
  function updateBizCard(id: string, patch: Partial<BizCard>) {
    setBizCards(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }
  function deleteBizCard(id: string) {
    setBizCards(prev => prev.filter(c => c.id !== id));
  }
  function saveBizCard(id: string) {
    setBizCards(prev => prev.map(c => c.id === id ? { ...c, isEditing: false } : c));
    showSaved("事業情報を保存しました");
  }

  async function saveAccount() {
    setIsLoading(true);
    try { updateUser({ name, email }); showSaved("アカウント情報を保存しました"); }
    finally { setIsLoading(false); }
  }

  async function savePassword() {
    setPwErr("");
    if (!curPw)            { setPwErr("現在のパスワードを入力してください"); return; }
    if (!newPw || !newPw2) { setPwErr("新しいパスワードをすべて入力してください"); return; }
    const e = validatePassword(newPw);
    if (e)                 { setPwErr(e); return; }
    if (newPw !== newPw2)  { setPwErr("新しいパスワードが一致しません"); return; }
    setIsLoading(true);
    try {
      // await api.updatePassword({ currentPassword: curPw, newPassword: newPw });
      setCurPw(""); setNewPw(""); setNewPw2("");
      showSaved("パスワードを変更しました");
    } finally { setIsLoading(false); }
  }

  async function savePersonalAsset() {
    setIsLoading(true);
    try {
      updateUser({ personalAsset: { cash: pCash, invest: pInvest, liab: pLiab } });
      showSaved("個人資産情報を保存しました");
    } finally { setIsLoading(false); }
  }

  function saveNotif(alert: boolean, monthly: boolean) {
    updateUser({ notif: { alert, monthly } });
    showSaved("通知設定を保存しました");
  }

  async function handleDeleteAccount() {
    if (!window.confirm(
      "アカウントを削除すると、すべての資産データ・履歴が完全に消去されます。\nこの操作は取り消せません。本当に削除しますか？"
    )) return;
    logout();
    navigate("/login");
  }

  return (
    <div className="st-wrap">
      <style>{sharedCss + css}</style>

      <div className="st-page-hdr">
        <h1 className="st-page-title">設定</h1>
        <p className="st-page-sub">アカウント・資産情報・通知の管理</p>
      </div>

      {/* タブ */}
      <div className="st-tabs">
        {TABS.map(tab => (
          <button key={tab.id} className={`st-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}>
            <span className="st-tab-icon" style={{ background: tab.iconBg }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── タブ①: アカウント ── */}
      {activeTab === "account" && (
        <>
          <div className="st-section">
            <SectionHdr icon={<UserIcon />} label="アカウント情報" iconBg={T.primaryLight} />
            <div className="st-body">
              <div className="st-grid2">
                <SInput label="お名前" value={name} onChange={setName} placeholder="山田 太郎" />
                <SInput label="メールアドレス" type="email" value={email} onChange={setEmail} placeholder="your@email.com" />
              </div>
            </div>
            <div className="st-save-row">
              <button className="st-btn st-btn-ghost"
                onClick={() => { setName(user?.name ?? ""); setEmail(user?.email ?? ""); }}>
                キャンセル
              </button>
              <button className="st-btn st-btn-primary" onClick={saveAccount} disabled={isLoading}>
                <CheckIcon /> 保存する
              </button>
            </div>
          </div>

          <div className="st-section">
            <SectionHdr icon={<LockIcon />} label="パスワード変更" iconBg={T.purpleLight} />
            <div className="st-body">
              <SField label="現在のパスワード">
                <div className="st-iwrap">
                  <input className="st-input has-icon" type={showCur ? "text" : "password"}
                    placeholder="現在のパスワードを入力" value={curPw}
                    onChange={e => setCurPw(e.target.value)} />
                  <span className="st-iicon" onClick={() => setShowCur(v => !v)}>
                    {showCur ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>
              </SField>
              <div className="st-grid2">
                <div>
                  <SField label="新しいパスワード" hint="8文字以上・英数字混在">
                    <div className="st-iwrap">
                      <input className="st-input has-icon" type={showNew ? "text" : "password"}
                        placeholder="新しいパスワード" value={newPw}
                        onChange={e => setNewPw(e.target.value)} />
                      <span className="st-iicon" onClick={() => setShowNew(v => !v)}>
                        {showNew ? <EyeOffIcon /> : <EyeIcon />}
                      </span>
                    </div>
                  </SField>
                  {newPw && (
                    <>
                      <div className="pw-bar">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="pw-seg"
                            style={{ background: n <= strength.level ? strength.color : undefined }} />
                        ))}
                      </div>
                      <div className="pw-lbl" style={{ color: strength.color }}>強度: {strength.label}</div>
                    </>
                  )}
                </div>
                <SField label="新しいパスワード（確認）">
                  <div className="st-iwrap">
                    <input className="st-input has-icon" type={showNew2 ? "text" : "password"}
                      placeholder="もう一度入力" value={newPw2}
                      onChange={e => setNewPw2(e.target.value)} />
                    <span className="st-iicon" onClick={() => setShowNew2(v => !v)}>
                      {showNew2 ? <EyeOffIcon /> : <EyeIcon />}
                    </span>
                  </div>
                </SField>
              </div>
              {pwErr && <div className="st-error"><AlertIcon />{pwErr}</div>}
            </div>
            <div className="st-save-row">
              <button className="st-btn st-btn-primary" onClick={savePassword} disabled={isLoading}>
                <LockIcon /> パスワードを変更
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── タブ②: 個人資産 ── */}
      {activeTab === "asset" && (
        <div className="st-section">
          <SectionHdr icon={<WalletIcon />} label="個人資産情報" iconBg={T.tealLight} />
          <div className="st-body">
            {/* 初期情報バナー */}
            <div style={{
              background: T.amberLight,
              border: `1px solid #F5C87A`,
              borderRadius: T.radiusSm,
              padding: "12px 14px",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#7A4A00", marginBottom: 2 }}>
                  このデータはサービス開始前の初期情報です
                </div>
                <div style={{ fontSize: 11.5, color: "#9A6010", lineHeight: 1.6 }}>
                  ここで登録した内容はダッシュボードの初期値として使われます。<br />運用開始後は「データ入力」画面から月次データを入力してください。実績値はデータ入力画面の登録内容が優先されます。
                </div>
              </div>
            </div>
            <div className="ob-sec-title" style={{ marginBottom: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block" }} />
              個人資産
            </div>
            <div className="st-grid2">
              <SInput label="現金・預金" value={pCash} onChange={setPCash}
                suffix="万円" hint="銀行口座・現金など" placeholder="300" />
              <SInput label="投資・運用資産" value={pInvest} onChange={setPInvest}
                suffix="万円" hint="株・投信・iDeCoなど" placeholder="0" />
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="ob-sec-title" style={{ marginBottom: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.danger, display: "inline-block" }} />
                個人負債
              </div>
              <SInput label="負債（ローン等）" value={pLiab} onChange={setPLiab}
                suffix="万円" hint="住宅ローン・奨学金など" placeholder="0" />
            </div>
            <div className="st-net" style={{ background: T.tealLight, marginTop: 4 }}>
              <span style={{ fontWeight: 600, color: T.teal }}>個人純資産: </span>
              <span style={{ fontWeight: 700, color: pNet >= 0 ? T.teal : T.danger }}>
                {pNet.toLocaleString("ja-JP")}万円
              </span>
              <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                （資産 {(parseFloat(pCash||"0")+parseFloat(pInvest||"0")).toLocaleString("ja-JP")}万 − 負債 {parseFloat(pLiab||"0").toLocaleString("ja-JP")}万）
              </span>
            </div>
          </div>
          <div className="st-save-row">
            <button className="st-btn st-btn-ghost"
              onClick={() => {
                setPCash(user?.personalAsset?.cash ?? "");
                setPInvest(user?.personalAsset?.invest ?? "");
                setPLiab(user?.personalAsset?.liab ?? "");
              }}>
              キャンセル
            </button>
            <button className="st-btn st-btn-primary" onClick={savePersonalAsset} disabled={isLoading}>
              <CheckIcon /> 保存する
            </button>
          </div>
        </div>
      )}

      {/* ── タブ③: 事業情報 ── */}
      {activeTab === "business" && (
        <>
          {/* 初期情報の説明バナー */}
          <div style={{
            background: T.amberLight,
            border: `1px solid #F5C87A`,
            borderRadius: T.radius,
            padding: "14px 18px",
            marginBottom: 16,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#7A4A00", marginBottom: 3 }}>
                このデータはサービス開始前の初期情報です
              </div>
              <div style={{ fontSize: 12, color: "#9A6010", lineHeight: 1.6 }}>
                ここで登録した内容はダッシュボードの初期値として使われます。<br />運用開始後は「データ入力」画面から月次データを入力してください。資産・負債の実績値はデータ入力画面の登録内容が優先されます。
              </div>
            </div>
          </div>

          {/* 事業合計サマリー */}
          {bizCards.length > 0 && (() => {
            const totalAsset = bizCards.reduce((s, c) =>
              s + parseFloat(c.capital||"0") + parseFloat(c.deposit||"0") + parseFloat(c.equipment||"0"), 0);
            const totalLiab  = bizCards.reduce((s, c) => s + parseFloat(c.liab||"0"), 0);
            const totalNet   = totalAsset - totalLiab;
            const totalRev   = bizCards.reduce((s, c) => {
              const rev = parseFloat(c.customers||"0") * parseFloat(c.unitPrice||"0");
              return s + rev;
            }, 0);
            const totalFixed = bizCards.reduce((s, c) =>
              s + c.fixedCosts.reduce((fs, r) => fs + parseFloat(r.amount||"0"), 0), 0);
            return (
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: T.radius, overflow: "hidden", marginBottom: 16,
              }}>
                <div style={{
                  padding: "11px 18px", background: T.bg,
                  borderBottom: `1px solid ${T.border}`,
                  fontSize: 12.5, fontWeight: 600, color: T.textPrimary,
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <BuildingIcon />
                  全事業 合計（{bizCards.length}件）
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                  {[
                    { label: "資産合計",   value: totalAsset, color: T.teal,    sub: "資本金＋預金＋設備" },
                    { label: "負債合計",   value: totalLiab,  color: T.danger,  sub: "ローン・買掛金" },
                    { label: "純資産合計", value: totalNet,   color: totalNet >= 0 ? T.primary : T.danger, sub: "資産 − 負債" },
                  ].map((item, i) => (
                    <div key={item.label} style={{
                      padding: "14px 18px",
                      borderRight: i < 2 ? `1px solid ${T.border}` : "none",
                    }}>
                      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: item.color, letterSpacing: -0.5 }}>
                        {item.value.toLocaleString("ja-JP")}
                        <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 3, color: T.textSecondary }}>万円</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 2 }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
                {(totalRev > 0 || totalFixed > 0) && (
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    borderTop: `1px solid ${T.border}`,
                    background: T.bg,
                  }}>
                    {[
                      { label: "月次売上（推計）", value: totalRev,   color: T.primary, sub: "顧客数 × 平均単価" },
                      { label: "月次固定費合計",   value: totalFixed,  color: T.purple,  sub: "登録済み固定費の合計" },
                      { label: "月次利益（推計）", value: totalRev - totalFixed, color: (totalRev - totalFixed) >= 0 ? T.teal : T.danger, sub: "売上 − 固定費" },
                    ].map((item, i) => (
                      <div key={item.label} style={{
                        padding: "12px 18px",
                        borderRight: i < 2 ? `1px solid ${T.border}` : "none",
                      }}>
                        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: item.color, letterSpacing: -0.5 }}>
                          {item.value.toLocaleString("ja-JP")}
                          <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 3, color: T.textSecondary }}>万円</span>
                        </div>
                        <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 2 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <button className="biz-add-btn" onClick={addBizCard}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            追加
          </button>

          {bizCards.length === 0 && (
            <div style={{
              textAlign: "center", padding: "40px 20px",
              color: T.textMuted, fontSize: 13,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.radius,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🏢</div>
              事業情報がまだ登録されていません。<br />
              「追加+」ボタンから事業を登録してください。
            </div>
          )}

          {bizCards.map(card => (
            <BizCardView
              key={card.id}
              card={card}
              onUpdate={patch => updateBizCard(card.id, patch)}
              onDelete={() => deleteBizCard(card.id)}
              onSave={() => saveBizCard(card.id)}
            />
          ))}
        </>
      )}

      {/* ── タブ④: 通知設定 ── */}
      {activeTab === "notif" && (
        <div className="st-section">
          <SectionHdr icon={<SettingsIcon />} label="通知設定" iconBg="#FEF3C7" />
          <div className="st-body" style={{ gap: 0, padding: "4px 20px" }}>
            {([
              { label: "アラート通知",  sub: "返済期日・純資産マイナスなどの警告",    checked: notifAlert,   setFn: setNotifAlert   },
              { label: "月次レポート",  sub: "毎月初旬に先月のサマリーをメール通知",  checked: notifMonthly, setFn: setNotifMonthly },
            ] as const).map(item => (
              <div key={item.label} className="st-toggle-row">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>{item.sub}</div>
                </div>
                <Toggle checked={item.checked} onChange={v => {
                  item.setFn(v);
                  saveNotif(
                    item.label === "アラート通知" ? v : notifAlert,
                    item.label === "月次レポート" ? v : notifMonthly,
                  );
                }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── タブ⑤: アカウント削除 ── */}
      {activeTab === "danger" && (
        <div className="st-section" style={{ borderColor: "#F7C1C1" }}>
          <div className="st-section-hdr" style={{ background: T.dangerLight }}>
            <div className="st-section-icon" style={{ background: "#FECDCD" }}><AlertIcon /></div>
            <span style={{ color: T.danger }}>アカウントの削除</span>
          </div>
          <div className="st-body">
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.7 }}>
              アカウントを削除すると、すべての資産データ・履歴が完全に消去されます。この操作は取り消せません。
            </p>
            <button className="st-btn st-btn-danger" onClick={handleDeleteAccount}>
              アカウントを削除する
            </button>
          </div>
        </div>
      )}

      {toast && <div className="st-toast"><CheckIcon /> {toast}</div>}
    </div>
  );
};

export default Settings;