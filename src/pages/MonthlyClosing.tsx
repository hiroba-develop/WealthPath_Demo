const MonthlyClosing = () => {
  const checklistItems = [
    { id: 1, title: "仕訳入力の完了確認", completed: true },
    { id: 2, title: "銀行口座の残高照合", completed: true },
    { id: 3, title: "未払金・未収金の確認", completed: true },
    { id: 4, title: "在庫の棚卸", completed: false },
    { id: 5, title: "固定資産の減価償却", completed: true },
    { id: 6, title: "前払費用・前受収益の計上", completed: false },
    { id: 7, title: "損益計算書の確認", completed: true },
    { id: 8, title: "税理士レビュー依頼", completed: false },
  ];

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">月次決算</h1>
      <p className="mt-2 text-sm text-gray-600">
        毎月の財務状況を確認し、8項目のチェックリストで漏れなく処理します
      </p>

      {/* 進捗状況 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              2025年12月 月次決算
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {completedCount} / {checklistItems.length} 項目完了
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(progressPercentage)}%
            </div>
            <p className="text-sm text-gray-600">完了率</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* チェックリスト */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            決算チェックリスト
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {checklistItems.map((item) => (
            <li
              key={item.id}
              className="px-6 py-4 hover:bg-gray-50 flex items-center"
            >
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span
                className={`ml-4 text-sm font-medium ${
                  item.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-900"
                }`}
              >
                {item.title}
              </span>
              {!item.completed && (
                <button className="ml-auto px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  実行
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 今月の財務サマリー */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            事業用損益
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">売上高</span>
              <span className="text-sm font-bold text-gray-900">
                ¥3,200,000
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">売上原価</span>
              <span className="text-sm font-bold text-gray-900">¥800,000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">売上総利益</span>
              <span className="text-sm font-bold text-gray-900">
                ¥2,400,000
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">販管費</span>
              <span className="text-sm font-bold text-gray-900">
                ¥1,200,000
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold text-gray-900">営業利益</span>
              <span className="text-lg font-bold text-blue-600">
                ¥1,200,000
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            個人収支
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">役員報酬</span>
              <span className="text-sm font-bold text-gray-900">¥450,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">投資収益</span>
              <span className="text-sm font-bold text-gray-900">¥80,000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">収入合計</span>
              <span className="text-sm font-bold text-gray-900">¥530,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">生活費</span>
              <span className="text-sm font-bold text-gray-900">¥320,000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold text-gray-900">
                個人貯蓄
              </span>
              <span className="text-lg font-bold text-green-600">¥210,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mt-6 flex space-x-4">
        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
          税理士にレビュー依頼
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
          レポートをダウンロード
        </button>
      </div>
    </div>
  );
};

export default MonthlyClosing;



