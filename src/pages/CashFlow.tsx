const CashFlow = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        キャッシュフロー管理
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        事業と個人のキャッシュの流れを3区分で可視化し、将来の資金繰りを予測します
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

      {/* 今月のキャッシュフロー */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          2025年12月 キャッシュフロー（事業用）
        </h2>

        <div className="space-y-6">
          {/* 営業CF */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              営業活動によるキャッシュフロー
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">営業収入</span>
                <span className="font-medium text-gray-900">+¥3,200,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">仕入支出</span>
                <span className="font-medium text-gray-900">-¥800,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">経費支出</span>
                <span className="font-medium text-gray-900">-¥1,200,000</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold text-gray-900">小計</span>
                <span className="text-lg font-bold text-blue-600">
                  +¥1,200,000
                </span>
              </div>
            </div>
          </div>

          {/* 投資CF */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              投資活動によるキャッシュフロー
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">設備投資</span>
                <span className="font-medium text-gray-900">-¥200,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ソフトウェア投資</span>
                <span className="font-medium text-gray-900">-¥150,000</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold text-gray-900">小計</span>
                <span className="text-lg font-bold text-purple-600">
                  -¥350,000
                </span>
              </div>
            </div>
          </div>

          {/* 財務CF */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              財務活動によるキャッシュフロー
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">借入金返済</span>
                <span className="font-medium text-gray-900">-¥100,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">配当金支払</span>
                <span className="font-medium text-gray-900">¥0</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold text-gray-900">小計</span>
                <span className="text-lg font-bold text-green-600">
                  -¥100,000
                </span>
              </div>
            </div>
          </div>

          {/* 合計 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                現金及び現金同等物の増減
              </span>
              <span className="text-2xl font-bold text-blue-600">
                +¥750,000
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">期首残高</span>
                <span className="font-medium">¥5,200,000</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">期末残高</span>
                <span className="text-xl font-bold text-gray-900">
                  ¥5,950,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 将来予測 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          今後3ヶ月の残高予測
        </h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
          ここにチャートが表示されます
        </div>
      </div>
    </div>
  );
};

export default CashFlow;



