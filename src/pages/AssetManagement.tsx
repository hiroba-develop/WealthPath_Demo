import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Building2,
  PiggyBank,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AssetManagement = () => {
  const [viewMode, setViewMode] = useState<"integrated" | "personal" | "business">(
    "integrated"
  );
  const [showDevelopmentPlan, setShowDevelopmentPlan] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedServices, setEditedServices] = useState<any[]>([]);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    developmentCost: 0,
    monthlyRevenue: 0,
    currentCustomers: 0,
    targetCustomers: 0,
    pricePerCustomer: 0,
    developmentPeriod: "",
    launchDate: "",
    customerGrowthRate: "",
  });

  // ユーザーデータ
  const userData = {
    business: {
      cashBalance: 320,
      accountsReceivable: 150,
      investments: 80,
      equipment: 200,
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
  };

  // 個人投資データ
  const totalInvestment =
    userData.personal.investments.nisa +
    userData.personal.investments.ideco +
    userData.personal.investments.stocks +
    userData.personal.investments.other;
  const totalReturn = totalInvestment * 0.15;


  // サービス開発投資計画データ
  // サービス開発投資データ（投資とリターンにフォーカス）
  const [developmentServices, setDevelopmentServices] = useState([
    {
      id: 1,
      name: "会計自動化SaaS",
      status: "運用中",
      developmentCost: 250, // 万円
      monthlyRevenue: 85, // 月額売上（万円）
      currentCustomers: 45,
      targetCustomers: 100,
      pricePerCustomer: 1.89, // 万円/月/顧客
      developmentPeriod: "6ヶ月",
      launchDate: "2024年4月",
      annualRevenue: 85 * 12,
      roi: ((85 * 12 - 250) / 250) * 100,
      paybackPeriod: (250 / 85).toFixed(1), // ヶ月
      customerGrowthRate: "月8人増加",
    },
    {
      id: 2,
      name: "請求書管理システム",
      status: "開発中",
      developmentCost: 180,
      monthlyRevenue: 42,
      currentCustomers: 28,
      targetCustomers: 80,
      pricePerCustomer: 1.5,
      developmentPeriod: "4ヶ月",
      launchDate: "2024年6月",
      annualRevenue: 42 * 12,
      roi: ((42 * 12 - 180) / 180) * 100,
      paybackPeriod: (180 / 42).toFixed(1),
      customerGrowthRate: "月6人増加",
    },
    {
      id: 3,
      name: "経費精算アプリ",
      status: "計画中",
      developmentCost: 120,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 60,
      pricePerCustomer: 0.98,
      developmentPeriod: "3ヶ月",
      launchDate: "2025年2月（予定）",
      annualRevenue: 0,
      roi: 0,
      paybackPeriod: "未算出",
      customerGrowthRate: "目標: 月5人",
    },
  ]);

  // 編集機能のハンドラー
  const handleEditMode = () => {
    setEditedServices(JSON.parse(JSON.stringify(developmentServices)));
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setDevelopmentServices(editedServices);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedServices([]);
    setIsEditMode(false);
  };

  const updateService = (serviceId: number, field: string, value: any) => {
    setEditedServices((prev) =>
      prev.map((service) => {
        if (service.id === serviceId) {
          const updated = { ...service, [field]: value };
          // 自動計算
          if (field === 'monthlyRevenue' || field === 'developmentCost') {
            updated.annualRevenue = updated.monthlyRevenue * 12;
            updated.roi = updated.developmentCost > 0 
              ? ((updated.annualRevenue - updated.developmentCost) / updated.developmentCost) * 100 
              : 0;
            updated.paybackPeriod = updated.monthlyRevenue > 0 
              ? (updated.developmentCost / updated.monthlyRevenue).toFixed(1) 
              : "未算出";
          }
          return updated;
        }
        return service;
      })
    );
  };

  const deleteService = (serviceId: number) => {
    if (confirm("このサービスを削除してもよろしいですか？")) {
      setEditedServices((prev) => prev.filter((service) => service.id !== serviceId));
    }
  };

  const addNewService = () => {
    setShowAddServiceForm(true);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const handleAddService = () => {
    if (!newService.name.trim()) {
      alert("サービス名を入力してください");
      return;
    }

    const newId = Math.max(...developmentServices.map(s => s.id), 0) + 1;
    const annualRevenue = newService.monthlyRevenue * 12;
    const roi = newService.developmentCost > 0 
      ? ((annualRevenue - newService.developmentCost) / newService.developmentCost) * 100 
      : 0;
    const paybackPeriod = newService.monthlyRevenue > 0 
      ? (newService.developmentCost / newService.monthlyRevenue).toFixed(1) 
      : "未算出";

    const serviceToAdd = {
      id: newId,
      name: newService.name,
      status: "計画中",
      developmentCost: newService.developmentCost,
      monthlyRevenue: newService.monthlyRevenue,
      currentCustomers: newService.currentCustomers,
      targetCustomers: newService.targetCustomers,
      pricePerCustomer: newService.pricePerCustomer,
      developmentPeriod: newService.developmentPeriod || "未定",
      launchDate: newService.launchDate || "未定",
      annualRevenue: annualRevenue,
      roi: roi,
      paybackPeriod: paybackPeriod,
      customerGrowthRate: newService.customerGrowthRate || "未定",
    };

    setDevelopmentServices([...developmentServices, serviceToAdd]);
    setShowAddServiceForm(false);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const handleCancelAddService = () => {
    setShowAddServiceForm(false);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const currentServices = isEditMode && editedServices.length > 0 ? editedServices : developmentServices;

  // サービス開発投資の集計（運用中・開発中のみ）
  const activeServices = developmentServices.filter(s => s.status === "運用中" || s.status === "開発中");
  const totalDevelopmentCost = activeServices.reduce((sum, s) => sum + s.developmentCost, 0);
  const totalMonthlyRevenue = activeServices.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const totalAnnualRevenue = totalMonthlyRevenue * 12;
  const developmentROI = totalDevelopmentCost > 0 
    ? ((totalAnnualRevenue - totalDevelopmentCost) / totalDevelopmentCost) * 100 
    : 0;
  const totalCustomers = activeServices.reduce((sum, s) => sum + s.currentCustomers, 0);

  // 事業投資データ（サービス開発を動的に計算）
  const businessInvestments = [
    {
      name: "サービス開発",
      amount: totalDevelopmentCost,
      roi: developmentROI,
      ratio: 0, // 後で計算
      color: "blue",
      details: activeServices.length > 0 
        ? activeServices.map(s => `${s.name}: ${s.developmentCost}万円`)
        : ["サービスなし"],
      expectedRevenue: `月${totalMonthlyRevenue}万円`,
      serviceCount: activeServices.length,
      customers: `${totalCustomers}社`,
    },
    {
      name: "販促",
      amount: 150,
      roi: 244.4,
      ratio: 0,
      color: "green",
      details: [
        "広告費: 100万円 (66.7%)",
        "コンテンツ制作: 30万円 (20.0%)",
        "SNS運用: 20万円 (13.3%)",
      ],
      customers: "新規48件獲得",
    },
    {
      name: "人件費",
      amount: 765,
      roi: 145.0,
      ratio: 0,
      color: "orange",
      details: [
        "従業員給与: 690万円",
        "社会保険料: 55万円",
        "福利厚生: 20万円",
      ],
      employees: "3名",
    },
    {
      name: "設備投資",
      amount: 100,
      roi: 37.5,
      ratio: 0,
      color: "purple",
      details: [
        "PC・機器: 60万円",
        "ソフトウェア: 30万円",
        "その他: 10万円",
      ],
      depreciation: "5年",
    },
    {
      name: "諸経費",
      amount: 43,
      roi: 0,
      ratio: 0,
      color: "gray",
      details: [
        "オフィス賃料: 25万円",
        "光熱費・通信費: 8万円",
        "その他: 10万円",
      ],
      note: "運営基盤",
    },
  ];

  const totalBusinessInvestment = businessInvestments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  // 比率を計算
  businessInvestments.forEach(inv => {
    inv.ratio = totalBusinessInvestment > 0 
      ? (inv.amount / totalBusinessInvestment) * 100 
      : 0;
  });

  // 投資推移データ（過去5ヶ月）
  const investmentTrend = [
    { month: "7月", personal: 480, business: 420 },
    { month: "8月", personal: 495, business: 430 },
    { month: "9月", personal: 510, business: 440 },
    { month: "10月", personal: 520, business: 445 },
    { month: "11月", personal: 530, business: 450 },
  ];

  // 資産配分データ
  const assetAllocationData = [
    { name: "事業用現金", value: userData.business.cashBalance, color: "#3b82f6" },
    { name: "個人預貯金", value: userData.personal.savings, color: "#10b981" },
    { name: "NISA", value: userData.personal.investments.nisa, color: "#f59e0b" },
    { name: "iDeCo", value: userData.personal.investments.ideco, color: "#ef4444" },
    { name: "個別株", value: userData.personal.investments.stocks, color: "#8b5cf6" },
    { name: "その他", value: userData.personal.investments.other, color: "#6b7280" },
  ];

  // 統合ビュー
  const IntegratedView = () => {
    const totalAssets =
      userData.business.cashBalance +
      userData.personal.savings +
      totalInvestment;

    return (
      <div className="space-y-6">
        {/* 総資産サマリー */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl mb-2 opacity-90">総資産</h2>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold">{totalAssets.toLocaleString()}万円</div>
            <div className="text-2xl opacity-90 mb-2">前月比 +8.2%</div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Wallet className="w-6 h-6" />,
              label: "総資産",
              value: `${totalAssets.toLocaleString()}万円`,
              change: "+8.2%",
              color: "indigo",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "投資資産",
              value: `${totalInvestment.toLocaleString()}万円`,
              change: "+15.7%",
              color: "orange",
            },
            {
              icon: <PiggyBank className="w-6 h-6" />,
              label: "事業投資",
              value: `${totalBusinessInvestment.toLocaleString()}万円`,
              change: "+8.5%",
              color: "blue",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              label: "平均リターン",
              value: "15.0%",
              change: "+2.3%",
              color: "green",
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
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 資産配分円グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">資産配分</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assetAllocationData}
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
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 資産配分詳細 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">資産配分詳細</h3>
            <div className="space-y-2">
              {assetAllocationData.map((item, idx) => (
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

        {/* 投資推移グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">投資推移（過去5ヶ月）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={investmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="personal"
                stackId="1"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
                name="個人投資"
              />
              <Area
                type="monotone"
                dataKey="business"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="事業投資"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 個人投資ビュー
  const PersonalView = () => (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Wallet className="w-6 h-6" />,
            label: "投資総額",
            value: `${totalInvestment}万円`,
            change: "+12.5%",
            color: "blue",
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: "評価損益",
            value: `+${totalReturn.toFixed(0)}万円`,
            change: "+15.2%",
            color: "green",
          },
          {
            icon: <Activity className="w-6 h-6" />,
            label: "平均リターン",
            value: "15.0%",
            change: "+2.3%",
            color: "orange",
          },
          {
            icon: <Calendar className="w-6 h-6" />,
            label: "月次投資額",
            value: "5万円",
            change: "target",
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 投資ポートフォリオ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            個人投資ポートフォリオ
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: "NISA",
                amount: userData.personal.investments.nisa,
                return: 18.5,
                ratio: 37.7,
                color: "blue",
              },
              {
                name: "iDeCo",
                amount: userData.personal.investments.ideco,
                return: 12.3,
                ratio: 28.3,
                color: "green",
              },
              {
                name: "個別株",
                amount: userData.personal.investments.stocks,
                return: 15.8,
                ratio: 18.9,
                color: "orange",
              },
              {
                name: "その他",
                amount: userData.personal.investments.other,
                return: 8.2,
                ratio: 15.1,
                color: "purple",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 border-${item.color}-200 bg-${item.color}-50`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded bg-${item.color}-200 text-${item.color}-800`}
                  >
                    {item.ratio}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {item.amount}万円
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  +{item.return}%
                </div>
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
                  { name: "NISA", value: userData.personal.investments.nisa },
                  { name: "iDeCo", value: userData.personal.investments.ideco },
                  { name: "個別株", value: userData.personal.investments.stocks },
                  { name: "その他", value: userData.personal.investments.other },
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
                  <Cell key="3" fill="#8b5cf6" />,
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
            <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
              新NISA
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">2024年投資枠</span>
                <span className="font-semibold text-gray-900">
                  60万円 / 360万円
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: "16.7%" }}
                ></div>
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
            <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 font-semibold">
              加入中
            </span>
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

      {/* 投資アドバイス */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">投資アドバイス</h3>
        <div className="space-y-3">
          {[
            {
              type: "success",
              icon: <CheckCircle className="w-5 h-5" />,
              title: "NISA投資順調",
              desc: "年間目標の16.7%を達成。このペースを維持しましょう。",
              color: "green",
            },
            {
              type: "warning",
              icon: <AlertCircle className="w-5 h-5" />,
              title: "iDeCo増額を検討",
              desc: "月額5万円まで増額で年間23万円の追加節税が可能です。",
              color: "yellow",
            },
            {
              type: "info",
              icon: <Info className="w-5 h-5" />,
              title: "リバランスのタイミング",
              desc: "株式比率が高めです。債券への配分も検討しましょう。",
              color: "blue",
            },
          ].map((advice, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 border-${advice.color}-500 bg-${advice.color}-50`}
            >
              <div className="flex gap-3">
                <div className={`text-${advice.color}-600 flex-shrink-0`}>
                  {advice.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{advice.title}</h4>
                  <p className="text-sm text-gray-600">{advice.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 事業投資ビュー
  const BusinessView = () => (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Building2 className="w-6 h-6" />,
            label: "事業投資総額",
            value: `${totalBusinessInvestment}万円`,
            change: "+8.5%",
            color: "blue",
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: "投資効果",
            value: "+95万円",
            change: "+18.2%",
            color: "green",
          },
          {
            icon: <Activity className="w-6 h-6" />,
            label: "平均ROI",
            value: "21.1%",
            change: "+3.2%",
            color: "orange",
          },
          {
            icon: <Calendar className="w-6 h-6" />,
            label: "月次投資額",
            value: "45万円",
            change: "plan",
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 事業投資ポートフォリオ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            事業投資ポートフォリオ
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {businessInvestments.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 border-${item.color}-200 bg-${item.color}-50`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded bg-${item.color}-200 text-${item.color}-800`}
                  >
                    {item.ratio}%
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {item.amount}万円
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  ROI: {item.roi}%
                </div>
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
                  <Cell key="3" fill="#8b5cf6" />,
                  <Cell key="4" fill="#6b7280" />,
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
            <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
              {activeServices.length}サービス運用中
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">累計投資額</div>
                <div className="text-lg font-bold text-blue-600">{businessInvestments[0].amount.toLocaleString()}万円</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">期待ROI</div>
                <div className="text-lg font-bold text-green-600">
                  {businessInvestments[0].roi > 0 ? businessInvestments[0].roi.toFixed(1) : 0}%
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">顧客数</div>
                <div className="text-lg font-bold text-purple-600">{businessInvestments[0].customers}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">サービス一覧</h4>
              {activeServices.length > 0 ? (
                <div className="space-y-2">
                  {activeServices.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          service.status === "運用中" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{service.developmentCost}万円</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  運用中・開発中のサービスはありません
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">月間売上</div>
              <div className="text-xl font-bold text-green-600">
                {businessInvestments[0].expectedRevenue}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                年間: {totalAnnualRevenue}万円
              </div>
            </div>

            <button 
              onClick={() => setShowDevelopmentPlan(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              サービス詳細を管理
            </button>
          </div>
        </div>

        {/* 販促投資パネル */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">販促投資</h3>
            <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 font-semibold">
              実施中
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">累計投資額</div>
                <div className="text-lg font-bold text-green-600">{businessInvestments[1].amount}万円</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">期待ROI</div>
                <div className="text-lg font-bold text-orange-600">{businessInvestments[1].roi}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">内訳</h4>
              {businessInvestments[1].details?.map((detail, idx) => {
                const percentage = parseFloat(
                  detail.match(/\((.+?)%\)/)?.[1] || "0"
                );
                return (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{detail.split(":")[0]}</span>
                      <span className="font-semibold">
                        {detail.split(":")[1]?.split("(")[0]}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">獲得顧客数</div>
              <div className="text-xl font-bold text-blue-600">
                {businessInvestments[1].customers}
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
              効果測定を見る
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 人件費投資パネル */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">人件費投資</h3>
            <span className="text-xs px-3 py-1 rounded bg-orange-100 text-orange-700 font-semibold">
              最重要
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">年間投資額</div>
                <div className="text-lg font-bold text-orange-600">{businessInvestments[2].amount}万円</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">ROI</div>
                <div className="text-lg font-bold text-green-600">{businessInvestments[2].roi}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">内訳</h4>
              {businessInvestments[2].details?.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-600">{detail}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">従業員数</div>
              <div className="text-xl font-bold text-blue-600">
                {businessInvestments[2].employees}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">💡 投資効果</div>
              <p className="text-xs text-gray-700">
                従業員1人あたり年間約255万円の投資で、約370万円の売上貢献。
                人材は最も重要な投資です。
              </p>
            </div>

            <a href="/payroll" className="block w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-center">
              給与詳細を見る
            </a>
          </div>
        </div>

        {/* 設備投資パネル */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">設備投資</h3>
            <span className="text-xs px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold">
              計画的
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">累計投資額</div>
                <div className="text-lg font-bold text-purple-600">{businessInvestments[3].amount}万円</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">ROI</div>
                <div className="text-lg font-bold text-green-600">{businessInvestments[3].roi}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">投資内訳</h4>
              {businessInvestments[3].details?.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-600">{detail}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">減価償却期間</div>
              <div className="text-xl font-bold text-blue-600">
                {businessInvestments[3].depreciation}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">💡 効果</div>
              <p className="text-xs text-gray-700">
                業務効率化と生産性向上により、年間約38万円のコスト削減効果。
                長期的な投資として重要です。
              </p>
            </div>

            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
              設備詳細を見る
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 諸経費パネル */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">諸経費（運営費）</h3>
            <span className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold">
              固定費
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">月間費用</div>
                <div className="text-lg font-bold text-gray-700">{businessInvestments[4].amount}万円</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">年間費用</div>
                <div className="text-lg font-bold text-gray-700">{businessInvestments[4].amount * 12}万円</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">費用内訳</h4>
              {businessInvestments[4].details?.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-600">{detail}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">位置づけ</div>
              <div className="text-xl font-bold text-blue-600">
                {businessInvestments[4].note}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">💡 特徴</div>
              <p className="text-xs text-gray-700">
                直接的なROIはありませんが、事業運営に必要不可欠な基盤コストです。
                定期的な見直しでコスト最適化を図りましょう。
              </p>
            </div>

            <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
              経費詳細を見る
            </button>
          </div>
        </div>

        {/* 投資全体サマリー */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📊 投資全体サマリー</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">総投資額（月間）</div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {(businessInvestments.reduce((sum, inv) => sum + inv.amount, 0) / 12).toFixed(0)}万円
              </div>
              <div className="text-xs text-gray-500">年間: {businessInvestments.reduce((sum, inv) => sum + inv.amount, 0)}万円</div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">加重平均ROI</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {(
                  businessInvestments
                    .filter((inv) => inv.roi > 0)
                    .reduce((sum, inv) => sum + (inv.roi * inv.amount), 0) /
                  businessInvestments
                    .filter((inv) => inv.roi > 0)
                    .reduce((sum, inv) => sum + inv.amount, 0)
                ).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">諸経費を除く</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">投資配分</div>
              {businessInvestments.map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{inv.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          idx === 0 ? 'bg-blue-500' :
                          idx === 1 ? 'bg-green-500' :
                          idx === 2 ? 'bg-orange-500' :
                          idx === 3 ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${inv.ratio}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-700 w-12 text-right">{inv.ratio}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="text-xs text-gray-600 mb-1">💡 総合評価</div>
              <p className="text-xs text-gray-700">
                人件費が全体の58.5%を占め、最大の投資項目です。
                サービス開発と販促が高いROIを示しており、バランスの取れた投資配分です。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 投資機会アラート */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">投資機会アラート</h3>
        <div className="space-y-3">
          {[
            {
              priority: "high",
              title: "サービス開発の追加投資",
              desc: "新機能の追加開発で月間売上が30万円増加見込み。投資額50万円",
              roi: "ROI 72%以上",
            },
            {
              priority: "medium",
              title: "販促強化（SNS広告拡大）",
              desc: "広告予算増額で新規顧客獲得数20%向上見込み。追加投資30万円",
              roi: "ROI 40%以上",
            },
            {
              priority: "low",
              title: "オフィス環境改善",
              desc: "作業環境改善で生産性向上。投資額30万円",
              roi: "定性的効果",
            },
          ].map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                alert.priority === "high"
                  ? "border-red-500 bg-red-50"
                  : alert.priority === "medium"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-blue-500 bg-blue-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        alert.priority === "high"
                          ? "bg-red-200 text-red-800"
                          : alert.priority === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {alert.priority === "high"
                        ? "優先度: 高"
                        : alert.priority === "medium"
                        ? "優先度: 中"
                        : "優先度: 低"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.desc}</p>
                  <div className="text-sm font-semibold text-green-600">{alert.roi}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">資産・投資管理</h1>
        <p className="mt-2 text-sm text-gray-600">
          事業と個人の資産・投資を統合管理し、最適なポートフォリオを構築
        </p>
      </div>

      {/* ビュー切り替えタブ */}
      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
        {[
          { id: "integrated", label: "統合ビュー" },
          { id: "personal", label: "個人投資" },
          { id: "business", label: "事業投資" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() =>
              setViewMode(view.id as "integrated" | "personal" | "business")
            }
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === view.id
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* 表示切り替え */}
      {viewMode === "integrated" && <IntegratedView />}
      {viewMode === "personal" && <PersonalView />}
      {viewMode === "business" && <BusinessView />}

      {/* サービス開発投資管理モーダル */}
      {showDevelopmentPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    💻 サービス開発投資管理
                    {isEditMode && <span className="ml-3 text-sm bg-yellow-500 px-3 py-1 rounded-full">編集モード</span>}
                  </h2>
                  <p className="text-sm opacity-90">
                    投資額・売上・顧客数を管理してROIを可視化
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditMode ? (
                    <>
                      <button
                        onClick={addNewService}
                        className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        サービス追加
                      </button>
                      <button
                        onClick={handleEditMode}
                        className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        編集
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="text-white bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-lg px-4 py-2 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="text-white bg-green-500 bg-opacity-80 hover:bg-opacity-100 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        保存
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setShowDevelopmentPlan(false);
                      setIsEditMode(false);
                      setEditedServices([]);
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 全体サマリー */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">総開発投資</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.developmentCost, 0)}万円
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">月間総売上</div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.monthlyRevenue, 0)}万円
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">総顧客数</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.currentCustomers, 0)}社
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">平均ROI</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {(() => {
                      const activeServices = currentServices.filter(s => (s.status === "運用中" || s.status === "開発中") && s.roi > 0);
                      return activeServices.length > 0 
                        ? (activeServices.reduce((sum, s) => sum + s.roi, 0) / activeServices.length).toFixed(1)
                        : 0;
                    })()}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
              </div>

              {/* サービス追加フォーム */}
              {showAddServiceForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">🆕 新規サービス追加</h3>
                    <button
                      onClick={handleCancelAddService}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* サービス名 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        サービス名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="例: AI経理アシスタント"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* 投資情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💰 開発投資額（万円）
                        </label>
                        <input
                          type="number"
                          value={newService.developmentCost}
                          onChange={(e) => setNewService({ ...newService, developmentCost: parseInt(e.target.value) || 0 })}
                          placeholder="例: 250"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📈 月間売上（万円）
                        </label>
                        <input
                          type="number"
                          value={newService.monthlyRevenue}
                          onChange={(e) => setNewService({ ...newService, monthlyRevenue: parseInt(e.target.value) || 0 })}
                          placeholder="例: 85"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* 顧客情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          👥 現在の顧客数
                        </label>
                        <input
                          type="number"
                          value={newService.currentCustomers}
                          onChange={(e) => setNewService({ ...newService, currentCustomers: parseInt(e.target.value) || 0 })}
                          placeholder="例: 45"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🎯 目標顧客数
                        </label>
                        <input
                          type="number"
                          value={newService.targetCustomers}
                          onChange={(e) => setNewService({ ...newService, targetCustomers: parseInt(e.target.value) || 0 })}
                          placeholder="例: 100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💵 顧客単価（万円/月）
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newService.pricePerCustomer}
                          onChange={(e) => setNewService({ ...newService, pricePerCustomer: parseFloat(e.target.value) || 0 })}
                          placeholder="例: 1.89"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* その他情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ⏱️ 開発期間
                        </label>
                        <input
                          type="text"
                          value={newService.developmentPeriod}
                          onChange={(e) => setNewService({ ...newService, developmentPeriod: e.target.value })}
                          placeholder="例: 6ヶ月"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📅 ローンチ予定
                        </label>
                        <input
                          type="text"
                          value={newService.launchDate}
                          onChange={(e) => setNewService({ ...newService, launchDate: e.target.value })}
                          placeholder="例: 2025年4月"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📈 顧客成長率
                        </label>
                        <input
                          type="text"
                          value={newService.customerGrowthRate}
                          onChange={(e) => setNewService({ ...newService, customerGrowthRate: e.target.value })}
                          placeholder="例: 月8人増加"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* プレビュー */}
                    {newService.developmentCost > 0 && newService.monthlyRevenue > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3">📊 投資シミュレーション</div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-gray-600">年間売上</div>
                            <div className="text-lg font-bold text-green-600">
                              {newService.monthlyRevenue * 12}万円
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">予想ROI</div>
                            <div className="text-lg font-bold text-blue-600">
                              {newService.developmentCost > 0
                                ? ((newService.monthlyRevenue * 12 - newService.developmentCost) / newService.developmentCost * 100).toFixed(1)
                                : 0}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">回収期間</div>
                            <div className="text-lg font-bold text-purple-600">
                              {newService.monthlyRevenue > 0
                                ? (newService.developmentCost / newService.monthlyRevenue).toFixed(1)
                                : 0}ヶ月
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ボタン */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={handleCancelAddService}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleAddService}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* サービス一覧 */}
              <div className="space-y-4">
                {currentServices.map((service) => (
                  <div
                    key={service.id}
                    className={`border-2 rounded-xl p-6 ${
                      service.status === "運用中"
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                        : service.status === "開発中"
                        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                        : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editedServices.find((s) => s.id === service.id)?.name || service.name}
                              onChange={(e) => updateService(service.id, "name", e.target.value)}
                              className="text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded px-3 py-2 flex-1"
                            />
                          ) : (
                            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                          )}
                          {isEditMode ? (
                            <select
                              value={editedServices.find((s) => s.id === service.id)?.status || service.status}
                              onChange={(e) => updateService(service.id, "status", e.target.value)}
                              className={`text-sm px-4 py-2 rounded-full font-semibold ${
                                service.status === "運用中"
                                  ? "bg-green-200 text-green-800"
                                  : service.status === "開発中"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <option>計画中</option>
                              <option>開発中</option>
                              <option>運用中</option>
                              <option>終了</option>
                            </select>
                          ) : (
                            <span
                              className={`text-sm px-4 py-2 rounded-full font-semibold ${
                                service.status === "運用中"
                                  ? "bg-green-200 text-green-800"
                                  : service.status === "開発中"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {service.status}
                            </span>
                          )}
                          {isEditMode && (
                            <button
                              onClick={() => deleteService(service.id)}
                              className="text-red-600 hover:bg-red-50 rounded-lg p-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 投資・リターン情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">💰 開発投資額</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedServices.find((s) => s.id === service.id)?.developmentCost || service.developmentCost}
                            onChange={(e) => updateService(service.id, "developmentCost", parseInt(e.target.value) || 0)}
                            className="text-lg font-bold text-blue-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-blue-600">{service.developmentCost}万円</div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">📈 月間売上</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedServices.find((s) => s.id === service.id)?.monthlyRevenue || service.monthlyRevenue}
                            onChange={(e) => updateService(service.id, "monthlyRevenue", parseInt(e.target.value) || 0)}
                            className="text-lg font-bold text-green-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-green-600">{service.monthlyRevenue}万円/月</div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">👥 顧客数</div>
                        {isEditMode ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editedServices.find((s) => s.id === service.id)?.currentCustomers || service.currentCustomers}
                              onChange={(e) => updateService(service.id, "currentCustomers", parseInt(e.target.value) || 0)}
                              className="text-lg font-bold text-purple-600 w-16 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                            />
                            <span className="text-gray-400">/</span>
                            <input
                              type="number"
                              value={editedServices.find((s) => s.id === service.id)?.targetCustomers || service.targetCustomers}
                              onChange={(e) => updateService(service.id, "targetCustomers", parseInt(e.target.value) || 0)}
                              className="text-sm text-gray-600 w-16 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-purple-600">
                            {service.currentCustomers}社 / {service.targetCustomers}社
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">💵 単価/顧客</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editedServices.find((s) => s.id === service.id)?.pricePerCustomer || service.pricePerCustomer}
                            onChange={(e) => updateService(service.id, "pricePerCustomer", parseFloat(e.target.value) || 0)}
                            className="text-lg font-bold text-indigo-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-indigo-600">{service.pricePerCustomer}万円/月</div>
                        )}
                      </div>
                    </div>

                    {/* ROI・回収期間 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">📊 ROI（年間）</div>
                        <div className="text-2xl font-bold">
                          {service.roi > 0 ? `+${service.roi.toFixed(1)}%` : `${service.roi.toFixed(1)}%`}
                        </div>
                        <div className="text-xs opacity-80 mt-1">
                          年間売上: {service.annualRevenue}万円
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">⏱️ 回収期間</div>
                        <div className="text-2xl font-bold">
                          {service.paybackPeriod !== "未算出" ? `${service.paybackPeriod}ヶ月` : service.paybackPeriod}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">📈 顧客成長率</div>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.customerGrowthRate || service.customerGrowthRate}
                            onChange={(e) => updateService(service.id, "customerGrowthRate", e.target.value)}
                            className="text-lg font-bold w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-xl font-bold">{service.customerGrowthRate}</div>
                        )}
                      </div>
                    </div>

                    {/* 詳細情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">開発期間:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.developmentPeriod || service.developmentPeriod}
                            onChange={(e) => updateService(service.id, "developmentPeriod", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span>{service.developmentPeriod}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">ローンチ:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.launchDate || service.launchDate}
                            onChange={(e) => updateService(service.id, "launchDate", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span>{service.launchDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
