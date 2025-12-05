import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, AlertCircle, CheckCircle, Target, DollarSign, PiggyBank, 
  Award, ArrowRight, Bell, Calendar, ChevronRight, Home, FileText, 
  Calculator, Users, Briefcase, Receipt, Send, Download,
  Search, Filter, Settings, Menu, X, Camera, File, Clock,
  MessageSquare, Video, Phone, Plus, Edit, Trash2, Eye,
  BarChart3, TrendingDown, AlertTriangle,
  Building2, Wallet, Shield, BookOpen, User, Zap,
  Activity, Star, Info, Link, ExternalLink, RefreshCw
} from 'lucide-react';

type ScenarioKey = 'conservative' | 'standard' | 'aggressive';

type ScenarioConfig = {
  growth: number;
  volatility: number;
};

type ForecastPoint = {
  month: string;
  balance: number;
  flow: number;
  risk: 'low' | 'medium' | 'high';
};

type ScenarioNarrative = {
  title: string;
  story: string;
  future: string;
  emotion: string;
  color: string;
};

type WeeklyChecklistState = {
  cashCheck: boolean;
  receiptsCheck: boolean;
  salesRecord: boolean;
  paymentsCheck: boolean;
};

type BusinessPL = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  nonOperatingIncome: number;
  nonOperatingExpenses: number;
  ordinaryIncome: number;
  extraordinaryIncome: number;
  extraordinaryLoss: number;
  netIncome: number;
};

type PersonalPL = {
  revenue: number;
  expenses: number;
  netIncome: number;
};

type TotalPL = {
  revenue: number;
  netIncome: number;
};

type CashFlowSummary = {
  operating: number;
  investing: number;
  financing: number;
  total: number;
};

type BusinessInvestment = {
  name: string;
  amount: number;
  roi: number;
  ratio: number;
  color: 'blue' | 'green' | 'orange' | 'purple';
  details?: string[];
  expectedRevenue?: string;
  customers?: string;
};

type Milestone = {
  month: string;
  event: string;
  impact: number;
  type: 'expense' | 'income' | 'investment';
  description: string;
};

type SimplifiedBalanceSheet = {
  assets: number;
  liabilities: number;
  equity: number;
};

type APIConnection = {
  id: string;
  name: string;
  logo: string;
  type: 'business' | 'personal';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  dataCount?: {
    transactions?: number;
    receipts?: number;
    invoices?: number;
  };
};

const hasOperatingIncome = (pl: BusinessPL | PersonalPL | TotalPL): pl is BusinessPL => {
  return (pl as BusinessPL).operatingIncome !== undefined;
};

const App = () => {
  // State管理
  const [currentScreen, setCurrentScreen] = useState('weekly');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardView, setDashboardView] = useState('total');
  const [investmentView, setInvestmentView] = useState('personal');
  const [reportView, setReportView] = useState('total');
  const [selectedScenario, setSelectedScenario] = useState('standard');
  const [customSimulation, setCustomSimulation] = useState({
    returnRate: 5,
    monthlyInvestment: 5
  });
  const [weeklyChecklist, setWeeklyChecklist] = useState<WeeklyChecklistState>({
    cashCheck: false,
    receiptsCheck: false,
    salesRecord: false,
    paymentsCheck: false
  });
  const weeklyStreak = 12;
  const [weeklyPoints, setWeeklyPoints] = useState(240);
  
  // API連携状態管理
  const [apiConnections, setApiConnections] = useState<APIConnection[]>([
    {
      id: 'freee',
      name: 'freee会計',
      logo: '📊',
      type: 'business',
      status: 'connected',
      lastSync: '2025/01/10 14:30',
      dataCount: {
        transactions: 245,
        receipts: 38,
        invoices: 12
      }
    },
    {
      id: 'yayoi',
      name: '弥生会計',
      logo: '📈',
      type: 'business',
      status: 'disconnected'
    },
    {
      id: 'moneyforward',
      name: 'マネーフォワード ME',
      logo: '💰',
      type: 'personal',
      status: 'connected',
      lastSync: '2025/01/10 06:00',
      dataCount: {
        transactions: 1523
      }
    }
  ]);

  const userData = {
    name: '山田太郎',
    age: 35,
    location: '東京都',
    taxType: 'both',
    targetAsset: 5000,
    email: 'yamada@example.com',
    business: {
      type: 'corporation',
      corporateName: '株式会社山田商事',
      annualRevenue: 1200,
      expenses: 400,
      cashBalance: 320,
      executiveSalary: 50,
      retained: 180
    },
    personal: {
      annualIncome: 600,
      personalExpenses: 300,
      savings: 500,
      investments: {
        nisa: 200,
        ideco: 150,
        stocks: 100,
        other: 80
      }
    }
  };

  // (以前のヘルパー関数は省略 - 変更なし)
  const calculateSimulation = (returnRate = 5, monthlyInvestment = 5) => {
    const currentAge = userData.age;
    const annualSaving = monthlyInvestment * 12 * 10000;
    const currentAssets = userData.personal.savings * 10000;
    
    const years = [];
    let assets = currentAssets;
    
    for (let i = 0; i <= 10; i++) {
      const year = currentAge + i;
      const investmentReturn = assets * (returnRate / 100);
      assets += annualSaving + investmentReturn;
      
      years.push({
        year: year,
        age: year,
        assets: Math.round(assets / 10000),
        target: userData.targetAsset
      });
    }

    const finalAssets = years[10].assets;
    const gap = userData.targetAsset - finalAssets;
    const probability = Math.min(100, Math.round((finalAssets / userData.targetAsset) * 100));
    
    return {
      years,
      finalAssets,
      gap,
      probability,
      monthlyRequired: gap > 0 ? Math.ceil(gap / 120) : 0
    };
  };

  const generateScenarioData = () => {
    const conservative = calculateSimulation(3, 5);
    const standard = calculateSimulation(5, 5);
    const aggressive = calculateSimulation(8, 5);
    
    return conservative.years.map((year, index) => ({
      year: year.year,
      conservative: conservative.years[index].assets,
      standard: standard.years[index].assets,
      aggressive: aggressive.years[index].assets,
      target: userData.targetAsset
    }));
  };

  const calculateOptimalSalary = (monthlySalary: number) => {
    const annualSalary = monthlySalary * 12;
    const incomeTax = annualSalary * 0.10;
    const residentTax = annualSalary * 0.10;
    const socialInsurance = annualSalary * 0.15;
    const totalDeduction = incomeTax + residentTax + socialInsurance;
    const takeHome = annualSalary - totalDeduction;
    
    return {
      incomeTax,
      residentTax,
      socialInsurance,
      totalDeduction,
      takeHome
    };
  };

  // API連携管理コンポーネント
  const APIConnectionCard = ({ connection }: { connection: APIConnection }) => {
    const handleConnect = () => {
      console.log(`Connecting to ${connection.name}...`);
      // 実際のAPI連携処理はここに実装
    };

    const handleDisconnect = () => {
      console.log(`Disconnecting from ${connection.name}...`);
    };

    const handleSync = () => {
      console.log(`Syncing ${connection.name}...`);
    };

    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border-2 ${
        connection.status === 'connected' ? 'border-green-200' :
        connection.status === 'error' ? 'border-red-200' :
        'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{connection.logo}</div>
            <div>
              <h4 className="font-bold text-gray-900">{connection.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  connection.status === 'connected' ? 'bg-green-100 text-green-700' :
                  connection.status === 'error' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {connection.status === 'connected' ? '連携中' :
                   connection.status === 'error' ? 'エラー' : '未連携'}
                </span>
                <span className="text-xs text-gray-500">
                  {connection.type === 'business' ? '事業用' : '個人用'}
                </span>
              </div>
            </div>
          </div>
          
          {connection.status === 'connected' ? (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              連携解除
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              連携する
            </button>
          )}
        </div>

        {connection.status === 'connected' && (
          <>
            <div className="space-y-2 mb-4">
              {connection.lastSync && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">最終同期</span>
                  <span className="font-medium text-gray-900">{connection.lastSync}</span>
                </div>
              )}
              {connection.dataCount && (
                <>
                  {connection.dataCount.transactions !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">取引データ</span>
                      <span className="font-medium text-gray-900">{connection.dataCount.transactions}件</span>
                    </div>
                  )}
                  {connection.dataCount.receipts !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">領収書</span>
                      <span className="font-medium text-gray-900">{connection.dataCount.receipts}件</span>
                    </div>
                  )}
                  {connection.dataCount.invoices !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">請求書</span>
                      <span className="font-medium text-gray-900">{connection.dataCount.invoices}件</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={handleSync}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4" />
              今すぐ同期
            </button>
          </>
        )}

        {connection.status === 'disconnected' && (
          <div className="text-sm text-gray-600">
            連携すると、自動でデータが取り込まれます
          </div>
        )}

        {connection.status === 'error' && (
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-red-800">
              同期中にエラーが発生しました。再接続してください。
            </div>
          </div>
        )}
      </div>
    );
  };

  // 仕訳入力画面（API連携版）
  const AccountingScreen = () => {
    const connectedBusinessAPI = apiConnections.find(api => api.type === 'business' && api.status === 'connected');

    if (!connectedBusinessAPI) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">仕訳入力</h2>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* API未連携状態 */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">会計ソフトと連携が必要です</h3>
            <p className="text-gray-600 mb-6">
              仕訳入力を行うには、freeeまたは弥生会計との連携が必要です
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {apiConnections.filter(api => api.type === 'business').map(api => (
                <APIConnectionCard key={api.id} connection={api} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // API連携済みの場合
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">仕訳入力</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} と連携中</span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 外部サービスへのリンク */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">仕訳は {connectedBusinessAPI.name} で管理されます</h3>
              <p className="text-white/90 text-sm">
                WealthPathで入力した仕訳は自動的に {connectedBusinessAPI.name} に反映されます
              </p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              {connectedBusinessAPI.name}を開く
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 簡易入力フォーム（APIに送信） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">簡易仕訳入力</h3>
          <div className="text-sm text-gray-600 mb-4">
            ここで入力した仕訳は {connectedBusinessAPI.name} に自動で反映されます
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2025-01-10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">金額</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="10000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">借方科目</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>勘定科目を選択</option>
                  <option>交際費</option>
                  <option>通信費</option>
                  <option>消耗品費</option>
                  <option>旅費交通費</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">貸方科目</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>勘定科目を選択</option>
                  <option>現金</option>
                  <option>普通預金</option>
                  <option>クレジットカード</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">摘要</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="取引内容を入力" />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                {connectedBusinessAPI.name}に送信
              </button>
            </div>
          </div>
        </div>

        {/* 最近の仕訳（APIから取得） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">最近の仕訳</h3>
            <span className="text-sm text-gray-600">
              {connectedBusinessAPI.name} から取得
            </span>
          </div>
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>データを読み込み中...</p>
            <p className="text-sm mt-1">freee API経由でデータを取得します</p>
          </div>
        </div>
      </div>
    );
  };

  // 領収書管理画面（API連携版）
  const ReceiptsScreen = () => {
    const connectedBusinessAPI = apiConnections.find(api => api.type === 'business' && api.status === 'connected');

    if (!connectedBusinessAPI) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">領収書管理</h2>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* API未連携状態 */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">会計ソフトと連携が必要です</h3>
            <p className="text-gray-600 mb-6">
              領収書管理を行うには、freeeまたは弥生会計との連携が必要です
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {apiConnections.filter(api => api.type === 'business').map(api => (
                <APIConnectionCard key={api.id} connection={api} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // API連携済みの場合
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">領収書管理</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} と連携中</span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* アップロードボタン */}
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg">
          <Camera className="w-6 h-6" />
          <span className="text-lg font-semibold">撮影して {connectedBusinessAPI.name} に送信</span>
        </button>

        {/* 機能説明カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Eye className="w-6 h-6" />, title: 'OCR自動読み取り', desc: '日付・金額・店名を自動抽出', color: 'blue' },
            { icon: <Zap className="w-6 h-6" />, title: 'AI勘定科目提案', desc: '最適な科目を自動で提案', color: 'purple' },
            { icon: <Shield className="w-6 h-6" />, title: '電子帳簿保存法対応', desc: connectedBusinessAPI.name + 'で自動対応', color: 'green' }
          ].map((feature, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-lg p-4 border border-${feature.color}-200`}>
              <div className={`text-${feature.color}-600 mb-2`}>{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* 領収書一覧（APIから取得） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">領収書一覧</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} から取得</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {connectedBusinessAPI.dataCount?.receipts || 0}件
              </span>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>データを読み込み中...</p>
            <p className="text-sm mt-1">{connectedBusinessAPI.name} API経由でデータを取得します</p>
          </div>
        </div>

        {/* 外部サービスへのリンク */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">詳細は {connectedBusinessAPI.name} で確認</h3>
              <p className="text-white/90 text-sm">
                すべての領収書と仕訳の詳細を確認できます
              </p>
            </div>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2">
              {connectedBusinessAPI.name}を開く
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 請求書管理画面（API連携版）
  const InvoicesScreen = () => {
    const connectedBusinessAPI = apiConnections.find(api => api.type === 'business' && api.status === 'connected');

    if (!connectedBusinessAPI) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">請求書管理</h2>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* API未連携状態 */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">会計ソフトと連携が必要です</h3>
            <p className="text-gray-600 mb-6">
              請求書管理を行うには、freeeまたは弥生会計との連携が必要です
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {apiConnections.filter(api => api.type === 'business').map(api => (
                <APIConnectionCard key={api.id} connection={api} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // API連携済みの場合
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">請求書管理</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} と連携中</span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 新規作成ボタン */}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          {connectedBusinessAPI.name} で新規請求書作成
        </button>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '今月売上', value: '230万円', icon: <DollarSign className="w-6 h-6" />, color: 'blue' },
            { label: '入金済み', value: '450万円', icon: <CheckCircle className="w-6 h-6" />, color: 'green' },
            { label: '未入金', value: '630万円', icon: <Clock className="w-6 h-6" />, color: 'yellow' },
            { label: '期限超過', value: '120万円', icon: <AlertCircle className="w-6 h-6" />, color: 'red' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* 請求書一覧（APIから取得） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">請求書一覧</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} から取得</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {connectedBusinessAPI.dataCount?.invoices || 0}件
              </span>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>データを読み込み中...</p>
            <p className="text-sm mt-1">{connectedBusinessAPI.name} API経由でデータを取得します</p>
          </div>
        </div>

        {/* 外部サービスへのリンク */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">請求書の作成・編集は {connectedBusinessAPI.name} で</h3>
              <p className="text-white/90 text-sm">
                請求書の詳細管理、送付、入金管理などすべての機能が利用できます
              </p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              {connectedBusinessAPI.name}を開く
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 月次決算画面（API連携版）
  const MonthlyClosingScreen = () => {
    const connectedBusinessAPI = apiConnections.find(api => api.type === 'business' && api.status === 'connected');

    if (!connectedBusinessAPI) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">月次決算</h2>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* API未連携状態 */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">会計ソフトと連携が必要です</h3>
            <p className="text-gray-600 mb-6">
              月次決算を行うには、freeeまたは弥生会計との連携が必要です
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {apiConnections.filter(api => api.type === 'business').map(api => (
                <APIConnectionCard key={api.id} connection={api} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    const checklistItems = [
      { task: '売上の計上', status: 'completed', source: connectedBusinessAPI.name },
      { task: '経費の計上', status: 'completed', source: connectedBusinessAPI.name },
      { task: '売掛金の消込', status: 'pending', source: connectedBusinessAPI.name },
      { task: '減価償却費の計上', status: 'completed', source: '自動処理' },
      { task: '棚卸資産の確認', status: 'pending', source: connectedBusinessAPI.name },
      { task: '仮払金の精算', status: 'pending', source: connectedBusinessAPI.name },
      { task: '預金残高の照合', status: 'completed', source: '自動処理' },
      { task: '試算表の確認', status: 'completed', source: '税理士' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">月次決算</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{connectedBusinessAPI.name} と連携中</span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 進捗状況カード */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle cx="64" cy="64" r="56" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="56" fill="none" stroke="white" strokeWidth="8"
                  strokeDasharray="351.86" strokeDashoffset="87.96"
                  transform="rotate(-90 64 64)"
                  strokeLinecap="round"
                />
                <text x="64" y="70" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">75%</text>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">2025年1月度 決算</h3>
              <div className="text-lg mb-1">6/8 タスク完了</div>
              <div className="flex items-center gap-2 text-yellow-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">締切まで残り4日</span>
              </div>
              <div className="mt-2 text-sm opacity-90">
                データは {connectedBusinessAPI.name} から自動取得
              </div>
            </div>
          </div>
        </div>

        {/* 財務サマリー（APIから取得） */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '売上高', value: '125万円', change: '+5.2%', icon: <DollarSign className="w-6 h-6" />, color: 'blue' },
            { label: '経費', value: '41万円', change: '-2.1%', icon: <Receipt className="w-6 h-6" />, color: 'red' },
            { label: '営業利益', value: '84万円', change: '+12.3%', icon: <TrendingUp className="w-6 h-6" />, color: 'green' },
            { label: '現金残高', value: '320万円', change: '+8.5%', icon: <Wallet className="w-6 h-6" />, color: 'purple' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 
                  card.change.includes('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* 決算チェックリスト */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">決算チェックリスト</h3>
            <span className="text-sm text-gray-600">
              {connectedBusinessAPI.name} のデータを使用
            </span>
          </div>
          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {item.task}
                    </div>
                    <div className="text-sm text-gray-500">データ元: {item.source}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status === 'completed' ? '完了' : '保留中'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 損益計算書（APIから取得） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">損益計算書（P/L）</h3>
            <span className="text-sm text-gray-600">
              {connectedBusinessAPI.name} から取得
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-semibold text-gray-900">売上高</span>
              <span className="text-xl font-bold text-gray-900">125万円</span>
            </div>
            <div className="flex justify-between items-center py-2 pl-4">
              <span className="text-gray-700">売上原価</span>
              <span className="font-medium text-gray-900">15万円</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">売上総利益</span>
              <span className="text-lg font-bold text-green-600">110万円</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900 text-lg">営業利益</span>
              <span className="text-2xl font-bold text-indigo-600">84万円</span>
            </div>
          </div>
        </div>

        {/* 外部サービスへのリンク */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">詳細は {connectedBusinessAPI.name} で確認</h3>
              <p className="text-white/90 text-sm">
                試算表、仕訳帳、総勘定元帳などすべての帳票を確認できます
              </p>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2">
              {connectedBusinessAPI.name}を開く
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 税理士レビュー依頼 */}
        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg">
          <MessageSquare className="w-6 h-6" />
          <span className="text-lg font-semibold">税理士にレビューを依頼</span>
        </button>
      </div>
    );
  };

  // Welcome Screen, Dashboard, その他の画面は以前のコードをそのまま使用
  // （長くなるため省略しますが、実装では変更なしで含めてください）

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">WealthPath</h1>
          <p className="text-2xl text-indigo-700 mb-2">資産形成のGPS</p>
          <p className="text-lg text-gray-600">事業と個人の資産を統合管理し、10年後の純資産を最大化する道しるべ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: <Building2 className="w-12 h-12" />, title: '事業・個人の完全分離', desc: '法人と個人の資産を明確に区分して管理' },
            { icon: <Calculator className="w-12 h-12" />, title: '税務最適化', desc: '役員報酬シミュレーションで節税効果を最大化' },
            { icon: <Zap className="w-12 h-12" />, title: '経理自動化', desc: 'freee・弥生・マネフォ連携で経理作業を削減' },
            { icon: <Users className="w-12 h-12" />, title: '税理士連携', desc: 'チャットで気軽に相談、月次決算もスムーズ' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => {
              setIsAuthenticated(true);
              setCurrentScreen('dashboard');
            }}
            className="bg-indigo-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            デモを開始
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard画面も同様に実装（コードは変更なし）
  // 他の画面も同じく実装（省略）

  // メインレイアウト
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <WelcomeScreen />
      ) : (
        <div className="flex h-screen">
          {/* サイドバー */}
          {sidebarOpen && (
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-indigo-600">WealthPath</h1>
                <p className="text-sm text-gray-600 mt-1">資産形成のGPS</p>
              </div>
              
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {[
                  { id: 'weekly', icon: <Calendar className="w-5 h-5" />, label: '今週のやること', badge: true },
                  { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'ホーム' },
                  { id: 'simulation', icon: <Target className="w-5 h-5" />, label: '10年後シミュレーション' },
                  { id: 'tax', icon: <Calculator className="w-5 h-5" />, label: '税務最適化' },
                  { id: 'investment', icon: <TrendingUp className="w-5 h-5" />, label: '投資管理' },
                  { id: 'accounting', icon: <Receipt className="w-5 h-5" />, label: '仕訳入力' },
                  { id: 'receipts', icon: <Camera className="w-5 h-5" />, label: '領収書管理' },
                  { id: 'invoices', icon: <FileText className="w-5 h-5" />, label: '請求書管理' },
                  { id: 'monthly', icon: <Calendar className="w-5 h-5" />, label: '月次決算' },
                  { id: 'api', icon: <Link className="w-5 h-5" />, label: 'API連携設定' },
                  { id: 'taxChat', icon: <MessageSquare className="w-5 h-5" />, label: '税理士チャット' },
                  { id: 'settings', icon: <Settings className="w-5 h-5" />, label: '設定' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                      currentScreen === item.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{userData.name}</div>
                    <div className="text-xs text-gray-600">{userData.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* メインコンテンツ */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </header>
            
            {/* コンテンツエリア */}
            <main className="flex-1 overflow-y-auto p-6">
              {currentScreen === 'accounting' && <AccountingScreen />}
              {currentScreen === 'receipts' && <ReceiptsScreen />}
              {currentScreen === 'invoices' && <InvoicesScreen />}
              {currentScreen === 'monthly' && <MonthlyClosingScreen />}
              {currentScreen === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">API連携設定</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">API連携について</p>
                        <p>WealthPathは各種会計ソフトやアプリと連携し、データを自動で取り込むことができます。</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">事業用会計ソフト</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {apiConnections.filter(api => api.type === 'business').map(api => (
                        <APIConnectionCard key={api.id} connection={api} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">個人用家計簿アプリ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {apiConnections.filter(api => api.type === 'personal').map(api => (
                        <APIConnectionCard key={api.id} connection={api} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* 他の画面も同様に実装 */}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;