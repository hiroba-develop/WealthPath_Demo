const FinancialAnalysis = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">財務3表統合分析</h1>
      <p className="mt-2 text-sm text-gray-600">
        損益計算書・貸借対照表・キャッシュフロー計算書を統合的に分析し、財務健全性を総合評価します
      </p>

      {/* 総合評価スコア */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">財務健全性スコア</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-6xl font-bold">82</div>
              <p className="text-sm mt-2 opacity-90">総合評価</p>
            </div>
            <div className="text-3xl">/ 100</div>
          </div>
          <p className="mt-4 text-sm opacity-90">
            あなたの財務状況は「良好」です。さらなる改善の余地があります。
          </p>
        </div>
      </div>

      {/* 4軸評価 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">収益性</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">85</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">営業利益率: 37.5%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">安全性</h3>
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">78</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">自己資本比率: 68.5%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">成長性</h3>
            <span className="text-2xl">🚀</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">88</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: "88%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">売上成長率: 15.2%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">効率性</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">76</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full"
              style={{ width: "76%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">総資産回転率: 2.1回</p>
        </div>
      </div>

      {/* AI分析による改善提案 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🤖</span>
          <h2 className="text-lg font-semibold text-gray-900">
            AI分析による改善提案
          </h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-semibold text-gray-900 mb-1">
              ✓ 強み: 高い収益性
            </h3>
            <p className="text-sm text-gray-600">
              営業利益率37.5%は業界平均（25%）を大きく上回っています。この収益性を維持しながら、さらなる事業拡大を検討できます。
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-semibold text-gray-900 mb-1">
              ⚠️ 改善の余地: 効率性の向上
            </h3>
            <p className="text-sm text-gray-600">
              総資産回転率が2.1回と、改善の余地があります。遊休資産の活用や在庫管理の最適化を検討しましょう。
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold text-gray-900 mb-1">
              💡 提案: 最適な投資配分
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              現在の財務状況から、以下の投資配分を推奨します：
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 事業投資: 月額15万円（マーケティング強化）</li>
              <li>• 個人投資: 月額20万円（NISA・iDeCo活用）</li>
              <li>• 緊急資金: 月額5万円（安全性の維持）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 投資配分シミュレーション */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          事業投資 vs 個人投資 最適配分シミュレーション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">現在の配分</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">事業投資</span>
                <span className="text-sm font-bold">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">個人投資</span>
                <span className="text-sm font-bold">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">10年後予測純資産</p>
              <p className="text-2xl font-bold text-gray-900">¥58,200,000</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-700 mb-3">
              ✓ 推奨配分
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">事業投資</span>
                <span className="text-sm font-bold">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">個人投資</span>
                <span className="text-sm font-bold">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">緊急資金</span>
                <span className="text-sm font-bold">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-green-700">10年後予測純資産</p>
              <p className="text-2xl font-bold text-green-700">¥64,800,000</p>
              <p className="text-sm text-green-600 mt-1">
                +¥6,600,000の改善
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;



