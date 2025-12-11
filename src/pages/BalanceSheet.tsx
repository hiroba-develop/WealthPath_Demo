const BalanceSheet = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        バランスシート（貸借対照表）
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        資産・負債・純資産のバランスを把握し、財務健全性をスコア化します
      </p>

      {/* ビュー切り替え */}
      <div className="mt-6 flex space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
          事業用
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">
          個人用
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">
          統合
        </button>
      </div>

      {/* 財務指標 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">自己資本比率</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">68.5%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">健全</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">流動比率</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">245%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">健全</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総資産</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ¥18,680,000
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">前月比 +2.3%</p>
        </div>
      </div>

      {/* 貸借対照表 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            2025年12月31日時点（事業用）
          </h2>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            前期比較
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 資産の部 */}
          <div>
            <h3 className="text-md font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
              資産の部
            </h3>

            <div className="space-y-4">
              {/* 流動資産 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  流動資産
                </h4>
                <div className="ml-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">現金及び預金</span>
                    <span className="font-medium">¥5,950,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">売掛金</span>
                    <span className="font-medium">¥2,800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">前払費用</span>
                    <span className="font-medium">¥150,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>流動資産合計</span>
                    <span>¥8,900,000</span>
                  </div>
                </div>
              </div>

              {/* 固定資産 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  固定資産
                </h4>
                <div className="ml-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">有形固定資産</span>
                    <span className="font-medium">¥3,200,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">無形固定資産</span>
                    <span className="font-medium">¥1,580,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">投資その他の資産</span>
                    <span className="font-medium">¥5,000,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>固定資産合計</span>
                    <span>¥9,780,000</span>
                  </div>
                </div>
              </div>

              {/* 資産合計 */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>資産合計</span>
                  <span className="text-lg">¥18,680,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* 負債・純資産の部 */}
          <div>
            <h3 className="text-md font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">
              負債・純資産の部
            </h3>

            <div className="space-y-4">
              {/* 流動負債 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  流動負債
                </h4>
                <div className="ml-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">買掛金</span>
                    <span className="font-medium">¥1,200,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">未払金</span>
                    <span className="font-medium">¥2,430,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>流動負債合計</span>
                    <span>¥3,630,000</span>
                  </div>
                </div>
              </div>

              {/* 固定負債 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  固定負債
                </h4>
                <div className="ml-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">長期借入金</span>
                    <span className="font-medium">¥2,250,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>固定負債合計</span>
                    <span>¥2,250,000</span>
                  </div>
                </div>
              </div>

              {/* 負債合計 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>負債合計</span>
                  <span>¥5,880,000</span>
                </div>
              </div>

              {/* 純資産 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  純資産
                </h4>
                <div className="ml-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">資本金</span>
                    <span className="font-medium">¥1,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">利益剰余金</span>
                    <span className="font-medium">¥11,800,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>純資産合計</span>
                    <span>¥12,800,000</span>
                  </div>
                </div>
              </div>

              {/* 負債・純資産合計 */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>負債・純資産合計</span>
                  <span className="text-lg">¥18,680,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;



