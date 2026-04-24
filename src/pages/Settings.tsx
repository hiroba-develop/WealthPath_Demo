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

  /* ── ページタイトル ── */
  .st-page-hdr { margin-bottom: 24px; }
  .st-page-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 3px; }
  .st-page-sub   { font-size: 12.5px; color: ${T.textMuted}; }

  /* ── タブ ── */
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
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    opacity: 0.7;
  }
  .st-tab.active .st-tab-icon { opacity: 1; }

  /* ── セクション ── */
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
  .st-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
  .st-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* ── フォーム ── */
  .st-label { display: block; font-size: 12px; font-weight: 500; color: ${T.textSecondary}; margin-bottom: 5px; }
  .st-input {
    width: 100%; height: 40px; padding: 0 12px;
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    font-size: 13.5px; font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary}; background: ${T.surface};
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .st-input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .st-input::placeholder { color: ${T.textMuted}; }
  .st-input.has-icon { padding-right: 40px; }
  .st-iwrap { position: relative; }
  .st-iicon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: ${T.textMuted}; cursor: pointer; display: flex; align-items: center;
    transition: color 0.12s;
  }
  .st-iicon:hover { color: ${T.textSecondary}; }
  .st-hint  { font-size: 11px; color: ${T.textMuted}; margin-top: 4px; }
  .st-net   { padding: 10px 14px; border-radius: ${T.radiusSm}; font-size: 12.5px; }

  /* ── ボタン ── */
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

  /* ── トグル行 ── */
  .st-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid ${T.border};
  }
  .st-toggle-row:last-child { border-bottom: none; }

  /* ── エラー ── */
  .st-error { font-size: 11.5px; color: ${T.danger}; display: flex; align-items: center; gap: 4px; }

  /* ── パスワード強度 ── */
  .pw-bar { display: flex; gap: 3px; margin-bottom: 4px; margin-top: 6px; }
  .pw-seg { height: 3px; flex: 1; border-radius: 2px; background: ${T.border}; transition: background 0.2s; }
  .pw-lbl { font-size: 10.5px; }

  /* ── トースト ── */
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
    .st-body  { padding: 16px; }
    .st-save-row { padding: 10px 16px; }
    .st-tab { padding: 8px 12px; font-size: 12px; }
  }
`;

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

function SInput({ label, value, onChange, type = "text", suffix, hint, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; suffix?: string; hint?: string; placeholder?: string;
}) {
  return (
    <SField label={label} hint={hint}>
      <div className="st-iwrap">
        <input className="st-input" type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={suffix ? { paddingRight: 42 } : {}} />
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
  label: string; value: string; onChange: (v: string) => void; options: string[];
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

// ── タブ定義 ────────────────────────────────────────────────────
type TabId = "account" | "asset" | "business" | "notif" | "danger";
const TABS: { id: TabId; label: string; icon: React.ReactNode; iconBg: string }[] = [
  { id: "account",  label: "アカウント",   icon: <UserIcon />,     iconBg: T.primaryLight },
  { id: "asset",    label: "個人資産",     icon: <WalletIcon />,   iconBg: T.tealLight },
  { id: "business", label: "事業情報",     icon: <BuildingIcon />, iconBg: T.primaryLight },
  { id: "notif",    label: "通知設定",     icon: <SettingsIcon />, iconBg: "#FEF3C7" },
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

  // ④ 事業情報
  const [bizName,  setBizName]  = useState<string>(user?.business?.name  ?? "");
  const [bizType,  setBizType]  = useState<string>(user?.business?.type  ?? "飲食・小売");
  const [bizAsset, setBizAsset] = useState<string>(user?.business?.asset ?? "");
  const [bizLiab,  setBizLiab]  = useState<string>(user?.business?.liab  ?? "");

  // ⑤ 通知
  const [notifAlert,   setNotifAlert]   = useState<boolean>(user?.notif?.alert   ?? true);
  const [notifMonthly, setNotifMonthly] = useState<boolean>(user?.notif?.monthly ?? true);

  const [toast,     setToast]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pNet     = parseFloat(pCash  ||"0") + parseFloat(pInvest||"0") - parseFloat(pLiab||"0");
  const bNet     = parseFloat(bizAsset||"0") - parseFloat(bizLiab||"0");
  const strength = pwStrength(newPw);

  function showSaved(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function saveAccount() {
    setIsLoading(true);
    try {
      updateUser({ name, email });
      showSaved("アカウント情報を保存しました");
    } finally { setIsLoading(false); }
  }

  async function savePassword() {
    setPwErr("");
    if (!curPw)              { setPwErr("現在のパスワードを入力してください"); return; }
    if (!newPw || !newPw2)   { setPwErr("新しいパスワードをすべて入力してください"); return; }
    const e = validatePassword(newPw);
    if (e)                   { setPwErr(e); return; }
    if (newPw !== newPw2)    { setPwErr("新しいパスワードが一致しません"); return; }
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

  async function saveBusiness() {
    setIsLoading(true);
    try {
      updateUser({ business: { name: bizName, type: bizType, asset: bizAsset, liab: bizLiab } });
      showSaved("事業情報を保存しました");
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
    // await api.deleteAccount();
    logout();
    navigate("/login");
  }

  return (
    <div className="st-wrap">
      <style>{sharedCss + css}</style>

      {/* ページタイトル */}
      <div className="st-page-hdr">
        <h1 className="st-page-title">設定</h1>
        <p className="st-page-sub">アカウント・資産情報・通知の管理</p>
      </div>

      {/* タブ */}
      <div className="st-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`st-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="st-tab-icon" style={{ background: tab.iconBg }}>
              {tab.icon}
            </span>
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
            <p style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.6 }}>
              会員登録時に入力した資産情報を更新できます。ダッシュボード・シミュレーションに反映されます。
            </p>
            <div className="st-grid2">
              <SInput label="現金・預金（万円）" value={pCash} onChange={setPCash}
                suffix="万円" hint="銀行口座・現金など" placeholder="300" />
              <SInput label="投資・運用資産（万円）" value={pInvest} onChange={setPInvest}
                suffix="万円" hint="株・投信・iDeCoなど" placeholder="0" />
            </div>
            <SInput label="負債（ローン等）（万円）" value={pLiab} onChange={setPLiab}
              suffix="万円" hint="住宅ローン・奨学金など" placeholder="0" />
            <div className="st-net" style={{ background: T.tealLight }}>
              <span style={{ fontWeight: 600, color: T.teal }}>個人純資産: </span>
              <span style={{ fontWeight: 700, color: pNet >= 0 ? T.teal : T.danger }}>
                {pNet.toLocaleString("ja-JP")}万円
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
        <div className="st-section">
          <SectionHdr icon={<BuildingIcon />} label="事業情報" iconBg={T.primaryLight} />
          <div className="st-body">
            <p style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.6 }}>
              事業名・業種・資産情報を更新できます。複数事業の詳細はデータ入力画面から管理してください。
            </p>
            <div className="st-grid2">
              <SInput label="事業名" value={bizName} onChange={setBizName} placeholder="例: カフェ経営" />
              <SSelect label="業種" value={bizType} onChange={setBizType}
                options={["飲食・小売", "IT・コンサルティング", "製造・建設", "医療・介護", "不動産", "その他サービス"]} />
            </div>
            <div className="st-grid2">
              <SInput label="事業資産合計（万円）" value={bizAsset} onChange={setBizAsset}
                suffix="万円" hint="設備・運転資金など" placeholder="50" />
              <SInput label="事業負債合計（万円）" value={bizLiab} onChange={setBizLiab}
                suffix="万円" hint="事業ローン等" placeholder="0" />
            </div>
            <div className="st-net" style={{ background: T.primaryLight }}>
              <span style={{ fontWeight: 600, color: T.primary }}>事業純資産: </span>
              <span style={{ fontWeight: 700, color: bNet >= 0 ? T.primary : T.danger }}>
                {bNet.toLocaleString("ja-JP")}万円
              </span>
            </div>
          </div>
          <div className="st-save-row">
            <button className="st-btn st-btn-ghost"
              onClick={() => {
                setBizName(user?.business?.name ?? "");
                setBizAsset(user?.business?.asset ?? "");
                setBizLiab(user?.business?.liab ?? "");
              }}>
              キャンセル
            </button>
            <button className="st-btn st-btn-primary" onClick={saveBusiness} disabled={isLoading}>
              <CheckIcon /> 保存する
            </button>
          </div>
        </div>
      )}

      {/* ── タブ④: 通知設定 ── */}
      {activeTab === "notif" && (
        <div className="st-section">
          <SectionHdr icon={<SettingsIcon />} label="通知設定" iconBg="#FEF3C7" />
          <div className="st-body" style={{ gap: 0, padding: "4px 20px" }}>
            {([
              { label: "アラート通知",  sub: "返済期日・純資産マイナスなどの警告",   checked: notifAlert,   setFn: setNotifAlert   },
              { label: "月次レポート",  sub: "毎月初旬に先月のサマリーをメール通知", checked: notifMonthly, setFn: setNotifMonthly },
            ] as const).map(item => (
              <div key={item.label} className="st-toggle-row">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>{item.sub}</div>
                </div>
                <Toggle checked={item.checked} onChange={v => {
                  item.setFn(v);
                  saveNotif(
                    item.label === "アラート通知"  ? v : notifAlert,
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
            <div>
              <button className="st-btn st-btn-danger" onClick={handleDeleteAccount}>
                アカウントを削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* トースト */}
      {toast && <div className="st-toast"><CheckIcon /> {toast}</div>}
    </div>
  );
};

export default Settings;