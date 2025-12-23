import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Activity,
  Calendar,
  Building2,
  PiggyBank,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AssetManagement = () => {
  const [viewMode, setViewMode] = useState<"integrated" | "personal" | "business">(
    "integrated"
  );
  const [showDevelopmentPlan, setShowDevelopmentPlan] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedServices, setEditedServices] = useState<any[]>([]);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [periodView, setPeriodView] = useState<"monthly" | "annual" | "all">("monthly");
  const [personalPeriodView, setPersonalPeriodView] = useState<"monthly" | "annual" | "all">("monthly");
  const [integratedPeriodView, setIntegratedPeriodView] = useState<"monthly" | "annual" | "all">("monthly");
  const [showArchived, setShowArchived] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    developmentCost: 0,
    monthlyRevenue: 0,
    currentCustomers: 0,
    targetCustomers: 0,
    pricePerCustomer: 0,
    developmentPeriod: "",
    launchDate: "",
    customerGrowthRate: "",
  });

  // ユーザーデータ
  const userData = {
    business: {
      cashBalance: 320,
      accountsReceivable: 150,
      investments: 80,
      equipment: 200,
    },
    personal: {
      savings: 500,
      investments: {
        nisa: 200,
        ideco: 150,
        stocks: 100,
        other: 80,
      },
    },
  };

  // 個人投資データ
  const totalInvestment =
    userData.personal.investments.nisa +
    userData.personal.investments.ideco +
    userData.personal.investments.stocks +
    userData.personal.investments.other;

  // 個人投資の詳細データ（各投資商品）
  const [personalInvestments, setPersonalInvestments] = useState([
    {
      id: 1,
      name: "NISA（つみたて）",
      category: "投資信託",
      investmentType: "accumulation", // 積立投資
      principal: 200, // 元本（万円）
      currentValue: 230, // 現在価値（万円）
      monthlyContribution: 3.33, // 月間積立額（万円）
      startDate: "2022-01-01",
      endDate: null, // 継続中
      returnRate: 5, // 年率%
      color: "#3b82f6", // 青
    },
    {
      id: 2,
      name: "iDeCo",
      category: "年金",
      investmentType: "accumulation", // 積立投資
      principal: 150,
      currentValue: 172.5,
      monthlyContribution: 2.3,
      startDate: "2021-04-01",
      endDate: null, // 継続中
      returnRate: 5,
      color: "#10b981", // 緑
    },
    {
      id: 3,
      name: "個別株式（国内）",
      category: "株式",
      investmentType: "lumpsum", // 一括投資
      principal: 100,
      currentValue: 115,
      monthlyContribution: 0,
      startDate: "2023-03-01",
      endDate: "2024-06-30", // 売却済み
      returnRate: 10,
      color: "#f59e0b", // オレンジ
    },
    {
      id: 4,
      name: "米国株ETF",
      category: "株式",
      investmentType: "accumulation", // 積立投資
      principal: 150,
      currentValue: 180,
      monthlyContribution: 2,
      startDate: "2022-06-01",
      endDate: null, // 継続中
      returnRate: 7,
      color: "#8b5cf6", // 紫
    },
    {
      id: 5,
      name: "ワンルームマンション投資",
      category: "不動産",
      investmentType: "realestate", // 不動産投資
      principal: 500,
      currentValue: 520,
      monthlyContribution: 0,
      startDate: "2021-03-01",
      endDate: null, // 継続中
      returnRate: 2, // 物件価値の年間上昇率
      color: "#ec4899", // ピンク
      hasLoan: true, // 返済が必要
      // 不動産専用フィールド
      propertyPrice: 2500, // 物件価格（万円）
      monthlyLoanPayment: 10, // 毎月のローン返済額（万円）
      monthlyRent: 12, // 毎月の家賃収入（万円）
    },
    {
      id: 6,
      name: "REIT（不動産投資信託）",
      category: "不動産",
      investmentType: "accumulation", // 積立投資
      principal: 80,
      currentValue: 88,
      monthlyContribution: 1,
      startDate: "2022-09-01",
      endDate: null, // 継続中
      returnRate: 6,
      color: "#6366f1", // インディゴ
      hasLoan: false, // 返済不要
    },
    {
      id: 7,
      name: "外貨預金（米ドル）",
      category: "その他",
      investmentType: "fixed", // 定額貯金
      principal: 50,
      currentValue: 53,
      monthlyContribution: 0,
      startDate: "2023-01-01",
      endDate: "2024-10-31", // 終了済み
      returnRate: 3,
      color: "#14b8a6", // ティール
    },
    {
      id: 8,
      name: "金・貴金属",
      category: "その他",
      investmentType: "accumulation", // 積立投資
      principal: 30,
      currentValue: 32,
      monthlyContribution: 0.5,
      startDate: "2023-06-01",
      endDate: null, // 継続中
      returnRate: 3,
      color: "#ef4444", // 赤
    },
  ]);

  // 個人投資の編集状態
  const [showEditInvestmentModal, setShowEditInvestmentModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);

  // 個人投資の操作関数
  const handleAddInvestment = () => {
    setEditingInvestment({
      id: 0,
      name: "",
      category: "投資信託",
      investmentType: "accumulation", // デフォルトは積立投資
      principal: 0,
      currentValue: 0,
      monthlyContribution: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      returnRate: 5, // デフォルト年率5%
      color: "#3b82f6", // デフォルト色（青）
      hasLoan: false, // デフォルトは返済不要
      // 不動産専用フィールド
      propertyPrice: 0,
      monthlyLoanPayment: 0,
      monthlyRent: 0,
    });
    setShowAddInvestmentModal(true);
  };

  const handleEditInvestment = (investment: any) => {
    setEditingInvestment({ ...investment });
    setShowEditInvestmentModal(true);
  };

  const handleSaveInvestment = () => {
    if (showEditInvestmentModal && editingInvestment) {
      // 編集モード
      setPersonalInvestments(personalInvestments.map(inv => 
        inv.id === editingInvestment.id ? editingInvestment : inv
      ));
      setShowEditInvestmentModal(false);
      setEditingInvestment(null);
    } else if (showAddInvestmentModal && editingInvestment) {
      // 新規追加モード
      const newId = Math.max(...personalInvestments.map(inv => inv.id), 0) + 1;
      setPersonalInvestments([
        ...personalInvestments,
        { ...editingInvestment, id: newId }
      ]);
      setShowAddInvestmentModal(false);
      setEditingInvestment(null);
    }
  };

  const handleCancelInvestmentEdit = () => {
    setShowEditInvestmentModal(false);
    setShowAddInvestmentModal(false);
    setEditingInvestment(null);
  };

  const handleDeleteInvestment = (id: number) => {
    if (window.confirm('この投資商品を削除してもよろしいですか？')) {
      setPersonalInvestments(personalInvestments.filter(inv => inv.id !== id));
    }
  };

  const updateEditingInvestmentField = (field: string, value: any) => {
    setEditingInvestment((prev: any) => ({ ...prev, [field]: value }));
  };

  // 投資商品の色を統一するヘルパー関数
  const getInvestmentColor = (investmentId: number) => {
    const investment = personalInvestments.find(inv => inv.id === investmentId);
    if (investment && investment.color) {
      // カスタム色が設定されている場合はそれを使用
      return {
        hex: investment.color,
        // 16進数からTailwindクラス名に近似する（完全一致ではない）
        tailwind: 'blue' // カスタム色の場合、Tailwindクラスは使用しない
      };
    }
    // フォールバック
    const colorPalette = ['blue', 'green', 'orange', 'purple', 'pink', 'indigo', 'teal', 'red'];
    const hexColorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#ef4444'];
    const index = personalInvestments.findIndex(inv => inv.id === investmentId);
    return {
      tailwind: colorPalette[index % colorPalette.length],
      hex: hexColorPalette[index % hexColorPalette.length]
    };
  };

  // 投資タイプに応じた価値計算関数
  const calculateInvestmentValue = (investment: any, targetDate: Date, today: Date) => {
    const startDate = new Date(investment.startDate);
    const endDate = investment.endDate ? new Date(investment.endDate) : today;
    
    // 対象日が範囲外の場合は0
    if (targetDate < startDate || targetDate > endDate) {
      return 0;
    }
    
    // 経過月数を計算（小数点も含む精密計算）
    const monthsElapsed = (targetDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (targetDate.getMonth() - startDate.getMonth()) +
                         (targetDate.getDate() - startDate.getDate()) / 30;
    const totalMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                       (today.getMonth() - startDate.getMonth()) +
                       (today.getDate() - startDate.getDate()) / 30;
    
    const monthlyRate = investment.returnRate / 100 / 12; // 月利
    
    // カテゴリが不動産の場合は、投資タイプに関係なく不動産計算を使用
    const effectiveInvestmentType = investment.category === '不動産' ? 'realestate' : investment.investmentType;
    
    switch (effectiveInvestmentType) {
      case "accumulation": {
        // 積立投資：毎月定額を積み立て、複利で運用
        // FV = P × ((1+r)^n - 1) / r + PV × (1+r)^n
        // P: 月間積立額, r: 月利, n: 経過月数, PV: 初期元本
        
        if (monthlyRate === 0) {
          // 利率0%の場合は単純な合計
          return investment.principal + (investment.monthlyContribution * monthsElapsed);
        }
        
        const compoundFactor = Math.pow(1 + monthlyRate, monthsElapsed);
        const contributionValue = investment.monthlyContribution * 
                                 ((compoundFactor - 1) / monthlyRate);
        const principalValue = investment.principal * compoundFactor;
        const calculatedValue = principalValue + contributionValue;
        
        // 現在価値を基準に比率調整（実績反映）
        const totalCalculatedValue = investment.principal * Math.pow(1 + monthlyRate, totalMonths) +
                                    investment.monthlyContribution * 
                                    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        
        return totalCalculatedValue > 0 ? calculatedValue * (investment.currentValue / totalCalculatedValue) : calculatedValue;
      }
      
      case "lumpsum": {
        // 一括投資：初期投資額が複利で成長
        // FV = PV × (1+r)^n
        const calculatedValue = investment.principal * Math.pow(1 + monthlyRate, monthsElapsed);
        const totalCalculatedValue = investment.principal * Math.pow(1 + monthlyRate, totalMonths);
        
        // 現在価値を基準に比率調整（実績反映）
        return totalCalculatedValue > 0 ? calculatedValue * (investment.currentValue / totalCalculatedValue) : calculatedValue;
      }
      
      case "fixed": {
        // 定額貯金：単利または固定利率
        // FV = PV × (1 + r×n)
        const calculatedValue = investment.principal * (1 + (investment.returnRate / 100) * (monthsElapsed / 12));
        const totalCalculatedValue = investment.principal * (1 + (investment.returnRate / 100) * (totalMonths / 12));
        
        // 現在価値を基準に比率調整（実績反映）
        return totalCalculatedValue > 0 ? calculatedValue * (investment.currentValue / totalCalculatedValue) : calculatedValue;
      }
      
      case "realestate": {
        // 不動産投資の資産価値計算
        // 借入がある場合：物件価値の推移（propertyPrice → currentValue）
        // 借入がない場合：純資産 = 自己資金 + 累積CF
        
        if (investment.hasLoan) {
          // 借入ありの場合：物件の資産価値として表示
          // 開始時点: propertyPrice（物件価格）
          // 現在/終了時点: currentValue（現在価値）
          // 中間時点: 線形補間
          
          const propertyPrice = investment.propertyPrice || investment.principal;
          
          // 進捗率を計算（0〜1）
          const progressRatio = totalMonths > 0 ? (monthsElapsed / totalMonths) : 0;
          
          // 線形補間: 開始時の物件価格から現在価値へ
          const calculatedValue = propertyPrice + 
            ((investment.currentValue - propertyPrice) * progressRatio);
          
          return calculatedValue;
        } else {
          // 借入なしの場合：従来通り純資産計算（CF累積）
          const selfFunding = investment.principal || 0;
          const monthlyRent = investment.monthlyRent || 0;
          const monthlyLoanPayment = investment.monthlyLoanPayment || 0;
          const monthlyCashFlow = monthlyRent - monthlyLoanPayment;
          
          const calculatedValue = selfFunding + (monthlyCashFlow * monthsElapsed);
          
          return calculatedValue;
        }
      }
      
      default:
        // デフォルトは単純な比例計算
        return monthsElapsed > 0 ? investment.currentValue * (monthsElapsed / totalMonths) : 0;
    }
  };

  // 事業データ構造（各事業の詳細情報）
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: "会計自動化SaaS",
      category: "サービス開発",
      status: "運用中",
      revenueType: "monthly" as "monthly" | "oneTime",
      investment: 250, // 万円
      monthlyRevenue: 85,
      annualRevenue: 1020,
      roi: 308, // %
      customers: 45,
      employees: 2,
      startDate: "2024-04-01",
      endDate: "", // 空文字列 = 終了日なし（現在も継続中）
      description: "中小企業向けの会計自動化サービス",
      costs: {
        development: 250,
        cogs: 180, // 原価（年間）
        marketing: 40,
        personnel: 240, // 年間
        infrastructure: 36, // 年間
        other: 20,
      },
    },
    {
      id: 2,
      name: "請求書管理システム",
      category: "サービス開発",
      status: "開発中",
      revenueType: "monthly" as "monthly" | "oneTime",
      investment: 180,
      monthlyRevenue: 42,
      annualRevenue: 504,
      roi: 180,
      customers: 28,
      employees: 1,
      startDate: "2024-06-01",
      endDate: "",
      description: "請求書の作成・管理・送付を一元化",
      costs: {
        development: 180,
        cogs: 120, // 原価（年間）
        marketing: 25,
        personnel: 120,
        infrastructure: 18,
        other: 10,
      },
    },
    {
      id: 3,
      name: "コンサルティング",
      category: "サービス提供",
      status: "運用中",
      revenueType: "monthly" as "monthly" | "oneTime",
      investment: 50,
      monthlyRevenue: 120,
      annualRevenue: 1440,
      roi: 2780,
      customers: 8,
      employees: 2,
      startDate: "2023-01-01",
      endDate: "",
      description: "財務・会計コンサルティングサービス",
      costs: {
        development: 0,
        cogs: 0, // 原価（年間）
        marketing: 30,
        personnel: 300,
        infrastructure: 10,
        other: 15,
      },
    },
  ]);


  // サービス開発投資計画データ
  // サービス開発投資データ（投資とリターンにフォーカス）
  const [developmentServices, setDevelopmentServices] = useState([
    {
      id: 1,
      name: "会計自動化SaaS",
      status: "運用中",
      developmentCost: 250, // 万円
      monthlyRevenue: 85, // 月額売上（万円）
      currentCustomers: 45,
      targetCustomers: 100,
      pricePerCustomer: 1.89, // 万円/月/顧客
      developmentPeriod: "6ヶ月",
      launchDate: "2024年4月",
      annualRevenue: 85 * 12,
      roi: ((85 * 12 - 250) / 250) * 100,
      paybackPeriod: (250 / 85).toFixed(1), // ヶ月
      customerGrowthRate: "月8人増加",
    },
    {
      id: 2,
      name: "請求書管理システム",
      status: "開発中",
      developmentCost: 180,
      monthlyRevenue: 42,
      currentCustomers: 28,
      targetCustomers: 80,
      pricePerCustomer: 1.5,
      developmentPeriod: "4ヶ月",
      launchDate: "2024年6月",
      annualRevenue: 42 * 12,
      roi: ((42 * 12 - 180) / 180) * 100,
      paybackPeriod: (180 / 42).toFixed(1),
      customerGrowthRate: "月6人増加",
    },
    {
      id: 3,
      name: "経費精算アプリ",
      status: "計画中",
      developmentCost: 120,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 60,
      pricePerCustomer: 0.98,
      developmentPeriod: "3ヶ月",
      launchDate: "2025年2月（予定）",
      annualRevenue: 0,
      roi: 0,
      paybackPeriod: "未算出",
      customerGrowthRate: "目標: 月5人",
    },
  ]);

  // 編集機能のハンドラー
  const handleEditMode = () => {
    setEditedServices(JSON.parse(JSON.stringify(developmentServices)));
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setDevelopmentServices(editedServices);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedServices([]);
    setIsEditMode(false);
  };

  const updateService = (serviceId: number, field: string, value: any) => {
    setEditedServices((prev) =>
      prev.map((service) => {
        if (service.id === serviceId) {
          const updated = { ...service, [field]: value };
          // 自動計算
          if (field === 'monthlyRevenue' || field === 'developmentCost') {
            updated.annualRevenue = updated.monthlyRevenue * 12;
            updated.roi = updated.developmentCost > 0 
              ? ((updated.annualRevenue - updated.developmentCost) / updated.developmentCost) * 100 
              : 0;
            updated.paybackPeriod = updated.monthlyRevenue > 0 
              ? (updated.developmentCost / updated.monthlyRevenue).toFixed(1) 
              : "未算出";
          }
          return updated;
        }
        return service;
      })
    );
  };

  const deleteService = (serviceId: number) => {
    if (confirm("このサービスを削除してもよろしいですか？")) {
      setEditedServices((prev) => prev.filter((service) => service.id !== serviceId));
    }
  };

  const addNewService = () => {
    setShowAddServiceForm(true);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const handleAddService = () => {
    if (!newService.name.trim()) {
      alert("サービス名を入力してください");
      return;
    }

    const newId = Math.max(...developmentServices.map(s => s.id), 0) + 1;
    const annualRevenue = newService.monthlyRevenue * 12;
    const roi = newService.developmentCost > 0 
      ? ((annualRevenue - newService.developmentCost) / newService.developmentCost) * 100 
      : 0;
    const paybackPeriod = newService.monthlyRevenue > 0 
      ? (newService.developmentCost / newService.monthlyRevenue).toFixed(1) 
      : "未算出";

    const serviceToAdd = {
      id: newId,
      name: newService.name,
      status: "計画中",
      developmentCost: newService.developmentCost,
      monthlyRevenue: newService.monthlyRevenue,
      currentCustomers: newService.currentCustomers,
      targetCustomers: newService.targetCustomers,
      pricePerCustomer: newService.pricePerCustomer,
      developmentPeriod: newService.developmentPeriod || "未定",
      launchDate: newService.launchDate || "未定",
      annualRevenue: annualRevenue,
      roi: roi,
      paybackPeriod: paybackPeriod,
      customerGrowthRate: newService.customerGrowthRate || "未定",
    };

    setDevelopmentServices([...developmentServices, serviceToAdd]);
    setShowAddServiceForm(false);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const handleCancelAddService = () => {
    setShowAddServiceForm(false);
    setNewService({
      name: "",
      developmentCost: 0,
      monthlyRevenue: 0,
      currentCustomers: 0,
      targetCustomers: 0,
      pricePerCustomer: 0,
      developmentPeriod: "",
      launchDate: "",
      customerGrowthRate: "",
    });
  };

  const currentServices = isEditMode && editedServices.length > 0 ? editedServices : developmentServices;

  // 事業の編集・追加ハンドラー
  const handleEditBusiness = (businessId: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setEditingBusiness({ ...business });
      setShowEditBusinessModal(true);
    }
  };

  // 事業が現在有効かどうかを判定
  const isBusinessActive = (business: any) => {
    if (!business.endDate) return true; // 終了日がない場合は有効
    const today = new Date();
    const endDate = new Date(business.endDate);
    return endDate >= today;
  };

  // 有効な事業とアーカイブを分ける
  const activeBusinesses = businesses.filter(isBusinessActive);
  const archivedBusinesses = businesses.filter(b => !isBusinessActive(b));

  const handleAddBusiness = () => {
    setEditingBusiness({
      name: "",
      category: "サービス提供",
      status: "企画中",
      revenueType: "monthly",
      investment: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
      roi: 0,
      customers: 0,
      employees: 0,
      startDate: "",
      endDate: "",
      description: "",
      costs: {
        development: 0,
        cogs: 0, // 原価（年間）
        marketing: 0,
        personnel: 0,
        infrastructure: 0,
        other: 0,
      },
    });
    setShowAddBusinessModal(true);
  };

  const handleSaveBusiness = () => {
    if (showEditBusinessModal && editingBusiness) {
      // 編集モード
      const annualRevenue = editingBusiness.revenueType === "monthly" 
        ? editingBusiness.monthlyRevenue * 12 
        : editingBusiness.monthlyRevenue; // 単発の場合はそのまま年間収益とする
      const totalCosts = Object.values(editingBusiness.costs).reduce((sum: number, cost: any) => sum + Number(cost), 0);
      const roi = totalCosts > 0 ? ((annualRevenue - totalCosts) / totalCosts) * 100 : 0;
      
      setBusinesses(businesses.map(b => 
        b.id === editingBusiness.id 
          ? { 
              ...editingBusiness, 
              annualRevenue,
              roi,
              investment: totalCosts
            } 
          : b
      ));
      setShowEditBusinessModal(false);
      setEditingBusiness(null);
    } else if (showAddBusinessModal && editingBusiness) {
      // 新規追加モード
      const newId = Math.max(...businesses.map(b => b.id), 0) + 1;
      const annualRevenue = editingBusiness.revenueType === "monthly" 
        ? editingBusiness.monthlyRevenue * 12 
        : editingBusiness.monthlyRevenue;
      const totalCosts = Object.values(editingBusiness.costs).reduce((sum: number, cost: any) => sum + Number(cost), 0);
      const roi = totalCosts > 0 ? ((annualRevenue - totalCosts) / totalCosts) * 100 : 0;
      
      setBusinesses([
        ...businesses,
        {
          ...editingBusiness,
          id: newId,
          annualRevenue,
          roi,
          investment: totalCosts
        }
      ]);
      setShowAddBusinessModal(false);
      setEditingBusiness(null);
    }
  };

  const handleCancelBusinessEdit = () => {
    setShowEditBusinessModal(false);
    setShowAddBusinessModal(false);
    setEditingBusiness(null);
  };

  const handleDeleteBusiness = (businessId: number) => {
    if (confirm("この事業を削除してもよろしいですか？")) {
      setBusinesses(businesses.filter(b => b.id !== businessId));
      if (selectedBusinessId === businessId) {
        setSelectedBusinessId(null);
      }
    }
  };

  const updateEditingBusinessField = (field: string, value: any) => {
    setEditingBusiness((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateEditingBusinessCost = (costField: string, value: any) => {
    setEditingBusiness((prev: any) => ({
      ...prev,
      costs: { ...prev.costs, [costField]: value === '' ? 0 : Number(value) }
    }));
  };


  // 資産配分データ
  const assetAllocationData = [
    { name: "事業用現金", value: userData.business.cashBalance, color: "#3b82f6" },
    { name: "個人預貯金", value: userData.personal.savings, color: "#10b981" },
    { name: "NISA", value: userData.personal.investments.nisa, color: "#f59e0b" },
    { name: "iDeCo", value: userData.personal.investments.ideco, color: "#ef4444" },
    { name: "個別株", value: userData.personal.investments.stocks, color: "#8b5cf6" },
    { name: "その他", value: userData.personal.investments.other, color: "#6b7280" },
  ];

  // 統合ビュー
  const IntegratedView = () => {
    const totalBusinessInvestment = businesses.reduce((sum, b) => sum + b.investment, 0);
    const totalAssets =
      userData.business.cashBalance +
      userData.personal.savings +
      totalInvestment;

    return (
      <div className="space-y-6">
        {/* 期間切り替えボタン */}
        <div className="flex justify-end items-center">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setIntegratedPeriodView("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                integratedPeriodView === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              月間表示
            </button>
            <button
              onClick={() => setIntegratedPeriodView("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                integratedPeriodView === "annual"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              年間表示
            </button>
            <button
              onClick={() => setIntegratedPeriodView("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                integratedPeriodView === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              全期間表示
            </button>
          </div>
        </div>

        {/* 総資産サマリー */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl mb-2 opacity-90">総資産</h2>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold">{totalAssets.toLocaleString()}万円</div>
            <div className="text-2xl opacity-90 mb-2">前月比 +8.2%</div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Wallet className="w-6 h-6" />,
              label: "総資産",
              value: `${totalAssets.toLocaleString()}万円`,
              change: "+8.2%",
              color: "indigo",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "投資資産",
              value: `${totalInvestment.toLocaleString()}万円`,
              change: "+15.7%",
              color: "orange",
            },
            {
              icon: <PiggyBank className="w-6 h-6" />,
              label: "事業投資",
              value: `${totalBusinessInvestment.toLocaleString()}万円`,
              change: "+8.5%",
              color: "blue",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              label: "平均リターン",
              value: "15.0%",
              change: "+2.3%",
              color: "green",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${card.color}-600`}>{card.icon}</div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    card.change.includes("+")
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 資産配分円グラフ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">資産配分</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 資産配分詳細 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">資産配分詳細</h3>
            <div className="space-y-2">
              {assetAllocationData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString()}万円
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 投資推移グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {integratedPeriodView === "monthly" ? "月別" : integratedPeriodView === "annual" ? "四半期別" : "年別"}資産推移（個人＋事業）
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={(() => {
                const today = new Date();
                
                // 個人投資（借入なし）の合計を計算
                const calculatePersonalTotal = (date: Date) => {
                  return personalInvestments
                    .filter(inv => !inv.hasLoan)
                    .reduce((sum, inv) => sum + calculateInvestmentValue(inv, date, today), 0);
                };
                
                // 事業投資の合計を計算（簡易版：固定値）
                const calculateBusinessTotal = () => {
                  return businesses.reduce((sum, b) => sum + b.investment, 0);
                };
                
                if (integratedPeriodView === "monthly") {
                  // 月間表示：過去12ヶ月
                  const months = [];
                  for (let i = 11; i >= 0; i--) {
                    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    months.push({
                      month: date.toLocaleDateString('ja-JP', { month: 'short' }),
                      personal: calculatePersonalTotal(date),
                      business: calculateBusinessTotal(),
                    });
                  }
                  return months;
                } else if (integratedPeriodView === "annual") {
                  // 年間表示：過去12四半期
                  const quarters = [];
                  for (let q = 11; q >= 0; q--) {
                    // 正しく年と月を計算
                    const targetDate = new Date(today);
                    targetDate.setMonth(today.getMonth() - (q * 3));
                    const quarterStartDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                    const year = quarterStartDate.getFullYear();
                    const quarter = Math.floor(quarterStartDate.getMonth() / 3) + 1;
                    quarters.push({
                      month: `${year}Q${quarter}`,
                      personal: calculatePersonalTotal(quarterStartDate),
                      business: calculateBusinessTotal(),
                    });
                  }
                  return quarters;
                } else {
                  // 全期間表示：年別
                  const years = [];
                  let earliestYear = today.getFullYear();
                  personalInvestments.forEach((inv) => {
                    const startYear = new Date(inv.startDate).getFullYear();
                    if (startYear < earliestYear) {
                      earliestYear = startYear;
                    }
                  });
                  
                  for (let year = earliestYear; year <= today.getFullYear(); year++) {
                    const yearDate = year === today.getFullYear() 
                      ? today 
                      : new Date(year, 11, 31);
                    years.push({
                      month: `${year}年`,
                      personal: calculatePersonalTotal(yearDate),
                      business: calculateBusinessTotal(),
                    });
                  }
                  return years;
                }
              })()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPersonal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `¥${Number(value).toFixed(1)}万`}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Area
                type="monotoneX"
                dataKey="personal"
                stackId="1"
                stroke="#6366f1"
                fill="url(#colorPersonal)"
                fillOpacity={1}
                name="個人投資"
              />
              <Area
                type="monotoneX"
                dataKey="business"
                stackId="1"
                stroke="#10b981"
                fill="url(#colorBusiness)"
                fillOpacity={1}
                name="事業投資"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 個人投資ビュー
  const PersonalView = () => {
    // 全ての投資をグラフに表示（借入ありも資産価値として表示）
    const allInvestments = personalInvestments;
    
    // サマリー計算用：借入なしの投資のみ（純資産）
    const assetInvestments = personalInvestments.filter(inv => !inv.hasLoan);
    const totalCurrentValue = assetInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalPrincipal = assetInvestments.reduce((sum, inv) => sum + inv.principal, 0);
    const totalGain = totalCurrentValue - totalPrincipal;
    const avgReturnRate = totalPrincipal > 0 ? ((totalGain / totalPrincipal) * 100) : 0;
    
    // 借入ありの資産も含めた総資産価値
    const totalAssetValue = personalInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);

    return (
    <div className="space-y-6">
        {/* 期間切り替えボタン */}
        <div className="flex justify-end items-center">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setPersonalPeriodView("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                personalPeriodView === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              月間表示
            </button>
            <button
              onClick={() => setPersonalPeriodView("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                personalPeriodView === "annual"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              年間表示
            </button>
            <button
              onClick={() => setPersonalPeriodView("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                personalPeriodView === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              全期間表示
            </button>
          </div>
        </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Wallet className="w-6 h-6" />,
            label: "総資産価値",
            value: `¥${totalAssetValue.toFixed(1)}万`,
            change: "借入含む",
            color: "blue",
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: "純資産評価損益",
            value: `+¥${totalGain.toFixed(1)}万`,
            change: "借入除く",
            color: "green",
          },
          {
            icon: <Activity className="w-6 h-6" />,
            label: "平均リターン",
            value: `${avgReturnRate.toFixed(1)}%`,
            change: "借入除く",
            color: "orange",
          },
          {
            icon: <Calendar className="w-6 h-6" />,
            label: "月次投資額",
            value: `¥${assetInvestments.reduce((sum, inv) => sum + inv.monthlyContribution, 0).toFixed(1)}万`,
            change: "積立中",
            color: "purple",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${card.color}-600`}>{card.icon}</div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700"
              >
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 投資推移グラフ */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {personalPeriodView === "monthly" ? "月別" : personalPeriodView === "annual" ? "四半期別" : "年別"}資産価値推移（全投資含む）
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={(() => {
              const today = new Date();
              
              if (personalPeriodView === "monthly") {
                // 月間表示：過去12ヶ月
                const months = [];
                
                for (let i = 11; i >= 0; i--) {
                  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                  const monthData: any = {
                    month: date.toLocaleDateString('ja-JP', { month: 'short' }),
                  };
                  
                  allInvestments.forEach((inv) => {
                    monthData[inv.name] = calculateInvestmentValue(inv, date, today);
                  });
                  
                  months.push(monthData);
                }
                
                return months;
              } else if (personalPeriodView === "annual") {
                // 年間表示：過去12四半期
                const quarters = [];
                
                for (let q = 11; q >= 0; q--) {
                  // 正しく年と月を計算
                  const targetDate = new Date(today);
                  targetDate.setMonth(today.getMonth() - (q * 3));
                  const quarterStartDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                  const year = quarterStartDate.getFullYear();
                  const quarter = Math.floor(quarterStartDate.getMonth() / 3) + 1;
                  const quarterLabel = `${year}Q${quarter}`;
                  
                  const quarterData: any = {
                    month: quarterLabel,
                  };
                  
                  allInvestments.forEach((inv) => {
                    quarterData[inv.name] = calculateInvestmentValue(inv, quarterStartDate, today);
                  });
                  
                  quarters.push(quarterData);
                }
                
                return quarters;
              } else {
                // 全期間表示：年別
                const years = [];
                
                let earliestYear = today.getFullYear();
                allInvestments.forEach((inv) => {
                  const startYear = new Date(inv.startDate).getFullYear();
                  if (startYear < earliestYear) {
                    earliestYear = startYear;
                  }
                });
                
                for (let year = earliestYear; year <= today.getFullYear(); year++) {
                  const yearData: any = {
                    month: `${year}年`,
                  };
                  
                  // 今年の場合は現在の日付、それ以外は12月31日を使用
                  const yearDate = year === today.getFullYear() 
                    ? today 
                    : new Date(year, 11, 31);
                  
                  allInvestments.forEach((inv) => {
                    yearData[inv.name] = calculateInvestmentValue(inv, yearDate, today);
                  });
                  
                  years.push(yearData);
                }
                
                return years;
              }
            })()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {allInvestments.map((inv) => {
                const color = inv.color || getInvestmentColor(inv.id).hex;
                return (
                  <linearGradient key={inv.id} id={`colorPersonal${inv.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => `¥${Number(value).toFixed(1)}万`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            {allInvestments.map((inv) => {
              const color = inv.color || getInvestmentColor(inv.id).hex;
              return (
                <Area
                  key={inv.id}
                  type="monotoneX"
                  dataKey={inv.name}
                  stackId="1"
                  stroke={color}
                  fill={`url(#colorPersonal${inv.id})`}
                  fillOpacity={1}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 借入返済ボード */}
      {(() => {
        // 借入返済フラグがtrueの投資のみを抽出
        const loanInvestments = personalInvestments.filter(inv => inv.hasLoan === true);
        
        if (loanInvestments.length === 0) return null;
        
        const today = new Date();
        
        // 各投資の借入情報を計算
        const loanDetails = loanInvestments.map(inv => {
          const propertyPrice = inv.propertyPrice || inv.principal;
          const selfFunding = inv.principal || 0;
          const initialLoan = propertyPrice - selfFunding;
          const monthlyPayment = inv.monthlyLoanPayment || 0;
          const monthlyRent = inv.monthlyRent || 0;
          
          // 経過月数
          const startDate = new Date(inv.startDate);
          const monthsElapsed = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                               (today.getMonth() - startDate.getMonth());
          
          // 簡易的な返済計算（元本返済を70%と仮定）
          const principalRepaymentRatio = 0.7;
          const totalPrincipalRepaid = monthlyPayment * principalRepaymentRatio * monthsElapsed;
          const remainingLoan = Math.max(0, initialLoan - totalPrincipalRepaid);
          const repaymentProgress = initialLoan > 0 ? ((initialLoan - remainingLoan) / initialLoan) * 100 : 0;
          
          return {
            name: inv.name,
            color: inv.color,
            initialLoan,
            remainingLoan,
            repaidAmount: initialLoan - remainingLoan,
            monthlyPayment,
            monthlyRent,
            repaymentProgress,
          };
        });
        
        // 合計値
        const totalInitialLoan = loanDetails.reduce((sum, loan) => sum + loan.initialLoan, 0);
        const totalRemainingLoan = loanDetails.reduce((sum, loan) => sum + loan.remainingLoan, 0);
        const totalRepaidAmount = loanDetails.reduce((sum, loan) => sum + loan.repaidAmount, 0);
        const totalMonthlyPayment = loanDetails.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
        const totalRepaymentProgress = totalInitialLoan > 0 ? (totalRepaidAmount / totalInitialLoan) * 100 : 0;
        
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">借入返済状況</h3>
            
            {/* サマリーカード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-xs text-red-600 mb-1">初期借入総額</div>
                <div className="text-2xl font-bold text-red-700">¥{totalInitialLoan.toFixed(1)}万</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs text-orange-600 mb-1">残債</div>
                <div className="text-2xl font-bold text-orange-700">¥{totalRemainingLoan.toFixed(1)}万</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600 mb-1">返済済み</div>
                <div className="text-2xl font-bold text-green-700">¥{totalRepaidAmount.toFixed(1)}万</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-blue-600 mb-1">月間返済額</div>
                <div className="text-2xl font-bold text-blue-700">¥{totalMonthlyPayment.toFixed(1)}万</div>
              </div>
            </div>
            
            {/* 返済進捗バー */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">返済進捗</span>
                <span className="text-sm font-bold text-gray-900">{totalRepaymentProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${totalRepaymentProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* 物件別詳細 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 mb-3">物件別詳細</h4>
              {loanDetails.map((loan, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: loan.color }}
                      ></div>
                      <span className="font-semibold text-gray-900">{loan.name}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {loan.repaymentProgress.toFixed(1)}% 返済済み
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">初期借入</div>
                      <div className="font-semibold text-gray-900">¥{loan.initialLoan.toFixed(1)}万</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">残債</div>
                      <div className="font-semibold text-orange-600">¥{loan.remainingLoan.toFixed(1)}万</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">月間返済</div>
                      <div className="font-semibold text-blue-600">¥{loan.monthlyPayment.toFixed(1)}万</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">月間家賃</div>
                      <div className="font-semibold text-green-600">¥{loan.monthlyRent.toFixed(1)}万</div>
                    </div>
                  </div>
                  
                  {/* 個別進捗バー */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${loan.repaymentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 投資ポートフォリオ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
            個人投資ポートフォリオ
          </h3>
            <button 
              onClick={handleAddInvestment}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
            >
              + 追加
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {personalInvestments.map((inv) => {
              const hexColor = inv.color || getInvestmentColor(inv.id).hex;
              const gain = inv.currentValue - inv.principal;
              const returnPct = inv.principal > 0 ? ((gain / inv.principal) * 100) : 0;
              
              // 色の明度を調整してボーダーと背景色を生成
              const lighterBg = hexColor + '20'; // 背景色（透明度20%）
              const lighterBorder = hexColor + '60'; // ボーダー色（透明度60%）
              
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-lg border-2 relative group"
                  style={{ 
                    borderColor: lighterBorder,
                    backgroundColor: lighterBg
                  }}
                >
                  <button
                    onClick={() => handleEditInvestment(inv)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg p-1.5 shadow-md hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{inv.name}</h4>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: lighterBorder,
                      color: hexColor
                    }}
                  >
                      {inv.category}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                    ¥{inv.currentValue.toFixed(1)}万
                </div>
                <div className="text-sm text-green-600 font-semibold mb-2">
                    +{returnPct.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span>開始: {inv.startDate}</span>
                    <span>{inv.endDate ? `終了: ${inv.endDate}` : '継続中'}</span>
              </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* ポートフォリオ円グラフ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">配分比率</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={personalInvestments.map(inv => ({
                  name: inv.name,
                  value: inv.currentValue
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {personalInvestments.map((inv) => {
                  const color = inv.color || getInvestmentColor(inv.id).hex;
                  return <Cell key={inv.id} fill={color} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 投資商品編集・追加モーダル */}
      {(showEditInvestmentModal || showAddInvestmentModal) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCancelInvestmentEdit}
        >
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            key={editingInvestment?.id || 'new'}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {showAddInvestmentModal ? "投資商品を追加" : "投資商品を編集"}
              </h3>

              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        投資商品名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingInvestment?.name || ''}
                        onChange={(e) => updateEditingInvestmentField('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="NISA（つみたて）"
                      />
          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        カテゴリ
                      </label>
                      <select
                        value={editingInvestment?.category || '投資信託'}
                        onChange={(e) => updateEditingInvestmentField('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="投資信託">投資信託</option>
                        <option value="株式">株式</option>
                        <option value="年金">年金</option>
                        <option value="不動産">不動産</option>
                        <option value="債券">債券</option>
                        <option value="暗号資産">暗号資産</option>
                        <option value="その他">その他</option>
                      </select>
              </div>
          </div>

                  {/* 借入返済フラグ */}
                  <div className="mt-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingInvestment?.hasLoan || false}
                        onChange={(e) => updateEditingInvestmentField('hasLoan', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
            <div>
                        <span className="text-sm font-medium text-gray-900">借入返済あり</span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          不動産ローンなど、返済が必要な借入がある場合にチェック
                        </p>
              </div>
                    </label>
                  </div>

                  {/* 投資タイプ（借入なしの場合のみ表示） */}
                  {!editingInvestment?.hasLoan && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        投資タイプ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingInvestment?.investmentType || 'accumulation'}
                        onChange={(e) => updateEditingInvestmentField('investmentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="accumulation">積立投資（毎月定額）</option>
                        <option value="lumpsum">一括投資（複利運用）</option>
                        <option value="fixed">定額貯金（単利）</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {editingInvestment?.investmentType === 'accumulation' && '毎月定額を積み立て、複利で運用します'}
                        {editingInvestment?.investmentType === 'lumpsum' && '初期投資額が複利で成長します'}
                        {editingInvestment?.investmentType === 'fixed' && '固定利率で単利計算します'}
                      </p>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      想定年率（%）
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingInvestment?.returnRate || ''}
                      onChange={(e) => updateEditingInvestmentField('returnRate', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5.0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      グラフの推移計算に使用されます
                    </p>
                  </div>
                </div>
                  )}
                  
                  {/* 想定年率（借入ありの場合のみ表示） */}
                  {editingInvestment?.hasLoan && (
                    <div className="mt-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      想定年率（%）
                      <span className="text-xs text-gray-500 ml-2">(物件価値の年間上昇率)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingInvestment?.returnRate || ''}
                      onChange={(e) => updateEditingInvestmentField('returnRate', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5.0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      グラフの推移計算に使用されます
                    </p>
              </div>
                </div>
                  )}
                  <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      開始日 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editingInvestment?.startDate || ''}
                      onChange={(e) => updateEditingInvestmentField('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
              </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      終了日 <span className="text-xs text-gray-500">(空欄=継続中)</span>
                    </label>
                    <input
                      type="date"
                      value={editingInvestment?.endDate || ''}
                      onChange={(e) => updateEditingInvestmentField('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
              </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      表示色
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={editingInvestment?.color || '#3b82f6'}
                        onChange={(e) => updateEditingInvestmentField('color', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">プレビュー:</span>
                        <div 
                          className="w-16 h-8 rounded border-2"
                          style={{ 
                            backgroundColor: (editingInvestment?.color || '#3b82f6') + '20',
                            borderColor: (editingInvestment?.color || '#3b82f6') + '60'
                          }}
                ></div>
            </div>
            </div>
              </div>
            </div>

                {/* 金額情報（借入なしの場合） */}
                {!editingInvestment?.hasLoan && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4">金額情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          元本（万円）
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.principal || ''}
                          onChange={(e) => updateEditingInvestmentField('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="200"
                        />
              </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          現在価値（万円）
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.currentValue || ''}
                          onChange={(e) => updateEditingInvestmentField('currentValue', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="230"
                        />
              </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          月間積立額（万円）
                          {editingInvestment?.investmentType !== 'accumulation' && 
                            <span className="text-xs text-gray-500 ml-2">(積立投資のみ有効)</span>
                          }
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.monthlyContribution || ''}
                          onChange={(e) => updateEditingInvestmentField('monthlyContribution', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="3.33"
                          disabled={editingInvestment?.investmentType !== 'accumulation'}
                        />
                        {editingInvestment?.investmentType === 'accumulation' && (
                          <p className="text-xs text-gray-500 mt-1">
                            複利計算でグラフに反映されます
                          </p>
                        )}
            </div>
            </div>
              </div>
                )}

                {/* 不動産投資専用フィールド（借入ありの場合） */}
                {editingInvestment?.hasLoan && (
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4">借入投資情報</h3>
                    <p className="text-xs text-gray-600 mb-4 p-2 bg-white rounded border border-pink-200">
                      💡 純資産 = 自己資金 + 累積キャッシュフロー で計算されます
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          合計価格（万円）※自己資金含む
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.propertyPrice || ''}
                          onChange={(e) => updateEditingInvestmentField('propertyPrice', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          不動産の購入価格
                        </p>
          </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          自己資金（万円）
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.principal || ''}
                          onChange={(e) => updateEditingInvestmentField('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          頭金などの自己資金
                        </p>
        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          現在価値（万円）
                        </label>
                        <input
                          type="number"
                          value={editingInvestment?.currentValue || ''}
                          onChange={(e) => updateEditingInvestmentField('currentValue', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="520"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          評価額の実績値
                        </p>
          </div>
              </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          毎月の返済額（万円）
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingInvestment?.monthlyLoanPayment || ''}
                          onChange={(e) => updateEditingInvestmentField('monthlyLoanPayment', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10.0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ローン返済額
                        </p>
              </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          毎月の収入（万円）※家賃収入など
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingInvestment?.monthlyRent || ''}
                          onChange={(e) => updateEditingInvestmentField('monthlyRent', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12.0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          月間家賃収入
                        </p>
            </div>
              </div>
                    <div className="mt-4 p-3 bg-white rounded border border-pink-200">
                      <div className="text-xs text-gray-600 mb-1">月間キャッシュフロー</div>
                      <div className="text-lg font-bold text-gray-900">
                        {((editingInvestment?.monthlyRent || 0) - (editingInvestment?.monthlyLoanPayment || 0)) >= 0 ? '+' : ''}
                        ¥{((editingInvestment?.monthlyRent || 0) - (editingInvestment?.monthlyLoanPayment || 0)).toFixed(1)}万
              </div>
                      <p className="text-xs text-gray-500 mt-1">
                        家賃収入 - ローン返済 = 月間CF
                      </p>
            </div>
            </div>
                )}

                {/* プレビュー */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">リアルタイムプレビュー</h3>
                  {editingInvestment?.category === '不動産' ? (
                    // 不動産用プレビュー
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">初期ローン額</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{((editingInvestment?.propertyPrice || 0) - (editingInvestment?.principal || 0)).toFixed(1)}万
          </div>
        </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">月間CF</div>
                        <div className="text-lg font-bold text-blue-600">
                          {((editingInvestment?.monthlyRent || 0) - (editingInvestment?.monthlyLoanPayment || 0)) >= 0 ? '+' : ''}
                          ¥{((editingInvestment?.monthlyRent || 0) - (editingInvestment?.monthlyLoanPayment || 0)).toFixed(1)}万
      </div>
                </div>
                <div>
                        <div className="text-xs text-gray-600 mb-1">純資産（現在）</div>
                        <div className="text-lg font-bold text-green-600">
                          ¥{(editingInvestment?.currentValue || 0).toFixed(1)}万
                </div>
              </div>
            </div>
                  ) : (
                    // 通常投資用プレビュー
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">評価損益</div>
                        <div className="text-lg font-bold text-green-600">
                          {((editingInvestment?.currentValue || 0) - (editingInvestment?.principal || 0)) >= 0 ? '+' : ''}
                          ¥{((editingInvestment?.currentValue || 0) - (editingInvestment?.principal || 0)).toFixed(1)}万
        </div>
      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">リターン率</div>
                        <div className="text-lg font-bold text-blue-600">
                          {(editingInvestment?.principal || 0) > 0 
                            ? `${((((editingInvestment?.currentValue || 0) - (editingInvestment?.principal || 0)) / (editingInvestment?.principal || 1)) * 100).toFixed(1)}%`
                            : "-"
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">年間積立額</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{((editingInvestment?.monthlyContribution || 0) * 12).toFixed(1)}万
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 pt-4 border-t">
                  {showEditInvestmentModal && (
                    <button
                      onClick={() => handleDeleteInvestment(editingInvestment.id)}
                      className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                    >
                      削除
                    </button>
                  )}
                  <button
                    onClick={handleCancelInvestmentEdit}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSaveInvestment}
                    disabled={!editingInvestment?.name?.trim() || !editingInvestment?.startDate}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                      editingInvestment?.name?.trim() && editingInvestment?.startDate
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {showAddInvestmentModal ? "追加" : "保存"}
                  </button>
                </div>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
  };


  // 事業投資ビュー
  const BusinessView = () => {
    // 過去1年間の稼働月数を計算
    const getActiveMonthsInLastYear = (business: any) => {
      const today = new Date();
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      const startDate = business.startDate ? new Date(business.startDate) : null;
      const endDate = business.endDate ? new Date(business.endDate) : null;

      if (!startDate) return 0;

      // 稼働開始日（過去1年以内か、実際の開始日の遅い方）
      const effectiveStart = startDate > oneYearAgo ? startDate : oneYearAgo;
      
      // 稼働終了日（今日か、実際の終了日の早い方）
      const effectiveEnd = endDate && endDate < today ? endDate : today;

      // 稼働開始が稼働終了より後の場合は0ヶ月
      if (effectiveStart > effectiveEnd) return 0;

      // 月数を計算（日付の差分から概算）
      const months = (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12 
        + (effectiveEnd.getMonth() - effectiveStart.getMonth()) 
        + (effectiveEnd.getDate() >= effectiveStart.getDate() ? 1 : 0);

      return Math.max(0, months);
    };

    // プロダクトの全期間の有効月数を計算（開始から終了または現在まで）
    const getTotalActiveMonths = (business: any) => {
      const today = new Date();
      const startDate = business.startDate ? new Date(business.startDate) : null;
      const endDate = business.endDate ? new Date(business.endDate) : null;

      if (!startDate) return 0;

      // 終了日が設定されていれば終了日まで、なければ今日まで
      const effectiveEnd = endDate || today;

      // 開始日が終了日より後の場合は0ヶ月
      if (startDate > effectiveEnd) return 0;

      // 月数を計算
      const months = (effectiveEnd.getFullYear() - startDate.getFullYear()) * 12 
        + (effectiveEnd.getMonth() - startDate.getMonth()) 
        + (effectiveEnd.getDate() >= startDate.getDate() ? 1 : 0);

      return Math.max(1, months); // 最低1ヶ月
    };

    // 期間に応じた収益を返すヘルパー関数
    const getRevenue = (business: any) => {
      if (periodView === "monthly") {
        // 月間表示：現在の月間収益
        if (business.revenueType === "oneTime") {
          return business.monthlyRevenue;
        }
        return business.monthlyRevenue;
      } else if (periodView === "annual") {
        // 年間表示：過去1年間の実績
        if (business.revenueType === "oneTime") {
          // 単発収益：過去1年以内に発生していれば全額
          const startDate = business.startDate ? new Date(business.startDate) : null;
          const today = new Date();
          const oneYearAgo = new Date(today);
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          
          if (startDate && startDate >= oneYearAgo && startDate <= today) {
            return business.monthlyRevenue;
          }
          return 0;
        } else {
          // 月間収益：稼働月数分
          const activeMonths = getActiveMonthsInLastYear(business);
          return business.monthlyRevenue * activeMonths;
        }
      } else {
        // 全期間表示：全期間の累計収益
        if (business.revenueType === "oneTime") {
          return business.monthlyRevenue;
        } else {
          const totalMonths = getTotalActiveMonths(business);
          return business.monthlyRevenue * totalMonths;
        }
      }
    };

    const getPeriodLabel = () => {
      return periodView === "monthly" ? "月間" : periodView === "annual" ? "年間" : "全期間";
    };

    const getRevenueLabel = (business: any) => {
      if (business.revenueType === "oneTime") {
        return "単発収益";
      }
      return `${getPeriodLabel()}収益`;
    };

    // 表示する事業リストを決定
    const displayBusinesses = showArchived ? archivedBusinesses : activeBusinesses;

    // 事業の合計値を計算
    const totalMonthlyRevenue = periodView === "monthly" 
      ? activeBusinesses.reduce((sum, b) => {
          if (b.revenueType === "oneTime") {
            return sum + (b.monthlyRevenue / 12);
          }
          return sum + b.monthlyRevenue;
        }, 0)
      : periodView === "annual"
      ? // 年間表示の場合は全事業（アーカイブ含む）の過去1年分を計算
        businesses.reduce((sum, b) => {
          if (b.revenueType === "oneTime") {
            const startDate = b.startDate ? new Date(b.startDate) : null;
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            if (startDate && startDate >= oneYearAgo && startDate <= today) {
              return sum + b.monthlyRevenue;
            }
            return sum;
          } else {
            const activeMonths = getActiveMonthsInLastYear(b);
            return sum + (b.monthlyRevenue * activeMonths);
          }
        }, 0)
      : // 全期間表示の場合は全事業の全期間累計
        businesses.reduce((sum, b) => {
          if (b.revenueType === "oneTime") {
            return sum + b.monthlyRevenue;
          } else {
            const totalMonths = getTotalActiveMonths(b);
            return sum + (b.monthlyRevenue * totalMonths);
          }
        }, 0);
        
    const totalBusinessRevenue = totalMonthlyRevenue;
    
    // 投資額の計算（期間に応じて按分）
    const totalBusinessInvestment = periodView === "monthly" 
      ? activeBusinesses.reduce((sum, b) => {
          // 月間表示：全期間の有効月数で按分した1ヶ月分
          const totalMonths = getTotalActiveMonths(b);
          const monthlyInvestment = b.investment / totalMonths;
          return sum + monthlyInvestment;
        }, 0)
      : periodView === "annual"
      ? businesses.reduce((sum, b) => {
          // 年間表示：過去1年間の稼働月数で按分
          const activeMonths = getActiveMonthsInLastYear(b);
          if (activeMonths === 0) return sum;
          
          // 全期間の有効月数で按分してから、稼働月数分を計上
          const totalMonths = getTotalActiveMonths(b);
          const monthlyInvestment = b.investment / totalMonths;
          const proRatedInvestment = monthlyInvestment * activeMonths;
          return sum + proRatedInvestment;
        }, 0)
      : // 全期間表示：全事業の投資額の合計
        businesses.reduce((sum, b) => sum + b.investment, 0);
    
    // 加重平均ROIを計算（期間に応じた収益で計算）
    const weightedROI = totalBusinessInvestment > 0
      ? (totalBusinessRevenue / totalBusinessInvestment) * 100
      : 0;
    
    const totalCustomers = activeBusinesses.reduce((sum, b) => sum + b.customers, 0);
    const activeBusinessCount = activeBusinesses.filter(b => b.status === "運用中").length;
    const totalBusinessCount = periodView === "monthly" 
      ? activeBusinesses.length
      : periodView === "annual"
      ? businesses.filter(b => getActiveMonthsInLastYear(b) > 0).length
      : businesses.length;

    return (
    <div className="space-y-6">
      {/* 期間切り替えボタン */}
      <div className="flex justify-end items-center">
        {/* 期間切り替え */}
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => setPeriodView("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              periodView === "monthly"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            月間表示
          </button>
          <button
            onClick={() => setPeriodView("annual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              periodView === "annual"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            年間表示
          </button>
          <button
            onClick={() => setPeriodView("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              periodView === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            全期間表示
          </button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Building2 className="w-6 h-6" />,
              label: "総投資額",
              value: `¥${totalBusinessInvestment.toFixed(1)}万`,
              change: periodView === "monthly" 
                ? `${totalBusinessCount}事業` 
                : periodView === "annual"
                ? `過去1年稼働`
                : `全期間累計`,
            color: "blue",
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
              label: `${getPeriodLabel()}収益`,
              value: `¥${totalBusinessRevenue.toFixed(1)}万`,
              change: periodView === "monthly" 
                ? `有効${activeBusinesses.length}事業` 
                : periodView === "annual"
                ? `過去1年実績`
                : `全期間累計`,
            color: "green",
          },
          {
            icon: <Activity className="w-6 h-6" />,
              label: "加重平均ROI",
              value: `${weightedROI.toFixed(1)}%`,
              change: totalBusinessInvestment > 0 ? "投資効率" : "データなし",
            color: "orange",
          },
          {
            icon: <Calendar className="w-6 h-6" />,
              label: "運用中",
              value: `${activeBusinessCount}事業`,
              change: `顧客${totalCustomers}社`,
            color: "purple",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${card.color}-500`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${card.color}-600`}>{card.icon}</div>
              <span
                  className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700"
              >
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 売上推移グラフ（積み上げ式） */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {periodView === "monthly" ? "月別" : periodView === "annual" ? "四半期別" : "年別"}収益推移（全事業含む）
          </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={(() => {
              if (periodView === "monthly") {
                // 月間表示：過去12ヶ月分のデータを生成
                const months = [];
                const today = new Date();
                
                for (let i = 11; i >= 0; i--) {
                  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                  const monthData: any = {
                    month: date.toLocaleDateString('ja-JP', { month: 'short' }),
                    date: date,
                  };
                  
                  // 全事業について、その月の収益を計算（アーカイブ含む）
                  businesses.forEach((business) => {
                    const startDate = business.startDate ? new Date(business.startDate) : null;
                    const endDate = business.endDate ? new Date(business.endDate) : null;
                    
                    // その月にこの事業が稼働していたか確認
                    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    const isActive = startDate && 
                      startDate <= monthEnd && 
                      (!endDate || endDate >= date);
                    
                    if (isActive) {
                      if (business.revenueType === "oneTime") {
                        // 単発収益は開始月のみ
                        if (startDate && 
                            startDate.getFullYear() === date.getFullYear() && 
                            startDate.getMonth() === date.getMonth()) {
                          monthData[business.name] = business.monthlyRevenue;
                        } else {
                          monthData[business.name] = 0;
                        }
                      } else {
                        // 月間継続収益
                        monthData[business.name] = business.monthlyRevenue;
                      }
                    } else {
                      monthData[business.name] = 0;
                    }
                  });
                  
                  months.push(monthData);
                }
                
                return months;
              } else if (periodView === "annual") {
                // 年間表示：直近3年を四半期ごとに表示（12四半期）
                const quarters = [];
                const today = new Date();
                
                for (let q = 11; q >= 0; q--) {
                  // 正しく年と月を計算
                  const targetDate = new Date(today);
                  targetDate.setMonth(today.getMonth() - (q * 3));
                  const quarterStartMonth = targetDate.getMonth();
                  const quarterStartYear = targetDate.getFullYear();
                  const quarterStartDate = new Date(quarterStartYear, quarterStartMonth, 1);
                  const year = quarterStartDate.getFullYear();
                  const quarter = Math.floor(quarterStartDate.getMonth() / 3) + 1;
                  const quarterLabel = `${year}Q${quarter}`;
                  
                  const quarterData: any = {
                    month: quarterLabel,
                  };
                  
                  // 3ヶ月分を集計
                  for (let m = 0; m < 3; m++) {
                    const date = new Date(quarterStartYear, quarterStartMonth + m, 1);
                    
                    businesses.forEach((business) => {
                      const startDate = business.startDate ? new Date(business.startDate) : null;
                      const endDate = business.endDate ? new Date(business.endDate) : null;
                      
                      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                      const isActive = startDate && 
                        startDate <= monthEnd && 
                        (!endDate || endDate >= date);
                      
                      if (isActive) {
                        if (business.revenueType === "oneTime") {
                          if (startDate && 
                              startDate.getFullYear() === date.getFullYear() && 
                              startDate.getMonth() === date.getMonth()) {
                            quarterData[business.name] = (quarterData[business.name] || 0) + business.monthlyRevenue;
                          }
                        } else {
                          quarterData[business.name] = (quarterData[business.name] || 0) + business.monthlyRevenue;
                        }
                      }
                    });
                  }
                  
                  // 初期化されていない事業は0にする
                  businesses.forEach((business) => {
                    if (!quarterData[business.name]) {
                      quarterData[business.name] = 0;
                    }
                  });
                  
                  quarters.push(quarterData);
                }
                
                return quarters;
              } else {
                // 全期間表示：年間ごとにまとめる
                const years = [];
                const today = new Date();
                
                // 全事業の最も古い開始日を見つける
                let earliestYear = today.getFullYear();
                businesses.forEach((business) => {
                  if (business.startDate) {
                    const startYear = new Date(business.startDate).getFullYear();
                    if (startYear < earliestYear) {
                      earliestYear = startYear;
                    }
                  }
                });
                
                // 各年のデータを生成
                for (let year = earliestYear; year <= today.getFullYear(); year++) {
                  const yearData: any = {
                    month: `${year}年`,
                  };
                  
                  // 12ヶ月分を集計
                  for (let month = 0; month < 12; month++) {
                    const date = new Date(year, month, 1);
                    
                    businesses.forEach((business) => {
                      const startDate = business.startDate ? new Date(business.startDate) : null;
                      const endDate = business.endDate ? new Date(business.endDate) : null;
                      
                      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                      const isActive = startDate && 
                        startDate <= monthEnd && 
                        (!endDate || endDate >= date);
                      
                      if (isActive) {
                        if (business.revenueType === "oneTime") {
                          if (startDate && 
                              startDate.getFullYear() === date.getFullYear() && 
                              startDate.getMonth() === date.getMonth()) {
                            yearData[business.name] = (yearData[business.name] || 0) + business.monthlyRevenue;
                          }
                        } else {
                          yearData[business.name] = (yearData[business.name] || 0) + business.monthlyRevenue;
                        }
                      }
                    });
                  }
                  
                  // 初期化されていない事業は0にする
                  businesses.forEach((business) => {
                    if (!yearData[business.name]) {
                      yearData[business.name] = 0;
                    }
                  });
                  
                  years.push(yearData);
                }
                
                return years;
              }
            })()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {businesses.map((business, idx) => {
                const colors = [
                  '#3b82f6', // blue
                  '#10b981', // green
                  '#f59e0b', // amber
                  '#ef4444', // red
                  '#8b5cf6', // violet
                  '#ec4899', // pink
                  '#06b6d4', // cyan
                  '#84cc16', // lime
                ];
                const color = colors[idx % colors.length];
                return (
                  <linearGradient key={business.id} id={`color${business.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => `¥${Number(value).toFixed(1)}万`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            {businesses.map((business, idx) => {
              const colors = [
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
              ];
              const color = colors[idx % colors.length];
              return (
                <Area
                  key={business.id}
                  type="monotoneX"
                  dataKey={business.name}
                  stackId="1"
                  stroke={color}
                  fill={`url(#color${business.id})`}
                  fillOpacity={1}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

        {/* 事業一覧ダッシュボード */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">
                {showArchived ? "アーカイブ済み事業・案件" : "事業・案件別 収益・投資・ROI"}
              </h3>
              
              {/* アーカイブ切り替え */}
              <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                <button
                  onClick={() => setShowArchived(false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    !showArchived
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  有効 ({activeBusinesses.length})
                </button>
                <button
                  onClick={() => setShowArchived(true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    showArchived
                      ? "bg-gray-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  アーカイブ ({archivedBusinesses.length})
                </button>
              </div>
            </div>
            
            {!showArchived && (
              <button 
                onClick={handleAddBusiness}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                + 新規追加
              </button>
            )}
          </div>

          {displayBusinesses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {showArchived ? "アーカイブされた事業はありません" : "事業・案件がありません。新規追加してください。"}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {displayBusinesses.map((business) => (
              <div
                key={business.id}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedBusinessId === business.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
                onClick={() => setSelectedBusinessId(business.id)}
              >
                {/* ステータスバッジ */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-base">{business.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      business.status === "運用中"
                        ? "bg-green-100 text-green-700"
                        : business.status === "開発中"
                        ? "bg-blue-100 text-blue-700"
                        : business.status === "営業中"
                        ? "bg-yellow-100 text-yellow-700"
                        : business.status === "企画中"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {business.status}
                  </span>
                </div>

                {/* カテゴリ */}
                <div className="text-xs text-gray-500 mb-3">
                  {business.category}
                  {business.startDate && (
                    <span className="ml-2">
                      | {new Date(business.startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })}〜
                      {business.endDate && new Date(business.endDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>

                {/* 主要指標 */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{getRevenueLabel(business)}</span>
                    <span className="text-lg font-bold text-blue-600">
                      ¥{getRevenue(business).toFixed(1)}万
                    </span>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">投資額</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ¥{business.investment.toFixed(1)}万
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROI</span>
                    <span className="text-lg font-bold text-green-600">
                      {business.investment > 0 
                        ? `${((getRevenue(business) / business.investment) * 100).toFixed(1)}%`
                        : "-"
                      }
                    </span>
                  </div>
                </div>

                {/* サブ指標 */}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                  <span>顧客: {business.customers}社</span>
                  <span>従業員: {business.employees}名</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* 選択された事業の詳細パネル */}
        {selectedBusinessId !== null && (
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-300">
            {(() => {
              const business = businesses.find(b => b.id === selectedBusinessId);
              if (!business) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{business.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{business.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedBusinessId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>

                  {/* 詳細指標グリッド */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">{getRevenueLabel(business)}</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ¥{getRevenue(business).toFixed(1)}万
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {business.revenueType === "oneTime" 
                          ? "単発案件"
                          : periodView === "monthly" 
                            ? `年間想定: ¥${(business.monthlyRevenue * 12).toFixed(1)}万`
                            : `過去1年: ${getActiveMonthsInLastYear(business)}ヶ月稼働`
                        }
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">ROI</div>
                      <div className="text-2xl font-bold text-green-600">
                        {business.investment > 0 
                          ? `${((getRevenue(business) / business.investment) * 100).toFixed(1)}%`
                          : "-"
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {periodView === "monthly" ? "月間利益率" : periodView === "annual" ? "年間利益率" : "全期間利益率"}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">顧客数</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {business.customers}社
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        継続率: 95%
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">従業員</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {business.employees}名
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        稼働中
                      </div>
        </div>
      </div>

                  {/* コスト内訳 */}
                  <div className="bg-gray-50 rounded-lg p-5 mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">コスト内訳</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">開発費</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{business.costs.development.toFixed(1)}万
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">原価（年）</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{(business.costs.cogs || 0).toFixed(1)}万
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">マーケティング</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{business.costs.marketing.toFixed(1)}万
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">人件費（年）</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{business.costs.personnel.toFixed(1)}万
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">インフラ（年）</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{business.costs.infrastructure.toFixed(1)}万
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">その他</div>
                        <div className="text-lg font-bold text-gray-900">
                          ¥{business.costs.other.toFixed(1)}万
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">総投資額</span>
                        <span className="text-xl font-bold text-gray-900">
                          ¥{business.investment.toFixed(1)}万円
            </span>
                      </div>
                    </div>
          </div>

                  {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">カテゴリ</div>
                      <div className="font-semibold text-gray-900">{business.category}</div>
              </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">収益タイプ</div>
                      <div className="font-semibold text-gray-900">
                        {business.revenueType === "monthly" ? "月間継続収益" : "単発収益"}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">開始日</div>
                      <div className="font-semibold text-gray-900">
                        {business.startDate || "未設定"}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">終了日</div>
                      <div className="font-semibold text-gray-900">
                        {business.endDate || "継続中"}
                      </div>
              </div>
            </div>

                  {/* アクションボタン */}
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => handleEditBusiness(business.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      編集
                    </button>
                    <button 
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                    >
                      削除
                    </button>
                </div>
            </div>
              );
            })()}
              </div>
        )}

        {/* 編集・追加モーダル */}
        {(showEditBusinessModal || showAddBusinessModal) && editingBusiness && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancelBusinessEdit();
              }
            }}
          >
            <div 
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {showAddBusinessModal ? "新規事業・案件追加" : "事業・案件編集"}
                  </h2>
                  <button
                    onClick={handleCancelBusinessEdit}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    <span className="text-2xl">×</span>
            </button>
                </div>
            </div>

              <div className="p-6 space-y-6">
                {/* 基本情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        事業・案件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingBusiness?.name || ''}
                        onChange={(e) => updateEditingBusinessField('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 会計自動化SaaS"
                      />
          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        カテゴリ
                      </label>
                      <select
                        value={editingBusiness?.category || 'サービス提供'}
                        onChange={(e) => updateEditingBusinessField('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="サービス提供">サービス提供</option>
                        <option value="コンサルティング">コンサルティング</option>
                        <option value="受託開発">受託開発</option>
                        <option value="その他">その他</option>
                      </select>
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ステータス
                      </label>
                      <select
                        value={editingBusiness?.status || '企画中'}
                        onChange={(e) => updateEditingBusinessField('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="企画中">企画中</option>
                        <option value="営業中">営業中</option>
                        <option value="開発中">開発中</option>
                        <option value="運用中">運用中</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        開始日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editingBusiness?.startDate || ''}
                        onChange={(e) => updateEditingBusinessField('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        終了日 <span className="text-xs text-gray-500">(空欄=継続中)</span>
                      </label>
                      <input
                        type="date"
                        value={editingBusiness?.endDate || ''}
                        onChange={(e) => updateEditingBusinessField('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        終了日を設定すると自動的にアーカイブされます
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      value={editingBusiness?.description || ''}
                      onChange={(e) => updateEditingBusinessField('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="事業・案件の簡単な説明"
                    />
              </div>
            </div>

                {/* 収益情報 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">収益情報</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      収益タイプ
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="monthly"
                          checked={editingBusiness?.revenueType === "monthly"}
                          onChange={(e) => updateEditingBusinessField('revenueType', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">月間継続収益</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="oneTime"
                          checked={editingBusiness?.revenueType === "oneTime"}
                          onChange={(e) => updateEditingBusinessField('revenueType', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">単発収益</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {editingBusiness?.revenueType === "monthly" ? "月間収益（万円）" : "単発収益（万円）"}
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.monthlyRevenue || ''}
                        onChange={(e) => updateEditingBusinessField('monthlyRevenue', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="85"
                      />
                      {editingBusiness?.revenueType === "monthly" && (
                        <p className="text-xs text-gray-500 mt-1">
                          年間: ¥{((editingBusiness?.monthlyRevenue || 0) * 12).toLocaleString()}万
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        顧客数（社）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.customers || ''}
                        onChange={(e) => updateEditingBusinessField('customers', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        従業員数（名）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.employees || ''}
                        onChange={(e) => updateEditingBusinessField('employees', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2"
                      />
                  </div>
          </div>
        </div>

                {/* コスト内訳 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">コスト内訳</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        開発費（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.development || ''}
                        onChange={(e) => updateEditingBusinessCost('development', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        原価・年間（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.cogs || ''}
                        onChange={(e) => updateEditingBusinessCost('cogs', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="180"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        広告宣伝費・年間（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.marketing || ''}
                        onChange={(e) => updateEditingBusinessCost('marketing', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        人件費・年間（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.personnel || ''}
                        onChange={(e) => updateEditingBusinessCost('personnel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="240"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        インフラ・年間（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.infrastructure || ''}
                        onChange={(e) => updateEditingBusinessCost('infrastructure', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="36"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        その他（万円）
                      </label>
                      <input
                        type="number"
                        value={editingBusiness?.costs?.other || ''}
                        onChange={(e) => updateEditingBusinessCost('other', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="20"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">総投資額（自動計算）</span>
                      <span className="text-lg font-bold text-blue-600">
                        ¥{Object.values(editingBusiness?.costs || {}).reduce((sum: number, cost: any) => sum + Number(cost || 0), 0).toLocaleString()}万円
            </span>
                    </div>
              </div>
          </div>

                {/* 計算結果プレビュー */}
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <h3 className="font-bold text-gray-900 mb-3">💡 計算結果プレビュー</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        {editingBusiness?.revenueType === "monthly" ? "年間収益" : "単発収益"}
              </div>
                      <div className="text-lg font-bold text-blue-600">
                        ¥{editingBusiness?.revenueType === "monthly" 
                          ? ((editingBusiness?.monthlyRevenue || 0) * 12).toLocaleString() 
                          : (editingBusiness?.monthlyRevenue || 0).toLocaleString()
                        }万
              </div>
                      {editingBusiness?.revenueType === "monthly" && (
                        <div className="text-xs text-gray-500 mt-1">
                          月¥{(editingBusiness?.monthlyRevenue || 0).toLocaleString()}万
            </div>
                      )}
                    </div>
            <div>
                      <div className="text-xs text-gray-600 mb-1">総投資額</div>
                      <div className="text-lg font-bold text-gray-900">
                        ¥{Object.values(editingBusiness?.costs || {}).reduce((sum: number, cost: any) => sum + Number(cost || 0), 0).toLocaleString()}万
                    </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">ROI</div>
                      <div className="text-lg font-bold text-green-600">
                        {(() => {
                          const annualRevenue = editingBusiness?.revenueType === "monthly" 
                            ? (editingBusiness?.monthlyRevenue || 0) * 12 
                            : (editingBusiness?.monthlyRevenue || 0);
                          const totalCosts = Object.values(editingBusiness?.costs || {}).reduce((sum: number, cost: any) => sum + Number(cost || 0), 0);
                          const roi = totalCosts > 0 ? ((annualRevenue - totalCosts) / totalCosts) * 100 : 0;
                          return roi.toFixed(1);
                        })()}%
                  </div>
            </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        {editingBusiness?.revenueType === "monthly" ? "月間利益" : "純利益"}
              </div>
                      <div className="text-lg font-bold text-green-600">
                        ¥{(() => {
                          const totalCosts = Object.values(editingBusiness?.costs || {}).reduce((sum: number, cost: any) => sum + Number(cost || 0), 0);
                          if (editingBusiness?.revenueType === "monthly") {
                            return ((editingBusiness?.monthlyRevenue || 0) - totalCosts / 12).toFixed(0);
                          } else {
                            return ((editingBusiness?.monthlyRevenue || 0) - totalCosts).toFixed(0);
                          }
                        })()}万
            </div>
          </div>
        </div>
      </div>

                {/* アクションボタン */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleCancelBusinessEdit}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSaveBusiness}
                    disabled={!editingBusiness?.name?.trim() || !editingBusiness?.startDate}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                      editingBusiness?.name?.trim() && editingBusiness?.startDate
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {showAddBusinessModal ? "追加" : "保存"}
                  </button>
                  </div>
                </div>
              </div>
            </div>
        )}
    </div>
  );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">資産・投資管理</h1>
        <p className="mt-2 text-sm text-gray-600">
          事業と個人の資産・投資を統合管理し、最適なポートフォリオを構築
        </p>
      </div>

      {/* ビュー切り替えタブ */}
      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
        {[
          { id: "integrated", label: "統合ビュー" },
          { id: "personal", label: "個人投資" },
          { id: "business", label: "事業投資" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() =>
              setViewMode(view.id as "integrated" | "personal" | "business")
            }
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === view.id
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* 表示切り替え */}
      {viewMode === "integrated" && <IntegratedView />}
      {viewMode === "personal" && <PersonalView />}
      {viewMode === "business" && <BusinessView />}

      {/* サービス開発投資管理モーダル */}
      {showDevelopmentPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    💻 サービス開発投資管理
                    {isEditMode && <span className="ml-3 text-sm bg-yellow-500 px-3 py-1 rounded-full">編集モード</span>}
                  </h2>
                  <p className="text-sm opacity-90">
                    投資額・売上・顧客数を管理してROIを可視化
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditMode ? (
                    <>
                      <button
                        onClick={addNewService}
                        className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        サービス追加
                      </button>
                      <button
                        onClick={handleEditMode}
                        className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        編集
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="text-white bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-lg px-4 py-2 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="text-white bg-green-500 bg-opacity-80 hover:bg-opacity-100 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        保存
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setShowDevelopmentPlan(false);
                      setIsEditMode(false);
                      setEditedServices([]);
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 全体サマリー */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">総開発投資</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.developmentCost, 0)}万円
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">月間総売上</div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.monthlyRevenue, 0)}万円
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">総顧客数</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentServices
                      .filter(s => s.status === "運用中" || s.status === "開発中")
                      .reduce((sum, s) => sum + s.currentCustomers, 0)}社
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">平均ROI</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {(() => {
                      const activeServices = currentServices.filter(s => (s.status === "運用中" || s.status === "開発中") && s.roi > 0);
                      return activeServices.length > 0 
                        ? (activeServices.reduce((sum, s) => sum + s.roi, 0) / activeServices.length).toFixed(1)
                        : 0;
                    })()}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    運用中・開発中のみ
                  </div>
                </div>
              </div>

              {/* サービス追加フォーム */}
              {showAddServiceForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">🆕 新規サービス追加</h3>
                    <button
                      onClick={handleCancelAddService}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* サービス名 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        サービス名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="例: AI経理アシスタント"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* 投資情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💰 開発投資額（万円）
                        </label>
                        <input
                          type="number"
                          value={newService.developmentCost}
                          onChange={(e) => setNewService({ ...newService, developmentCost: parseInt(e.target.value) || 0 })}
                          placeholder="例: 250"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📈 月間売上（万円）
                        </label>
                        <input
                          type="number"
                          value={newService.monthlyRevenue}
                          onChange={(e) => setNewService({ ...newService, monthlyRevenue: parseInt(e.target.value) || 0 })}
                          placeholder="例: 85"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* 顧客情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          👥 現在の顧客数
                        </label>
                        <input
                          type="number"
                          value={newService.currentCustomers}
                          onChange={(e) => setNewService({ ...newService, currentCustomers: parseInt(e.target.value) || 0 })}
                          placeholder="例: 45"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🎯 目標顧客数
                        </label>
                        <input
                          type="number"
                          value={newService.targetCustomers}
                          onChange={(e) => setNewService({ ...newService, targetCustomers: parseInt(e.target.value) || 0 })}
                          placeholder="例: 100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💵 顧客単価（万円/月）
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newService.pricePerCustomer}
                          onChange={(e) => setNewService({ ...newService, pricePerCustomer: parseFloat(e.target.value) || 0 })}
                          placeholder="例: 1.89"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* その他情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ⏱️ 開発期間
                        </label>
                        <input
                          type="text"
                          value={newService.developmentPeriod}
                          onChange={(e) => setNewService({ ...newService, developmentPeriod: e.target.value })}
                          placeholder="例: 6ヶ月"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📅 ローンチ予定
                        </label>
                        <input
                          type="text"
                          value={newService.launchDate}
                          onChange={(e) => setNewService({ ...newService, launchDate: e.target.value })}
                          placeholder="例: 2025年4月"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📈 顧客成長率
                        </label>
                        <input
                          type="text"
                          value={newService.customerGrowthRate}
                          onChange={(e) => setNewService({ ...newService, customerGrowthRate: e.target.value })}
                          placeholder="例: 月8人増加"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* プレビュー */}
                    {newService.developmentCost > 0 && newService.monthlyRevenue > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3">📊 投資シミュレーション</div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-gray-600">年間売上</div>
                            <div className="text-lg font-bold text-green-600">
                              {newService.monthlyRevenue * 12}万円
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">予想ROI</div>
                            <div className="text-lg font-bold text-blue-600">
                              {newService.developmentCost > 0
                                ? ((newService.monthlyRevenue * 12 - newService.developmentCost) / newService.developmentCost * 100).toFixed(1)
                                : 0}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">回収期間</div>
                            <div className="text-lg font-bold text-purple-600">
                              {newService.monthlyRevenue > 0
                                ? (newService.developmentCost / newService.monthlyRevenue).toFixed(1)
                                : 0}ヶ月
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ボタン */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={handleCancelAddService}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleAddService}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* サービス一覧 */}
              <div className="space-y-4">
                {currentServices.map((service) => (
                  <div
                    key={service.id}
                    className={`border-2 rounded-xl p-6 ${
                      service.status === "運用中"
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                        : service.status === "開発中"
                        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                        : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editedServices.find((s) => s.id === service.id)?.name || service.name}
                              onChange={(e) => updateService(service.id, "name", e.target.value)}
                              className="text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded px-3 py-2 flex-1"
                            />
                          ) : (
                            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                          )}
                          {isEditMode ? (
                            <select
                              value={editedServices.find((s) => s.id === service.id)?.status || service.status}
                              onChange={(e) => updateService(service.id, "status", e.target.value)}
                              className={`text-sm px-4 py-2 rounded-full font-semibold ${
                                service.status === "運用中"
                                  ? "bg-green-200 text-green-800"
                                  : service.status === "開発中"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <option>計画中</option>
                              <option>開発中</option>
                              <option>運用中</option>
                              <option>終了</option>
                            </select>
                          ) : (
                            <span
                              className={`text-sm px-4 py-2 rounded-full font-semibold ${
                                service.status === "運用中"
                                  ? "bg-green-200 text-green-800"
                                  : service.status === "開発中"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {service.status}
                            </span>
                          )}
                          {isEditMode && (
                            <button
                              onClick={() => deleteService(service.id)}
                              className="text-red-600 hover:bg-red-50 rounded-lg p-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 投資・リターン情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">💰 開発投資額</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedServices.find((s) => s.id === service.id)?.developmentCost || service.developmentCost}
                            onChange={(e) => updateService(service.id, "developmentCost", parseInt(e.target.value) || 0)}
                            className="text-lg font-bold text-blue-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-blue-600">{service.developmentCost}万円</div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">📈 月間売上</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedServices.find((s) => s.id === service.id)?.monthlyRevenue || service.monthlyRevenue}
                            onChange={(e) => updateService(service.id, "monthlyRevenue", parseInt(e.target.value) || 0)}
                            className="text-lg font-bold text-green-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-green-600">{service.monthlyRevenue}万円/月</div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">👥 顧客数</div>
                        {isEditMode ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editedServices.find((s) => s.id === service.id)?.currentCustomers || service.currentCustomers}
                              onChange={(e) => updateService(service.id, "currentCustomers", parseInt(e.target.value) || 0)}
                              className="text-lg font-bold text-purple-600 w-16 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                            />
                            <span className="text-gray-400">/</span>
                            <input
                              type="number"
                              value={editedServices.find((s) => s.id === service.id)?.targetCustomers || service.targetCustomers}
                              onChange={(e) => updateService(service.id, "targetCustomers", parseInt(e.target.value) || 0)}
                              className="text-sm text-gray-600 w-16 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-purple-600">
                            {service.currentCustomers}社 / {service.targetCustomers}社
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">💵 単価/顧客</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editedServices.find((s) => s.id === service.id)?.pricePerCustomer || service.pricePerCustomer}
                            onChange={(e) => updateService(service.id, "pricePerCustomer", parseFloat(e.target.value) || 0)}
                            className="text-lg font-bold text-indigo-600 w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-lg font-bold text-indigo-600">{service.pricePerCustomer}万円/月</div>
                        )}
                      </div>
                    </div>

                    {/* ROI・回収期間 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">📊 ROI（年間）</div>
                        <div className="text-2xl font-bold">
                          {service.roi > 0 ? `+${service.roi.toFixed(1)}%` : `${service.roi.toFixed(1)}%`}
                        </div>
                        <div className="text-xs opacity-80 mt-1">
                          年間売上: {service.annualRevenue}万円
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">⏱️ 回収期間</div>
                        <div className="text-2xl font-bold">
                          {service.paybackPeriod !== "未算出" ? `${service.paybackPeriod}ヶ月` : service.paybackPeriod}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div className="text-xs opacity-90 mb-1">📈 顧客成長率</div>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.customerGrowthRate || service.customerGrowthRate}
                            onChange={(e) => updateService(service.id, "customerGrowthRate", e.target.value)}
                            className="text-lg font-bold w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-xl font-bold">{service.customerGrowthRate}</div>
                        )}
                      </div>
                    </div>

                    {/* 詳細情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">開発期間:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.developmentPeriod || service.developmentPeriod}
                            onChange={(e) => updateService(service.id, "developmentPeriod", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span>{service.developmentPeriod}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">ローンチ:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedServices.find((s) => s.id === service.id)?.launchDate || service.launchDate}
                            onChange={(e) => updateService(service.id, "launchDate", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span>{service.launchDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
