import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import WeeklyTasks from "./pages/WeeklyTasks";
import AssetManagement from "./pages/AssetManagement";
import InvestmentManagement from "./pages/InvestmentManagement";
import TenYearSimulation from "./pages/TenYearSimulation";
import TaxOptimization from "./pages/TaxOptimization";
import AccountingIntegration from "./pages/AccountingIntegration";
import Payroll from "./pages/Payroll";
import MonthlyClosing from "./pages/MonthlyClosing";
import CashFlow from "./pages/CashFlow";
import BalanceSheet from "./pages/BalanceSheet";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import Reports from "./pages/Reports";
import TaxAccountantChat from "./pages/TaxAccountantChat";

// 認証が必要なルートを保護するコンポーネント
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// アプリケーションルート
const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ログインページ */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* 保護されたルート */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/weekly-tasks"
        element={
          <ProtectedRoute>
            <WeeklyTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset-management"
        element={
          <ProtectedRoute>
            <AssetManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investment-management"
        element={
          <ProtectedRoute>
            <InvestmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulation"
        element={
          <ProtectedRoute>
            <TenYearSimulation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax-optimization"
        element={
          <ProtectedRoute>
            <TaxOptimization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounting-integration"
        element={
          <ProtectedRoute>
            <AccountingIntegration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-closing"
        element={
          <ProtectedRoute>
            <MonthlyClosing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashflow"
        element={
          <ProtectedRoute>
            <CashFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance-sheet"
        element={
          <ProtectedRoute>
            <BalanceSheet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-analysis"
        element={
          <ProtectedRoute>
            <FinancialAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax-accountant-chat"
        element={
          <ProtectedRoute>
            <TaxAccountantChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404ページ - ダッシュボードにリダイレクト */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// メインAppコンポーネント
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

