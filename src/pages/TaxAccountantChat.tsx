import { useState } from "react";

interface Message {
  id: string;
  sender: "user" | "accountant";
  content: string;
  timestamp: string;
  read: boolean;
}

const TaxAccountantChat = () => {
  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "accountant",
      content:
        "こんにちは。王子クラウド会計事務所の田中です。今月の決算について何かご質問はありますか？",
      timestamp: "2025-12-09 10:30",
      read: true,
    },
    {
      id: "2",
      sender: "user",
      content:
        "今月の売上が好調なのですが、節税対策として何かできることはありますか？",
      timestamp: "2025-12-09 11:15",
      read: true,
    },
    {
      id: "3",
      sender: "accountant",
      content:
        "はい、いくつか提案があります。まず、小規模企業共済への加入をご検討されてはいかがでしょうか。年間最大84万円の所得控除が可能です。また、法人での資産運用も効果的です。詳細をご説明いたしましょうか？",
      timestamp: "2025-12-09 11:45",
      read: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">税理士チャット</h1>
      <p className="mt-2 text-sm text-gray-600">
        王子クラウド会計事務所の税理士にリアルタイムで相談できます
      </p>

      {/* 税理士情報 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            👨‍💼
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">田中 太郎</h2>
            <p className="text-sm text-gray-600">
              税理士 / 王子クラウド会計事務所
            </p>
            <div className="flex items-center mt-1">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-xs text-green-600">オンライン</span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              定期レビュー予約
            </button>
          </div>
        </div>
      </div>

      {/* チャットエリア */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        {/* メッセージリスト */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                } rounded-lg p-4`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* メッセージ入力エリア */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              送信
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※営業時間: 平日 9:00-18:00 / 通常24時間以内に返信します
          </p>
        </div>
      </div>

      {/* クイック質問 */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          よくある質問
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
            💰 役員報酬の最適額は？
          </button>
          <button className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
            📋 確定申告の準備について
          </button>
          <button className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
            🏢 法人化のタイミングは？
          </button>
          <button className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
            💡 節税対策を教えてください
          </button>
        </div>
      </div>

      {/* サービス内容 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          税理士連携サービス
        </h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>リアルタイムチャット相談:</strong>{" "}
              税務・財務の疑問を気軽に質問
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>四半期ごとの財務レビュー:</strong>{" "}
              定期的な経営分析とアドバイス
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>確定申告・決算サポート:</strong>{" "}
              期限に合わせた丁寧なサポート
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>戦略的アドバイス:</strong>{" "}
              資産形成と税務最適化の統合提案
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TaxAccountantChat;



