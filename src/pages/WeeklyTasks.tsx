import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "urgent" | "high" | "medium" | "low";
  completed: boolean;
  dueDate: string;
  actionLink?: string;
  type?: string;
  count?: number;
  amount?: string;
  duration?: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  value?: string;
}

const WeeklyTasks = () => {
  // モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // フォーム状態
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
    actionLink: "",
  });

  // 連続ログイン週数とポイント
  const [weeklyStreak] = useState(12);
  const [weeklyPoints, setWeeklyPoints] = useState(240);

  // 週次情報
  const currentWeek = {
    year: 2025,
    month: 12,
    week: 2,
    startDate: "12/9",
    endDate: "12/15",
  };

  // 目標設定
  const goals = {
    tenYearTarget: 100000000, // 10年後の目標純資産
    currentAssets: 31160000, // 現在の総資産
    monthlyTarget: 500000, // 月次貯蓄目標
    currentMonthSavings: 460000, // 今月の貯蓄実績
  };

  const goalProgress = (goals.currentAssets / goals.tenYearTarget) * 100;
  const monthlyProgress = (goals.currentMonthSavings / goals.monthlyTarget) * 100;
  const gap = goals.tenYearTarget - goals.currentAssets;

  // 週次健全性スコア
  const weeklyMetrics = {
    healthScore: 87,
    healthScoreChange: 3,
    revenue: 95,
    expenses: 32,
    cashFlow: 63,
    tasksCompleted: 9,
    tasksTotal: 12,
  };

  // 3分チェックリスト
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "現金残高を確認",
      description: "現在: ¥320万円",
      completed: false,
      value: "¥320万円",
    },
    {
      id: "2",
      title: "未処理領収書をチェック",
      description: "未処理: 3件",
      completed: false,
      value: "3件",
    },
    {
      id: "3",
      title: "今週の売上を記録",
      description: "先週: ¥95万円",
      completed: false,
      value: "¥95万円",
    },
    {
      id: "4",
      title: "重要な支払いを確認",
      description: "今週: 2件",
      completed: false,
      value: "2件",
    },
  ]);

  const checklistProgress = (checklist.filter((item) => item.completed).length / checklist.length) * 100;

  // チェックリスト完了処理
  const handleChecklistToggle = (id: string) => {
    const newChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(newChecklist);

    // 全て完了したらポイント付与
    if (newChecklist.every((item) => item.completed)) {
      setWeeklyPoints(weeklyPoints + 10);
    }
  };

  // 緊急タスク
  const urgentTasks: Task[] = [
    {
      id: "u1",
      title: "請求書 #1234 支払期限明日",
      category: "支払",
      priority: "urgent",
      completed: false,
      dueDate: "明日",
      type: "payment",
    },
    {
      id: "u2",
      title: "領収書3件が未処理",
      category: "経理",
      priority: "urgent",
      completed: false,
      dueDate: "今日",
      type: "receipt",
      count: 3,
      actionLink: "/accounting-integration",
    },
  ];

  // 重要タスク
  const importantTasks: Task[] = [
    {
      id: "i1",
      title: "NISA投資枠の消化",
      category: "投資",
      priority: "high",
      completed: false,
      dueDate: "今週中",
      amount: "5万円",
      actionLink: "/investment-management",
    },
    {
      id: "i2",
      title: "月次決算レビュー",
      category: "会計",
      priority: "high",
      completed: false,
      dueDate: "12/12",
      duration: "15分",
      actionLink: "/monthly-closing",
    },
  ];

  // 通常タスク（localStorageから読み込み）
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("weeklyTasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [
      {
        id: "1",
        title: "月次決算の確認と承認",
        category: "会計",
        priority: "high",
        completed: false,
        dueDate: "2025-12-10",
        actionLink: "/monthly-closing",
      },
      {
        id: "2",
        title: "請求書の発行（3件）",
        category: "経理",
        priority: "high",
        completed: false,
        dueDate: "2025-12-11",
      },
      {
        id: "3",
        title: "税理士との定例ミーティング",
        category: "税務",
        priority: "medium",
        completed: false,
        dueDate: "2025-12-12",
        actionLink: "/tax-accountant-chat",
      },
      {
        id: "4",
        title: "投資ポートフォリオのリバランス検討",
        category: "投資",
        priority: "medium",
        completed: false,
        dueDate: "2025-12-13",
        actionLink: "/investment-management",
      },
      {
        id: "5",
        title: "役員報酬の最適化シミュレーション",
        category: "税務",
        priority: "low",
        completed: false,
        dueDate: "2025-12-14",
        actionLink: "/tax-optimization",
      },
    ];
  });

  // tasksが変更されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  // おすすめアクション
  const recommendedActions = [
    {
      id: "1",
      title: "役員報酬を見直すと年間48万円節税可能",
      impact: "¥48万円",
      category: "tax",
      link: "/tax-optimization",
    },
    {
      id: "2",
      title: "今週中にiDeCo拠出で税効果アップ",
      impact: "¥8万円",
      category: "investment",
      link: "/investment-management",
    },
    {
      id: "3",
      title: "固定費の見直しで月1万円削減可能",
      impact: "¥12万円/年",
      category: "expense",
      link: "/monthly-closing",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "緊急";
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "";
    }
  };

  // タスク追加・編集のモーダルを開く
  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate,
        actionLink: task.actionLink || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        category: "",
        priority: "medium",
        dueDate: "",
        actionLink: "",
      });
    }
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: "",
      category: "",
      priority: "medium",
      dueDate: "",
      actionLink: "",
    });
  };

  // タスクを追加
  const addTask = () => {
    if (!formData.title || !formData.category || !formData.dueDate) {
      alert("タイトル、カテゴリ、期限は必須です");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      completed: false,
      dueDate: formData.dueDate,
      actionLink: formData.actionLink || undefined,
    };

    setTasks([...tasks, newTask]);
    closeModal();
  };

  // タスクを更新
  const updateTask = () => {
    if (!formData.title || !formData.category || !formData.dueDate || !editingTask) {
      alert("タイトル、カテゴリ、期限は必須です");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title,
              category: formData.category,
              priority: formData.priority,
              dueDate: formData.dueDate,
              actionLink: formData.actionLink || undefined,
            }
          : task
      )
    );
    closeModal();
  };

  // タスクを削除
  const deleteTask = (id: string) => {
    if (confirm("このタスクを削除しますか？")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // タスクの完了状態をトグル
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  // フォーム入力ハンドラ
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">今週のやること</h1>
            <p className="text-white/90">
              {currentWeek.year}年{currentWeek.month}月 第{currentWeek.week}週 (
              {currentWeek.startDate} - {currentWeek.endDate})
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">連続ログイン</div>
            <div className="text-4xl font-bold flex items-center gap-2">
              {weeklyStreak}週<span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-90 mb-1">今週の健全性スコア</div>
            <div className="text-3xl font-bold">{weeklyMetrics.healthScore}点</div>
            <div className="text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              +{weeklyMetrics.healthScoreChange}点
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-90 mb-1">今週の売上</div>
            <div className="text-3xl font-bold">¥{weeklyMetrics.revenue}万</div>
            <div className="text-sm mt-1">先週比 +8%</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-90 mb-1">今週の経費</div>
            <div className="text-3xl font-bold">¥{weeklyMetrics.expenses}万</div>
            <div className="text-sm mt-1">予算内 ✓</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-90 mb-1">週次ポイント</div>
            <div className="text-3xl font-bold">{weeklyPoints}</div>
            <div className="text-sm mt-1">累計ポイント</div>
          </div>
        </div>
      </div>

      {/* 3分チェックリスト */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              週次3分チェック
            </h2>
            <p className="text-sm text-gray-600 mt-1">完了すると +10ポイント獲得</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {checklist.filter((item) => item.completed).length}/{checklist.length}
            </div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${checklistProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChecklistToggle(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                item.completed
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.completed ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}
              >
                {item.completed && (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              {!item.completed && (
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {checklistProgress === 100 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-green-900">週次チェック完了！</div>
                <div className="text-sm text-green-700">+10ポイント獲得しました</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 緊急・重要タスク */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 緊急タスク */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-gray-900">⚠️ 緊急 ({urgentTasks.length}件)</h3>
          </div>

          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div key={task.id} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{task.title}</div>
                    <div className="text-sm text-red-700 mt-1">
                      期限: {task.dueDate}
                      {task.count && ` · ${task.count}件`}
                    </div>
                  </div>
                  {task.actionLink ? (
                    <Link
                      to={task.actionLink}
                      className="ml-3 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 whitespace-nowrap"
                    >
                      対応する
                    </Link>
                  ) : (
                    <button className="ml-3 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 whitespace-nowrap">
                      対応する
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 重要タスク */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900">重要 ({importantTasks.length}件)</h3>
          </div>

          <div className="space-y-3">
            {importantTasks.map((task) => (
              <div key={task.id} className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-yellow-900">{task.title}</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      {task.duration && `所要時間: ${task.duration}`}
                      {task.amount && task.amount}
                      {task.dueDate && ` · 期限: ${task.dueDate}`}
                    </div>
                  </div>
                  {!task.completed && task.actionLink ? (
                    <Link
                      to={task.actionLink}
                      className="ml-3 px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 whitespace-nowrap"
                    >
                      確認
                    </Link>
                  ) : !task.completed ? (
                    <button className="ml-3 px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 whitespace-nowrap">
                      確認
                    </button>
                  ) : (
                    <div className="text-green-600 flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* おすすめアクション */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900">💡 おすすめアクション</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {recommendedActions.map((action) => (
            <Link
              key={action.id}
              to={action.link}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {action.category === "tax" && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {action.category === "investment" && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  )}
                  {action.category === "expense" && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-2">{action.title}</div>
                  <div className="text-lg font-bold text-purple-600">{action.impact}</div>
                  <div className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                    詳細を見る
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 目標との差分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 10年後目標の進捗 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              10年後目標の進捗
            </h2>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">現在の資産</span>
              <span className="font-bold text-gray-900">
                ¥{goals.currentAssets.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">目標資産（10年後）</span>
              <span className="font-bold text-blue-600">
                ¥{goals.tenYearTarget.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
              <div
                className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${goalProgress}%` }}
              >
                <span className="text-xs text-white font-semibold">
                  {goalProgress.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">あと</span>
              <span className="text-xl font-bold text-orange-600">
                ¥{gap.toLocaleString()}
              </span>
            </div>
            <Link
              to="/simulation"
              className="mt-3 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              シミュレーションを見る
            </Link>
          </div>
        </div>

        {/* 今月の貯蓄目標 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              今月の貯蓄目標
            </h2>
            <span className="text-2xl">💰</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">今月の実績</span>
              <span className="font-bold text-gray-900">
                ¥{goals.currentMonthSavings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">月次目標</span>
              <span className="font-bold text-green-600">
                ¥{goals.monthlyTarget.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
              <div
                className={`h-4 rounded-full flex items-center justify-end pr-2 ${
                  monthlyProgress >= 100 ? "bg-green-600" : "bg-yellow-500"
                }`}
                style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
              >
                <span className="text-xs text-white font-semibold">
                  {monthlyProgress.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            {monthlyProgress >= 100 ? (
              <div className="text-center">
                <p className="text-sm text-green-600 font-semibold">
                  ✓ 今月の目標達成！
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">あと</span>
                  <span className="text-xl font-bold text-orange-600">
                    ¥{(goals.monthlyTarget - goals.currentMonthSavings).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  残り{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}日
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 打ち手の提案 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <span className="text-3xl mr-4">💡</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              目標達成のための打ち手
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>追加投資:</strong> 今月あと¥40,000を投資に回すことで、月次目標を達成できます。
                  <Link to="/investment-management" className="text-blue-600 hover:underline ml-1">
                    投資管理へ →
                  </Link>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>税務最適化:</strong> 役員報酬を見直すことで、年間¥48万円の節税が可能です。
                  <Link to="/tax-optimization" className="text-blue-600 hover:underline ml-1">
                    詳細を見る →
                  </Link>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>経費の見直し:</strong> 今月の経費が平均より15%高くなっています。不要な固定費を削減しましょう。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* その他のタスク一覧 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">その他のタスク</h2>
              <p className="mt-1 text-sm text-gray-500">
                {tasks.filter((t) => !t.completed).length}件の未完了タスク
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              タスクを追加
            </button>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p
                          className={`text-sm font-medium ${
                            task.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="mr-4">{task.category}</span>
                        <span>期限: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!task.completed && task.actionLink && (
                      <Link
                        to={task.actionLink}
                        className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        実行
                      </Link>
                    )}
                    <button
                      onClick={() => openModal(task)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="編集"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      {/* モチベーションメッセージ */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">素晴らしい！{weeklyStreak}週連続です 🎉</h4>
            <p className="text-white/90 mb-3">
              週次チェックを継続することで、財務の健全性が着実に向上しています。この調子で続ければ、10年後の目標達成確率は95%以上です！
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                目標まで: あと¥{(gap / 10000).toFixed(0)}万円
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                前月比: +2.3%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タスク追加・編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTask ? "タスクを編集" : "新しいタスクを追加"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: 月次決算の確認"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: 会計"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  優先度 <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="urgent">緊急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  期限 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アクションリンク（任意）
                </label>
                <input
                  type="text"
                  name="actionLink"
                  value={formData.actionLink}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: /monthly-closing"
                />
                <p className="mt-1 text-xs text-gray-500">
                  ページへのリンクを設定すると「実行」ボタンが表示されます
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={editingTask ? updateTask : addTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingTask ? "更新" : "追加"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTasks;
