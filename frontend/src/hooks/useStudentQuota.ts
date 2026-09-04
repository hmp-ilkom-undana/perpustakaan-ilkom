import { useMemo } from "react";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";

export interface DashboardQuota {
  terpakai: number;
  maksimal: number;
  sisa: number;
  isFull: boolean;
  countSkripsi: number;
  maxSkripsi: number;
  countRingkasan: number;
  maxRingkasan: number;
  countNaskah: number;
  maxNaskah: number;
}

const ACTIVE_STATUSES = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];

export function useStudentQuota() {
  const { data: borrowings = [], isPending: isLoadingBorrowings } = useMyBorrowingHistoryQuery();
  const { data: setting, isPending: isLoadingSetting } = useSystemSettingQuery();

  const activeBorrowings = useMemo(() => {
    return borrowings.filter((b: any) => ACTIVE_STATUSES.includes(b.status));
  }, [borrowings]);

  const quota = useMemo<DashboardQuota>(() => {
    const maxSkripsi = setting?.maxActiveSkripsi ?? 2;
    const maxRingkasan = setting?.maxActiveRingkasan ?? 1;
    const maxNaskah = setting?.maxActiveNaskah ?? 1;
    const maksimal = maxSkripsi + maxRingkasan + maxNaskah;
    const terpakai = activeBorrowings.length;
    const sisa = Math.max(0, maksimal - terpakai);

    let countSkripsi = 0;
    let countRingkasan = 0;
    let countNaskah = 0;

    activeBorrowings.forEach((b: any) => {
      const type = b.archive?.archiveType?.toUpperCase().replace(" ", "_") || "";
      if (type === "SKRIPSI") countSkripsi++;
      else if (type === "RINGKASAN_SKRIPSI") countRingkasan++;
      else if (type === "NASKAH_PUBLIKASI") countNaskah++;
    });

    return {
      terpakai,
      maksimal,
      sisa,
      isFull: terpakai >= maksimal,
      countSkripsi,
      maxSkripsi,
      countRingkasan,
      maxRingkasan,
      countNaskah,
      maxNaskah,
    };
  }, [activeBorrowings, setting]);

  return {
    quota,
    isLoading: isLoadingBorrowings || isLoadingSetting,
  };
}
