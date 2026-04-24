import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ── 型定義 ───────────────────────────────────────────────────────
interface PersonalAsset {
  cash:   string;  // 現金・預金（万円）
  invest: string;  // 投資・運用資産（万円）
  liab:   string;  // 負債（万円）
}

interface Business {
  name:  string;  // 事業名
  type:  string;  // 業種
  asset: string;  // 事業資産合計（万円）
  liab:  string;  // 事業負債合計（万円）
}

interface NotifSettings {
  alert:   boolean;  // アラート通知
  monthly: boolean;  // 月次レポート
}

interface User {
  id:             string;
  name:           string;
  email:          string;
  isSetupComplete: boolean;
  personalAsset?: PersonalAsset;   // 個人資産情報（onboarding後に設定）
  business?:      Business;        // 事業情報（onboarding後に設定）
  notif?:         NotifSettings;   // 通知設定
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  shouldRedirectToLogin: boolean;
  shouldRedirectToSetup: boolean;
  login:      (email: string, password: string) => Promise<boolean>;
  logout:     () => void;
  updateUser: (patch: Partial<User>) => void;  // 設定画面からユーザー情報を更新
}

// ── コンテキスト ─────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── プロバイダー ─────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]                             = useState<User | null>(null);
  const [isLoading, setIsLoading]                   = useState(true);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

  // 初期化：ローカルストレージからユーザー情報を復元
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed: User = JSON.parse(stored);
      setUser(parsed);
      setShouldRedirectToSetup(!parsed.isSetupComplete);
    } else {
      setShouldRedirectToLogin(true);
    }
    setIsLoading(false);
  }, []);

  // ログイン
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email && password) {
        const demoUser: User = {
          id:             "demo-user-id",
          name:           "デモユーザー",
          email:          email,
          isSetupComplete: true,
          // 初期値：onboarding / 設定画面で上書きされる
          personalAsset: { cash: "", invest: "", liab: "" },
          business:      { name: "", type: "飲食・小売", asset: "", liab: "" },
          notif:         { alert: true, monthly: true },
        };
        localStorage.setItem("user", JSON.stringify(demoUser));
        setUser(demoUser);
        setShouldRedirectToLogin(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("ログインエラー:", error);
      return false;
    }
  };

  // ログアウト
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShouldRedirectToLogin(true);
  };

  // ユーザー情報の部分更新（設定画面・onboardingから呼び出す）
  const updateUser = (patch: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      shouldRedirectToLogin,
      shouldRedirectToSetup,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── カスタムフック ───────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};