import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 個人固定費の bizId 予約値
export const PERSONAL_BIZ_ID = "__personal__";

// ── 型定義 ───────────────────────────────────────────────────────
export interface FixedCostMaster {
  id: string;
  bizId:      string; // 事業ID（表示名）
  name:       string; // 内容
  amount:     string; // 金額（万円）
  start_date: string; // 計上期間（開始）YYYY-MM-DD（空=無期限）
  end_date:   string; // 計上期間（終了）YYYY-MM-DD（空=無期限）
  memo:       string; // メモ
}

interface FixedCostContextValue {
  masters: FixedCostMaster[];
  addMaster:    (master: Omit<FixedCostMaster, "id">) => FixedCostMaster;
  updateMaster: (id: string, patch: Partial<Omit<FixedCostMaster, "id">>) => void;
  deleteMaster: (id: string) => void;
}

// ── 初期サンプルデータ ────────────────────────────────────────────
const INITIAL_MASTERS: FixedCostMaster[] = [
  { id: "fc-a1", bizId: "A事業",            name: "家賃（店舗）",     amount: "6", start_date: "", end_date: "", memo: "月額固定" },
  { id: "fc-a2", bizId: "A事業",            name: "仕入原価",         amount: "8", start_date: "", end_date: "", memo: "食材・消耗品" },
  { id: "fc-b1", bizId: "Bコンサルティング", name: "SaaS各種サブスク", amount: "2", start_date: "", end_date: "", memo: "Notion, Slack等" },
  { id: "fc-p1", bizId: PERSONAL_BIZ_ID,    name: "家賃",             amount: "7", start_date: "", end_date: "", memo: "" },
  { id: "fc-p2", bizId: PERSONAL_BIZ_ID,    name: "生命保険・医療保険", amount: "2", start_date: "", end_date: "", memo: "" },
];

// ── Context ───────────────────────────────────────────────────────
const FixedCostContext = createContext<FixedCostContextValue | null>(null);

export function FixedCostProvider({ children }: { children: ReactNode }) {
  const [masters, setMasters] = useState<FixedCostMaster[]>(INITIAL_MASTERS);

  function addMaster(master: Omit<FixedCostMaster, "id">): FixedCostMaster {
    const newMaster = { ...master, id: crypto.randomUUID() };
    setMasters(prev => [...prev, newMaster]);
    return newMaster;
  }

  function updateMaster(id: string, patch: Partial<Omit<FixedCostMaster, "id">>) {
    setMasters(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }

  function deleteMaster(id: string) {
    setMasters(prev => prev.filter(m => m.id !== id));
  }

  return (
    <FixedCostContext.Provider value={{ masters, addMaster, updateMaster, deleteMaster }}>
      {children}
    </FixedCostContext.Provider>
  );
}

export function useFixedCost(): FixedCostContextValue {
  const ctx = useContext(FixedCostContext);
  if (!ctx) throw new Error("useFixedCost must be used within FixedCostProvider");
  return ctx;
}