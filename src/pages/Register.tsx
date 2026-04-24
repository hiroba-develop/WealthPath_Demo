import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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

// ── 型定義 ───────────────────────────────────────────────────────
interface BizEntry {
  id: string;
  name: string;
  type: string;
  asset: string;
  liab: string;
}

const BIZ_TYPES = ["飲食・小売", "IT・コンサルティング", "製造・建設", "医療・介護", "不動産", "その他サービス"];

function newBiz(): BizEntry {
  return { id: crypto.randomUUID(), name: "", type: "飲食・小売", asset: "", liab: "" };
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

function OInput({ label, value, onChange, suffix, hint, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; hint?: string; placeholder?: string; type?: string;
}) {
  return (
    <OField label={label} hint={hint}>
      <div className="ob-input-wrap">
        <input className={`ob-input${suffix ? " has-suffix" : ""}`}
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)} />
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

  // ── Step1: 個人資産のみ（氏名は登録済みのため不要）
  const [pCash,   setPCash]   = useState("");
  const [pInvest, setPInvest] = useState("");
  const [pLiab,   setPLiab]   = useState("");

  // ── Step2: 事業情報（複数対応）
  const [businesses, setBusinesses] = useState<BizEntry[]>([newBiz()]);

  const pNet = parseFloat(pCash||"0") + parseFloat(pInvest||"0") - parseFloat(pLiab||"0");

  // 事業の更新
  function updateBiz(id: string, field: keyof BizEntry, value: string) {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
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
                個人資産の概算（万円）
              </div>
              <div className="ob-grid2">
                <OInput label="現金・預金" placeholder="300" value={pCash} onChange={setPCash}
                  suffix="万円" hint="銀行口座・現金など" />
                <OInput label="投資・運用資産" placeholder="0" value={pInvest} onChange={setPInvest}
                  suffix="万円" hint="株・投信・iDeCoなど" />
              </div>
              <div style={{ marginTop: 14 }}>
                <OInput label="負債（ローン等）" placeholder="0" value={pLiab} onChange={setPLiab}
                  suffix="万円" hint="住宅ローン・奨学金など" />
              </div>
              <div className="ob-net" style={{ background: T.primaryLight, marginTop: 14 }}>
                <span style={{ fontWeight: 600, color: T.primary }}>個人純資産: </span>
                <span style={{ fontWeight: 700, color: pNet >= 0 ? T.primary : T.danger }}>
                  {pNet.toLocaleString("ja-JP")}万円
                </span>
              </div>
            </>
          )}

          {/* ── Step2: 事業情報（複数） ── */}
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
                {businesses.map((biz, idx) => {
                  const bNet = parseFloat(biz.asset||"0") - parseFloat(biz.liab||"0");
                  return (
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
                          <OInput label="事業名" placeholder="例: カフェ経営"
                            value={biz.name} onChange={v => updateBiz(biz.id, "name", v)} />
                          <OSelect label="業種" value={biz.type}
                            onChange={v => updateBiz(biz.id, "type", v)} options={BIZ_TYPES} />
                        </div>
                        <div className="ob-grid2">
                          <OInput label="事業資産合計" placeholder="50"
                            value={biz.asset} onChange={v => updateBiz(biz.id, "asset", v)}
                            suffix="万円" hint="設備・運転資金など" />
                          <OInput label="事業負債合計" placeholder="0"
                            value={biz.liab} onChange={v => updateBiz(biz.id, "liab", v)}
                            suffix="万円" hint="事業ローン等" />
                        </div>
                        <div className="ob-net" style={{ background: T.tealLight }}>
                          <span style={{ fontWeight: 600, color: T.teal }}>純資産: </span>
                          <span style={{ fontWeight: 700, color: bNet >= 0 ? T.teal : T.danger }}>
                            {bNet.toLocaleString("ja-JP")}万円
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          <button className="ob-btn-skip" onClick={onComplete}>スキップ</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && (
              <button className="ob-btn ob-btn-ghost" onClick={() => setStep(s => s - 1)}>
                戻る
              </button>
            )}
            {step < TOTAL ? (
              <button className="ob-btn ob-btn-primary" onClick={() => setStep(s => s + 1)}>
                次へ <ArrowRightIcon />
              </button>
            ) : (
              <button className="ob-btn ob-btn-primary" onClick={onComplete}>
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ne = name     ? "" : "お名前を入力してください";
    const ee = validateEmail(email);
    const pe = validatePassword(password);
    const p2 = password !== password2 ? "パスワードが一致しません" : "";
    const ae = agree ? "" : "利用規約への同意が必要です";
    setNameErr(ne); setEmailErr(ee); setPwErr(pe); setPw2Err(p2); setAgreeErr(ae);
    if (ne || ee || pe || p2 || ae) return;

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
          <AuthLogo />

          <h1 className="auth-title">新規登録</h1>
          <p className="auth-subtitle">アカウントを作成して資産管理をはじめましょう</p>

          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <AuthInput label="お名前" required placeholder="山田 太郎"
              value={name} onChange={setName} error={nameErr} />
            <AuthInput label="メールアドレス" required type="email" placeholder="your@email.com"
              value={email} onChange={setEmail} error={emailErr} />
            <AuthInput
              label="パスワード" required
              type={showPw ? "text" : "password"} placeholder="8文字以上・英数字混在"
              value={password} onChange={setPassword} error={pwErr}
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
                <div style={{ fontSize: 10.5, color: strength.color }}>強度: {strength.label}</div>
              </div>
            )}
            <AuthInput
              label="パスワード（確認）" required
              type={showPw2 ? "text" : "password"} placeholder="もう一度入力"
              value={password2} onChange={setPassword2} error={pw2Err}
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