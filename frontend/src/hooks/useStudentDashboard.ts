import { useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
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

export interface DashboardFines {
  totalDenda: number;
  hasFine: boolean;
  fineBorrowings: any[];
  countLate: number;
  countDamaged: number;
  countLost: number;
}

export interface DashboardTaskItem {
  id: string;
  archive: {
    id?: string;
    title: string;
    archiveType: string;
    archiveCode?: string;
  };
  status: string;
  borrowDate: string;
  accDate?: string | null;
  returnDate?: string | null;
  pickupCode?: string | null;
  fineAmount?: number | null;
  daysRemaining?: number;
  isDueSoon?: boolean;
  isOverdue?: boolean;
}

export interface DashboardCalendar {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  taskDates: Date[];
  tasksForSelectedDate: DashboardTaskItem[];
}

export function useStudentDashboard() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: borrowings = [], isPending: isLoadingBorrowings } = useMyBorrowingHistoryQuery();
  const { data: setting, isPending: isLoadingSetting } = useSystemSettingQuery();

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const activeStatuses = useMemo(() => ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"], []);

  const activeBorrowings = useMemo(() => {
    return borrowings.filter((b: any) => activeStatuses.includes(b.status));
  }, [borrowings, activeStatuses]);

  // Kalkulasi Kuota Peminjaman
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

  // Kalkulasi Tunggakan Denda
  const denda = useMemo<DashboardFines>(() => {
    const fineBorrowings = borrowings.filter(
      (b: any) =>
        b.status !== "CANCELLED" &&
        b.status !== "REJECTED" &&
        ((b.fineAmount && b.fineAmount > 0 && !b.finePaidAt) || b.status === "OVERDUE"),
    );

    const totalDenda = fineBorrowings.reduce(
      (sum: number, b: any) => sum + (b.fineAmount || 0),
      0,
    );

    let countLate = 0;
    let countDamaged = 0;
    let countLost = 0;

    fineBorrowings.forEach((fb: any) => {
      if (fb.status === "OVERDUE") countLate++;
      else if (fb.status === "DAMAGED") countDamaged++;
      else if (fb.status === "LOST") countLost++;
      else countLate++;
    });

    return {
      totalDenda,
      hasFine: totalDenda > 0 && fineBorrowings.length > 0,
      fineBorrowings,
      countLate,
      countDamaged,
      countLost,
    };
  }, [borrowings]);

  const firstName = useMemo(() => {
    return session?.user?.name ? session.user.name.trim().split(" ")[0] : "Mahasiswa";
  }, [session?.user?.name]);

  const getTaskDate = (b: any) => {
    return b.status === "BORROWED" || b.status === "OVERDUE"
      ? b.returnDate
      : b.accDate || b.borrowDate;
  };

  const taskDates = useMemo<Date[]>(() => {
    return activeBorrowings
      .map((b: any) => {
        const ds = getTaskDate(b);
        return ds ? new Date(ds) : null;
      })
      .filter(Boolean) as Date[];
  }, [activeBorrowings]);

  const tasksForSelectedDate = useMemo<DashboardTaskItem[]>(() => {
    if (!date) return [];
    const now = new Date();

    return activeBorrowings
      .filter((b: any) => {
        const ds = getTaskDate(b);
        if (!ds) return false;
        const d = new Date(ds);
        return (
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      })
      .map((b: any) => {
        let daysRemaining: number | undefined;
        let isDueSoon = false;
        let isOverdue = b.status === "OVERDUE";

        if (b.returnDate) {
          const retDate = new Date(b.returnDate);
          daysRemaining = Math.ceil((retDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysRemaining <= 3 && daysRemaining >= 0) isDueSoon = true;
          if (daysRemaining < 0) isOverdue = true;
        }

        return {
          id: b.id,
          archive: {
            id: b.archive?.id,
            title: b.archive?.title || "Arsip Tanpa Judul",
            archiveType: b.archive?.archiveType || "Arsip",
            archiveCode: b.archive?.archiveCode,
          },
          status: b.status,
          borrowDate: b.borrowDate,
          accDate: b.accDate,
          returnDate: b.returnDate,
          pickupCode: b.pickupCode,
          fineAmount: b.fineAmount,
          daysRemaining,
          isDueSoon,
          isOverdue,
        };
      });
  }, [activeBorrowings, date]);

  return {
    session,
    isLoading: isSessionLoading || isLoadingBorrowings || isLoadingSetting,
    firstName,
    currentDate,
    quota,
    denda,
    calendar: {
      date,
      setDate,
      taskDates,
      tasksForSelectedDate,
    },
  };
}
