const Reports = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">レポート</h1>
      <p className="mt-2 text-sm text-gray-600">
        事業用・個人用・総合の3つの視点で財務状況を分析し、月次・四半期・年次レポートを作成します
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
          総合
        </button>
      </div>

      {/* レポート期間選択 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              レポート期間を選択
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              分析したい期間を選択してください
            </p>
          </div>
          <div className="flex space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
              <option>2025年12月</option>
              <option>2025年11月</option>
              <option>2025年10月</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              レポート生成
            </button>
          </div>
        </div>
      </div>

      {/* 利用可能なレポート */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📊</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              最新
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            月次レポート
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            今月の収支・資産状況を詳細分析
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">2025年12月</span>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              表示 →
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📈</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              Q4
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            四半期レポート
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            3ヶ月間のトレンドと推移を分析
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">2025年Q4</span>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              表示 →
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📅</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              年次
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            年次レポート
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            1年間の総括と次年度計画
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">2025年</span>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              表示 →
            </button>
          </div>
        </div>
      </div>

      {/* 月次レポートプレビュー */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          2025年12月 月次レポート（事業用）
        </h2>

        <div className="space-y-6">
          {/* サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">売上高</p>
              <p className="text-2xl font-bold text-gray-900">¥3,200,000</p>
              <p className="text-xs text-green-600 mt-1">↑ 前月比 +8.2%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">営業利益</p>
              <p className="text-2xl font-bold text-gray-900">¥1,200,000</p>
              <p className="text-xs text-green-600 mt-1">↑ 前月比 +12.5%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">営業利益率</p>
              <p className="text-2xl font-bold text-gray-900">37.5%</p>
              <p className="text-xs text-green-600 mt-1">↑ 前月比 +3.8pt</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">営業CF</p>
              <p className="text-2xl font-bold text-gray-900">¥1,200,000</p>
              <p className="text-xs text-green-600 mt-1">↑ 前月比 +15.3%</p>
            </div>
          </div>

          {/* AI分析コメント */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🤖</span>
              <h3 className="font-semibold text-gray-900">AI分析コメント</h3>
            </div>
            <p className="text-sm text-gray-700">
              今月は売上・利益ともに好調でした。特に営業利益率が37.5%と高水準を維持しており、収益性の高いビジネスモデルが確立されています。一方で、売掛金の回収に若干の遅れが見られるため、キャッシュフロー管理に注意が必要です。
            </p>
          </div>

          {/* グラフエリア */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              月次推移グラフ
            </h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              ここにチャートが表示されます
            </div>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex space-x-4">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              PDFでダウンロード
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
              Excelでダウンロード
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;



