const AccountingIntegration = () => {
  const connectedServices = [
    {
      name: "マネーフォワード会計",
      status: "connected",
      lastSync: "2時間前",
      icon: "📊",
    },
    {
      name: "マネーフォワードME",
      status: "connected",
      lastSync: "1時間前",
      icon: "💰",
    },
  ];

  const availableServices = [
    { name: "弥生会計", icon: "📋" },
    { name: "freee", icon: "🔷" },
    { name: "楽天銀行", icon: "🏦" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        会計データ連携・統合
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        各種会計サービスと連携して、データを自動で同期・統合します
      </p>

      {/* 連携済みサービス */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">連携済み</h2>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            すべて同期
          </button>
        </div>
        <div className="space-y-4">
          {connectedServices.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <div className="text-3xl mr-4">{service.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    最終同期: {service.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-sm text-green-600">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  接続中
                </span>
                <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                  設定
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 連携可能なサービス */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          連携可能なサービス
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableServices.map((service, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                連携する
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* データ同期状況 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          データ同期状況
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">
                仕訳データ
              </span>
            </div>
            <span className="text-sm text-gray-600">234件 同期済み</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">
                取引明細
              </span>
            </div>
            <span className="text-sm text-gray-600">156件 同期済み</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">
                個人支出データ
              </span>
            </div>
            <span className="text-sm text-gray-600">89件 同期済み</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingIntegration;



