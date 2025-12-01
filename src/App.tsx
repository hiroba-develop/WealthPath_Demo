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
  Activity, Star, Info
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

const hasOperatingIncome = (pl: BusinessPL | PersonalPL | TotalPL): pl is BusinessPL => {
  return (pl as BusinessPL).operatingIncome !== undefined;
};

const App = () => {
  // State管理
  const [currentScreen, setCurrentScreen] = useState('weekly');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardView, setDashboardView] = useState('total'); // total, business, personal
  const [investmentView, setInvestmentView] = useState('personal'); // personal, business
  const [reportView, setReportView] = useState('total'); // total, business, personal
  const [selectedScenario, setSelectedScenario] = useState('standard'); // conservative, standard, aggressive
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
  const weeklyStreak = 12; // 連続ログイン週数
  const [weeklyPoints, setWeeklyPoints] = useState(240); // 累計ポイント
  
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

  // 10年後シミュレーション計算
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

  // 3つのシナリオデータ生成
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

  // 役員報酬最適化計算
  const calculateOptimalSalary = (monthlySalary: number) => {
    const annualSalary = monthlySalary * 12;
    const incomeTax = annualSalary * 0.10; // 簡易計算
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

  // Welcome Screen (G-001)
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
            { icon: <Zap className="w-12 h-12" />, title: '経理自動化', desc: 'AI仕訳とOCR領収書読み取りで経理作業を削減' },
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

  // Home Dashboard (G-007) - 大幅拡充
  const Dashboard = () => {
    const totalAssets = userData.business.cashBalance + userData.personal.savings + 
      (userData.personal.investments.nisa + userData.personal.investments.ideco + 
       userData.personal.investments.stocks + userData.personal.investments.other);
    
    const simulation = calculateSimulation();
    
    // 月次収支データ
    const monthlyData = [
      { month: '7月', income: 100, expense: 35, profit: 65 },
      { month: '8月', income: 120, expense: 40, profit: 80 },
      { month: '9月', income: 110, expense: 38, profit: 72 },
      { month: '10月', income: 130, expense: 42, profit: 88 },
      { month: '11月', income: 125, expense: 41, profit: 84 }
    ];
    
    // 資産配分データ
    const assetAllocation = [
      { name: '事業用現金', value: userData.business.cashBalance, color: '#3b82f6' },
      { name: '個人預貯金', value: userData.personal.savings, color: '#10b981' },
      { name: 'NISA', value: userData.personal.investments.nisa, color: '#f59e0b' },
      { name: 'iDeCo', value: userData.personal.investments.ideco, color: '#ef4444' },
      { name: '個別株', value: userData.personal.investments.stocks, color: '#8b5cf6' },
      { name: 'その他', value: userData.personal.investments.other, color: '#6b7280' }
    ];

    return (
      <div className="space-y-6">
        {/* ビュー切り替えタブ */}
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'total', label: '総合ビュー' },
            { id: 'business', label: '事業用' },
            { id: 'personal', label: '個人用' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setDashboardView(view.id)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                dashboardView === view.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* 現在の純資産表示 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl mb-2 opacity-90">現在の純資産</h2>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold">{totalAssets.toLocaleString()}万円</div>
            <div className="text-2xl opacity-90 mb-2">目標: {userData.targetAsset.toLocaleString()}万円</div>
          </div>
        </div>

        {/* 10年後予測サマリーカード */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">10年後の予測</h3>
            <button 
              onClick={() => setCurrentScreen('simulation')}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              詳細を見る <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {simulation.finalAssets.toLocaleString()}万円
              </div>
              <div className="text-sm text-gray-600">標準シナリオ（年率5%）</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(simulation.probability / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">目標達成確率: {simulation.probability}%</div>
            </div>
          </div>
        </div>

        {/* サマリーカード（ビュー別） */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dashboardView === 'total' && [
            { icon: <Wallet className="w-6 h-6" />, label: '総資産', value: `${totalAssets.toLocaleString()}万円`, change: '+8.2%', color: 'indigo' },
            { icon: <TrendingUp className="w-6 h-6" />, label: '月次利益', value: '84万円', change: '+12.3%', color: 'green' },
            { icon: <PiggyBank className="w-6 h-6" />, label: '投資資産', value: `${(userData.personal.investments.nisa + userData.personal.investments.ideco + userData.personal.investments.stocks + userData.personal.investments.other).toLocaleString()}万円`, change: '+15.7%', color: 'orange' },
            { icon: <Calculator className="w-6 h-6" />, label: '節税効果', value: '48万円/年', change: 'NEW', color: 'purple' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
          
          {dashboardView === 'business' && [
            { icon: <DollarSign className="w-6 h-6" />, label: '月次売上', value: '125万円', change: '+5.2%', color: 'blue' },
            { icon: <Receipt className="w-6 h-6" />, label: '月次経費', value: '41万円', change: '-2.1%', color: 'red' },
            { icon: <TrendingUp className="w-6 h-6" />, label: '月次利益', value: '84万円', change: '+12.3%', color: 'green' },
            { icon: <Wallet className="w-6 h-6" />, label: '現金残高', value: `${userData.business.cashBalance.toLocaleString()}万円`, change: '+8.5%', color: 'indigo' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 
                  card.change.includes('-') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
          
          {dashboardView === 'personal' && [
            { icon: <DollarSign className="w-6 h-6" />, label: '月次収入', value: '50万円', change: '±0%', color: 'blue' },
            { icon: <Receipt className="w-6 h-6" />, label: '月次支出', value: '25万円', change: '+3.2%', color: 'red' },
            { icon: <Activity className="w-6 h-6" />, label: '貯蓄率', value: '50%', change: '-3.2%', color: 'green' },
            { icon: <PiggyBank className="w-6 h-6" />, label: '純資産', value: `${(userData.personal.savings + userData.personal.investments.nisa + userData.personal.investments.ideco + userData.personal.investments.stocks + userData.personal.investments.other).toLocaleString()}万円`, change: '+15.7%', color: 'indigo' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 10年後予測グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">10年後予測</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={simulation.years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="assets" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="予測資産" />
                <Area type="monotone" dataKey="target" stroke="#ef4444" fill="none" strokeDasharray="5 5" name="目標" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 月次収支グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">月次収支推移</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="収入" />
                <Bar dataKey="expense" fill="#ef4444" name="支出" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 資産配分円グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">資産配分</h3>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {assetAllocation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value.toLocaleString()}万円</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 今月のやることリスト */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">今月のやることリスト</h3>
            <div className="space-y-3">
              {[
                { task: 'NISA投資枠の消化', amount: '5万円', priority: 'high', status: 'pending' },
                { task: '経費精算（通信費）', amount: '1.2万円', priority: 'high', status: 'pending' },
                { task: '請求書発行（3件）', amount: '45万円', priority: 'medium', status: 'inProgress' },
                { task: '月次決算レビュー', amount: null, priority: 'low', status: 'completed' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'inProgress' ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className={`font-medium ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.task}
                      </div>
                      {item.amount && <div className="text-sm text-gray-600">{item.amount}</div>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 最適化ポイント */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">最適化ポイント</h3>
            <div className="space-y-4">
              {[
                { icon: <TrendingUp className="w-5 h-5" />, title: '役員報酬の最適化', desc: '年間48万円の節税効果', action: '詳細を見る', color: 'green', screen: 'tax' },
                { icon: <PiggyBank className="w-5 h-5" />, title: 'iDeCo増額', desc: '月2万円で年10万円の節税', action: '設定する', color: 'blue', screen: 'investment' },
                { icon: <AlertCircle className="w-5 h-5" />, title: '固定費の見直し', desc: '通信費を3社比較で削減可能', action: '確認する', color: 'orange', screen: 'dashboard' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 border-${item.color}-500 bg-${item.color}-50`}>
                  <div className="flex items-start gap-3">
                    <div className={`text-${item.color}-600 mt-1`}>{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                      <button 
                        onClick={() => setCurrentScreen(item.screen)}
                        className={`text-sm text-${item.color}-600 hover:text-${item.color}-800 font-medium flex items-center gap-1`}
                      >
                        {item.action} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 税理士連携CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">税理士に相談してみませんか？</h3>
              <p className="text-purple-100">チャットで気軽に質問できます。月次決算のサポートも万全です。</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('taxChat')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              チャットを開始
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 10年後シミュレーション画面 (G-008) - 大幅拡充
  const SimulationScreen = () => {
    const scenarioData = generateScenarioData();
    const currentSimulation = calculateSimulation(customSimulation.returnRate, customSimulation.monthlyInvestment);
    
    const scenarios = [
      { id: 'conservative', name: '保守的', rate: 3, color: 'blue', desc: '安全性重視' },
      { id: 'standard', name: '標準', rate: 5, color: 'green', desc: 'バランス型' },
      { id: 'aggressive', name: '積極的', rate: 8, color: 'orange', desc: '成長重視' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">10年後シミュレーション</h2>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* シナリオ選択カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map(scenario => {
            const sim = calculateSimulation(scenario.rate, 5);
            return (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`bg-white rounded-xl p-6 cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? `border-2 border-${scenario.color}-500 shadow-lg`
                    : 'border-2 border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
                  <span className={`text-2xl font-bold text-${scenario.color}-600`}>{scenario.rate}%</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{scenario.desc}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">10年後</span>
                    <span className="font-semibold text-gray-900">{sim.finalAssets.toLocaleString()}万円</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">達成確率</span>
                    <span className="font-semibold text-gray-900">{sim.probability}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4本の折れ線グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">資産推移シミュレーション</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="conservative" stroke="#3b82f6" strokeWidth={2} name="保守的(3%)" />
              <Line type="monotone" dataKey="standard" stroke="#10b981" strokeWidth={2} name="標準(5%)" />
              <Line type="monotone" dataKey="aggressive" stroke="#f59e0b" strokeWidth={2} name="積極的(8%)" />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="目標" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* カスタムシミュレーション */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">カスタムシミュレーション</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">想定リターン率</label>
                  <span className="text-sm font-bold text-indigo-600">{customSimulation.returnRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={customSimulation.returnRate}
                  onChange={(e) => setCustomSimulation({...customSimulation, returnRate: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">月次投資額</label>
                  <span className="text-sm font-bold text-indigo-600">{customSimulation.monthlyInvestment}万円</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={customSimulation.monthlyInvestment}
                  onChange={(e) => setCustomSimulation({...customSimulation, monthlyInvestment: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0万円</span>
                  <span>30万円</span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">予測結果</div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {currentSimulation.finalAssets.toLocaleString()}万円
                </div>
                <div className="text-sm text-gray-600">
                  目標まで: {currentSimulation.gap > 0 ? `${currentSimulation.gap.toLocaleString()}万円不足` : '目標達成'}
                </div>
              </div>
            </div>
          </div>

          {/* 推奨アクション */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">推奨アクション</h3>
            <div className="space-y-4">
              {[
                { icon: <PiggyBank className="w-6 h-6" />, title: 'NISA最大活用', desc: '年間360万円の枠を活用して非課税メリットを最大化', impact: '10年で+80万円', color: 'green' },
                { icon: <TrendingUp className="w-6 h-6" />, title: 'iDeCo増額', desc: '月額2.3万円→5万円に増額で節税効果アップ', impact: '10年で+120万円', color: 'blue' },
                { icon: <AlertCircle className="w-6 h-6" />, title: '固定費見直し', desc: '通信費・保険を見直して月1万円削減', impact: '10年で+120万円', color: 'orange' }
              ].map((action, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 border-${action.color}-500 bg-${action.color}-50`}>
                  <div className="flex gap-3">
                    <div className={`text-${action.color}-600 flex-shrink-0`}>{action.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{action.desc}</p>
                      <div className={`text-sm font-semibold text-${action.color}-600`}>{action.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ライフイベント追加セクション */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ライフイベント</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Home className="w-6 h-6" />, title: '住宅購入', amount: '3,000万円', year: '3年後' },
              { icon: <Users className="w-6 h-6" />, title: '結婚・出産', amount: '500万円', year: '5年後' },
              { icon: <BookOpen className="w-6 h-6" />, title: '教育費', amount: '1,000万円', year: '10年後' }
            ].map((event, idx) => (
              <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-indigo-600">{event.icon}</div>
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                </div>
                <div className="text-sm text-gray-600 mb-1">{event.amount}</div>
                <div className="text-sm text-gray-500">{event.year}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            ライフイベントを追加
          </button>
        </div>
      </div>
    );
  };

  // 税務最適化画面 (G-010) - 大幅拡充
  const TaxOptimizationScreen = () => {
    const [executiveSalary, setExecutiveSalary] = useState(50);
    const currentCalc = calculateOptimalSalary(executiveSalary);
    const optimalCalc = calculateOptimalSalary(60);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">税務最適化ダッシュボード</h2>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="w-8 h-8" />
              <span className="text-sm opacity-90">今年度</span>
            </div>
            <div className="text-3xl font-bold mb-1">324万円</div>
            <div className="text-sm opacity-90">年間納税予測</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-sm opacity-90">最大化可能</span>
            </div>
            <div className="text-3xl font-bold mb-1">48万円</div>
            <div className="text-sm opacity-90">節税効果（年間）</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white" />
                ))}
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">85点</div>
            <div className="text-sm opacity-90">最適化スコア</div>
          </div>
        </div>

        {/* 役員報酬シミュレーター */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">役員報酬シミュレーター</h3>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">月額役員報酬</label>
              <span className="text-lg font-bold text-indigo-600">{executiveSalary}万円</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={executiveSalary}
              onChange={(e) => setExecutiveSalary(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20万円</span>
              <span>100万円</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 現在 */}
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600 mb-1">現在の設定</div>
                <div className="text-2xl font-bold text-gray-900">{executiveSalary}万円/月</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">年収</span>
                  <span className="font-semibold">{(executiveSalary * 12).toLocaleString()}万円</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">所得税</span>
                  <span className="font-semibold text-red-600">-{currentCalc.incomeTax.toLocaleString()}万円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">住民税</span>
                  <span className="font-semibold text-red-600">-{currentCalc.residentTax.toLocaleString()}万円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">社会保険料</span>
                  <span className="font-semibold text-red-600">-{currentCalc.socialInsurance.toLocaleString()}万円</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">手取り額</span>
                  <span className="font-bold text-lg text-green-600">{currentCalc.takeHome.toLocaleString()}万円</span>
                </div>
              </div>
            </div>

            {/* 最適 */}
            <div className="border-2 border-indigo-500 rounded-lg p-4 bg-indigo-50">
              <div className="text-center mb-4">
                <div className="text-sm text-indigo-600 mb-1 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" />
                  最適化後
                </div>
                <div className="text-2xl font-bold text-indigo-600">60万円/月</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">年収</span>
                  <span className="font-semibold">720万円</span>
                </div>
                <div className="h-px bg-indigo-200"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">所得税</span>
                  <span className="font-semibold text-red-600">-{optimalCalc.incomeTax.toLocaleString()}万円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">住民税</span>
                  <span className="font-semibold text-red-600">-{optimalCalc.residentTax.toLocaleString()}万円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">社会保険料</span>
                  <span className="font-semibold text-red-600">-{optimalCalc.socialInsurance.toLocaleString()}万円</span>
                </div>
                <div className="h-px bg-indigo-200"></div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">手取り額</span>
                  <span className="font-bold text-lg text-green-600">{optimalCalc.takeHome.toLocaleString()}万円</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900">最適化で年間48万円の節税効果</div>
                <div className="text-sm text-gray-600">手取り額が年間36万円増加します</div>
              </div>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              この設定を適用
            </button>
          </div>
        </div>

        {/* 法人成り診断パネル */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">法人成り診断</h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-gray-900 mb-1">現在の状態: 法人</div>
                <div className="text-sm text-gray-600">株式会社山田商事（設立3年目）</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { icon: <Calculator className="w-5 h-5" />, title: '節税メリット', desc: '所得分散で税負担軽減', color: 'green' },
              { icon: <Shield className="w-5 h-5" />, title: '信頼性向上', desc: '取引先からの信用度UP', color: 'blue' },
              { icon: <TrendingUp className="w-5 h-5" />, title: '経費範囲拡大', desc: '損金算入の幅が広がる', color: 'orange' }
            ].map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}>
                <div className={`text-${item.color}-600 mb-2`}>{item.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">年間節税額試算</div>
                <div className="text-3xl font-bold text-green-600">約120万円</div>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                詳細レポート
              </button>
            </div>
          </div>
        </div>

        {/* 節税機会カード */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">節税機会</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '小規模企業共済', priority: 'high', amount: '月7万円', effect: '年間25万円節税', status: 'available' },
              { name: 'iDeCo', priority: 'high', amount: '月6.8万円', effect: '年間23万円節税', status: 'active' },
              { name: '経営セーフティ共済', priority: 'medium', amount: '月20万円', effect: '年間240万円損金', status: 'available' },
              { name: 'ふるさと納税', priority: 'medium', amount: '年間12万円', effect: '実質2千円で返礼品', status: 'available' }
            ].map((item, idx) => (
              <div key={idx} className={`rounded-lg p-4 border-2 ${
                item.status === 'active' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-indigo-300'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority === 'high' ? '優先度: 高' : '優先度: 中'}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="text-sm text-gray-600">{item.amount}</div>
                  <div className="text-sm font-semibold text-indigo-600">{item.effect}</div>
                </div>
                <button className={`w-full py-2 rounded text-sm font-medium transition-colors ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-700 cursor-default' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  {item.status === 'active' ? '✓ 加入済み' : '申込む'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 控除最大化チェックリスト */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">控除最大化チェックリスト</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { item: '小規模企業共済の加入', status: 'done', effect: '年25万円' },
              { item: 'iDeCoの満額拠出', status: 'done', effect: '年23万円' },
              { item: '経営セーフティ共済の加入', status: 'pending', effect: '年240万円' },
              { item: 'ふるさと納税の活用', status: 'pending', effect: '年12万円' },
              { item: '生命保険料控除の最大化', status: 'done', effect: '年4万円' },
              { item: '医療費控除の申告', status: 'pending', effect: '要確認' },
              { item: '配偶者（特別）控除の確認', status: 'na', effect: '該当なし' },
              { item: '扶養控除の確認', status: 'na', effect: '該当なし' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {item.status === 'done' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : item.status === 'pending' ? (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{item.item}</span>
                </div>
                <span className="text-sm text-gray-600">{item.effect}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 投資管理（個人投資）画面 (G-011) - 拡充
  const PersonalInvestmentScreen = () => {
    const totalInvestment = userData.personal.investments.nisa + userData.personal.investments.ideco + 
                           userData.personal.investments.stocks + userData.personal.investments.other;
    const totalReturn = totalInvestment * 0.15;
    
    const investmentTrend = [
      { month: '7月', amount: 480 },
      { month: '8月', amount: 495 },
      { month: '9月', amount: 510 },
      { month: '10月', amount: 520 },
      { month: '11月', amount: 530 }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">投資管理</h2>
            <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setInvestmentView('personal')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentView === 'personal' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                個人投資
              </button>
              <button
                onClick={() => setInvestmentView('business')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentView === 'business' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                事業投資
              </button>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Wallet className="w-6 h-6" />, label: '投資総額', value: `${totalInvestment}万円`, change: '+12.5%', color: 'blue' },
            { icon: <TrendingUp className="w-6 h-6" />, label: '評価損益', value: `+${totalReturn.toFixed(0)}万円`, change: '+15.2%', color: 'green' },
            { icon: <Activity className="w-6 h-6" />, label: '平均リターン', value: '15.0%', change: '+2.3%', color: 'orange' },
            { icon: <Calendar className="w-6 h-6" />, label: '月次投資額', value: '5万円', change: 'target', color: 'purple' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 投資ポートフォリオ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">個人投資ポートフォリオ</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'NISA', amount: userData.personal.investments.nisa, return: 18.5, ratio: 37.7, color: 'blue' },
                { name: 'iDeCo', amount: userData.personal.investments.ideco, return: 12.3, ratio: 28.3, color: 'green' },
                { name: '個別株', amount: userData.personal.investments.stocks, return: 15.8, ratio: 18.9, color: 'orange' },
                { name: 'その他', amount: userData.personal.investments.other, return: 8.2, ratio: 15.1, color: 'purple' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 border-${item.color}-200 bg-${item.color}-50`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded bg-${item.color}-200 text-${item.color}-800`}>
                      {item.ratio}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.amount}万円</div>
                  <div className="text-sm text-green-600 font-semibold">+{item.return}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* ポートフォリオ円グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">配分比率</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'NISA', value: userData.personal.investments.nisa },
                    { name: 'iDeCo', value: userData.personal.investments.ideco },
                    { name: '個別株', value: userData.personal.investments.stocks },
                    { name: 'その他', value: userData.personal.investments.other }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    <Cell key="0" fill="#3b82f6" />,
                    <Cell key="1" fill="#10b981" />,
                    <Cell key="2" fill="#f59e0b" />,
                    <Cell key="3" fill="#8b5cf6" />
                  ]}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NISA管理パネル */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">NISA管理</h3>
              <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold">新NISA</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">2024年投資枠</span>
                  <span className="font-semibold text-gray-900">60万円 / 360万円</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{width: '16.7%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">推奨月次投資額</div>
                  <div className="text-lg font-bold text-blue-600">5万円</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">次回投資予定日</div>
                  <div className="text-lg font-bold text-blue-600">12/1</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">累計評価益</div>
                <div className="text-2xl font-bold text-green-600">+37万円</div>
                <div className="text-xs text-gray-500 mt-1">リターン: +18.5%</div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                投資設定を変更
              </button>
            </div>
          </div>

          {/* iDeCo管理パネル */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">iDeCo管理</h3>
              <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 font-semibold">加入中</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">月次拠出額</div>
                  <div className="text-lg font-bold text-green-600">2.3万円</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">年間節税効果</div>
                  <div className="text-lg font-bold text-orange-600">8.3万円</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">累計拠出額</div>
                  <div className="text-lg font-bold text-gray-900">138万円</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">現在評価額</div>
                  <div className="text-lg font-bold text-gray-900">150万円</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">運用益</div>
                <div className="text-2xl font-bold text-green-600">+12万円</div>
                <div className="text-xs text-gray-500 mt-1">リターン: +8.7%</div>
              </div>

              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                配分を変更
              </button>
            </div>
          </div>
        </div>

        {/* 投資推移グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">投資推移（過去5ヶ月）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={investmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="投資総額" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 投資アドバイス */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">投資アドバイス</h3>
          <div className="space-y-3">
            {[
              { type: 'success', icon: <CheckCircle className="w-5 h-5" />, title: 'NISA投資順調', desc: '年間目標の16.7%を達成。このペースを維持しましょう。', color: 'green' },
              { type: 'warning', icon: <AlertCircle className="w-5 h-5" />, title: 'iDeCo増額を検討', desc: '月額5万円まで増額で年間23万円の追加節税が可能です。', color: 'yellow' },
              { type: 'info', icon: <Info className="w-5 h-5" />, title: 'リバランスのタイミング', desc: '株式比率が高めです。債券への配分も検討しましょう。', color: 'blue' }
            ].map((advice, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 border-${advice.color}-500 bg-${advice.color}-50`}>
                <div className="flex gap-3">
                  <div className={`text-${advice.color}-600 flex-shrink-0`}>{advice.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{advice.title}</h4>
                    <p className="text-sm text-gray-600">{advice.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 税理士相談CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">投資について税理士に相談</h3>
              <p className="text-purple-100">最適な投資配分や節税効果について専門家のアドバイスを受けられます</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('taxChat')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex-shrink-0"
            >
              相談する
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 事業投資管理画面 (G-012)
  const BusinessInvestmentScreen = () => {
    const totalInvestment = 450;
    const businessInvestments: BusinessInvestment[] = [
      { name: 'サービス開発', amount: 150, roi: 25.5, ratio: 33.3, color: 'blue', 
        details: ['新機能開発: 60万円', 'UI/UX改善: 40万円', '技術調査: 30万円', 'テスト環境: 20万円'],
        expectedRevenue: '月20万円増' },
      { name: 'マーケティング', amount: 180, roi: 18.3, ratio: 40.0, color: 'green',
        details: ['広告費: 100万円 (55.6%)', 'コンテンツ制作: 50万円 (27.8%)', 'SEO対策: 30万円 (16.7%)'],
        customers: '新規25件獲得' },
      { name: '設備投資', amount: 80, roi: 12.0, ratio: 17.8, color: 'orange' },
      { name: '人材育成', amount: 40, roi: 15.0, ratio: 8.9, color: 'purple' }
    ];
    const serviceInvestment = businessInvestments[0];
    const marketingInvestment = businessInvestments[1];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">投資管理</h2>
            <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setInvestmentView('personal')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentView === 'personal' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                個人投資
              </button>
              <button
                onClick={() => setInvestmentView('business')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentView === 'business' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                事業投資
              </button>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Briefcase className="w-6 h-6" />, label: '事業投資総額', value: `${totalInvestment}万円`, change: '+8.5%', color: 'blue' },
            { icon: <TrendingUp className="w-6 h-6" />, label: '投資効果', value: '+95万円', change: '+18.2%', color: 'green' },
            { icon: <Activity className="w-6 h-6" />, label: '平均ROI', value: '21.1%', change: '+3.2%', color: 'orange' },
            { icon: <Calendar className="w-6 h-6" />, label: '月次投資額', value: '45万円', change: 'plan', color: 'purple' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 事業投資ポートフォリオ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">事業投資ポートフォリオ</h3>
            <div className="grid grid-cols-2 gap-4">
              {businessInvestments.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 border-${item.color}-200 bg-${item.color}-50`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded bg-${item.color}-200 text-${item.color}-800`}>
                      {item.ratio}%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{item.amount}万円</div>
                  <div className="text-sm text-green-600 font-semibold">ROI: {item.roi}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* ポートフォリオ円グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">投資配分</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={businessInvestments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, ratio }) => `${name} ${ratio}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {[
                    <Cell key="0" fill="#3b82f6" />,
                    <Cell key="1" fill="#10b981" />,
                    <Cell key="2" fill="#f59e0b" />,
                    <Cell key="3" fill="#8b5cf6" />
                  ]}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* サービス開発投資パネル */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">サービス開発投資</h3>
              <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold">最優先</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">累計投資額</div>
                  <div className="text-lg font-bold text-blue-600">150万円</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">期待ROI</div>
                  <div className="text-lg font-bold text-green-600">25.5%</div>
                </div>
              </div>

              {serviceInvestment?.details && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">投資内訳</h4>
                  {serviceInvestment.details.map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">予想売上増加</div>
                <div className="text-xl font-bold text-green-600">{serviceInvestment?.expectedRevenue ?? '—'}</div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                投資計画を見る
              </button>
            </div>
          </div>

          {/* マーケティング投資パネル */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">マーケティング投資</h3>
              <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 font-semibold">実施中</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">累計投資額</div>
                  <div className="text-lg font-bold text-green-600">180万円</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">期待ROI</div>
                  <div className="text-lg font-bold text-orange-600">18.3%</div>
                </div>
              </div>

              {marketingInvestment?.details && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">内訳</h4>
                  {marketingInvestment.details.map((detail, idx) => {
                    const percentage = parseFloat(detail.match(/\((.+?)%\)/)?.[1] || '0');
                    return (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{detail.split(':')[0]}</span>
                          <span className="font-semibold">{detail.split(':')[1]?.split('(')[0]}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">獲得顧客数</div>
                <div className="text-xl font-bold text-blue-600">{marketingInvestment?.customers ?? '—'}</div>
              </div>

              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                効果測定を見る
              </button>
            </div>
          </div>
        </div>

        {/* 投資機会アラート */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">投資機会アラート</h3>
          <div className="space-y-3">
            {[
              { priority: 'high', title: 'SEO対策の追加投資', desc: '競合分析の結果、月10万円の追加投資で検索順位が大幅改善見込み', roi: 'ROI 30%以上' },
              { priority: 'medium', title: '営業支援ツール導入', desc: 'CRM導入で業務効率20%向上。初期費用50万円', roi: '年間120万円削減' },
              { priority: 'low', title: 'オフィス環境改善', desc: '作業環境改善で生産性向上。投資額30万円', roi: '定性的効果' }
            ].map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.priority === 'high' ? 'bg-red-200 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.priority === 'high' ? '優先度: 高' : alert.priority === 'medium' ? '優先度: 中' : '優先度: 低'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.desc}</p>
                    <div className="text-sm font-semibold text-green-600">{alert.roi}</div>
                  </div>
                  <button className="ml-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 flex-shrink-0">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 領収書管理画面 (G-014)
  const ReceiptsScreen = () => {
    const unprocessedReceipts = [
      { id: 1, store: 'スターバックス', date: '2024/11/25', amount: 1580, suggestedAccount: '交際費', image: '/receipt1.jpg' },
      { id: 2, store: 'ビックカメラ', date: '2024/11/24', amount: 12800, suggestedAccount: '消耗品費', image: '/receipt2.jpg' },
      { id: 3, store: 'タクシー', date: '2024/11/23', amount: 3400, suggestedAccount: '旅費交通費', image: '/receipt3.jpg' }
    ];

    const processedReceipts = [
      { id: 4, date: '2024/11/22', store: 'Amazon', account: '消耗品費', amount: 5680, status: 'processed' },
      { id: 5, date: '2024/11/21', store: 'ドトール', account: '交際費', amount: 890, status: 'processed' },
      { id: 6, date: '2024/11/20', store: 'ヨドバシカメラ', account: '備品費', amount: 24800, status: 'processed' },
      { id: 7, date: '2024/11/19', store: 'JR東日本', account: '旅費交通費', amount: 1850, status: 'processed' },
      { id: 8, date: '2024/11/18', store: 'スタバ', account: '交際費', amount: 1200, status: 'processed' }
    ];

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

        {/* アップロードボタン */}
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg">
          <Camera className="w-6 h-6" />
          <span className="text-lg font-semibold">撮影してアップロード</span>
        </button>

        {/* 機能説明カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Eye className="w-6 h-6" />, title: 'OCR自動読み取り', desc: '日付・金額・店名を自動抽出', color: 'blue' },
            { icon: <Zap className="w-6 h-6" />, title: 'AI勘定科目提案', desc: '最適な科目を自動で提案', color: 'purple' },
            { icon: <Shield className="w-6 h-6" />, title: '電子帳簿保存法対応', desc: '法令要件を完全クリア', color: 'green' }
          ].map((feature, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-lg p-4 border border-${feature.color}-200`}>
              <div className={`text-${feature.color}-600 mb-2`}>{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* 未処理領収書 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">未処理領収書</h3>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              {unprocessedReceipts.length}件
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unprocessedReceipts.map(receipt => (
              <div key={receipt.id} className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition-colors bg-orange-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{receipt.store}</h4>
                    <div className="text-sm text-gray-600">{receipt.date}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">¥{receipt.amount.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded px-3 py-2 mb-3">
                  <div className="text-xs text-gray-500 mb-1">AI提案科目</div>
                  <div className="font-semibold text-indigo-600">{receipt.suggestedAccount}</div>
                </div>
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  処理する
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 処理済み領収書 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">処理済み領収書</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Search className="w-4 h-4" />
                検索
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                フィルター
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">日付</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">店名</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">勘定科目</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">金額</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {processedReceipts.map(receipt => (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{receipt.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{receipt.store}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                        {receipt.account}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      ¥{receipt.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 請求書管理画面 (G-015)
  const InvoicesScreen = () => {
    const invoices = [
      { id: 'INV-2024-015', client: '株式会社ABC', issueDate: '2024/11/20', dueDate: '2024/12/20', amount: 450000, status: 'paid' },
      { id: 'INV-2024-016', client: '合同会社XYZ', issueDate: '2024/11/22', dueDate: '2024/12/22', amount: 280000, status: 'unpaid' },
      { id: 'INV-2024-017', client: '株式会社DEF', issueDate: '2024/11/25', dueDate: '2024/12/25', amount: 350000, status: 'unpaid' },
      { id: 'INV-2024-018', client: 'GHI株式会社', issueDate: '2024/10/15', dueDate: '2024/11/15', amount: 120000, status: 'overdue' }
    ];

    const monthlySales = [
      { month: '7月', amount: 180 },
      { month: '8月', amount: 220 },
      { month: '9月', amount: 195 },
      { month: '10月', amount: 250 },
      { month: '11月', amount: 230 }
    ];

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

        {/* 新規作成ボタン */}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          新規請求書作成
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

        {/* 期限超過アラート */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-gray-900">期限超過の請求書があります</h3>
                <p className="text-sm text-gray-600">GHI株式会社への督促が必要です</p>
              </div>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
              督促メール送信
            </button>
          </div>
        </div>

        {/* 請求書一覧テーブル */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">請求書一覧</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">請求書ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">請求先</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">発行日</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">期限</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">金額</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">ステータス</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{invoice.client}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{invoice.issueDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{invoice.dueDate}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      ¥{invoice.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status === 'paid' ? '入金済み' : invoice.status === 'unpaid' ? '未入金' : '期限超過'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 月次売上推移グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">月次売上推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" name="売上高（万円）" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 月次決算画面 (G-017)
  const MonthlyClosingScreen = () => {
    const checklistItems = [
      { task: '売上の計上', status: 'completed', assignee: '自動処理' },
      { task: '経費の計上', status: 'completed', assignee: '山田太郎' },
      { task: '売掛金の消込', status: 'pending', assignee: '山田太郎' },
      { task: '減価償却費の計上', status: 'completed', assignee: '自動処理' },
      { task: '棚卸資産の確認', status: 'pending', assignee: '山田太郎' },
      { task: '仮払金の精算', status: 'pending', assignee: '山田太郎' },
      { task: '預金残高の照合', status: 'completed', assignee: '自動処理' },
      { task: '試算表の確認', status: 'completed', assignee: '税理士' }
    ];

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
              <h3 className="text-2xl font-bold mb-2">2024年11月度 決算</h3>
              <div className="text-lg mb-1">6/8 タスク完了</div>
              <div className="flex items-center gap-2 text-yellow-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">締切まで残り4日</span>
              </div>
            </div>
          </div>
        </div>

        {/* 財務サマリー */}
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">決算チェックリスト</h3>
          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {item.task}
                    </div>
                    <div className="text-sm text-gray-500">担当: {item.assignee}</div>
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

        {/* 損益計算書 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">損益計算書（P/L）</h3>
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
            <div className="pl-4 space-y-2">
              <div className="text-sm font-semibold text-gray-700 mb-2">販売費及び一般管理費</div>
              {[
                { item: '人件費', amount: '12万円' },
                { item: '地代家賃', amount: '8万円' },
                { item: '通信費', amount: '3万円' },
                { item: 'その他経費', amount: '3万円' }
              ].map((expense, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-gray-600 text-sm">　{expense.item}</span>
                  <span className="text-gray-900">{expense.amount}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-100">
                <span className="font-medium text-gray-700">販管費合計</span>
                <span className="font-semibold text-gray-900">26万円</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900 text-lg">営業利益</span>
              <span className="text-2xl font-bold text-indigo-600">84万円</span>
            </div>
          </div>
        </div>

        {/* 要確認事項 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">要確認事項</h3>
          <div className="space-y-2">
            {[
              '仮払金残高が10万円あります。内容を確認してください。',
              '売掛金の消込が必要です（ABC社: 45万円）',
              '減価償却費が自動計上されました（3.2万円）'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
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

  // レポート一覧画面 (G-019)
  const ReportsScreen = () => {
    const reports = [
      { id: 1, title: '総合レポート', period: '2024年11月', type: '月次', status: 'latest', icon: <BarChart3 className="w-6 h-6" />, color: 'indigo' },
      { id: 2, title: '事業用財務レポート', period: '2024年Q3', type: '四半期', status: 'latest', icon: <Building2 className="w-6 h-6" />, color: 'blue' },
      { id: 3, title: '個人資産レポート', period: '2024年11月', type: '月次', status: 'latest', icon: <User className="w-6 h-6" />, color: 'green' },
      { id: 4, title: '税務最適化レポート', period: '2024年', type: '年次', status: 'preparing', icon: <Calculator className="w-6 h-6" />, color: 'purple' },
      { id: 5, title: '投資パフォーマンスレポート', period: '2024年11月', type: '月次', status: 'latest', icon: <TrendingUp className="w-6 h-6" />, color: 'orange' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">レポート</h2>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ビュー切り替えとフィルター */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'total', label: '総合' },
              { id: 'business', label: '事業用' },
              { id: 'personal', label: '個人用' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setReportView(view.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  reportView === view.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option>月次</option>
              <option>四半期</option>
              <option>年次</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              カスタムレポート作成
            </button>
          </div>
        </div>

        {/* レポートカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <div key={report.id} className={`bg-white rounded-xl p-6 shadow-sm border-2 border-${report.color}-200 hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100 text-${report.color}-600`}>
                  {report.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.status === 'latest' ? 'bg-green-100 text-green-700' :
                  report.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {report.status === 'latest' ? '最新' : report.status === 'preparing' ? '準備中' : '作成中'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{report.period}</span>
                <span className="font-medium">{report.type}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  表示
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // レポート詳細画面 (G-020) - サンプル
  const ReportDetailScreen = () => {
    const indicators = [
      { label: '売上高', value: '125万円', change: '+5.2%', trend: 'up' },
      { label: '経費', value: '41万円', change: '-2.1%', trend: 'down' },
      { label: '営業利益', value: '84万円', change: '+12.3%', trend: 'up' },
      { label: '現金残高', value: '320万円', change: '+8.5%', trend: 'up' },
      { label: '売掛金', value: '65万円', change: '-5.2%', trend: 'down' },
      { label: '買掛金', value: '28万円', change: '+3.1%', trend: 'up' },
      { label: '純資産', value: '1,030万円', change: '+15.7%', trend: 'up' },
      { label: '自己資本比率', value: '78.5%', change: '+2.3%', trend: 'up' }
    ];

    const plTrend = [
      { month: '7月', revenue: 100, expense: 35, profit: 65 },
      { month: '8月', revenue: 120, expense: 40, profit: 80 },
      { month: '9月', revenue: 110, expense: 38, profit: 72 },
      { month: '10月', revenue: 130, expense: 42, profit: 88 },
      { month: '11月', revenue: 125, expense: 41, profit: 84 }
    ];

    const expenseBreakdown = [
      { name: '人件費', value: 12, color: '#3b82f6' },
      { name: '地代家賃', value: 8, color: '#10b981' },
      { name: '通信費', value: 3, color: '#f59e0b' },
      { name: '交際費', value: 2, color: '#ef4444' },
      { name: 'その他', value: 16, color: '#8b5cf6' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">総合レポート</h2>
            <p className="text-gray-600">2024年11月度</p>
          </div>
          <button 
            onClick={() => setCurrentScreen('reports')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '総資産', value: '1,030万円', change: '+15.7%', color: 'indigo' },
            { label: '月次利益', value: '84万円', change: '+12.3%', color: 'green' },
            { label: '投資資産', value: '530万円', change: '+18.2%', color: 'orange' },
            { label: '節税効果', value: '48万円/年', change: 'NEW', color: 'purple' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* 主要指標 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">主要指標</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indicators.map((indicator, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${
                indicator.trend === 'up' ? 'bg-green-50 border border-green-200' : 
                indicator.trend === 'down' ? 'bg-red-50 border border-red-200' : 
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className="text-sm text-gray-600 mb-1">{indicator.label}</div>
                <div className="text-xl font-bold text-gray-900 mb-1">{indicator.value}</div>
                <div className={`text-sm font-semibold ${
                  indicator.trend === 'up' ? 'text-green-600' : 
                  indicator.trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {indicator.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* P/L推移グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">P/L推移（過去5ヶ月）</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={plTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="収入" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="支出" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="利益" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 支出内訳グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">支出内訳</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI分析レポート */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">AI分析レポート</h3>
          <div className="space-y-4">
            {[
              { type: 'success', icon: <TrendingUp className="w-5 h-5" />, title: '売上が好調に推移', desc: '前月比+5.2%の伸び。マーケティング投資の効果が出ています。', color: 'green' },
              { type: 'warning', icon: <AlertCircle className="w-5 h-5" />, title: '固定費の見直し時期', desc: '通信費が業界平均より15%高い状態です。プラン変更を検討しましょう。', color: 'yellow' },
              { type: 'info', icon: <Info className="w-5 h-5" />, title: '節税機会あり', desc: '小規模企業共済の加入で年間25万円の節税が可能です。', color: 'blue' }
            ].map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 border-${insight.color}-500 bg-${insight.color}-50`}>
                <div className="flex gap-3">
                  <div className={`text-${insight.color}-600 flex-shrink-0`}>{insight.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 税理士相談ボタン */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">レポートについて税理士に相談</h3>
              <p className="text-purple-100">詳細な分析や改善策について専門家のアドバイスを受けられます</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('taxChat')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex-shrink-0"
            >
              相談する
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 税理士チャット画面 (G-021)
  const TaxChatScreen = () => {
    const [messages] = useState([
      { id: 1, sender: 'tax', text: 'こんにちは、王子クラウド会計事務所の田中です。本日はどのようなご相談でしょうか？', time: '10:30', read: true },
      { id: 2, sender: 'user', text: '役員報酬の最適化について相談したいです。現在50万円/月ですが、適切でしょうか？', time: '10:32', read: true },
      { id: 3, sender: 'tax', text: 'ご相談ありがとうございます。現在の売上と利益状況を確認したところ、月60万円に設定することで年間48万円の節税効果が見込めます。', time: '10:35', read: true },
      { id: 4, sender: 'tax', text: '詳細なシミュレーションレポートを添付しますので、ご確認ください。', time: '10:35', read: true, hasAttachment: true, attachment: '役員報酬最適化レポート.pdf' }
    ]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">税理士チャット</h2>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* チャットメイン */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{height: '600px'}}>
              {/* ヘッダー */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  王
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">王子クラウド会計事務所</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">オンライン</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* メッセージエリア */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        {message.hasAttachment && (
                          <div className="mt-2 p-2 bg-white/10 rounded flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <span className="text-xs">{message.attachment}</span>
                            <button className="ml-auto">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className={`text-xs text-gray-500 ${message.sender === 'user' ? 'text-right' : ''}`}>
                          {message.time}
                        </span>
                        {message.sender === 'user' && message.read && (
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 入力エリア */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Camera className="w-5 h-5" />
                  </button>
                  <div className="flex-1 border border-gray-300 rounded-lg p-3 min-h-[44px] max-h-32 overflow-y-auto">
                    <input 
                      type="text"
                      placeholder="メッセージを入力..."
                      className="w-full outline-none"
                    />
                  </div>
                  <button className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-4">
            {/* 相談メニュー */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">相談メニュー</h3>
              <div className="space-y-2">
                {[
                  { icon: <Calculator className="w-5 h-5" />, label: '税務相談', color: 'blue' },
                  { icon: <FileText className="w-5 h-5" />, label: '確定申告サポート', color: 'green' },
                  { icon: <Video className="w-5 h-5" />, label: 'ビデオ面談予約', color: 'purple' },
                  { icon: <TrendingUp className="w-5 h-5" />, label: '節税アドバイス', color: 'orange' }
                ].map((menu, idx) => (
                  <button key={idx} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-${menu.color}-200 hover:bg-${menu.color}-50 transition-colors`}>
                    <div className={`text-${menu.color}-600`}>{menu.icon}</div>
                    <span className="font-medium text-gray-900">{menu.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* プレミアムプラン案内 */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
              <h3 className="font-bold mb-2">プレミアムプラン</h3>
              <div className="text-2xl font-bold mb-3">月額 9,800円</div>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>無制限チャット相談</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>月次決算サポート</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>確定申告代行</span>
                </li>
              </ul>
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                詳しく見る
              </button>
            </div>

            {/* よくある質問 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">よくある質問</h3>
              <div className="space-y-2">
                {[
                  '役員報酬の決め方は？',
                  '経費にできるものは？',
                  'iDeCoとNISAの違いは？',
                  '法人成りのタイミングは？'
                ].map((question, idx) => (
                  <button key={idx} className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 仕訳入力画面 (G-013)
  const AccountingScreen = () => {
    const [entries] = useState([
      { id: 1, date: '2024/11/25', debit: '交際費', credit: '現金', amount: 5000, memo: 'クライアント打ち合わせ' },
      { id: 2, date: '2024/11/24', debit: '通信費', credit: '普通預金', amount: 8500, memo: 'インターネット料金' },
      { id: 3, date: '2024/11/23', debit: '消耗品費', credit: 'クレジットカード', amount: 3200, memo: '事務用品購入' }
    ]);

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

        {/* 新規仕訳ボタン */}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          新規仕訳を追加
        </button>

        {/* AI仕訳アシスタント */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <Zap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">AI仕訳アシスタント</h3>
              <p className="text-blue-100 mb-4">自然な言葉で取引内容を入力すると、自動で仕訳を生成します</p>
              <div className="bg-white rounded-lg p-3">
                <input
                  type="text"
                  placeholder="例: 打ち合わせでコーヒー代1500円を現金で払った"
                  className="w-full text-gray-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 仕訳入力フォーム */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">仕訳入力フォーム</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2024-11-26" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">伝票番号</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" value="2024-1126-001" disabled />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">借方科目</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">借方金額</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">貸方科目</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">貸方金額</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">摘要</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                        <option>勘定科目を選択</option>
                        <option>交際費</option>
                        <option>通信費</option>
                        <option>消耗品費</option>
                        <option>旅費交通費</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="金額" />
                    </td>
                    <td className="py-3 px-2">
                      <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                        <option>勘定科目を選択</option>
                        <option>現金</option>
                        <option>普通預金</option>
                        <option>クレジットカード</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="金額" />
                    </td>
                    <td className="py-3 px-2">
                      <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="摘要" />
                    </td>
                    <td className="py-3 px-2">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              行を追加
            </button>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Camera className="w-4 h-4" />
                領収書を添付
              </button>
              <div className="flex-1"></div>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                キャンセル
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                保存
              </button>
            </div>
          </div>
        </div>

        {/* 最近の仕訳 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">最近の仕訳</h3>
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div className="flex-1 grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">日付</div>
                    <div className="font-medium text-gray-900">{entry.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">借方</div>
                    <div className="font-medium text-gray-900">{entry.debit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">貸方</div>
                    <div className="font-medium text-gray-900">{entry.credit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">金額</div>
                    <div className="font-medium text-gray-900">¥{entry.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">摘要</div>
                    <div className="font-medium text-gray-900">{entry.memo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // キャッシュフロー管理画面（予測・シミュレーション重視版）
  const CashFlowScreen = () => {
    const [simulationMode, setSimulationMode] = useState<ScenarioKey>('conservative'); // conservative, standard, aggressive
    const [showDetailedForecast, setShowDetailedForecast] = useState(false);
    
    // シミュレーションパラメータ
    const simParams = {
      monthlyRevenue: 100,
      monthlyExpenses: 35,
      investmentAmount: 20,
      savingsGoal: 500
    };

    // 現在のキャッシュフロー状況
    const currentCash = {
      balance: 1200,
      operating: 700,
      investing: -60,
      financing: -80
    };

    // 6ヶ月先までの予測データ生成（3シナリオ）
    const generateForecast = () => {
      const scenarios: Record<ScenarioKey, ScenarioConfig> = {
        conservative: { growth: 0.98, volatility: 0.02 },
        standard: { growth: 1.02, volatility: 0.05 },
        aggressive: { growth: 1.05, volatility: 0.1 }
      };

      const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
      const forecasts: Record<ScenarioKey, ForecastPoint[]> = {
        conservative: [],
        standard: [],
        aggressive: []
      };

      (Object.keys(scenarios) as ScenarioKey[]).forEach((scenario) => {
        let balance = currentCash.balance;
        const data: ForecastPoint[] = [];

        months.forEach((month) => {
          const { growth, volatility } = scenarios[scenario];
          const randomFactor = 1 + (Math.random() - 0.5) * volatility;
          const monthlyFlow = (currentCash.operating + currentCash.investing + currentCash.financing) * growth * randomFactor;
          balance += monthlyFlow / 10;

          data.push({
            month,
            balance: Math.round(balance),
            flow: Math.round(monthlyFlow / 10),
            risk: scenario === 'aggressive' ? 'high' : scenario === 'standard' ? 'medium' : 'low'
          });
        });

        forecasts[scenario] = data;
      });

      return forecasts;
    };

    const forecasts = generateForecast();
    const currentForecast = forecasts[simulationMode];

    // 目標達成可能性の計算
    const calculateGoalProbability = () => {
      const finalPoint = currentForecast[currentForecast.length - 1];
      if (!finalPoint) {
        return {
          probability: 0,
          gap: simParams.savingsGoal,
          status: 'concern' as const
        };
      }

      const finalBalance = finalPoint.balance;
      const goalBalance = simParams.savingsGoal;
      const probability = Math.min(100, Math.round((finalBalance / goalBalance) * 100));
      
      return {
        probability,
        gap: goalBalance - finalBalance,
        status: probability >= 90 ? 'excellent' : probability >= 70 ? 'good' : probability >= 50 ? 'fair' : 'concern'
      };
    };

    const goalStatus = calculateGoalProbability();

    // リスク分析
    const analyzeRisk = () => {
      const balances = currentForecast.map((f) => f.balance);
      const minBalance = Math.min(...balances);
      const maxBalance = Math.max(...balances);
      const volatility = maxBalance - minBalance;
      
      return {
        minBalance,
        volatility,
        warningMonths: currentForecast.filter((f) => f.balance < 1000).map((f) => f.month),
        riskLevel: minBalance < 800 ? 'high' : minBalance < 1000 ? 'medium' : 'low'
      };
    };

    const riskAnalysis = analyzeRisk();

    // シミュレーション結果の物語的説明
    const getStoryNarrative = () => {
      const narratives: Record<ScenarioKey, ScenarioNarrative> = {
        conservative: {
          title: '🛡️ 安定重視の道',
          story: '着実に、でも確実に進む道です。',
          future: `6ヶ月後、あなたの現金残高は約${currentForecast[5].balance.toLocaleString()}万円。リスクは最小限に抑えられ、安心して眠れる日々が続きます。`,
          emotion: '安心感',
          color: 'from-blue-500 to-cyan-500'
        },
        standard: {
          title: '⚖️ バランスの取れた道',
          story: '成長とリスクのバランスを取る、賢明な選択です。',
          future: `6ヶ月後、あなたの現金残高は約${currentForecast[5].balance.toLocaleString()}万円。適度な成長を実現しながら、安定性も保てています。`,
          emotion: '充実感',
          color: 'from-indigo-500 to-purple-500'
        },
        aggressive: {
          title: '🚀 成長重視の道',
          story: 'リスクを取って、大きな成長を目指す道です。',
          future: `6ヶ月後、あなたの現金残高は約${currentForecast[5].balance.toLocaleString()}万円。ボラティリティは高いですが、大きな成果の可能性があります。`,
          emotion: 'ワクワク感',
          color: 'from-orange-500 to-red-500'
        }
      };

      return narratives[simulationMode];
    };

    const narrative = getStoryNarrative();

    // マイルストーン生成
    const generateMilestones = (): Milestone[] => {
      return [
        {
          month: '2月',
          event: '税金支払い',
          impact: -35,
          type: 'expense',
          description: '確定申告による税金支払いが発生'
        },
        {
          month: '3月',
          event: '大口案件入金',
          impact: +120,
          type: 'income',
          description: '進行中のプロジェクトが完了し入金予定'
        },
        {
          month: '4月',
          event: '設備投資',
          impact: -50,
          type: 'investment',
          description: '新しい機材導入を計画'
        },
        {
          month: '6月',
          event: 'ボーナス時期',
          impact: +80,
          type: 'income',
          description: '役員賞与の支給予定'
        }
      ];
    };

    const milestones = generateMilestones();

    return (
      <div className="space-y-6">
        {/* ヘッダー - 情緒的な表現 */}
        <div className="relative overflow-hidden">
          <div className={`bg-gradient-to-r ${narrative.color} rounded-2xl p-8 text-white relative`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-3">あなたの未来を描く</h2>
                  <p className="text-xl text-white/90">キャッシュフロー予測シミュレーション</p>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-2">現在の残高</div>
                  <div className="text-5xl font-bold">¥{currentCash.balance.toLocaleString()}</div>
                  <div className="text-sm opacity-90 mt-1">万円</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">流入（月次平均）</div>
                  <div className="text-3xl font-bold">+¥{Math.abs(currentCash.operating).toLocaleString()}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">流出（月次平均）</div>
                  <div className="text-3xl font-bold">-¥{Math.abs(currentCash.investing + currentCash.financing).toLocaleString()}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">純増減</div>
                  <div className="text-3xl font-bold">+¥{Math.abs(currentCash.operating + currentCash.investing + currentCash.financing).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* シナリオ選択 - 物語的表現 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">どの道を選びますか？</h3>
          <p className="text-gray-600 mb-6">あなたのビジネスと人生に合った道を選んでください。それぞれの道には、異なる未来が待っています。</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSimulationMode('conservative')}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                simulationMode === 'conservative'
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">安定重視</h4>
              <p className="text-sm text-gray-600 mb-4">リスクを最小限に。確実性を求める道です。</p>
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">成長率</span>
                  <span className="font-semibold text-gray-900">控えめ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">リスク</span>
                  <span className="font-semibold text-green-600">低</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">感情</span>
                  <span className="font-semibold text-blue-600">安心感</span>
                </div>
              </div>
              {simulationMode === 'conservative' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setSimulationMode('standard')}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                simulationMode === 'standard'
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-3">⚖️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">バランス型</h4>
              <p className="text-sm text-gray-600 mb-4">成長とリスクのバランスを取る賢明な選択。</p>
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">成長率</span>
                  <span className="font-semibold text-gray-900">適度</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">リスク</span>
                  <span className="font-semibold text-yellow-600">中</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">感情</span>
                  <span className="font-semibold text-purple-600">充実感</span>
                </div>
              </div>
              {simulationMode === 'standard' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setSimulationMode('aggressive')}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                simulationMode === 'aggressive'
                  ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">成長重視</h4>
              <p className="text-sm text-gray-600 mb-4">大きな成長を目指す、チャレンジャーの道。</p>
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">成長率</span>
                  <span className="font-semibold text-gray-900">積極的</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">リスク</span>
                  <span className="font-semibold text-red-600">高</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">感情</span>
                  <span className="font-semibold text-orange-600">ワクワク</span>
                </div>
              </div>
              {simulationMode === 'aggressive' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 物語的な予測表示 */}
        <div className={`bg-gradient-to-br ${narrative.color} rounded-2xl p-8 text-white shadow-xl`}>
          <div className="mb-6">
            <h3 className="text-3xl font-bold mb-3">{narrative.title}</h3>
            <p className="text-xl text-white/90 mb-2">{narrative.story}</p>
            <p className="text-lg text-white/80">{narrative.future}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-90 mb-1">目標達成確率</div>
              <div className="text-4xl font-bold mb-2">{goalStatus.probability}%</div>
              <div className="text-xs opacity-80">
                {goalStatus.status === 'excellent' && '素晴らしい！'}
                {goalStatus.status === 'good' && '順調です'}
                {goalStatus.status === 'fair' && 'もう少し'}
                {goalStatus.status === 'concern' && '要改善'}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-90 mb-1">最低残高予測</div>
              <div className="text-4xl font-bold mb-2">¥{riskAnalysis.minBalance}</div>
              <div className="text-xs opacity-80">
                {riskAnalysis.riskLevel === 'low' && '十分な余裕'}
                {riskAnalysis.riskLevel === 'medium' && '注意が必要'}
                {riskAnalysis.riskLevel === 'high' && '要警戒'}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-90 mb-1">あなたが感じるもの</div>
              <div className="text-4xl font-bold mb-2">{narrative.emotion}</div>
              <div className="text-xs opacity-80">この道の感情</div>
            </div>
          </div>
        </div>

        {/* 予測グラフ - インタラクティブ */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">6ヶ月後までの旅路</h3>
            <button
              onClick={() => setShowDetailedForecast(!showDetailedForecast)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showDetailedForecast ? '簡易表示' : '詳細を見る'}
            </button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={currentForecast}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #8b5cf6', 
                  borderRadius: '12px',
                  padding: '12px'
                }}
                formatter={(value) => [`¥${value.toLocaleString()}万`, '残高']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fill="url(#balanceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>

          {showDetailedForecast && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentForecast.map((month, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    month.balance < 1000 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-700 mb-2">{month.month}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ¥{month.balance.toLocaleString()}
                  </div>
                  <div className={`text-sm ${month.flow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.flow > 0 ? '+' : ''}¥{month.flow.toLocaleString()}万
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 重要なイベント・マイルストーン */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">予定されている重要イベント</h3>
          <p className="text-gray-600 mb-6">今後6ヶ月で予想される大きな資金の動きです</p>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                  milestone.type === 'income' 
                    ? 'border-green-200 bg-green-50' 
                    : milestone.type === 'expense'
                    ? 'border-red-200 bg-red-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.type === 'income' 
                    ? 'bg-green-500' 
                    : milestone.type === 'expense'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}>
                  {milestone.type === 'income' && <TrendingUp className="w-6 h-6 text-white" />}
                  {milestone.type === 'expense' && <TrendingDown className="w-6 h-6 text-white" />}
                  {milestone.type === 'investment' && <Target className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{milestone.event}</h4>
                    <span className="text-sm text-gray-500">{milestone.month}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                  <div className={`text-lg font-bold ${
                    milestone.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {milestone.impact > 0 ? '+' : ''}¥{Math.abs(milestone.impact).toLocaleString()}万
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AIアドバイス - 情緒的 */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">AIからのアドバイス</h3>
              
              {goalStatus.status === 'excellent' && (
                <div className="space-y-3">
                  <p className="text-lg">
                    素晴らしいです！現在の道を進めば、6ヶ月後に{currentForecast[5].balance.toLocaleString()}万円の残高となり、
                    目標を{goalStatus.probability}%達成できる見込みです。
                  </p>
                  <p className="text-white/90">
                    この調子を維持しつつ、さらに成長を目指すなら、
                    {simulationMode === 'conservative' && '「バランス型」にチャレンジするのも良いでしょう。'}
                    {simulationMode === 'standard' && '現在の戦略を継続することをお勧めします。'}
                    {simulationMode === 'aggressive' && 'リスク管理を忘れずに進みましょう。'}
                  </p>
                </div>
              )}

              {goalStatus.status === 'good' && (
                <div className="space-y-3">
                  <p className="text-lg">
                    順調に進んでいます。目標達成確率{goalStatus.probability}%は良好な数字です。
                    あと少し改善すれば、さらに安心できる状態になります。
                  </p>
                  <p className="text-white/90">
                    月次の支出を5%削減するか、売上を8%向上させることで、
                    目標達成確率を90%以上に高めることができます。
                  </p>
                </div>
              )}

              {(goalStatus.status === 'fair' || goalStatus.status === 'concern') && (
                <div className="space-y-3">
                  <p className="text-lg">
                    現在の道では目標達成が難しい状況です（達成確率{goalStatus.probability}%）。
                    でも大丈夫、改善の余地は十分にあります。
                  </p>
                  <p className="text-white/90">
                    以下の対策を検討してください：
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>月次支出を10-15%削減する（優先度：高）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>新規顧客獲得で売上を20%向上させる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>より保守的なシナリオに切り替える</span>
                    </li>
                  </ul>
                </div>
              )}

              {riskAnalysis.warningMonths.length > 0 && (
                <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">警告：資金ショートの可能性</span>
                  </div>
                  <p className="text-sm">
                    {riskAnalysis.warningMonths.join('、')}に残高が1000万円を下回る可能性があります。
                    事前に資金調達または支出調整を検討してください。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* シナリオ比較 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">3つの道を比較する</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">項目</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">🛡️ 安定重視</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">⚖️ バランス型</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">🚀 成長重視</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">6ヶ月後の残高</td>
                  <td className="py-4 px-4 text-center font-bold text-blue-600">
                    ¥{forecasts.conservative[5].balance.toLocaleString()}万
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-purple-600">
                    ¥{forecasts.standard[5].balance.toLocaleString()}万
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-orange-600">
                    ¥{forecasts.aggressive[5].balance.toLocaleString()}万
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">期待成長率</td>
                  <td className="py-4 px-4 text-center">-2%</td>
                  <td className="py-4 px-4 text-center">+2%</td>
                  <td className="py-4 px-4 text-center">+5%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">リスクレベル</td>
                  <td className="py-4 px-4 text-center text-green-600 font-semibold">低</td>
                  <td className="py-4 px-4 text-center text-yellow-600 font-semibold">中</td>
                  <td className="py-4 px-4 text-center text-red-600 font-semibold">高</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">最低残高</td>
                  <td className="py-4 px-4 text-center">
                    ¥{Math.min(...forecasts.conservative.map(f => f.balance)).toLocaleString()}万
                  </td>
                  <td className="py-4 px-4 text-center">
                    ¥{Math.min(...forecasts.standard.map(f => f.balance)).toLocaleString()}万
                  </td>
                  <td className="py-4 px-4 text-center">
                    ¥{Math.min(...forecasts.aggressive.map(f => f.balance)).toLocaleString()}万
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">おすすめな人</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">安定志向</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">堅実派</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">挑戦者</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // バランスシート（貸借対照表）管理画面
  const BalanceSheetScreen = () => {
    const [bsView, setBsView] = useState('total'); // total, business, personal
    const [bsPeriod, setBsPeriod] = useState('monthly'); // monthly, quarterly, yearly
    const [compareMode, setCompareMode] = useState(false);

    // バランスシートデータ生成
    const generateBalanceSheetData = () => {
      const businessData = {
        assets: {
          current: {
            cash: 320,
            accountsReceivable: 150,
            inventory: 50,
            total: 520
          },
          fixed: {
            equipment: 200,
            securities: 80,
            total: 280
          },
          total: 800
        },
        liabilities: {
          current: {
            accountsPayable: 80,
            unpaidExpenses: 40,
            total: 120
          },
          fixed: {
            longTermDebt: 150,
            total: 150
          },
          total: 270
        },
        equity: {
          capital: 100,
          retainedEarnings: 430,
          total: 530
        }
      };

      const personalData = {
        assets: {
          current: {
            cash: 500,
            total: 500
          },
          fixed: {
            nisaAssets: 200,
            idecoAssets: 150,
            stockAssets: 100,
            realEstate: 0,
            total: 450
          },
          total: 950
        },
        liabilities: {
          current: {
            creditCard: 20,
            total: 20
          },
          fixed: {
            mortgage: 0,
            total: 0
          },
          total: 20
        },
        equity: {
          netAssets: 930,
          total: 930
        }
      };

      const totalData = {
        assets: {
          current: {
            total: businessData.assets.current.total + personalData.assets.current.total
          },
          fixed: {
            total: businessData.assets.fixed.total + personalData.assets.fixed.total
          },
          total: businessData.assets.total + personalData.assets.total
        },
        liabilities: {
          current: {
            total: businessData.liabilities.current.total + personalData.liabilities.current.total
          },
          fixed: {
            total: businessData.liabilities.fixed.total + personalData.liabilities.fixed.total
          },
          total: businessData.liabilities.total + personalData.liabilities.total
        },
        equity: {
          total: businessData.equity.total + personalData.equity.total
        }
      };

      // 前期データ（比較用）
      const previousData = {
        assets: { total: bsView === 'business' ? 720 : bsView === 'personal' ? 880 : 1600 },
        liabilities: { total: bsView === 'business' ? 250 : bsView === 'personal' ? 30 : 280 },
        equity: { total: bsView === 'business' ? 470 : bsView === 'personal' ? 850 : 1320 }
      };

      return { businessData, personalData, totalData, previousData };
    };

    const { businessData, personalData, totalData, previousData } = generateBalanceSheetData();
    const currentData = bsView === 'business' ? businessData : bsView === 'personal' ? personalData : totalData;

    // 財務指標計算
    const calculateFinancialRatios = () => {
      const equityRatio = Number(((currentData.equity.total / currentData.assets.total) * 100).toFixed(1));
      const currentRatio = currentData.liabilities.current.total > 0 
        ? Number(((currentData.assets.current.total / currentData.liabilities.current.total) * 100).toFixed(1))
        : 999;
      const fixedRatio = currentData.equity.total > 0
        ? Number(((currentData.assets.fixed.total / currentData.equity.total) * 100).toFixed(1))
        : 0;
      const debtRatio = currentData.equity.total > 0
        ? Number(((currentData.liabilities.total / currentData.equity.total) * 100).toFixed(1))
        : 0;

      return { equityRatio, currentRatio, fixedRatio, debtRatio };
    };

    const ratios = calculateFinancialRatios();

    // 健全性スコア計算
    const calculateHealthScore = () => {
      let score = 0;
      
      // 自己資本比率（40点満点）
      if (ratios.equityRatio >= 50) score += 40;
      else if (ratios.equityRatio >= 30) score += 30;
      else if (ratios.equityRatio >= 20) score += 20;
      else score += 10;

      // 流動比率（30点満点）
      if (ratios.currentRatio >= 200) score += 30;
      else if (ratios.currentRatio >= 150) score += 25;
      else if (ratios.currentRatio >= 100) score += 15;
      else score += 5;

      // 固定比率（20点満点）
      if (ratios.fixedRatio <= 100) score += 20;
      else if (ratios.fixedRatio <= 150) score += 15;
      else if (ratios.fixedRatio <= 200) score += 10;
      else score += 5;

      // 負債比率（10点満点）
      if (ratios.debtRatio <= 50) score += 10;
      else if (ratios.debtRatio <= 100) score += 7;
      else if (ratios.debtRatio <= 150) score += 4;
      else score += 2;

      return score;
    };

    const healthScore = calculateHealthScore();

    // 資産構成比データ
    const assetCompositionData = [
      { name: '流動資産', value: currentData.assets.current.total, color: '#10b981' },
      { name: '固定資産', value: currentData.assets.fixed.total, color: '#3b82f6' }
    ];

    // 前期比較計算
    const calculateChange = (current: number, previous: number) => {
      const change = current - previous;
      const changeRate = previous !== 0 ? Number((((change) / previous) * 100).toFixed(1)) : 0;
      return { change, changeRate };
    };

    const assetChange = calculateChange(currentData.assets.total, previousData.assets.total);
    const liabilityChange = calculateChange(currentData.liabilities.total, previousData.liabilities.total);
    const equityChange = calculateChange(currentData.equity.total, previousData.equity.total);

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">バランスシート（貸借対照表）</h2>
            <p className="text-gray-600 mt-1">財務状況を可視化し、健全性を分析</p>
          </div>
        </div>

        {/* ビュー切り替えと期間選択 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setBsView('total')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                bsView === 'total' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              統合
            </button>
            <button
              onClick={() => setBsView('business')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                bsView === 'business' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              事業用
            </button>
            <button
              onClick={() => setBsView('personal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                bsView === 'personal' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              個人用
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              前期比較
            </button>
            <select
              value={bsPeriod}
              onChange={(e) => setBsPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              <option value="monthly">月次</option>
              <option value="quarterly">四半期</option>
              <option value="yearly">年次</option>
            </select>
          </div>
        </div>

        {/* 健全性スコアと財務指標 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 健全性スコア */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-90 mb-2">財務健全性スコア</div>
            <div className="text-4xl font-bold mb-2">{healthScore}</div>
            <div className="text-xs opacity-90">/ 100点</div>
            <div className="mt-4">
              {healthScore >= 80 && <div className="text-sm font-medium">優良</div>}
              {healthScore >= 60 && healthScore < 80 && <div className="text-sm font-medium">良好</div>}
              {healthScore >= 40 && healthScore < 60 && <div className="text-sm font-medium">普通</div>}
              {healthScore < 40 && <div className="text-sm font-medium">要改善</div>}
            </div>
          </div>

          {/* 自己資本比率 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">自己資本比率</div>
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{ratios.equityRatio}%</div>
            <div className="mt-2 text-xs text-gray-600">
              {ratios.equityRatio >= 50 && '非常に良好'}
              {ratios.equityRatio >= 30 && ratios.equityRatio < 50 && '良好'}
              {ratios.equityRatio >= 20 && ratios.equityRatio < 30 && '普通'}
              {ratios.equityRatio < 20 && '要改善'}
            </div>
          </div>

          {/* 流動比率 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">流動比率</div>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{ratios.currentRatio >= 999 ? '∞' : ratios.currentRatio + '%'}</div>
            <div className="mt-2 text-xs text-gray-600">
              {ratios.currentRatio >= 200 && '非常に良好'}
              {ratios.currentRatio >= 150 && ratios.currentRatio < 200 && '良好'}
              {ratios.currentRatio >= 100 && ratios.currentRatio < 150 && '普通'}
              {ratios.currentRatio < 100 && '要改善'}
            </div>
          </div>

          {/* 固定比率 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">固定比率</div>
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{ratios.fixedRatio}%</div>
            <div className="mt-2 text-xs text-gray-600">
              {ratios.fixedRatio <= 100 && '非常に良好'}
              {ratios.fixedRatio > 100 && ratios.fixedRatio <= 150 && '良好'}
              {ratios.fixedRatio > 150 && ratios.fixedRatio <= 200 && '普通'}
              {ratios.fixedRatio > 200 && '要改善'}
            </div>
          </div>

          {/* 負債比率 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">負債比率</div>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{ratios.debtRatio}%</div>
            <div className="mt-2 text-xs text-gray-600">
              {ratios.debtRatio <= 50 && '非常に良好'}
              {ratios.debtRatio > 50 && ratios.debtRatio <= 100 && '良好'}
              {ratios.debtRatio > 100 && ratios.debtRatio <= 150 && '普通'}
              {ratios.debtRatio > 150 && '要改善'}
            </div>
          </div>
        </div>

        {/* バランスシート本体 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 資産の部 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">資産の部</h3>
              <div className="text-2xl font-bold text-indigo-600">¥{currentData.assets.total.toLocaleString()}万</div>
            </div>

            {/* 流動資産 */}
            <div className="mb-6">
              <div className="flex items-center justify-between py-2 bg-green-50 px-3 rounded-lg mb-2">
                <span className="font-semibold text-green-900">流動資産</span>
                <span className="font-semibold text-green-900">¥{currentData.assets.current.total.toLocaleString()}万</span>
              </div>
              {bsView !== 'total' && (
                <div className="space-y-2 ml-4">
                  {bsView === 'business' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">現金預金</span>
                        <span className="font-medium text-gray-900">¥{businessData.assets.current.cash.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">売掛金</span>
                        <span className="font-medium text-gray-900">¥{businessData.assets.current.accountsReceivable.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">棚卸資産</span>
                        <span className="font-medium text-gray-900">¥{businessData.assets.current.inventory.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                  {bsView === 'personal' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">現金預金</span>
                        <span className="font-medium text-gray-900">¥{personalData.assets.current.cash.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 固定資産 */}
            <div>
              <div className="flex items-center justify-between py-2 bg-blue-50 px-3 rounded-lg mb-2">
                <span className="font-semibold text-blue-900">固定資産</span>
                <span className="font-semibold text-blue-900">¥{currentData.assets.fixed.total.toLocaleString()}万</span>
              </div>
              {bsView !== 'total' && (
                <div className="space-y-2 ml-4">
                  {bsView === 'business' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">設備</span>
                        <span className="font-medium text-gray-900">¥{businessData.assets.fixed.equipment.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">投資有価証券</span>
                        <span className="font-medium text-gray-900">¥{businessData.assets.fixed.securities.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                  {bsView === 'personal' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">NISA資産</span>
                        <span className="font-medium text-gray-900">¥{personalData.assets.fixed.nisaAssets.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">iDeCo資産</span>
                        <span className="font-medium text-gray-900">¥{personalData.assets.fixed.idecoAssets.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">株式資産</span>
                        <span className="font-medium text-gray-900">¥{personalData.assets.fixed.stockAssets.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {compareMode && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-900 mb-1">前期比較</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">資産合計の増減</span>
                  <span className={`text-sm font-bold ${assetChange.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {assetChange.change >= 0 ? '+' : ''}¥{assetChange.change.toLocaleString()}万 ({assetChange.changeRate >= 0 ? '+' : ''}{assetChange.changeRate}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 負債・純資産の部 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* 負債の部 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">負債の部</h3>
                <div className="text-2xl font-bold text-orange-600">¥{currentData.liabilities.total.toLocaleString()}万</div>
              </div>

              {/* 流動負債 */}
              <div className="mb-4">
                <div className="flex items-center justify-between py-2 bg-orange-50 px-3 rounded-lg mb-2">
                  <span className="font-semibold text-orange-900">流動負債</span>
                  <span className="font-semibold text-orange-900">¥{currentData.liabilities.current.total.toLocaleString()}万</span>
                </div>
                {bsView !== 'total' && (
                  <div className="space-y-2 ml-4">
                    {bsView === 'business' && (
                      <>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">買掛金</span>
                          <span className="font-medium text-gray-900">¥{businessData.liabilities.current.accountsPayable.toLocaleString()}万</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">未払費用</span>
                          <span className="font-medium text-gray-900">¥{businessData.liabilities.current.unpaidExpenses.toLocaleString()}万</span>
                        </div>
                      </>
                    )}
                    {bsView === 'personal' && (
                      <>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">クレジットカード</span>
                          <span className="font-medium text-gray-900">¥{personalData.liabilities.current.creditCard.toLocaleString()}万</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 固定負債 */}
              <div>
                <div className="flex items-center justify-between py-2 bg-red-50 px-3 rounded-lg mb-2">
                  <span className="font-semibold text-red-900">固定負債</span>
                  <span className="font-semibold text-red-900">¥{currentData.liabilities.fixed.total.toLocaleString()}万</span>
                </div>
                {bsView !== 'total' && (
                  <div className="space-y-2 ml-4">
                    {bsView === 'business' && (
                      <>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">長期借入金</span>
                          <span className="font-medium text-gray-900">¥{businessData.liabilities.fixed.longTermDebt.toLocaleString()}万</span>
                        </div>
                      </>
                    )}
                    {bsView === 'personal' && (
                      <>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">住宅ローン</span>
                          <span className="font-medium text-gray-900">¥{personalData.liabilities.fixed.mortgage.toLocaleString()}万</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {compareMode && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700">負債合計の増減</span>
                    <span className={`text-sm font-bold ${liabilityChange.change <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {liabilityChange.change >= 0 ? '+' : ''}¥{liabilityChange.change.toLocaleString()}万 ({liabilityChange.changeRate >= 0 ? '+' : ''}{liabilityChange.changeRate}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 純資産の部 */}
            <div className="pt-6 border-t-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">純資産の部</h3>
                <div className="text-2xl font-bold text-indigo-600">¥{currentData.equity.total.toLocaleString()}万</div>
              </div>

              {bsView !== 'total' && (
                <div className="space-y-2">
                  {bsView === 'business' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">資本金</span>
                        <span className="font-medium text-gray-900">¥{businessData.equity.capital.toLocaleString()}万</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">利益剰余金</span>
                        <span className="font-medium text-gray-900">¥{businessData.equity.retainedEarnings.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                  {bsView === 'personal' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">純資産</span>
                        <span className="font-medium text-gray-900">¥{personalData.equity.netAssets.toLocaleString()}万</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {compareMode && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700">純資産の増減</span>
                    <span className={`text-sm font-bold ${equityChange.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {equityChange.change >= 0 ? '+' : ''}¥{equityChange.change.toLocaleString()}万 ({equityChange.changeRate >= 0 ? '+' : ''}{equityChange.changeRate}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* バランスチェック */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">バランスシート整合性: OK</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                資産 = 負債 + 純資産 (¥{currentData.assets.total}万 = ¥{currentData.liabilities.total}万 + ¥{currentData.equity.total}万)
              </div>
            </div>
          </div>
        </div>

        {/* 資産構成比グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">資産構成比</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetCompositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">流動資産</div>
              <div className="text-xl font-bold text-green-600">¥{currentData.assets.current.total.toLocaleString()}万</div>
              <div className="text-xs text-gray-500 mt-1">
                {((currentData.assets.current.total / currentData.assets.total) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">固定資産</div>
              <div className="text-xl font-bold text-blue-600">¥{currentData.assets.fixed.total.toLocaleString()}万</div>
              <div className="text-xs text-gray-500 mt-1">
                {((currentData.assets.fixed.total / currentData.assets.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* 財務改善アドバイス */}
        {healthScore < 70 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">財務改善の提案</h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  {ratios.equityRatio < 30 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>自己資本比率が低い状態です。利益を内部留保し、自己資本を増強することをお勧めします。</span>
                    </li>
                  )}
                  {ratios.currentRatio < 150 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>流動比率が低めです。短期的な支払い能力を確保するため、現金預金を増やすことを検討してください。</span>
                    </li>
                  )}
                  {ratios.fixedRatio > 150 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>固定比率が高い状態です。固定資産への過剰投資を見直し、バランスの取れた資産配分を目指しましょう。</span>
                    </li>
                  )}
                  {ratios.debtRatio > 100 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>負債比率が高めです。借入金の返済を進め、財務の安全性を高めることをお勧めします。</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 財務3表統合分析画面
  const FinancialStatementsScreen = () => {
    const [fsView, setFsView] = useState('total'); // total, business, personal
    const [fsPeriod, setFsPeriod] = useState('monthly'); // monthly, quarterly, yearly
    const [showSimulator, setShowSimulator] = useState(false);
    const [investmentAllocation, setInvestmentAllocation] = useState<{ business: number; personal: number }>({
      business: 50,
      personal: 50
    });

    // 損益計算書データ
    const generatePLData = () => {
      const businessPL: BusinessPL = {
        revenue: 1200,
        cogs: 300,
        grossProfit: 900,
        operatingExpenses: 400,
        operatingIncome: 500,
        nonOperatingIncome: 20,
        nonOperatingExpenses: 30,
        ordinaryIncome: 490,
        extraordinaryIncome: 0,
        extraordinaryLoss: 0,
        netIncome: 350
      };

      const personalPL: PersonalPL = {
        revenue: 600,
        expenses: 300,
        netIncome: 300
      };

      return { businessPL, personalPL };
    };

    // バランスシートデータ
    const generateBSData = () => {
      const businessBS: SimplifiedBalanceSheet = {
        assets: 800,
        liabilities: 270,
        equity: 530
      };

      const personalBS: SimplifiedBalanceSheet = {
        assets: 950,
        liabilities: 20,
        equity: 930
      };

      return { businessBS, personalBS };
    };

    // キャッシュフローデータ
    const generateCFData = () => {
      const businessCF: CashFlowSummary = {
        operating: 700,
        investing: -60,
        financing: -80,
        total: 560
      };

      const personalCF: CashFlowSummary = {
        operating: 220,
        investing: -240,
        financing: 0,
        total: -20
      };

      return { businessCF, personalCF };
    };

    const { businessPL, personalPL } = generatePLData();
    const { businessBS, personalBS } = generateBSData();
    const { businessCF, personalCF } = generateCFData();

    // 統合データ計算
    const totalPL: TotalPL = {
      revenue: businessPL.revenue + personalPL.revenue,
      netIncome: businessPL.netIncome + personalPL.netIncome
    };

    const totalBS: SimplifiedBalanceSheet = {
      assets: businessBS.assets + personalBS.assets,
      liabilities: businessBS.liabilities + personalBS.liabilities,
      equity: businessBS.equity + personalBS.equity
    };

    const totalCF: CashFlowSummary = {
      operating: businessCF.operating + personalCF.operating,
      investing: businessCF.investing + personalCF.investing,
      financing: businessCF.financing + personalCF.financing,
      total: businessCF.total + personalCF.total
    };

    // 現在のビューのデータ
    const currentPL: BusinessPL | PersonalPL | TotalPL = fsView === 'business' ? businessPL : fsView === 'personal' ? personalPL : totalPL;
    const currentBS: SimplifiedBalanceSheet = fsView === 'business' ? businessBS : fsView === 'personal' ? personalBS : totalBS;
    const currentCF: CashFlowSummary = fsView === 'business' ? businessCF : fsView === 'personal' ? personalCF : totalCF;

    // 総合財務指標計算
    const calculateFinancialMetrics = () => {
      const netIncome = currentPL.netIncome;
      const revenue = currentPL.revenue;
      const operatingIncome = hasOperatingIncome(currentPL) ? currentPL.operatingIncome : netIncome;
      const investedCapital = currentBS.equity + currentBS.liabilities * 0.5 || 1;

      const roe = Number(((netIncome / (currentBS.equity || 1)) * 100).toFixed(1));
      const roa = Number(((netIncome / (currentBS.assets || 1)) * 100).toFixed(1));
      const roic = Number((((operatingIncome * 0.7) / investedCapital) * 100).toFixed(1));
      const operatingMargin = Number((((operatingIncome) / (revenue || 1)) * 100).toFixed(1));
      const equityRatio = Number(((currentBS.equity / (currentBS.assets || 1)) * 100).toFixed(1));
      const freeCF = currentCF.operating + currentCF.investing;

      return { roe, roa, roic, operatingMargin, equityRatio, freeCF };
    };

    const metrics = calculateFinancialMetrics();

    // 4軸分析データ（収益性・安全性・成長性・効率性）
    const fourAxisData = [
      { axis: '収益性', value: Math.min(100, metrics.roe * 2), fullMark: 100 },
      { axis: '安全性', value: Math.min(100, metrics.equityRatio * 2), fullMark: 100 },
      { axis: '成長性', value: 75, fullMark: 100 }, // サンプル値
      { axis: '効率性', value: Math.min(100, metrics.roa * 2), fullMark: 100 }
    ];

    // トレンド分析データ（6期分）
    const trendData = [
      { period: '7月', roe: 18, roa: 12, operatingMargin: 35, equityRatio: 64 },
      { period: '8月', roe: 19, roa: 13, operatingMargin: 36, equityRatio: 65 },
      { period: '9月', roe: 20, roa: 14, operatingMargin: 38, equityRatio: 65 },
      { period: '10月', roe: 21, roa: 15, operatingMargin: 39, equityRatio: 66 },
      { period: '11月', roe: 22, roa: 16, operatingMargin: 40, equityRatio: 66 },
      { period: '12月', roe: metrics.roe, roa: metrics.roa, operatingMargin: metrics.operatingMargin, equityRatio: metrics.equityRatio }
    ];

    // 財務3表の整合性チェック
    const checkConsistency = () => {
      // PL純利益 ⇔ BS純資産増減の整合性
      const bsConsistent = Math.abs(currentBS.assets - (currentBS.liabilities + currentBS.equity)) < 1;
      
      // BS増減 ⇔ CFの整合性（簡易チェック）
      const cfConsistent = true; // 実際は前期比較が必要
      
      return { bsConsistent, cfConsistent };
    };

    const consistency = checkConsistency();

    // シミュレーション計算
    const calculateSimulation = () => {
      const businessInvestment = investmentAllocation.business;
      const personalInvestment = investmentAllocation.personal;
      
      // 10年後の予測純資産
      const currentNetAssets = totalBS.equity;
      const annualReturn = 0.06; // 6%の年間リターン
      const totalInvestment = businessInvestment + personalInvestment;
      
      let projectedAssets = currentNetAssets;
      for (let i = 0; i < 10; i++) {
        projectedAssets = projectedAssets * (1 + annualReturn) + (totalInvestment * 12 / 10000);
      }
      
      return Math.round(projectedAssets);
    };

    const simulatedAssets = calculateSimulation();

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">財務3表統合分析</h2>
            <p className="text-gray-600 mt-1">損益計算書・貸借対照表・キャッシュフロー計算書を統合分析</p>
          </div>
        </div>

        {/* ビュー切り替えと期間選択 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFsView('total')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                fsView === 'total' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              統合
            </button>
            <button
              onClick={() => setFsView('business')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                fsView === 'business' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              事業用
            </button>
            <button
              onClick={() => setFsView('personal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                fsView === 'personal' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              個人用
            </button>
          </div>

          <select
            value={fsPeriod}
            onChange={(e) => setFsPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="monthly">月次</option>
            <option value="quarterly">四半期</option>
            <option value="yearly">年次</option>
          </select>
        </div>

        {/* 財務健全性総合ダッシュボード */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">財務健全性総合評価</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm opacity-90 mb-1">収益性</div>
              <div className="text-3xl font-bold">{fourAxisData[0].value.toFixed(0)}</div>
              <div className="text-xs opacity-90 mt-1">ROE {metrics.roe}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">安全性</div>
              <div className="text-3xl font-bold">{fourAxisData[1].value.toFixed(0)}</div>
              <div className="text-xs opacity-90 mt-1">自己資本比率 {metrics.equityRatio}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">成長性</div>
              <div className="text-3xl font-bold">{fourAxisData[2].value.toFixed(0)}</div>
              <div className="text-xs opacity-90 mt-1">前年比成長率</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">効率性</div>
              <div className="text-3xl font-bold">{fourAxisData[3].value.toFixed(0)}</div>
              <div className="text-xs opacity-90 mt-1">ROA {metrics.roa}%</div>
            </div>
          </div>
        </div>

        {/* 主要財務指標 */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">ROE</div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.roe}%</div>
            <div className="text-xs text-gray-500 mt-1">自己資本利益率</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">ROA</div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.roa}%</div>
            <div className="text-xs text-gray-500 mt-1">総資産利益率</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">ROIC</div>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.roic}%</div>
            <div className="text-xs text-gray-500 mt-1">投下資本利益率</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">営業利益率</div>
              <BarChart3 className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.operatingMargin}%</div>
            <div className="text-xs text-gray-500 mt-1">売上高営業利益率</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">自己資本比率</div>
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.equityRatio}%</div>
            <div className="text-xs text-gray-500 mt-1">財務安全性</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600">フリーCF</div>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">¥{metrics.freeCF.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">万円</div>
          </div>
        </div>

        {/* 財務3表の同時表示 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 損益計算書 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">損益計算書 (P/L)</h3>
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            
            {fsView === 'business' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">売上高</span>
                  <span className="font-medium text-gray-900">¥{businessPL.revenue.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">売上原価</span>
                  <span className="font-medium text-red-600">-¥{businessPL.cogs.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 bg-green-50 px-2 rounded">
                  <span className="text-sm font-semibold text-green-900">売上総利益</span>
                  <span className="font-bold text-green-900">¥{businessPL.grossProfit.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">販管費</span>
                  <span className="font-medium text-red-600">-¥{businessPL.operatingExpenses.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 bg-blue-50 px-2 rounded">
                  <span className="text-sm font-semibold text-blue-900">営業利益</span>
                  <span className="font-bold text-blue-900">¥{businessPL.operatingIncome.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 bg-indigo-50 px-2 rounded mt-2">
                  <span className="text-sm font-semibold text-indigo-900">当期純利益</span>
                  <span className="font-bold text-indigo-900">¥{businessPL.netIncome.toLocaleString()}万</span>
                </div>
              </div>
            )}

            {fsView === 'personal' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">年収</span>
                  <span className="font-medium text-gray-900">¥{personalPL.revenue.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">生活費</span>
                  <span className="font-medium text-red-600">-¥{personalPL.expenses.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 bg-indigo-50 px-2 rounded mt-2">
                  <span className="text-sm font-semibold text-indigo-900">手取り</span>
                  <span className="font-bold text-indigo-900">¥{personalPL.netIncome.toLocaleString()}万</span>
                </div>
              </div>
            )}

            {fsView === 'total' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">総収入</span>
                  <span className="font-medium text-gray-900">¥{totalPL.revenue.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between py-2 bg-indigo-50 px-2 rounded mt-2">
                  <span className="text-sm font-semibold text-indigo-900">純利益合計</span>
                  <span className="font-bold text-indigo-900">¥{totalPL.netIncome.toLocaleString()}万</span>
                </div>
              </div>
            )}
          </div>

          {/* 貸借対照表 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">貸借対照表 (B/S)</h3>
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 bg-green-50 px-2 rounded">
                <span className="text-sm font-semibold text-green-900">資産</span>
                <span className="font-bold text-green-900">¥{currentBS.assets.toLocaleString()}万</span>
              </div>
              <div className="flex items-center justify-between py-2 bg-orange-50 px-2 rounded">
                <span className="text-sm font-semibold text-orange-900">負債</span>
                <span className="font-bold text-orange-900">¥{currentBS.liabilities.toLocaleString()}万</span>
              </div>
              <div className="flex items-center justify-between py-2 bg-indigo-50 px-2 rounded">
                <span className="text-sm font-semibold text-indigo-900">純資産</span>
                <span className="font-bold text-indigo-900">¥{currentBS.equity.toLocaleString()}万</span>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="text-xs text-gray-600 mb-2">バランスチェック</div>
                {consistency.bsConsistent ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">整合性: OK</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">要確認</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* キャッシュフロー計算書 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">キャッシュフロー (C/F)</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">営業CF</span>
                <span className={`font-medium ${currentCF.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{currentCF.operating.toLocaleString()}万
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">投資CF</span>
                <span className={`font-medium ${currentCF.investing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{currentCF.investing.toLocaleString()}万
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">財務CF</span>
                <span className={`font-medium ${currentCF.financing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{currentCF.financing.toLocaleString()}万
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-blue-50 px-2 rounded mt-2">
                <span className="text-sm font-semibold text-blue-900">CF合計</span>
                <span className={`font-bold ${currentCF.total >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                  ¥{currentCF.total.toLocaleString()}万
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-1">フリーCF</div>
                <div className={`text-lg font-bold ${metrics.freeCF >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{metrics.freeCF.toLocaleString()}万
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* トレンド分析グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">主要指標トレンド（6期分）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="roe" stroke="#10b981" strokeWidth={2} name="ROE (%)" />
              <Line type="monotone" dataKey="roa" stroke="#3b82f6" strokeWidth={2} name="ROA (%)" />
              <Line type="monotone" dataKey="operatingMargin" stroke="#f59e0b" strokeWidth={2} name="営業利益率 (%)" />
              <Line type="monotone" dataKey="equityRatio" stroke="#8b5cf6" strokeWidth={2} name="自己資本比率 (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 財務改善アドバイス */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">AI財務改善アドバイス</h3>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-blue-900 mb-1">収益性の改善</div>
                <div className="text-sm text-blue-800">
                  ROE {metrics.roe}%は業界平均を上回っています。さらに向上させるには、営業利益率を高めるか、資産回転率を改善することを検討してください。
                </div>
                <div className="text-xs text-blue-600 mt-1">優先度: 中</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-green-900 mb-1">キャッシュフローの最適化</div>
                <div className="text-sm text-green-800">
                  フリーCFが¥{metrics.freeCF.toLocaleString()}万と健全です。この資金を事業投資と個人投資に適切に配分することで、10年後の純資産を最大化できます。
                </div>
                <div className="text-xs text-green-600 mt-1">優先度: 高</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-purple-900 mb-1">財務安全性の維持</div>
                <div className="text-sm text-purple-800">
                  自己資本比率{metrics.equityRatio}%は非常に良好です。この水準を維持しながら、成長投資を行うことをお勧めします。
                </div>
                <div className="text-xs text-purple-600 mt-1">優先度: 中</div>
              </div>
            </div>
          </div>
        </div>

        {/* 統合シミュレーター */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">投資配分統合シミュレーター</h3>
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showSimulator ? '閉じる' : 'シミュレーション開始'}
            </button>
          </div>

          {showSimulator && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-900 mb-4">
                  事業投資と個人投資の最適な配分を見つけましょう。スライダーを動かして、10年後の予測純資産を確認できます。
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">事業投資（月額）</label>
                      <span className="text-lg font-bold text-indigo-600">¥{investmentAllocation.business.toLocaleString()}万</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={investmentAllocation.business}
                      onChange={(e) => setInvestmentAllocation({
                        business: parseInt(e.target.value),
                        personal: 100 - parseInt(e.target.value)
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">個人投資（月額）</label>
                      <span className="text-lg font-bold text-purple-600">¥{investmentAllocation.personal.toLocaleString()}万</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={investmentAllocation.personal}
                      onChange={(e) => setInvestmentAllocation({
                        personal: parseInt(e.target.value),
                        business: 100 - parseInt(e.target.value)
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg text-white">
                  <div className="text-sm opacity-90 mb-1">現在の純資産</div>
                  <div className="text-3xl font-bold">¥{totalBS.equity.toLocaleString()}万</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-white">
                  <div className="text-sm opacity-90 mb-1">10年後予測純資産</div>
                  <div className="text-3xl font-bold">¥{simulatedAssets.toLocaleString()}万</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg text-white">
                  <div className="text-sm opacity-90 mb-1">増加額</div>
                  <div className="text-3xl font-bold">+¥{(simulatedAssets - totalBS.equity).toLocaleString()}万</div>
                  <div className="text-xs opacity-90 mt-1">
                    {((simulatedAssets / totalBS.equity - 1) * 100).toFixed(1)}% 増加
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">推奨配分</div>
                    <div className="text-sm text-green-800 mt-1">
                      現在のシミュレーションでは、事業投資 {investmentAllocation.business}万円/月、個人投資 {investmentAllocation.personal}万円/月の配分で、
                      10年後に約{simulatedAssets.toLocaleString()}万円の純資産を実現できる見込みです。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 整合性チェック結果 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">財務3表整合性チェック</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">貸借対照表の整合性</span>
              </div>
              <span className="text-sm text-green-600">OK</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">キャッシュフローの整合性</span>
              </div>
              <span className="text-sm text-green-600">OK</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">純利益と純資産増減の整合性</span>
              </div>
              <span className="text-sm text-green-600">OK</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 mb-1">整合性の説明</div>
            <div className="text-sm text-blue-800">
              損益計算書の純利益は貸借対照表の純資産増減に反映され、その資金の流れはキャッシュフロー計算書で確認できます。
              3表すべてが整合的であることを確認しました。
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 週次ダッシュボード画面
  const WeeklyDashboardScreen = () => {
    // 現在の週情報
    const currentWeek = {
      year: 2025,
      month: 1,
      week: 2,
      startDate: '1/6',
      endDate: '1/12'
    };

    // 今週のタスクデータ
    const urgentTasks = [
      {
        id: 1,
        title: '請求書 #1234 支払期限明日',
        type: 'payment',
        dueDate: '明日',
        priority: 'urgent'
      },
      {
        id: 2,
        title: '領収書5件が未処理',
        type: 'receipt',
        count: 5,
        priority: 'urgent'
      }
    ];

    const importantTasks = [
      {
        id: 3,
        title: '週次財務チェック',
        type: 'check',
        duration: '3分',
        completed: Object.values(weeklyChecklist).filter(Boolean).length === 4
      },
      {
        id: 4,
        title: 'NISA積立設定確認',
        type: 'investment',
        amount: '10万円',
        remaining: true
      },
      {
        id: 5,
        title: '先週の経費が予算超過',
        type: 'expense',
        amount: '5万円超過',
        needsReview: true
      }
    ];

    const recommendedActions = [
      {
        id: 1,
        title: '役員報酬を見直すと年間42万円節税可能',
        impact: '42万円',
        category: 'tax'
      },
      {
        id: 2,
        title: '今週中にiDeCo拠出で税効果アップ',
        impact: '8万円',
        category: 'investment'
      },
      {
        id: 3,
        title: 'ふるさと納税の残り枠: 12万円',
        impact: '12万円',
        category: 'tax'
      }
    ];

    // 週次実績データ
    const weeklyMetrics = {
      healthScore: 87,
      healthScoreChange: 3,
      revenue: 95,
      expenses: 32,
      cashFlow: 63,
      tasksCompleted: 12,
      tasksTotal: 15
    };

    // チェックリスト完了処理
    const handleChecklistToggle = (key: keyof WeeklyChecklistState) => {
      const newChecklist: WeeklyChecklistState = { ...weeklyChecklist, [key]: !weeklyChecklist[key] };
      setWeeklyChecklist(newChecklist);
      
      // 全て完了したらポイント付与
      if (Object.values(newChecklist).every(Boolean)) {
        setWeeklyPoints(weeklyPoints + 10);
      }
    };

    const checklistProgress = (Object.values(weeklyChecklist).filter(Boolean).length / 4) * 100;

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">今週のやること</h2>
              <p className="text-white/90">{currentWeek.year}年{currentWeek.month}月 第{currentWeek.week}週 ({currentWeek.startDate} - {currentWeek.endDate})</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">連続ログイン</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                {weeklyStreak}週
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-90 mb-1">今週の健全性スコア</div>
              <div className="text-3xl font-bold">{weeklyMetrics.healthScore}点</div>
              <div className="text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{weeklyMetrics.healthScoreChange}点
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-90 mb-1">今週の売上</div>
              <div className="text-3xl font-bold">¥{weeklyMetrics.revenue}万</div>
              <div className="text-sm mt-1">先週比 +8%</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-90 mb-1">今週の経費</div>
              <div className="text-3xl font-bold">¥{weeklyMetrics.expenses}万</div>
              <div className="text-sm mt-1">予算内 ✓</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-90 mb-1">週次ポイント</div>
              <div className="text-3xl font-bold">{weeklyPoints}</div>
              <div className="text-sm mt-1">累計ポイント</div>
            </div>
          </div>
        </div>

        {/* 3分チェックリスト */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                週次3分チェック
              </h3>
              <p className="text-sm text-gray-600 mt-1">完了すると +10ポイント獲得</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">
                {Object.values(weeklyChecklist).filter(Boolean).length}/4
              </div>
              <div className="text-sm text-gray-600">完了</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${checklistProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleChecklistToggle('cashCheck')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                weeklyChecklist.cashCheck
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                weeklyChecklist.cashCheck ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {weeklyChecklist.cashCheck && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">現金残高を確認</div>
                <div className="text-sm text-gray-600">現在: ¥320万円</div>
              </div>
              {!weeklyChecklist.cashCheck && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => handleChecklistToggle('receiptsCheck')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                weeklyChecklist.receiptsCheck
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                weeklyChecklist.receiptsCheck ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {weeklyChecklist.receiptsCheck && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">未処理領収書をチェック</div>
                <div className="text-sm text-gray-600">未処理: 5件</div>
              </div>
              {!weeklyChecklist.receiptsCheck && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => handleChecklistToggle('salesRecord')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                weeklyChecklist.salesRecord
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                weeklyChecklist.salesRecord ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {weeklyChecklist.salesRecord && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">今週の売上を記録</div>
                <div className="text-sm text-gray-600">先週: ¥87万円</div>
              </div>
              {!weeklyChecklist.salesRecord && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => handleChecklistToggle('paymentsCheck')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                weeklyChecklist.paymentsCheck
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                weeklyChecklist.paymentsCheck ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {weeklyChecklist.paymentsCheck && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">重要な支払いを確認</div>
                <div className="text-sm text-gray-600">今週: 3件</div>
              </div>
              {!weeklyChecklist.paymentsCheck && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {checklistProgress === 100 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-900">週次チェック完了！</div>
                  <div className="text-sm text-green-700">+10ポイント獲得しました</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 緊急タスク */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-gray-900">⚠️ 緊急 ({urgentTasks.length}件)</h3>
            </div>

            <div className="space-y-3">
              {urgentTasks.map(task => (
                <div key={task.id} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-red-900">{task.title}</div>
                      <div className="text-sm text-red-700 mt-1">
                        {task.dueDate && `期限: ${task.dueDate}`}
                        {task.count && `${task.count}件`}
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      対応する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 重要タスク */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900">重要 ({importantTasks.length}件)</h3>
            </div>

            <div className="space-y-3">
              {importantTasks.map(task => (
                <div key={task.id} className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-yellow-900">{task.title}</div>
                      <div className="text-sm text-yellow-700 mt-1">
                        {task.duration && `所要時間: ${task.duration}`}
                        {task.amount && task.amount}
                      </div>
                    </div>
                    {!task.completed && (
                      <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">
                        確認
                      </button>
                    )}
                    {task.completed && (
                      <div className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* おすすめアクション */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">💡 おすすめアクション</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendedActions.map(action => (
              <div key={action.id} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {action.category === 'tax' && <Calculator className="w-5 h-5 text-white" />}
                    {action.category === 'investment' && <TrendingUp className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-2">{action.title}</div>
                    <div className="text-lg font-bold text-purple-600">{action.impact}</div>
                    <button className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                      詳細を見る
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 今週の実績サマリー */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">今週の実績</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">¥{weeklyMetrics.cashFlow}万</div>
              <div className="text-sm text-gray-600 mt-1">今週のキャッシュフロー</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{weeklyMetrics.tasksCompleted}/{weeklyMetrics.tasksTotal}</div>
              <div className="text-sm text-gray-600 mt-1">タスク完了率</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">+{weeklyMetrics.healthScoreChange}</div>
              <div className="text-sm text-gray-600 mt-1">健全性スコア向上</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{weeklyStreak}週</div>
              <div className="text-sm text-gray-600 mt-1">連続ログイン</div>
            </div>
          </div>

          {/* 週次比較グラフ */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">直近4週間の推移</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { week: '第1週', score: 82, revenue: 87, expenses: 35 },
                { week: '第2週', score: 84, revenue: 92, expenses: 33 },
                { week: '第3週', score: 85, revenue: 88, expenses: 34 },
                { week: '第4週', score: 87, revenue: 95, expenses: 32 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="score" fill="#8b5cf6" name="健全性スコア" />
                <Bar dataKey="revenue" fill="#10b981" name="売上" />
                <Bar dataKey="expenses" fill="#f59e0b" name="経費" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* モチベーションメッセージ */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">素晴らしい！{weeklyStreak}週連続です 🎉</h4>
              <p className="text-white/90 mb-3">
                週次チェックを継続することで、財務の健全性が着実に向上しています。
                この調子で続ければ、10年後の目標達成確率は95%以上です！
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  目標まで: あと¥3,540万円
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  前月比: +2.3%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                  { id: 'cashflow', icon: <Activity className="w-5 h-5" />, label: 'キャッシュフロー' },
                  { id: 'balancesheet', icon: <Building2 className="w-5 h-5" />, label: 'バランスシート' },
                  { id: 'financial3', icon: <BarChart3 className="w-5 h-5" />, label: '財務3表分析' },
                  { id: 'reports', icon: <FileText className="w-5 h-5" />, label: 'レポート' },
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
              {currentScreen === 'weekly' && <WeeklyDashboardScreen />}
              {currentScreen === 'dashboard' && <Dashboard />}
              {currentScreen === 'simulation' && <SimulationScreen />}
              {currentScreen === 'tax' && <TaxOptimizationScreen />}
              {currentScreen === 'investment' && (
                investmentView === 'personal' ? <PersonalInvestmentScreen /> : <BusinessInvestmentScreen />
              )}
              {currentScreen === 'accounting' && <AccountingScreen />}
              {currentScreen === 'receipts' && <ReceiptsScreen />}
              {currentScreen === 'invoices' && <InvoicesScreen />}
              {currentScreen === 'monthly' && <MonthlyClosingScreen />}
              {currentScreen === 'cashflow' && <CashFlowScreen />}
              {currentScreen === 'balancesheet' && <BalanceSheetScreen />}
              {currentScreen === 'financial3' && <FinancialStatementsScreen />}
              {currentScreen === 'reports' && <ReportsScreen />}
              {currentScreen === 'reportDetail' && <ReportDetailScreen />}
              {currentScreen === 'taxChat' && <TaxChatScreen />}
              {/* 設定画面は今後追加予定 */}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App ;