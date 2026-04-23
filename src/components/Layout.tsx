import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ── Types ────────────────────────────────────────────────────────
type NavChild = {
  name: string;
  path: string;
};

type NavItem = {
  name: string;
  path?: string;
  icon: string;
  children?: NavChild[];
};

// ── Navigation Definition ────────────────────────────────────────
const navigationItems: NavItem[] = [
  { name: "ダッシュボード", path: "/", icon: "🏠" },
  {
    name: "データ入力",
    icon: "📝",
    children: [
      { name: "事業", path: "/data-entry/business" },
      { name: "個人", path: "/data-entry/personal" },
    ],
  },
  //{ name: "資産・投資管理", path: "/asset-management", icon: "💎" },
  { name: "シミュレーション", path: "/simulation", icon: "📊" },
  //{ name: "税務最適化", path: "/tax-optimization", icon: "💰" },
  //{ name: "会計データ連携・統合", path: "/accounting-integration", icon: "🔗" },
  //{ name: "給与計算", path: "/payroll", icon: "💵" },
  //{ name: "月次決算", path: "/monthly-closing", icon: "📋" },
  //{ name: "キャッシュフロー", path: "/cashflow", icon: "💸" },
  //{ name: "バランスシート", path: "/balance-sheet", icon: "⚖️" },
  //{ name: "財務3表分析", path: "/financial-analysis", icon: "📈" },
  //{ name: "レポート", path: "/reports", icon: "📄" },
  //{ name: "税理士チャット", path: "/tax-accountant-chat", icon: "💬" },
  { name: "設定", path: "/settings", icon: "⚙️" },
];

// ── Chevron Icon ─────────────────────────────────────────────────
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ── Accordion Nav Item ───────────────────────────────────────────
const AccordionItem = ({
  item,
  currentPath,
  isOpen,
  onToggle,
  mobile = false,
}: {
  item: NavItem;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
  mobile?: boolean;
}) => {
  const isChildActive = item.children?.some((c) => currentPath === c.path) ?? false;

  if (mobile) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
            isChildActive
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
          }`}
        >
          <span className="flex items-center">
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </span>
          <ChevronIcon open={isOpen} />
        </button>
        {isOpen && (
          <div className="ml-6 border-l-2 border-gray-100 pl-3 space-y-1 py-1">
            {item.children?.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={`block py-1.5 px-2 text-sm rounded-md ${
                  currentPath === child.path
                    ? "text-blue-700 font-medium bg-blue-50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
          isChildActive
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <span className="flex items-center">
          <span className="mr-2">{item.icon}</span>
          {item.name}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 mb-1 border-l-2 border-gray-100 pl-3 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={`block px-2 py-1.5 text-sm rounded-md ${
                currentPath === child.path
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Layout ───────────────────────────────────────────────────────
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // データ入力配下にいる場合は最初から開いた状態にする
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    location.pathname.startsWith("/data-entry") ? "データ入力" : null
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl mr-2">💎</span>
                <span className="text-xl font-bold text-blue-600">WealthPath</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex md:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-3 md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">メニューを開く</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                if (item.children) {
                  return (
                    <AccordionItem
                      key={item.name}
                      item={item}
                      currentPath={location.pathname}
                      isOpen={openAccordion === item.name}
                      onToggle={() => toggleAccordion(item.name)}
                      mobile
                    />
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      location.pathname === item.path
                        ? "border-blue-500 text-blue-700 bg-blue-50"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* サイドバー（デスクトップ） */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigationItems.map((item) => {
                  if (item.children) {
                    return (
                      <AccordionItem
                        key={item.name}
                        item={item}
                        currentPath={location.pathname}
                        isOpen={openAccordion === item.name}
                        onToggle={() => toggleAccordion(item.name)}
                      />
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      to={item.path!}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;