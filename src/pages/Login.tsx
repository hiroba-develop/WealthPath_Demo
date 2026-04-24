import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  T, sharedCss, AuthLogo,
  EyeIcon, EyeOffIcon, LockIcon, AlertIcon,
  validateEmail,
} from "../components/Authshared";

const Login = () => {
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // 入力検証
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    if (!password) { setError("パスワードを入力してください"); return; }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("ログインに失敗しました。認証情報を確認してください。");
      }
    } catch (err) {
      setError("ログイン処理中にエラーが発生しました。");
      console.error("ログインエラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{sharedCss}</style>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div className="auth-page">
        <div className="auth-card">
          <AuthLogo />

          <h1 className="auth-title">ログイン</h1>
          <p className="auth-subtitle">メールアドレスとパスワードでログインしてください</p>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              background: T.dangerLight, border: "1px solid #F7C1C1",
              borderRadius: T.radiusSm, padding: "10px 12px", marginBottom: 16,
            }}>
              <span style={{ color: T.danger, flexShrink: 0, marginTop: 1 }}><AlertIcon /></span>
              <span style={{ fontSize: 13, color: T.danger }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            {/* メールアドレス */}
            <div className="auth-group">
              <label htmlFor="email-address" className="auth-label">
                メールアドレス<span className="auth-req">*</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="auth-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* パスワード */}
            <div className="auth-group">
              <label htmlFor="password" className="auth-label">
                パスワード<span className="auth-req">*</span>
              </label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  className="auth-input has-icon"
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span className="auth-input-icon" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
            </div>

            {/* パスワードを忘れた */}
            <div style={{ textAlign: "right", marginTop: -8, marginBottom: 4 }}>
              <span className="auth-link" style={{ fontSize: 12 }}>パスワードをお忘れですか？</span>
            </div>

            {/* ログインボタン */}
            <button type="submit" disabled={isLoading} className="auth-btn auth-btn-primary">
              {isLoading ? (
                <>
                  <svg
                    style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  処理中…
                </>
              ) : (
                <><LockIcon /> ログイン</>
              )}
            </button>
          </form>

          <div className="auth-link-row">
            アカウントをお持ちでない方は
            <Link
                to="/register"
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
              >
                <span className="auth-link"> 新規登録</span>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;