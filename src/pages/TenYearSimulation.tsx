import { useState } from "react";
import {
  PiggyBank,
  TrendingUp,
  AlertCircle,
  Star,
  Plus,
  ChevronRight,
  Zap,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// ライフイベントの型定義
interface LifeEvent {
  id: string;
  icon: string;
  title: string;
  amount: string;
  year: number;
  paymentType: "lump_sum" | "loan"; // 一括 or ローン
  loanDetails?: {
    downPayment: number; // 頭金（万円）
    loanAmount: number; // 借入額（万円）
    period: number; // 返済期間（年）
    interestRate: number; // 金利（%）
  };
  isAsset?: boolean; // 資産として計上するか
  assetDetails?: {
    assetValue: number; // 資産価値（万円）
    assetType: "real_estate" | "vehicle" | "other"; // 資産の種類
    depreciation: {
      enabled: boolean; // 減価償却あり
      rate: number; // 年率（%）
    };
    income: {
      enabled: boolean; // 収益あり
      monthlyAmount: number; // 月次収益（万円）
    };
  };
}

const TenYearSimulation = () => {
  const [selectedScenario, setSelectedScenario] = useState("standard");
  const [customSimulation, setCustomSimulation] = useState({
    returnRate: 5,
    monthlyInvestment: 5,
  });
  
  // ライフイベント管理
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([
    {
      id: "1",
      icon: "🏠",
      title: "住宅購入",
      amount: "3000",
      year: 3,
      paymentType: "loan",
      loanDetails: {
        downPayment: 300,
        loanAmount: 2700,
        period: 30,
        interestRate: 1.5,
      },
      isAsset: true,
      assetDetails: {
        assetValue: 3000,
        assetType: "real_estate",
        depreciation: {
          enabled: false,
          rate: 0,
        },
        income: {
          enabled: false,
          monthlyAmount: 0,
        },
      },
    },
    {
      id: "2",
      icon: "👨‍👩‍👧",
      title: "結婚・出産",
      amount: "500",
      year: 5,
      paymentType: "lump_sum",
      isAsset: false,
    },
    {
      id: "3",
      icon: "📚",
      title: "教育費",
      amount: "1000",
      year: 10,
      paymentType: "lump_sum",
      isAsset: false,
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    icon: "🎯",
    title: "",
    amount: "",
    year: 1,
    paymentType: "lump_sum" as "lump_sum" | "loan",
    loanDetails: {
      downPayment: 0,
      loanAmount: 0,
      period: 30,
      interestRate: 1.5,
    },
    isAsset: false,
    assetDetails: {
      assetValue: 0,
      assetType: "real_estate" as "real_estate" | "vehicle" | "other",
      depreciation: {
        enabled: false,
        rate: 2,
      },
      income: {
        enabled: false,
        monthlyAmount: 0,
      },
    },
  });

  // ユーザーデータ
  const userData = {
    age: 35,
    targetAsset: 5000,
    personal: {
      savings: 500,
      annualIncome: 600,
    },
  };

  // 10年後シミュレーション計算（ライフイベント考慮版）
  const calculateSimulation = (
    returnRate: number = 5,
    monthlyInvestment: number = 5
  ) => {
    const currentAge = userData.age;
    const annualSaving = monthlyInvestment * 12;
    const currentAssets = userData.personal.savings;

    const years = [];
    let cashAssets = currentAssets; // 現金資産
    let totalAssets = currentAssets; // 総資産（現金 + 固定資産）
    const fixedAssets: { [key: string]: number } = {}; // 固定資産の追跡

    for (let i = 0; i <= 10; i++) {
      const year = currentAge + i;
      const investmentReturn = cashAssets * (returnRate / 100);
      
      // 基本の現金資産増加
      cashAssets += annualSaving + investmentReturn;

      // ライフイベントの影響を計算
      const eventsThisYear = lifeEvents.filter((event) => event.year === i);
      
      eventsThisYear.forEach((event) => {
        if (event.paymentType === "lump_sum") {
          // 一括支払い
          cashAssets -= parseFloat(event.amount);
        } else if (event.paymentType === "loan" && event.loanDetails) {
          // ローン: 初年度は頭金のみ
          cashAssets -= event.loanDetails.downPayment;
        }

        // 資産として計上する場合
        if (event.isAsset && event.assetDetails) {
          fixedAssets[event.id] = event.assetDetails.assetValue;
        }
      });

      // ローンの月次返済（イベント発生年以降）
      lifeEvents.forEach((event) => {
        if (
          event.paymentType === "loan" &&
          event.loanDetails &&
          i >= event.year &&
          i < event.year + event.loanDetails.period
        ) {
          // 月次返済額を計算（元利均等返済）
          const monthlyPayment = calculateMonthlyLoanPayment(
            event.loanDetails.loanAmount,
            event.loanDetails.interestRate,
            event.loanDetails.period
          );
          cashAssets -= monthlyPayment * 12; // 年間返済額
        }

        // 固定資産の処理（取得年以降）
        if (event.isAsset && event.assetDetails && i >= event.year) {
          // 減価償却
          if (
            event.assetDetails.depreciation.enabled &&
            fixedAssets[event.id]
          ) {
            const depreciationAmount =
              fixedAssets[event.id] * (event.assetDetails.depreciation.rate / 100);
            fixedAssets[event.id] = Math.max(
              0,
              fixedAssets[event.id] - depreciationAmount
            );
          }

          // 資産からの収益
          if (event.assetDetails.income.enabled) {
            cashAssets += event.assetDetails.income.monthlyAmount * 12;
          }
        }
      });

      // 総資産 = 現金資産 + 固定資産の合計
      const fixedAssetsTotal = Object.values(fixedAssets).reduce(
        (sum, val) => sum + val,
        0
      );
      totalAssets = cashAssets + fixedAssetsTotal;

      years.push({
        year: year,
        age: year,
        assets: Math.round(totalAssets),
        cashAssets: Math.round(cashAssets),
        fixedAssets: Math.round(fixedAssetsTotal),
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
      monthlyRequired: gap > 0 ? Math.ceil(gap / 120) : 0,
    };
  };

  // ローンの月次返済額を計算（元利均等返済）
  const calculateMonthlyLoanPayment = (
    principal: number, // 借入額（万円）
    annualRate: number, // 年利率（%）
    years: number // 返済期間（年）
  ): number => {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
  };

  // 3つのシナリオ + カスタムのデータ生成
  const generateScenarioData = () => {
    const conservative = calculateSimulation(3, 5);
    const standard = calculateSimulation(5, 5);
    const aggressive = calculateSimulation(8, 5);
    const custom = calculateSimulation(
      customSimulation.returnRate,
      customSimulation.monthlyInvestment
    );

    return conservative.years.map((year, index) => ({
      year: year.year,
      conservative: conservative.years[index].assets,
      standard: standard.years[index].assets,
      aggressive: aggressive.years[index].assets,
      custom: custom.years[index].assets,
      target: userData.targetAsset,
    }));
  };

  const scenarios = [
    {
      id: "conservative",
      name: "保守的",
      rate: 3,
      color: "blue",
      desc: "安全性重視",
    },
    {
      id: "standard",
      name: "標準",
      rate: 5,
      color: "green",
      desc: "バランス型",
    },
    {
      id: "aggressive",
      name: "積極的",
      rate: 8,
      color: "orange",
      desc: "成長重視",
    },
  ];

  const scenarioData = generateScenarioData();
  const currentSimulation = calculateSimulation(
    customSimulation.returnRate,
    customSimulation.monthlyInvestment
  );

  // ライフイベント管理関数
  const openAddModal = () => {
    setEditingEvent(null);
    setNewEvent({
      icon: "🎯",
      title: "",
      amount: "",
      year: 1,
      paymentType: "lump_sum",
      loanDetails: {
        downPayment: 0,
        loanAmount: 0,
        period: 30,
        interestRate: 1.5,
      },
      isAsset: false,
      assetDetails: {
        assetValue: 0,
        assetType: "real_estate",
        depreciation: {
          enabled: false,
          rate: 2,
        },
        income: {
          enabled: false,
          monthlyAmount: 0,
        },
      },
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: LifeEvent) => {
    setEditingEvent(event);
    setNewEvent({
      icon: event.icon,
      title: event.title,
      amount: event.amount,
      year: event.year,
      paymentType: event.paymentType,
      loanDetails: event.loanDetails || {
        downPayment: 0,
        loanAmount: 0,
        period: 30,
        interestRate: 1.5,
      },
      isAsset: event.isAsset || false,
      assetDetails: event.assetDetails || {
        assetValue: 0,
        assetType: "real_estate",
        depreciation: {
          enabled: false,
          rate: 2,
        },
        income: {
          enabled: false,
          monthlyAmount: 0,
        },
      },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setNewEvent({
      icon: "🎯",
      title: "",
      amount: "",
      year: 1,
      paymentType: "lump_sum",
      loanDetails: {
        downPayment: 0,
        loanAmount: 0,
        period: 30,
        interestRate: 1.5,
      },
      isAsset: false,
      assetDetails: {
        assetValue: 0,
        assetType: "real_estate",
        depreciation: {
          enabled: false,
          rate: 2,
        },
        income: {
          enabled: false,
          monthlyAmount: 0,
        },
      },
    });
  };

  const saveEvent = () => {
    if (!newEvent.title || !newEvent.amount) {
      alert("タイトルと金額を入力してください");
      return;
    }

    const eventData: Omit<LifeEvent, "id"> = {
      icon: newEvent.icon,
      title: newEvent.title,
      amount: newEvent.amount,
      year: newEvent.year,
      paymentType: newEvent.paymentType,
      isAsset: newEvent.isAsset,
    };

    // ローンの場合は詳細情報を追加
    if (newEvent.paymentType === "loan") {
      eventData.loanDetails = { ...newEvent.loanDetails };
    }

    // 資産の場合は詳細情報を追加
    if (newEvent.isAsset) {
      eventData.assetDetails = {
        assetValue: newEvent.assetDetails.assetValue,
        assetType: newEvent.assetDetails.assetType,
        depreciation: {
          enabled: newEvent.assetDetails.depreciation?.enabled || false,
          rate: newEvent.assetDetails.depreciation?.rate || 0,
        },
        income: {
          enabled: newEvent.assetDetails.income?.enabled || false,
          monthlyAmount: newEvent.assetDetails.income?.monthlyAmount || 0,
        },
      };
    }

    if (editingEvent) {
      // 編集
      setLifeEvents(
        lifeEvents.map((event) =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
    } else {
      // 新規追加
      const newId = (
        Math.max(0, ...lifeEvents.map((e) => parseInt(e.id))) + 1
      ).toString();
      setLifeEvents([
        ...lifeEvents,
        {
          ...eventData,
          id: newId,
        },
      ]);
    }
    closeModal();
  };

  const deleteEvent = (id: string) => {
    if (confirm("このライフイベントを削除しますか？")) {
      setLifeEvents(lifeEvents.filter((event) => event.id !== id));
    }
  };

  // アイコン選択肢
  const iconOptions = [
    "🏠", "🚗", "👨‍👩‍👧", "💍", "👶", "📚", "🎓", "✈️", "🏥", "💼", "🎯", "🎉", "🎁", "💰"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">10年後シミュレーション</h1>
        <p className="mt-2 text-sm text-gray-600">
          現在の資産と投資計画から、10年後の純資産を予測します
        </p>
      </div>

      {/* シナリオ選択カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const sim = calculateSimulation(scenario.rate, 5);
          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`bg-white rounded-xl p-6 cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? `border-2 border-${scenario.color}-500 shadow-lg`
                  : "border-2 border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
                <span className={`text-2xl font-bold text-${scenario.color}-600`}>
                  {scenario.rate}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{scenario.desc}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">10年後</span>
                  <span className="font-semibold text-gray-900">
                    {sim.finalAssets.toLocaleString()}万円
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">達成確率</span>
                  <span className="font-semibold text-gray-900">
                    {sim.probability}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4本の折れ線グラフ + カスタム + ライフイベント表示 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          資産推移シミュレーション
        </h3>
        <div className="mb-4 space-y-2">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-purple-900">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="font-medium">
                紫色のライン: カスタム設定（リターン率{customSimulation.returnRate}%、月次投資
                {customSimulation.monthlyInvestment}万円）
              </span>
            </div>
          </div>
          {lifeEvents.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-orange-900 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="font-medium">ライフイベントの影響が反映されています</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {lifeEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs bg-white px-2 py-1 rounded border border-orange-200"
                  >
                    {event.icon} {event.title} ({event.year}年後
                    {event.paymentType === "loan" ? " / ローン" : " / 一括"})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={scenarioData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="conservative"
              stroke="#3b82f6"
              strokeWidth={2}
              name="保守的(3%)"
            />
            <Line
              type="monotone"
              dataKey="standard"
              stroke="#10b981"
              strokeWidth={2}
              name="標準(5%)"
            />
            <Line
              type="monotone"
              dataKey="aggressive"
              stroke="#f59e0b"
              strokeWidth={2}
              name="積極的(8%)"
            />
            <Line
              type="monotone"
              dataKey="custom"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="カスタム"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="目標"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* カスタムシミュレーション */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            カスタムシミュレーション
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  想定リターン率
                </label>
                <span className="text-sm font-bold text-indigo-600">
                  {customSimulation.returnRate}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={customSimulation.returnRate}
                onChange={(e) =>
                  setCustomSimulation({
                    ...customSimulation,
                    returnRate: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  月次投資額
                </label>
                <span className="text-sm font-bold text-indigo-600">
                  {customSimulation.monthlyInvestment}万円
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={customSimulation.monthlyInvestment}
                onChange={(e) =>
                  setCustomSimulation({
                    ...customSimulation,
                    monthlyInvestment: parseInt(e.target.value),
                  })
                }
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
                目標まで:{" "}
                {currentSimulation.gap > 0
                  ? `${currentSimulation.gap.toLocaleString()}万円不足`
                  : "目標達成"}
              </div>
            </div>
          </div>
        </div>

        {/* 推奨アクション */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">推奨アクション</h3>
          <div className="space-y-4">
            {[
              {
                icon: <PiggyBank className="w-6 h-6" />,
                title: "NISA最大活用",
                desc: "年間360万円の枠を活用して非課税メリットを最大化",
                impact: "10年で+80万円",
                color: "green",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "iDeCo増額",
                desc: "月額2.3万円→5万円に増額で節税効果アップ",
                impact: "10年で+120万円",
                color: "blue",
              },
              {
                icon: <AlertCircle className="w-6 h-6" />,
                title: "固定費見直し",
                desc: "通信費・保険を見直して月1万円削減",
                impact: "10年で+120万円",
                color: "orange",
              },
            ].map((action, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 border-${action.color}-500 bg-${action.color}-50`}
              >
                <div className="flex gap-3">
                  <div className={`text-${action.color}-600 flex-shrink-0`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{action.desc}</p>
                    <div className={`text-sm font-semibold text-${action.color}-600`}>
                      {action.impact}
                    </div>
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
          {lifeEvents.map((event) => (
            <div
              key={event.id}
              className="border-2 border-gray-300 rounded-lg p-4 bg-white hover:border-indigo-400 hover:shadow-md transition-all relative group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{event.icon}</span>
                <h4 className="font-semibold text-gray-900 flex-1">{event.title}</h4>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {parseInt(event.amount).toLocaleString()}万円
                {event.paymentType === "loan" && event.loanDetails && (
                  <span className="ml-2 text-xs text-blue-600">
                    (ローン: {event.loanDetails.loanAmount.toLocaleString()}万円)
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {event.year}年後
                {event.paymentType === "loan" && event.loanDetails && (
                  <span className="ml-2 text-xs">
                    | {event.loanDetails.period}年返済
                  </span>
                )}
              </div>
              {event.isAsset && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  📊 資産計上
                  {event.assetDetails?.income.enabled && (
                    <span className="ml-1">+ 収益</span>
                  )}
                </div>
              )}
              
              {/* 編集・削除ボタン */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(event)}
                  className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  title="編集"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={openAddModal}
          className="mt-4 w-full border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          ライフイベントを追加
        </button>
      </div>

      {/* ライフイベント追加・編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingEvent ? "ライフイベントを編集" : "ライフイベントを追加"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* アイコン選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アイコン
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewEvent({ ...newEvent, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        newEvent.icon === icon
                          ? "border-indigo-500 bg-indigo-50 scale-110"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* タイトル */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="例: 住宅購入"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* 金額 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  金額（万円） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newEvent.amount}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, amount: e.target.value })
                  }
                  placeholder="例: 3000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* 支払方法 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支払方法
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNewEvent({ ...newEvent, paymentType: "lump_sum" })
                    }
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      newEvent.paymentType === "lump_sum"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm">一括払い</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewEvent({ ...newEvent, paymentType: "loan" })
                    }
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      newEvent.paymentType === "loan"
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl mb-1">🏦</div>
                    <div className="text-sm">ローン</div>
                  </button>
                </div>
              </div>

              {/* ローン詳細設定 */}
              {newEvent.paymentType === "loan" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-sm font-semibold text-blue-900 mb-3">
                    🏦 ローン詳細設定
                  </div>

                  {/* 頭金 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      頭金（万円）
                    </label>
                    <input
                      type="number"
                      value={newEvent.loanDetails.downPayment}
                      onChange={(e) => {
                        const downPayment = parseFloat(e.target.value) || 0;
                        const totalAmount = parseFloat(newEvent.amount) || 0;
                        setNewEvent({
                          ...newEvent,
                          loanDetails: {
                            ...newEvent.loanDetails,
                            downPayment,
                            loanAmount: Math.max(0, totalAmount - downPayment),
                          },
                        });
                      }}
                      placeholder="例: 300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* 借入額（自動計算） */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      借入額（自動計算）
                    </label>
                    <div className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg text-lg font-bold text-blue-600">
                      {newEvent.loanDetails.loanAmount.toLocaleString()}万円
                    </div>
                  </div>

                  {/* 返済期間 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        返済期間
                      </label>
                      <span className="text-sm font-bold text-blue-600">
                        {newEvent.loanDetails.period}年
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="5"
                      value={newEvent.loanDetails.period}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          loanDetails: {
                            ...newEvent.loanDetails,
                            period: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5年</span>
                      <span>35年</span>
                    </div>
                  </div>

                  {/* 金利 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        年利率
                      </label>
                      <span className="text-sm font-bold text-blue-600">
                        {newEvent.loanDetails.interestRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newEvent.loanDetails.interestRate}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          loanDetails: {
                            ...newEvent.loanDetails,
                            interestRate: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  {/* 月次返済額の表示 */}
                  {newEvent.loanDetails.loanAmount > 0 && (
                    <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
                      <div className="text-xs text-gray-600 mb-1">月次返済額（試算）</div>
                      <div className="text-xl font-bold text-blue-600">
                        {calculateMonthlyLoanPayment(
                          newEvent.loanDetails.loanAmount,
                          newEvent.loanDetails.interestRate,
                          newEvent.loanDetails.period
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        万円/月
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        年間返済額:{" "}
                        {(
                          calculateMonthlyLoanPayment(
                            newEvent.loanDetails.loanAmount,
                            newEvent.loanDetails.interestRate,
                            newEvent.loanDetails.period
                          ) * 12
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                        万円
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 年数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  何年後？
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEvent.year}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, year: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-indigo-600 min-w-[4rem] text-right">
                    {newEvent.year}年後
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1年後</span>
                  <span>10年後</span>
                </div>
              </div>

              {/* 資産として計上 */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEvent.isAsset}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, isAsset: e.target.checked })
                    }
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      資産として計上する（BS反映）
                    </div>
                    <div className="text-xs text-gray-600">
                      不動産や車両など、バランスシートに載る資産の場合はチェック
                    </div>
                  </div>
                </label>
              </div>

              {/* 資産詳細設定 */}
              {newEvent.isAsset && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm font-semibold text-green-900 mb-3">
                    📊 資産詳細設定
                  </div>

                  {/* 資産価値 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      資産価値（万円）
                    </label>
                    <input
                      type="number"
                      value={newEvent.assetDetails.assetValue}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          assetDetails: {
                            ...newEvent.assetDetails,
                            assetValue: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="資産としての評価額"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <div className="text-xs text-gray-600 mt-1">
                      ※ 通常は購入価格と同じですが、異なる場合は調整してください
                    </div>
                  </div>

                  {/* 資産種別 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      資産の種類
                    </label>
                    <select
                      value={newEvent.assetDetails.assetType}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          assetDetails: {
                            ...newEvent.assetDetails,
                            assetType: e.target.value as "real_estate" | "vehicle" | "other",
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    >
                      <option value="real_estate">🏠 不動産</option>
                      <option value="vehicle">🚗 車両</option>
                      <option value="other">📦 その他</option>
                    </select>
                  </div>

                  {/* 減価償却 */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newEvent.assetDetails.depreciation.enabled}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            assetDetails: {
                              ...newEvent.assetDetails,
                              depreciation: {
                                ...newEvent.assetDetails.depreciation,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        減価償却あり
                      </span>
                    </label>

                    {newEvent.assetDetails.depreciation.enabled && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-xs text-gray-700">年間減価率</label>
                          <span className="text-sm font-bold text-green-600">
                            {newEvent.assetDetails.depreciation.rate}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="0.5"
                          value={newEvent.assetDetails.depreciation.rate}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              assetDetails: {
                                ...newEvent.assetDetails,
                              depreciation: {
                                ...newEvent.assetDetails.depreciation,
                                rate: parseFloat(e.target.value),
                              },
                              },
                            })
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 収益 */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newEvent.assetDetails.income.enabled}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            assetDetails: {
                              ...newEvent.assetDetails,
                              income: {
                                ...newEvent.assetDetails.income,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        収益を生む資産（賃貸など）
                      </span>
                    </label>

                    {newEvent.assetDetails.income.enabled && (
                      <div>
                        <label className="block text-xs text-gray-700 mb-2">
                          月次収益（万円）
                        </label>
                        <input
                          type="number"
                          value={newEvent.assetDetails.income.monthlyAmount}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              assetDetails: {
                                ...newEvent.assetDetails,
                              income: {
                                ...newEvent.assetDetails.income,
                                monthlyAmount: parseFloat(e.target.value) || 0,
                              },
                              },
                            })
                          }
                          placeholder="家賃収入など"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {newEvent.assetDetails.income.monthlyAmount > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            年間収益: {(newEvent.assetDetails.income.monthlyAmount * 12).toFixed(1)}万円
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* プレビュー */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="text-xs text-gray-600 mb-2">プレビュー</div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{newEvent.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {newEvent.title || "タイトル"}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {newEvent.amount
                        ? `${parseInt(newEvent.amount).toLocaleString()}万円`
                        : "金額"}
                      {newEvent.paymentType === "loan" && (
                        <span className="ml-2 text-xs text-blue-600">
                          (ローン: {newEvent.loanDetails.loanAmount.toLocaleString()}万円)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {newEvent.year}年後
                      {newEvent.paymentType === "loan" && (
                        <span className="ml-2 text-xs">
                          | {newEvent.loanDetails.period}年返済
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={saveEvent}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingEvent ? "更新" : "追加"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 目標達成確率と詳細分析 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          目標達成確率と詳細分析
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 達成確率 */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-90 mb-2">目標達成確率</div>
            <div className="text-5xl font-bold mb-4">
              {currentSimulation.probability}%
            </div>
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(currentSimulation.probability / 20)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm opacity-90">
              {currentSimulation.gap > 0
                ? `目標まであと ${currentSimulation.gap.toLocaleString()}万円`
                : "目標達成可能！"}
            </div>
          </div>

          {/* 詳細データ */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">現在の資産</div>
              <div className="text-2xl font-bold text-gray-900">
                {userData.personal.savings.toLocaleString()}万円
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">10年後予測</div>
              <div className="text-2xl font-bold text-green-600">
                {currentSimulation.finalAssets.toLocaleString()}万円
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">増加額</div>
              <div className="text-2xl font-bold text-purple-600">
                +
                {(
                  currentSimulation.finalAssets - userData.personal.savings
                ).toLocaleString()}
                万円
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(
                  ((currentSimulation.finalAssets - userData.personal.savings) /
                    userData.personal.savings) *
                  100
                ).toFixed(1)}
                % 増加
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* シミュレーションの前提条件 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 text-white rounded-lg p-2">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">シミュレーションの前提条件</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>
                  月次投資額: {customSimulation.monthlyInvestment}万円（年間
                  {customSimulation.monthlyInvestment * 12}万円）
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>想定リターン率: 年率{customSimulation.returnRate}%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>
                  税制優遇制度（NISA・iDeCo）を最大限活用することで、実質リターンを向上
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>インフレ率を考慮した実質ベースでの計算</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 目標達成のためのアドバイス */}
      {currentSimulation.gap > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-yellow-900 mb-2">
                目標達成のためのアドバイス
              </h4>
              <div className="text-sm text-yellow-800 mb-3">
                現在の計画では目標まで
                {currentSimulation.gap.toLocaleString()}
                万円不足しています。以下の方法で目標達成を目指しましょう：
              </div>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    月次投資額を
                    {(
                      customSimulation.monthlyInvestment +
                      currentSimulation.monthlyRequired
                    ).toFixed(1)}
                    万円に増額（現在+
                    {currentSimulation.monthlyRequired.toFixed(1)}万円）
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    想定リターン率を改善（ポートフォリオの最適化で+1〜2%可能）
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>固定費削減で投資原資を確保（通信費・保険の見直し）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    事業収益の向上で投資額を増やす（マーケティング投資の強化）
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {currentSimulation.gap <= 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h4 className="font-bold text-green-900 mb-2">
                素晴らしい！目標達成が見込めます 🎉
              </h4>
              <div className="text-sm text-green-800 mb-3">
                現在の投資計画を継続することで、10年後に目標の
                {userData.targetAsset.toLocaleString()}
                万円を達成できる見込みです。この調子で継続しましょう！
              </div>
              <div className="bg-green-100 rounded-lg p-3 mt-3">
                <div className="text-xs text-green-700 mb-1">さらに資産を増やすには</div>
                <ul className="space-y-1 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>投資額を増やして、さらなる資産形成を目指す</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>事業投資を強化して、事業収益を拡大する</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>新しい収入源を検討する（副業・不動産投資など）</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 年齢別の目標マイルストーン */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          年齢別の目標マイルストーン
        </h3>
        <div className="space-y-3">
          {currentSimulation.years
            .filter((_, idx) => idx % 2 === 0)
            .map((year, idx) => {
              const progress = (year.assets / userData.targetAsset) * 100;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900 text-lg">
                        {year.age}歳
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({year.year}年)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">
                        {year.assets.toLocaleString()}万円
                      </div>
                      <div className="text-xs text-gray-500">
                        進捗率: {progress.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* シミュレーション結果のまとめ */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ChevronRight className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">次のステップ</h4>
            <p className="text-white/90 mb-3">
              シミュレーション結果を元に、具体的なアクションプランを立てましょう。
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                資産・投資管理へ
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                税務最適化へ
              </button>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                税理士に相談する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenYearSimulation;
