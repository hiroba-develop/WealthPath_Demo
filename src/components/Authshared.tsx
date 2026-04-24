//import { useState } from "react";

// ── Design Tokens ────────────────────────────────────────────────
export const T = {
  bg: "#F7F8FC",
  surface: "#FFFFFF",
  border: "#E5E7EF",
  borderMid: "#D0D4E8",
  borderFocus: "#4F63E7",
  primary: "#4F63E7",
  primaryLight: "#EEF1FD",
  primaryHover: "#3A4FC8",
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
  success: "#10B981",
  successLight: "#ECFDF5",
  radius: "12px",
  radiusSm: "8px",
};

// ── 共通CSS ──────────────────────────────────────────────────────
export const sharedCss = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary};
    min-height: 100vh;
    background: ${T.bg};
  }
  .auth-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 16px;
  }
  .auth-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 16px;
    width: 100%; max-width: 420px;
    padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(28,30,46,0.07);
  }
  .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .auth-logo-mark {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, ${T.primary} 0%, #6B7FF5 100%);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .auth-logo-text { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; color: ${T.textPrimary}; }
  .auth-logo-sub  { font-size: 10px; color: ${T.textMuted}; margin-top: 1px; }
  .auth-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 6px; }
  .auth-subtitle { font-size: 13px; color: ${T.textSecondary}; margin-bottom: 28px; line-height: 1.6; }

  .auth-group { margin-bottom: 16px; }
  .auth-label { display: block; font-size: 12px; font-weight: 500; color: ${T.textSecondary}; margin-bottom: 6px; }
  .auth-req { color: ${T.danger}; margin-left: 2px; }
  .auth-input-wrap { position: relative; }
  .auth-input {
    width: 100%; height: 42px; padding: 0 12px;
    border: 1px solid ${T.border}; border-radius: ${T.radiusSm};
    font-size: 14px; font-family: 'Noto Sans JP', sans-serif;
    color: ${T.textPrimary}; background: ${T.surface};
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .auth-input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(79,99,231,0.1); }
  .auth-input::placeholder { color: ${T.textMuted}; }
  .auth-input.error { border-color: ${T.danger}; }
  .auth-input.error:focus { box-shadow: 0 0 0 3px rgba(224,82,82,0.1); }
  .auth-input.has-icon { padding-right: 40px; }
  .auth-input-icon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: ${T.textMuted}; cursor: pointer; display: flex; align-items: center;
    transition: color 0.12s;
  }
  .auth-input-icon:hover { color: ${T.textSecondary}; }
  .auth-error-msg { font-size: 11.5px; color: ${T.danger}; margin-top: 5px; display: flex; align-items: center; gap: 4px; }
  .auth-hint { font-size: 11px; color: ${T.textMuted}; margin-top: 4px; }

  .pw-strength { margin-top: 6px; }
  .pw-strength-bar { display: flex; gap: 3px; margin-bottom: 4px; }
  .pw-strength-seg { height: 3px; flex: 1; border-radius: 2px; background: ${T.border}; transition: background 0.2s; }
  .pw-strength-label { font-size: 10.5px; }

  .auth-btn {
    width: 100%; height: 44px; border-radius: ${T.radiusSm};
    font-size: 14px; font-family: 'Noto Sans JP', sans-serif; font-weight: 600;
    cursor: pointer; border: none; transition: background 0.15s, transform 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .auth-btn:active { transform: scale(0.98); }
  .auth-btn-primary { background: ${T.primary}; color: white; margin-top: 8px; }
  .auth-btn-primary:hover { background: ${T.primaryHover}; }
  .auth-btn-primary:disabled { background: ${T.textMuted}; cursor: not-allowed; transform: none; }

  .auth-link-row { text-align: center; font-size: 13px; color: ${T.textSecondary}; margin-top: 20px; }
  .auth-link { color: ${T.primary}; font-weight: 500; cursor: pointer; text-decoration: none; }
  .auth-link:hover { text-decoration: underline; }

  .auth-check-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
  .auth-check { width: 16px; height: 16px; accent-color: ${T.primary}; flex-shrink: 0; margin-top: 1px; cursor: pointer; }
  .auth-check-label { font-size: 12px; color: ${T.textSecondary}; line-height: 1.5; }

  .auth-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #1a6e4f; color: white;
    padding: 10px 16px; border-radius: ${T.radiusSm};
    font-size: 13px; display: flex; align-items: center; gap: 8px;
    z-index: 1000; animation: slideUp 0.2s ease;
    box-shadow: 0 4px 12px rgba(28,30,46,0.2);
    font-family: 'Noto Sans JP', sans-serif;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 480px) {
    .auth-card { padding: 28px 20px; }
  }
`;

// ── Icons ────────────────────────────────────────────────────────
export const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
export const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
export const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
export const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
export const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
export const BuildingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
  </svg>
);
export const WalletIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8L4 7h16l-4-4z"/><circle cx="16" cy="13" r="1"/>
  </svg>
);
export const SettingsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
export const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
export const LogoMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

// ── バリデーション ───────────────────────────────────────────────
export function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "有効なメールアドレスを入力してください";
}
export function validatePassword(v: string) {
  if (v.length < 8) return "8文字以上で入力してください";
  if (!/[a-zA-Z]/.test(v)) return "英字を含めてください";
  if (!/[0-9]/.test(v)) return "数字を含めてください";
  return "";
}
export function pwStrength(v: string): { level: number; label: string; color: string } {
  if (!v) return { level: 0, label: "", color: T.border };
  let score = 0;
  if (v.length >= 8)  score++;
  if (v.length >= 12) score++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^a-zA-Z0-9]/.test(v)) score++;
  if (score <= 1) return { level: 1, label: "弱い", color: T.danger };
  if (score <= 2) return { level: 2, label: "普通", color: T.warning };
  if (score <= 3) return { level: 3, label: "良い", color: T.teal };
  return             { level: 4, label: "強い", color: T.success };
}

// ── 共通ロゴ ────────────────────────────────────────────────────
export function AuthLogo() {
  return (
    <div className="auth-logo">
      <span className="text-2xl mr-2">💎</span>
      <span className="text-xl font-bold text-blue-600">WealthPath</span>
    </div>
  );
}

// ── 共通フォームインプット ────────────────────────────────────────
export function AuthInput({
  label, required, type = "text", placeholder, value, onChange,
  error, hint, showToggle, onToggle,
}: {
  label: string; required?: boolean; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
  error?: string; hint?: string;
  showToggle?: boolean; onToggle?: () => void;
}) {
  return (
    <div className="auth-group">
      <label className="auth-label">
        {label}{required && <span className="auth-req">*</span>}
      </label>
      <div className="auth-input-wrap">
        <input
          className={`auth-input${error ? " error" : ""}${showToggle !== undefined ? " has-icon" : ""}`}
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showToggle !== undefined && (
          <span className="auth-input-icon" onClick={onToggle}>
            {showToggle ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        )}
      </div>
      {error && <div className="auth-error-msg"><AlertIcon />{error}</div>}
      {hint && !error && <div className="auth-hint">{hint}</div>}
    </div>
  );
}