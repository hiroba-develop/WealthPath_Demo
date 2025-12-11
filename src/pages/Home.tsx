import { useState } from "react";
import { Link } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Calculator,
  ChevronRight,
  Star,
  AlertCircle,
  DollarSign,
  Receipt,
  Activity,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Award,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  value?: string;
}

interface MonthlyTask {
  id: string;
  task: string;
  amount: string | null;
  priority: "high" | "medium" | "low";
  status: "pending" | "inProgress" | "completed";
}

const Home = () => {
  const [dashboardView, setDashboardView] = useState("total"); // total, business, personal

  // 週次チェックリスト状態
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "現金残高を確認",
      description: "現在: ¥320万円",
      completed: false,
      value: "¥320万円",
    },
    {
      id: "2",
      title: "未処理領収書をチェック",
      description: "未処理: 3件",
      completed: false,
      value: "3件",
    },
    {
      id: "3",
      title: "今週の売上を記録",
      description: "先週: ¥95万円",
      completed: false,
      value: "¥95万円",
    },
    {
      id: "4",
      title: "重要な支払いを確認",
      description: "今週: 2件",
      completed: false,
      value: "2件",
    },
  ]);

  // 今月のやることリスト状態
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTask[]>([
    {
      id: "1",
      task: "NISA投資枠の消化",
      amount: "5万円",
      priority: "high",
      status: "pending",
    },
    {
      id: "2",
      task: "経費精算（通信費）",
      amount: "1.2万円",
      priority: "high",
      status: "pending",
    },
    {
      id: "3",
      task: "請求書発行（3件）",
      amount: "45万円",
      priority: "medium",
      status: "inProgress",
    },
    {
      id: "4",
      task: "月次決算レビュー",
      amount: null,
      priority: "low",
      status: "completed",
    },
  ]);

  const [weeklyStreak] = useState(12);
  const [weeklyPoints, setWeeklyPoints] = useState(240);

  // 現在の週情報
  const currentWeek = {
    year: 2025,
    month: 12,
    week: 2,
    startDate: "12/9",
    endDate: "12/15",
  };

  // 週次健全性スコア
  const weeklyMetrics = {
    healthScore: 87,
    healthScoreChange: 3,
    revenue: 95,
    expenses: 32,
    tasksCompleted: 9,
    tasksTotal: 12,
  };

  // チェックリスト完了処理
  const handleChecklistToggle = (id: string) => {
    const newChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(newChecklist);

    // 全て完了したらポイント付与
    if (newChecklist.every((item) => item.completed)) {
      setWeeklyPoints(weeklyPoints + 10);
    }
  };

  // 今月のタスク完了処理
  const handleMonthlyTaskToggle = (id: string) => {
    setMonthlyTasks(
      monthlyTasks.map((task) => {
        if (task.id === id) {
          // ステータスをサイクル: pending → inProgress → completed → pending
          let newStatus: MonthlyTask["status"];
          if (task.status === "pending") {
            newStatus = "inProgress";
          } else if (task.status === "inProgress") {
            newStatus = "completed";
          } else {
            newStatus = "pending";
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const checklistProgress =
    (checklist.filter((item) => item.completed).length / checklist.length) *
    100;

  // 緊急タスク
  const urgentTasks = [
    {
      id: 1,
      title: "請求書 #1234 支払期限明日",
      type: "payment",
      dueDate: "明日",
      priority: "urgent",
    },
    {
      id: 2,
      title: "領収書3件が未処理",
      type: "receipt",
      count: 3,
      priority: "urgent",
    },
  ];

  // 重要タスク
  const importantTasks = [
    {
      id: 3,
      title: "週次財務チェック",
      type: "check",
      duration: "3分",
      completed: checklist.every((item) => item.completed),
    },
    {
      id: 4,
      title: "NISA積立設定確認",
      type: "investment",
      amount: "10万円",
      remaining: true,
    },
  ];

  // おすすめアクション
  const recommendedActions = [
    {
      id: 1,
      title: "役員報酬を見直すと年間42万円節税可能",
      impact: "42万円",
      category: "tax",
    },
    {
      id: 2,
      title: "今週中にiDeCo拠出で税効果アップ",
      impact: "8万円",
      category: "investment",
    },
    {
      id: 3,
      title: "ふるさと納税の残り枠: 12万円",
      impact: "12万円",
      category: "tax",
    },
  ];

  // ユーザーデータ
  const userData = {
    business: {
      cashBalance: 320,
      annualRevenue: 1200,
      expenses: 400,
    },
    personal: {
      savings: 500,
      investments: {
        nisa: 200,
        ideco: 150,
        stocks: 100,
        other: 80,
      },
    },
    targetAsset: 5000,
    age: 35,
  };

  const totalAssets =
    userData.business.cashBalance +
    userData.personal.savings +
    userData.personal.investments.nisa +
    userData.personal.investments.ideco +
    userData.personal.investments.stocks +
    userData.personal.investments.other;

  // 10年後シミュレーション計算
  const calculateSimulation = () => {
    const returnRate = 5;
    const monthlyInvestment = 5;
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
        target: userData.targetAsset,
      });
    }

    const finalAssets = years[10].assets;
    const gap = userData.targetAsset - finalAssets;
    const probability = Math.min(
      100,
      Math.round((finalAssets / userData.targetAsset) * 100)
    );

    return {
      years,
      finalAssets,
      gap,
      probability,
    };
  };

  const simulation = calculateSimulation();

  // 月次収支データ
  const monthlyData = [
    { month: "7月", income: 100, expense: 35, profit: 65 },
    { month: "8月", income: 120, expense: 40, profit: 80 },
    { month: "9月", income: 110, expense: 38, profit: 72 },
    { month: "10月", income: 130, expense: 42, profit: 88 },
    { month: "11月", income: 125, expense: 41, profit: 84 },
  ];

  // 資産配分データ
  const assetAllocation = [
    {
      name: "事業用現金",
      value: userData.business.cashBalance,
      color: "#3b82f6",
    },
    {
      name: "個人預貯金",
      value: userData.personal.savings,
      color: "#10b981",
    },
    { name: "NISA", value: userData.personal.investments.nisa, color: "#f59e0b" },
    {
      name: "iDeCo",
      value: userData.personal.investments.ideco,
      color: "#ef4444",
    },
    {
      name: "個別株",
      value: userData.personal.investments.stocks,
      color: "#8b5cf6",
    },
    {
      name: "その他",
      value: userData.personal.investments.other,
      color: "#6b7280",
    },
  ];

  return (
    <div className="space-y-6">
      

      {/* ビュー切り替えタブ */}
      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
        {[
          { id: "total", label: "総合ビュー" },
          { id: "business", label: "事業用" },
          { id: "personal", label: "個人用" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setDashboardView(view.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              dashboardView === view.id
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
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
          <div className="text-5xl font-bold">
            {totalAssets.toLocaleString()}万円
          </div>
          <div className="text-2xl opacity-90 mb-2">
            目標: {userData.targetAsset.toLocaleString()}万円
          </div>
        </div>
      </div>

      {/* 10年後予測サマリーカード */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">10年後の予測</h3>
          <Link
            to="/simulation"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            詳細を見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-1">
              {simulation.finalAssets.toLocaleString()}万円
            </div>
            <div className="text-sm text-gray-600">
              標準シナリオ（年率5%）
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(simulation.probability / 20)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              目標達成確率: {simulation.probability}%
            </div>
          </div>
        </div>
      </div>

      {/* サマリーカード（ビュー別） */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dashboardView === "total" &&
          [
            {
              icon: <Wallet className="w-6 h-6" />,
              label: "総資産",
              value: `${totalAssets.toLocaleString()}万円`,
              change: "+8.2%",
              color: "indigo",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "月次利益",
              value: "84万円",
              change: "+12.3%",
              color: "green",
            },
            {
              icon: <PiggyBank className="w-6 h-6" />,
              label: "投資資産",
              value: `${(
                userData.personal.investments.nisa +
                userData.personal.investments.ideco +
                userData.personal.investments.stocks +
                userData.personal.investments.other
              ).toLocaleString()}万円`,
              change: "+15.7%",
              color: "orange",
            },
            {
              icon: <Calculator className="w-6 h-6" />,
              label: "節税効果",
              value: "48万円/年",
              change: "NEW",
              color: "purple",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    card.change.includes("+")
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}

        {dashboardView === "business" &&
          [
            {
              icon: <DollarSign className="w-6 h-6" />,
              label: "月次売上",
              value: "125万円",
              change: "+5.2%",
              color: "blue",
            },
            {
              icon: <Receipt className="w-6 h-6" />,
              label: "月次経費",
              value: "41万円",
              change: "-2.1%",
              color: "red",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "月次利益",
              value: "84万円",
              change: "+12.3%",
              color: "green",
            },
            {
              icon: <Wallet className="w-6 h-6" />,
              label: "現金残高",
              value: `${userData.business.cashBalance.toLocaleString()}万円`,
              change: "+8.5%",
              color: "indigo",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    card.change.includes("+")
                      ? "bg-green-100 text-green-700"
                      : card.change.includes("-")
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}

        {dashboardView === "personal" &&
          [
            {
              icon: <DollarSign className="w-6 h-6" />,
              label: "月次収入",
              value: "50万円",
              change: "±0%",
              color: "blue",
            },
            {
              icon: <Receipt className="w-6 h-6" />,
              label: "月次支出",
              value: "25万円",
              change: "+3.2%",
              color: "red",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              label: "貯蓄率",
              value: "50%",
              change: "-3.2%",
              color: "green",
            },
            {
              icon: <PiggyBank className="w-6 h-6" />,
              label: "純資産",
              value: `${(
                userData.personal.savings +
                userData.personal.investments.nisa +
                userData.personal.investments.ideco +
                userData.personal.investments.stocks +
                userData.personal.investments.other
              ).toLocaleString()}万円`,
              change: "+15.7%",
              color: "indigo",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    card.change.includes("+")
                      ? "bg-green-100 text-green-700"
                      : card.change.includes("-")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
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
              <Area
                type="monotone"
                dataKey="assets"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
                name="予測資産"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                fill="none"
                strokeDasharray="5 5"
                name="目標"
              />
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
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
              <div
                key={idx}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value.toLocaleString()}万円
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 今月のやることリスト */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            今月のやることリスト
          </h3>
          <div className="space-y-3">
            {monthlyTasks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMonthlyTaskToggle(item.id)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "inProgress"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="text-left">
                    <div
                      className={`font-medium ${
                        item.status === "completed"
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {item.task}
                    </div>
                    {item.amount && (
                      <div className="text-sm text-gray-600">{item.amount}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : item.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.priority === "high"
                      ? "高"
                      : item.priority === "medium"
                      ? "中"
                      : "低"}
                  </span>
                  {item.status === "completed" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              💡 タスクをクリックして進捗を更新：未着手 → 進行中 → 完了
            </div>
          </div>
        </div>

        {/* 最適化ポイント */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            最適化ポイント
          </h3>
          <div className="space-y-4">
            {[
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: "役員報酬の最適化",
                desc: "年間48万円の節税効果",
                action: "詳細を見る",
                color: "green",
                screen: "/tax-optimization",
              },
              {
                icon: <PiggyBank className="w-5 h-5" />,
                title: "iDeCo増額",
                desc: "月2万円で年10万円の節税",
                action: "設定する",
                color: "blue",
                screen: "/asset-management",
              },
              {
                icon: <AlertCircle className="w-5 h-5" />,
                title: "固定費の見直し",
                desc: "通信費を3社比較で削減可能",
                action: "確認する",
                color: "orange",
                screen: "/asset-management",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 border-${item.color}-500 bg-${item.color}-50`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-${item.color}-600 mt-1`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                    <Link
                      to={item.screen}
                      className={`text-sm text-${item.color}-600 hover:text-${item.color}-800 font-medium flex items-center gap-1`}
                    >
                      {item.action} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 週次の落とし込み */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              週次目標（{currentWeek.month}月 第{currentWeek.week}週）
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentWeek.startDate} - {currentWeek.endDate}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">タスク完了率</div>
            <div className="text-2xl font-bold text-green-600">
              {weeklyMetrics.tasksCompleted}/{weeklyMetrics.tasksTotal}
            </div>
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
            <p className="text-sm text-gray-600 mt-1">
              完了すると +10ポイント獲得
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {checklist.filter((item) => item.completed).length}/{checklist.length}
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
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChecklistToggle(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                item.completed
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.completed
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {item.completed && (
                  <CheckCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              {!item.completed && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}
        </div>
        {checklistProgress === 100 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-green-900">
                  週次チェック完了！
                </div>
                <div className="text-sm text-green-700">
                  +10ポイント獲得しました
                </div>
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
            <h3 className="text-lg font-bold text-gray-900">
              ⚠️ 緊急 ({urgentTasks.length}件)
            </h3>
          </div>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
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
            <h3 className="text-lg font-bold text-gray-900">
              重要 ({importantTasks.length}件)
            </h3>
          </div>
          <div className="space-y-3">
            {importantTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-yellow-900">
                      {task.title}
                    </div>
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
          {recommendedActions.map((action) => (
            <div
              key={action.id}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {action.category === "tax" && (
                    <Calculator className="w-5 h-5 text-white" />
                  )}
                  {action.category === "investment" && (
                    <TrendingUp className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {action.title}
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {action.impact}
                  </div>
                  <button className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                    詳細を見る
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* モチベーションメッセージ */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">
              素晴らしい！{weeklyStreak}週連続です 🎉
            </h4>
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

      {/* 税理士連携CTA */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">
              税理士に相談してみませんか？
            </h3>
            <p className="text-purple-100">
              チャットで気軽に質問できます。月次決算のサポートも万全です。
            </p>
          </div>
          <Link
            to="/tax-accountant-chat"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            チャットを開始
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

