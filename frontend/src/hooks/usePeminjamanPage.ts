import {
  useState,
  useMemo,
  useCallback,
} from "react";
import { useStudentBorrowing } from "./useStudentBorrowing";
import { useStudentHistory } from "./useStudentHistory";

export type PeminjamanTab = "AKTIF" | "RIWAYAT";

export function usePeminjamanPage() {
  const [activeTab, setActiveTab] = useState<PeminjamanTab>("AKTIF");

  const borrowing = useStudentBorrowing();
  const history = useStudentHistory();

  const switchTab = useCallback((tab: PeminjamanTab) => {
    setActiveTab(tab);
  }, []);

  const isLoading = useMemo(
    () =>
      activeTab === "AKTIF" ? borrowing.isLoading : history.isLoading,
    [activeTab, borrowing.isLoading, history.isLoading]
  );

  return {
    activeTab,
    switchTab,
    isLoading,
    borrowing,
    history,
  };
}
