import { useState } from "react";

interface Investment {
  id: string;
  name: string;
  category: "personal" | "business";
  type: string;
  amount: number;
  roi: number;
  date: string;
}

interface BusinessPortfolio {
  id: string;
  category: "development" | "marketing" | "personnel" | "equipment" | "overhead";
  name: string;
  monthlyInvestment: number;
  annualInvestment: number;
  expectedReturn: number;
  actualReturn: number;
  roi: number;
  metrics: {
    key: string;
    value: string;
  }[];
}

interface CorporateInfo {
  companyName: string;
  foundedDate: string;
  capitalStock: number;
  totalShares: number;
  ownedShares: number;
  ownershipPercentage: number;
  estimatedCompanyValue: number;
  ownedValue: number;
}

const InvestmentManagement = () => {
  // 法人情報
  const [corporateInfo] = useState<CorporateInfo>({
    companyName: "株式会社WealthPath",
    foundedDate: "2020-04-01",
    capitalStock: 10000000,
    totalShares: 10000,
    ownedShares: 8000,
    ownershipPercentage: 80.0,
    estimatedCompanyValue: 45000000,
    ownedValue: 36000000,
  });

  // 従業員人件費データ（給与計算ページから）
  const employeeCount = 3;
  const monthlyPayrollExpense = 1147000;
  const annualPayrollExpense = monthlyPayrollExpense * 12;
  
  // 従業員1人あたりの月間売上貢献
  const revenuePerEmployee = 933333; // ¥2,800,000 / 3人
  const annualRevenuePerEmployee = revenuePerEmployee * 12;

  // 事業ポートフォリオ
  const [businessPortfolio] = useState<BusinessPortfolio[]>([
    {
      id: "port-1",
      category: "development",
      name: "サービス開発",
      monthlyInvestment: 250000,
      annualInvestment: 3000000,
      expectedReturn: 10500000,
      actualReturn: 9800000,
      roi: 226.7,
      metrics: [
        { key: "開発期間", value: "6ヶ月" },
        { key: "リリース済み機能", value: "8個" },
        { key: "ユーザー増加率", value: "+45%" },
      ],
    },
    {
      id: "port-2",
      category: "marketing",
      name: "販促",
      monthlyInvestment: 150000,
      annualInvestment: 1800000,
      expectedReturn: 5940000,
      actualReturn: 6200000,
      roi: 244.4,
      metrics: [
        { key: "CAC（顧客獲得コスト）", value: "¥12,500" },
        { key: "LTV（顧客生涯価値）", value: "¥48,000" },
        { key: "LTV/CAC比率", value: "3.84" },
      ],
    },
    {
      id: "port-3",
      category: "personnel",
      name: "人件費",
      monthlyInvestment: monthlyPayrollExpense,
      annualInvestment: annualPayrollExpense,
      expectedReturn: annualPayrollExpense * 1.45,
      actualReturn: revenuePerEmployee * employeeCount * 12,
      roi: 145.0,
      metrics: [
        { key: "従業員数", value: `${employeeCount}名` },
        { key: "1人あたり年間売上", value: `¥${annualRevenuePerEmployee.toLocaleString()}` },
        { key: "生産性指標", value: "9.8x" },
      ],
    },
    {
      id: "port-4",
      category: "equipment",
      name: "設備投資",
      monthlyInvestment: 100000,
      annualInvestment: 1200000,
      expectedReturn: 1800000,
      actualReturn: 1650000,
      roi: 37.5,
      metrics: [
        { key: "減価償却期間", value: "5年" },
        { key: "投資回収期間", value: "2.8年" },
        { key: "稼働率", value: "92%" },
      ],
    },
    {
      id: "port-5",
      category: "overhead",
      name: "諸経費",
      monthlyInvestment: 410000,
      annualInvestment: 4920000,
      expectedReturn: 0,
      actualReturn: 0,
      roi: 0,
      metrics: [
        { key: "オフィス賃料", value: "¥250,000/月" },
        { key: "光熱費・通信費", value: "¥80,000/月" },
        { key: "その他固定費", value: "¥80,000/月" },
      ],
    },
  ]);

  // 簡易PL用のデータ
  const monthlyRevenue = 2800000;
  const annualRevenue = monthlyRevenue * 12;

  const totalMonthlyInvestment = businessPortfolio.reduce(
    (sum, item) => sum + item.monthlyInvestment,
    0
  );
  const totalAnnualInvestment = businessPortfolio.reduce(
    (sum, item) => sum + item.annualInvestment,
    0
  );

  const totalExpectedReturn = businessPortfolio.reduce((sum, item) => sum + item.expectedReturn, 0);
  const totalActualReturn = businessPortfolio.reduce((sum, item) => sum + item.actualReturn, 0);

  const monthlyOperatingProfit = monthlyRevenue - totalMonthlyInvestment;
  const annualOperatingProfit = annualRevenue - totalAnnualInvestment;
  const operatingProfitMargin = (annualOperatingProfit / annualRevenue) * 100;

  // 持ち株割合を考慮した実質利益
  const ownedAnnualProfit = annualOperatingProfit * (corporateInfo.ownershipPercentage / 100);

  // 個人投資
  const [investments] = useState<Investment[]>([
    {
      id: "1",
      name: "つみたてNISA",
      category: "personal",
      type: "資産形成投資",
      amount: 1200000,
      roi: 7.2,
      date: "2024-01-01",
    },
    {
      id: "2",
      name: "iDeCo",
      category: "personal",
      type: "資産形成投資",
      amount: 816000,
      roi: 6.8,
      date: "2024-01-01",
    },
    {
      id: "3",
      name: "個別株投資",
      category: "personal",
      type: "資産形成投資",
      amount: 2500000,
      roi: 12.5,
      date: "2023-06-15",
    },
  ]);

  const personalInvestments = investments.filter((inv) => inv.category === "personal");
  const totalPersonalAmount = personalInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const avgPersonalROI =
    personalInvestments.reduce((sum, inv) => sum + inv.roi, 0) / personalInvestments.length;

  // 事業投資の合計ROI計算
  const weightedBusinessROI = businessPortfolio
    .filter((item) => item.category !== "overhead")
    .reduce((sum, item) => {
      const weight = item.annualInvestment / totalAnnualInvestment;
      return sum + item.roi * weight;
    }, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "development":
        return "💻";
      case "marketing":
        return "📢";
      case "personnel":
        return "👥";
      case "equipment":
        return "🏭";
      case "overhead":
        return "📋";
      default:
        return "📦";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "development":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "marketing":
        return "bg-green-100 text-green-800 border-green-200";
      case "personnel":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "equipment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "overhead":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">資産・投資管理</h1>
      <p className="mt-2 text-sm text-gray-600">
        個人の資産形成と事業の収益性を統合管理し、持ち株割合を考慮した実質資産価値を把握します
      </p>

      {/* 法人情報と持ち株割合 */}
      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">🏢 {corporateInfo.companyName}</h2>
              <p className="text-xs text-gray-600 mt-0.5">設立: {corporateInfo.foundedDate} | 資本金: ¥{corporateInfo.capitalStock.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">持ち株割合</p>
            <p className="text-3xl font-bold text-indigo-600">{corporateInfo.ownershipPercentage}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-xs text-gray-600 mb-1">発行済株式数</p>
            <p className="text-xl font-bold text-gray-900">{corporateInfo.totalShares.toLocaleString()}株</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-xs text-gray-600 mb-1">保有株式数</p>
            <p className="text-xl font-bold text-indigo-600">{corporateInfo.ownedShares.toLocaleString()}株</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-xs text-gray-600 mb-1">企業評価額</p>
            <p className="text-xl font-bold text-gray-900">¥{corporateInfo.estimatedCompanyValue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-4 shadow-lg">
            <p className="text-xs text-white opacity-90 mb-1">実質保有価値</p>
            <p className="text-xl font-bold text-white">¥{corporateInfo.ownedValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-900">💡 持ち株価値の分析</p>
              <p className="text-xs text-gray-700 mt-1">
                持ち株割合{corporateInfo.ownershipPercentage}%により、実質的な資産価値は¥{corporateInfo.ownedValue.toLocaleString()}です。
                年間営業利益¥{annualOperatingProfit.toLocaleString()}のうち、
                あなたの取り分は約¥{ownedAnnualProfit.toLocaleString()}（配当として受け取れる潜在的な金額）となります。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 簡易PL */}
      <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">📊 簡易損益計算書（PL）</h2>
              <p className="text-xs text-gray-600 mt-0.5">事業の収益性とポートフォリオ分析</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">営業利益率</p>
            <p className={`text-2xl font-bold ${operatingProfitMargin >= 15 ? 'text-green-600' : operatingProfitMargin >= 5 ? 'text-blue-600' : 'text-orange-600'}`}>
              {operatingProfitMargin.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 月次PL */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs mr-2">月次</span>
              今月の収支
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">売上高</span>
                <span className="text-lg font-bold text-green-600">¥{monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">事業投資合計</span>
                <span className="text-lg font-bold text-red-600">-¥{totalMonthlyInvestment.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${monthlyOperatingProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                <span className="text-sm font-bold text-gray-900">営業利益</span>
                <span className={`text-2xl font-bold ${monthlyOperatingProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {monthlyOperatingProfit >= 0 ? '+' : ''}¥{monthlyOperatingProfit.toLocaleString()}
                </span>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-700">あなたの取り分（{corporateInfo.ownershipPercentage}%）</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ¥{Math.floor(monthlyOperatingProfit * (corporateInfo.ownershipPercentage / 100)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 年次PL */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs mr-2">年次</span>
              年間予測
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">年間売上</span>
                <span className="text-lg font-bold text-green-600">¥{annualRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">年間投資</span>
                <span className="text-lg font-bold text-red-600">-¥{totalAnnualInvestment.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${annualOperatingProfit >= 0 ? 'bg-purple-50 border-purple-200' : 'bg-orange-50 border-orange-200'}`}>
                <span className="text-sm font-bold text-gray-900">年間営業利益</span>
                <span className={`text-2xl font-bold ${annualOperatingProfit >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                  {annualOperatingProfit >= 0 ? '+' : ''}¥{annualOperatingProfit.toLocaleString()}
                </span>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-700">あなたの年間取り分（{corporateInfo.ownershipPercentage}%）</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ¥{ownedAnnualProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 事業ポートフォリオ */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-lg font-semibold text-gray-900">🎯 事業ポートフォリオ分析</h2>
          <p className="text-xs text-gray-600 mt-1">各投資カテゴリのパフォーマンスとROI</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {businessPortfolio.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 ${getCategoryColor(item.category)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.roi > 100 ? 'bg-green-500 text-white' : item.roi > 0 ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>
                    ROI: {item.roi > 0 ? `${item.roi.toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-600 mb-2">月間投資額</p>
                <p className="text-lg font-bold text-gray-900 mb-3">
                  ¥{item.monthlyInvestment.toLocaleString()}
                </p>
                <div className="space-y-1">
                  {item.metrics.map((metric, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="text-gray-600">{metric.key}: </span>
                      <span className="font-semibold text-gray-900">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ポートフォリオ詳細テーブル */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">年間投資額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">期待リターン</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">実績リターン</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">達成率</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businessPortfolio.map((item) => {
                  const achievementRate = item.expectedReturn > 0 
                    ? (item.actualReturn / item.expectedReturn) * 100 
                    : 0;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{getCategoryIcon(item.category)}</span>
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{item.annualInvestment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.expectedReturn > 0 ? `¥${item.expectedReturn.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.actualReturn > 0 ? `¥${item.actualReturn.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${
                          item.roi >= 100 ? 'text-green-600' :
                          item.roi >= 50 ? 'text-blue-600' :
                          item.roi > 0 ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {item.roi > 0 ? `${item.roi.toFixed(1)}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievementRate > 0 ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  achievementRate >= 100 ? 'bg-green-500' :
                                  achievementRate >= 80 ? 'bg-blue-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${Math.min(achievementRate, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {achievementRate.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">合計</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ¥{totalAnnualInvestment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">
                    ¥{totalExpectedReturn.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    ¥{totalActualReturn.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {weightedBusinessROI.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-700">
                      {((totalActualReturn / totalExpectedReturn) * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ポートフォリオ分析 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">💡 ポートフォリオ分析</p>
                <p className="text-xs text-gray-700 mt-1">
                  最も高いROIを示しているのは「{businessPortfolio.reduce((max, item) => item.roi > max.roi ? item : max).name}」で
                  {businessPortfolio.reduce((max, item) => item.roi > max.roi ? item : max).roi.toFixed(1)}%です。
                  一方、諸経費は直接的なリターンを生まないものの、事業運営に必要不可欠な投資です。
                  全体の加重平均ROIは{weightedBusinessROI.toFixed(1)}%で、健全な投資配分と言えます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 個人投資サマリー */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">💎 個人投資</h3>
          </div>
          <div className="text-3xl font-bold mb-2">¥{totalPersonalAmount.toLocaleString()}</div>
          <div className="flex items-center justify-between text-sm opacity-90">
            <span>平均ROI</span>
            <span className="font-semibold">{avgPersonalROI.toFixed(1)}%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-400 text-xs opacity-80">
            NISA・iDeCo・個別株投資
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">🚀 事業投資</h3>
          </div>
          <div className="text-3xl font-bold mb-2">¥{totalAnnualInvestment.toLocaleString()}</div>
          <div className="flex items-center justify-between text-sm opacity-90">
            <span>加重平均ROI</span>
            <span className="font-semibold">{weightedBusinessROI.toFixed(1)}%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-green-400 text-xs opacity-80">
            サービス開発・販促・人件費・設備・諸経費
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">🏢 法人資産価値</h3>
          </div>
          <div className="text-3xl font-bold mb-2">¥{corporateInfo.ownedValue.toLocaleString()}</div>
          <div className="flex items-center justify-between text-sm opacity-90">
            <span>持ち株割合</span>
            <span className="font-semibold">{corporateInfo.ownershipPercentage}%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-400 text-xs opacity-80">
            企業評価額の実質保有分
          </div>
        </div>
      </div>

      {/* 個人投資一覧 */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">💎 個人投資一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">投資名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">投資額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">開始日</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💎</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                        <div className="text-sm text-gray-500">{investment.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ¥{investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-blue-600">{investment.roi.toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {investment.date}
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

export default InvestmentManagement;
