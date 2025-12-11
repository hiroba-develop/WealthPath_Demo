const TaxOptimization = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">税務最適化</h1>
      <p className="mt-2 text-sm text-gray-600">
        個人と法人の税率差を活用し、合法的に手取りを最大化する戦略を提案します
      </p>

      {/* 年間節税効果 */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 text-white">
        <h2 className="text-xl font-bold mb-2">年間予想節税効果</h2>
        <div className="text-5xl font-bold mb-4">¥1,280,000</div>
        <p className="text-sm opacity-90">
          最適化戦略を実行することで期待できる節税額
        </p>
      </div>

      {/* 役員報酬最適化 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          役員報酬の最適化
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">現在の役員報酬</div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ¥600,000/月
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">所得税</span>
                <span className="font-medium">¥98,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">住民税</span>
                <span className="font-medium">¥48,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">社会保険料</span>
                <span className="font-medium">¥87,000</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">手取り額</span>
                <span className="font-bold text-gray-900">¥367,000</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="text-sm text-green-700 mb-2 flex items-center">
              <span className="mr-2">✓</span>
              推奨される役員報酬
            </div>
            <div className="text-2xl font-bold text-green-700 mb-4">
              ¥450,000/月
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">所得税</span>
                <span className="font-medium">¥58,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">住民税</span>
                <span className="font-medium">¥36,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">社会保険料</span>
                <span className="font-medium">¥65,000</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">手取り額</span>
                <span className="font-bold text-green-700">¥291,000</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-green-200">
              <p className="text-xs text-gray-600">
                ※法人に資金を残すことで、より効率的な節税と資産形成が可能です
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 節税戦略リスト */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          実行可能な節税戦略
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start border-b pb-4">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">💼</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                小規模企業共済への加入
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                年間最大84万円の所得控除が可能。節税効果: 約¥252,000/年
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                詳細を見る →
              </button>
            </div>
          </li>
          <li className="flex items-start border-b pb-4">
            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🏢</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                法人での資産運用
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                法人で投資することで、個人よりも低い税率で運用可能。節税効果:
                約¥380,000/年
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                詳細を見る →
              </button>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                iDeCo・NISAの最大活用
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                個人の投資枠を最大限に活用。節税効果: 約¥648,000/年
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                詳細を見る →
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TaxOptimization;



