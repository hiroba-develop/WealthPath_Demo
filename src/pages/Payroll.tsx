import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  type: "owner" | "employee";
  position: string;
  baseSalary: number;
  allowances: {
    commute: number;
    housing: number;
    family: number;
    other: number;
  };
  deductions: {
    incomeTax: number;
    residentTax: number;
    healthInsurance: number;
    pensionInsurance: number;
    employmentInsurance: number;
  };
  status: "pending" | "paid";
  paymentDate?: string;
  joinDate: string;
  email: string;
  phone: string;
}

interface PayrollHistory {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  paymentDate: string;
  status: "paid" | "pending";
}

const Payroll = () => {
  const [selectedTab, setSelectedTab] = useState<"overview" | "employees" | "owner" | "history">("overview");
  const [viewMode, setViewMode] = useState<"all" | "personal" | "business">("all");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  
  // 従業員追加フォームの状態
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    baseSalary: 0,
    commuteAllowance: 0,
    housingAllowance: 0,
    familyAllowance: 0,
    joinDate: "",
  });

  // オーナー（自分）の給与情報
  const [ownerSalary] = useState<Employee>({
    id: "owner-1",
    name: "山田 太郎",
    type: "owner",
    position: "代表取締役",
    baseSalary: 500000,
    allowances: {
      commute: 0,
      housing: 0,
      family: 0,
      other: 0,
    },
    deductions: {
      incomeTax: 65000,
      residentTax: 42000,
      healthInsurance: 35000,
      pensionInsurance: 37000,
      employmentInsurance: 0,
    },
    status: "paid",
    paymentDate: "2025-12-25",
    joinDate: "2020-04-01",
    email: "yamada@wealthpath.co.jp",
    phone: "090-1234-5678",
  });

  // 従業員リスト
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp-1",
      name: "佐藤 花子",
      type: "employee",
      position: "経理マネージャー",
      baseSalary: 350000,
      allowances: {
        commute: 15000,
        housing: 30000,
        family: 10000,
        other: 0,
      },
      deductions: {
        incomeTax: 42000,
        residentTax: 28000,
        healthInsurance: 28000,
        pensionInsurance: 30000,
        employmentInsurance: 2430,
      },
      status: "paid",
      paymentDate: "2025-12-25",
      joinDate: "2021-06-01",
      email: "sato@wealthpath.co.jp",
      phone: "090-2345-6789",
    },
    {
      id: "emp-2",
      name: "鈴木 一郎",
      type: "employee",
      position: "営業担当",
      baseSalary: 320000,
      allowances: {
        commute: 12000,
        housing: 25000,
        family: 15000,
        other: 5000,
      },
      deductions: {
        incomeTax: 38000,
        residentTax: 25000,
        healthInsurance: 26000,
        pensionInsurance: 28000,
        employmentInsurance: 2262,
      },
      status: "pending",
      joinDate: "2022-08-15",
      email: "suzuki@wealthpath.co.jp",
      phone: "090-3456-7890",
    },
    {
      id: "emp-3",
      name: "田中 美咲",
      type: "employee",
      position: "アシスタント",
      baseSalary: 250000,
      allowances: {
        commute: 10000,
        housing: 0,
        family: 0,
        other: 0,
      },
      deductions: {
        incomeTax: 28000,
        residentTax: 18000,
        healthInsurance: 20000,
        pensionInsurance: 22000,
        employmentInsurance: 1560,
      },
      status: "pending",
      joinDate: "2023-04-01",
      email: "tanaka@wealthpath.co.jp",
      phone: "090-4567-8901",
    },
  ]);

  // 給与履歴（サンプルデータ）
  const payrollHistory: PayrollHistory[] = [
    {
      id: "hist-1",
      employeeId: "owner-1",
      month: "2025-11",
      baseSalary: 500000,
      totalAllowances: 0,
      totalDeductions: 179000,
      netSalary: 321000,
      paymentDate: "2025-11-25",
      status: "paid",
    },
    {
      id: "hist-2",
      employeeId: "emp-1",
      month: "2025-11",
      baseSalary: 350000,
      totalAllowances: 55000,
      totalDeductions: 130430,
      netSalary: 274570,
      paymentDate: "2025-11-25",
      status: "paid",
    },
  ];

  const calculateTotalSalary = (emp: Employee) => {
    return emp.baseSalary + Object.values(emp.allowances).reduce((a, b) => a + b, 0);
  };

  const calculateTotalDeductions = (emp: Employee) => {
    return Object.values(emp.deductions).reduce((a, b) => a + b, 0);
  };

  const calculateNetSalary = (emp: Employee) => {
    return calculateTotalSalary(emp) - calculateTotalDeductions(emp);
  };

  const allEmployees = [ownerSalary, ...employees];
  
  // 自分の給与（収入）
  const myIncome = calculateNetSalary(ownerSalary);
  
  // 従業員への支払い（支出）
  const employeeExpense = employees.reduce((sum, emp) => sum + calculateTotalSalary(emp), 0);

  const handleAddEmployee = () => {
    setShowAddEmployee(true);
  };
  
  const handleSaveNewEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.baseSalary || !newEmployee.joinDate) {
      alert("必須項目を入力してください");
      return;
    }
    
    const totalSalary = newEmployee.baseSalary + newEmployee.commuteAllowance + newEmployee.housingAllowance + newEmployee.familyAllowance;
    
    // 控除額の概算計算（実際の計算は簡略化）
    const incomeTax = Math.floor(totalSalary * 0.10);
    const residentTax = Math.floor(totalSalary * 0.07);
    const healthInsurance = Math.floor(totalSalary * 0.08);
    const pensionInsurance = Math.floor(totalSalary * 0.09);
    const employmentInsurance = Math.floor(totalSalary * 0.006);
    
    const employee: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmployee.name,
      type: "employee",
      position: newEmployee.position,
      baseSalary: newEmployee.baseSalary,
      allowances: {
        commute: newEmployee.commuteAllowance,
        housing: newEmployee.housingAllowance,
        family: newEmployee.familyAllowance,
        other: 0,
      },
      deductions: {
        incomeTax,
        residentTax,
        healthInsurance,
        pensionInsurance,
        employmentInsurance,
      },
      status: "pending",
      joinDate: newEmployee.joinDate,
      email: newEmployee.email,
      phone: newEmployee.phone,
    };
    
    setEmployees([...employees, employee]);
    setShowAddEmployee(false);
    
    // フォームをリセット
    setNewEmployee({
      name: "",
      position: "",
      email: "",
      phone: "",
      baseSalary: 0,
      commuteAllowance: 0,
      housingAllowance: 0,
      familyAllowance: 0,
      joinDate: "",
    });
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("この従業員を削除してもよろしいですか？")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: "paid" as const, paymentDate: new Date().toISOString().split("T")[0] }
          : emp
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">給与計算</h1>
      <p className="mt-2 text-sm text-gray-600">
            役員報酬と従業員給与を一元管理し、個人と事業の資金フローを可視化します
      </p>
        </div>
        <div className="flex space-x-3">
          {/* ビュー切り替えボタン */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setViewMode("personal")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "personal"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              💎 個人
            </button>
            <button
              onClick={() => setViewMode("business")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "business"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🚀 事業
            </button>
        </div>
          <button
            onClick={handleAddEmployee}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            従業員を追加
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`${
              selectedTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            概要
          </button>
          <button
            onClick={() => setSelectedTab("owner")}
            className={`${
              selectedTab === "owner"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            自分の給与
          </button>
          <button
            onClick={() => setSelectedTab("employees")}
            className={`${
              selectedTab === "employees"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            従業員給与
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`${
              selectedTab === "history"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            給与履歴
          </button>
        </nav>
      </div>

      {/* 概要タブ */}
      {selectedTab === "overview" && (
        <div>
          {/* サマリーカード - 個人と事業の分離 */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 個人（自分の収入） */}
            {(viewMode === "all" || viewMode === "personal") && (
              <div className={`bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg ${viewMode !== "all" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">💎 個人（自分の収入）</h3>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <div className="text-3xl font-bold mb-2">
                  +¥{myIncome.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>役員報酬の手取り</span>
                  <span className="font-semibold">月額</span>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400 text-sm opacity-90">
                  <div className="flex justify-between">
                    <span>総支給額</span>
                    <span>¥{calculateTotalSalary(ownerSalary).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>控除額</span>
                    <span>-¥{calculateTotalDeductions(ownerSalary).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 事業（従業員への支出） */}
            {(viewMode === "all" || viewMode === "business") && (
              <div className={`bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg ${viewMode !== "all" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">🚀 事業（従業員人件費）</h3>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <div className="text-3xl font-bold mb-2">
                  -¥{employeeExpense.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>従業員への支払い</span>
                  <span className="font-semibold">{employees.length}名</span>
                </div>
                <div className="mt-4 pt-4 border-t border-red-400 text-sm opacity-90">
                  <div className="flex justify-between">
                    <span>平均給与</span>
                    <span>
                      {employees.length > 0 
                        ? `¥${Math.floor(employeeExpense / employees.length).toLocaleString()}`
                        : "¥0"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>年間人件費</span>
                    <span>¥{(employeeExpense * 12).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 自分の給与詳細 - 個人 */}
          {(viewMode === "all" || viewMode === "personal") && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">💎 個人収入: 自分の給与</h2>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-blue-500 p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">
                      {ownerSalary.name.substring(0, 2)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{ownerSalary.name}</h3>
                    <p className="text-sm text-gray-600">{ownerSalary.position}</p>
                  </div>
                  <span className="ml-auto px-3 py-1 text-sm rounded bg-purple-100 text-purple-800">
                    役員報酬
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-xs text-gray-600">基本給</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">¥{ownerSalary.baseSalary.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-xs text-gray-600">総支給額</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">¥{calculateTotalSalary(ownerSalary).toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-xs text-gray-600">控除額</p>
                    <p className="text-lg font-bold text-red-600 mt-1">-¥{calculateTotalDeductions(ownerSalary).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-xs text-gray-600">手取り額</p>
                    <p className="text-xl font-bold text-green-600 mt-1">¥{calculateNetSalary(ownerSalary).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTab("owner")}
                  className="mt-4 w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  詳細を見る
                </button>
              </div>
            </div>
          )}

          {/* 従業員給与一覧 - 事業 */}
          {(viewMode === "all" || viewMode === "business") && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">🚀 事業支出: 従業員への給与</h2>
                <span className="ml-3 text-sm text-gray-500">（{employees.length}名）</span>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-red-500">
                {employees.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">従業員が登録されていません</h3>
                    <p className="mt-1 text-sm text-gray-500">右上の「従業員を追加」ボタンから従業員を登録してください</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <div key={employee.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {employee.name.substring(0, 2)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-semibold text-gray-900">{employee.name}</h3>
                              <p className="text-xs text-gray-500">{employee.position}</p>
                            </div>
                          </div>
                          <div className="flex space-x-4 text-sm">
                            <div className="text-right">
                              <p className="text-xs text-gray-500">総支給額</p>
                              <p className="font-semibold text-gray-900">¥{calculateTotalSalary(employee).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">手取り額</p>
                              <p className="font-semibold text-green-600">¥{calculateNetSalary(employee).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {employee.status === "paid" ? (
                                <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">支払済</span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleMarkAsPaid(employee.id)}
                                    className="text-xs px-2 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50"
                                  >
                                    支払済にする
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="text-xs px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                                  >
                                    削除
            </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 自分の給与タブ */}
      {selectedTab === "owner" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">役員報酬の詳細</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">基本情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">氏名</p>
                  <p className="font-medium text-gray-900">{ownerSalary.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">役職</p>
                  <p className="font-medium text-gray-900">{ownerSalary.position}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">メールアドレス</p>
                  <p className="font-medium text-gray-900">{ownerSalary.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">就任日</p>
                  <p className="font-medium text-gray-900">{ownerSalary.joinDate}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">給与詳細</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-blue-700">基本給</p>
                    <p className="text-2xl font-bold text-blue-900">¥{ownerSalary.baseSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-700">控除額</p>
                    <p className="text-2xl font-bold text-red-600">-¥{calculateTotalDeductions(ownerSalary).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-green-700">手取り額</p>
                    <p className="text-3xl font-bold text-green-600">¥{calculateNetSalary(ownerSalary).toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <p className="text-xs font-semibold text-blue-900 mb-2">控除内訳</p>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">所得税</p>
                      <p className="text-sm font-semibold">¥{ownerSalary.deductions.incomeTax.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">住民税</p>
                      <p className="text-sm font-semibold">¥{ownerSalary.deductions.residentTax.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">健康保険</p>
                      <p className="text-sm font-semibold">¥{ownerSalary.deductions.healthInsurance.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">厚生年金</p>
                      <p className="text-sm font-semibold">¥{ownerSalary.deductions.pensionInsurance.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">雇用保険</p>
                      <p className="text-sm font-semibold">¥{ownerSalary.deductions.employmentInsurance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 従業員給与タブ */}
      {selectedTab === "employees" && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">従業員一覧（{employees.length}名）</h2>
          <div className="space-y-4">
          {employees.map((employee) => (
              <div key={employee.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{employee.name.substring(0, 2)}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-xs text-gray-500 mt-1">入社日: {employee.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600">基本給</p>
                    <p className="text-lg font-semibold text-gray-900">¥{employee.baseSalary.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600">手当合計</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ¥{Object.values(employee.allowances).reduce((a, b) => a + b, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-gray-600">総支給額</p>
                    <p className="text-lg font-bold text-blue-600">¥{calculateTotalSalary(employee).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-gray-600">手取り額</p>
                    <p className="text-lg font-bold text-green-600">¥{calculateNetSalary(employee).toLocaleString()}</p>
                  </div>
                </div>
                {employee.status === "pending" && (
                  <button
                    onClick={() => handleMarkAsPaid(employee.id)}
                    className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    給与を支払う
                  </button>
                )}
              </div>
            ))}
            {employees.length === 0 && (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">従業員が登録されていません</h3>
                <p className="mt-1 text-sm text-gray-500">右上の「従業員を追加」ボタンから従業員を登録してください</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 給与履歴タブ */}
      {selectedTab === "history" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">給与支払履歴</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">対象月</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">従業員名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">基本給</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">手当</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">控除</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">手取り額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払日</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollHistory.map((record) => {
                const emp = allEmployees.find((e) => e.id === record.employeeId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{record.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{record.totalAllowances.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-¥{record.totalDeductions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">¥{record.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.paymentDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 従業員追加モーダル */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">新しい従業員を追加</h3>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  役職 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="営業担当"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  基本給 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="number"
                    value={newEmployee.baseSalary || ""}
                    onChange={(e) => setNewEmployee({ ...newEmployee, baseSalary: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300000"
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">手当</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">通勤手当</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-xs text-gray-500">¥</span>
                      <input
                        type="number"
                        value={newEmployee.commuteAllowance || ""}
                        onChange={(e) => setNewEmployee({ ...newEmployee, commuteAllowance: parseInt(e.target.value) || 0 })}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">住宅手当</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-xs text-gray-500">¥</span>
                      <input
                        type="number"
                        value={newEmployee.housingAllowance || ""}
                        onChange={(e) => setNewEmployee({ ...newEmployee, housingAllowance: parseInt(e.target.value) || 0 })}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        placeholder="20000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">家族手当</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-xs text-gray-500">¥</span>
                      <input
                        type="number"
                        value={newEmployee.familyAllowance || ""}
                        onChange={(e) => setNewEmployee({ ...newEmployee, familyAllowance: parseInt(e.target.value) || 0 })}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  入社日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {newEmployee.baseSalary > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">給与プレビュー</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-blue-700">総支給額</p>
                      <p className="font-bold text-blue-900">
                        ¥{(newEmployee.baseSalary + newEmployee.commuteAllowance + newEmployee.housingAllowance + newEmployee.familyAllowance).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">控除額（概算）</p>
                      <p className="font-bold text-blue-900">
                        ¥{Math.floor((newEmployee.baseSalary + newEmployee.commuteAllowance + newEmployee.housingAllowance + newEmployee.familyAllowance) * 0.306).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">手取り額（概算）</p>
                      <p className="font-bold text-green-600">
                        ¥{Math.floor((newEmployee.baseSalary + newEmployee.commuteAllowance + newEmployee.housingAllowance + newEmployee.familyAllowance) * 0.694).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">※ 控除額は概算です。実際の金額は給与計算時に正確に計算されます。</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddEmployee(false);
                  setNewEmployee({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    baseSalary: 0,
                    commuteAllowance: 0,
                    housingAllowance: 0,
                    familyAllowance: 0,
                    joinDate: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveNewEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                追加
                  </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
