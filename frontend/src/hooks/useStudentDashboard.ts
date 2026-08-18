import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";

export function useStudentDashboard() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: borrowings = [], isPending: isLoadingBorrowings } = useMyBorrowingHistoryQuery();
  const { data: setting, isPending: isLoadingSetting } = useSystemSettingQuery();

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];
  const activeBorrowings = borrowings.filter((b: any) =>
    activeStatuses.includes(b.status),
  );

  const maxSkripsi = setting?.maxActiveSkripsi ?? 2;
  const maxRingkasan = setting?.maxActiveRingkasan ?? 1;
  const maxNaskah = setting?.maxActiveNaskah ?? 1;
  const maksimal = maxSkripsi + maxRingkasan + maxNaskah;
  const terpakai = activeBorrowings.length;

  let countSkripsi = 0;
  let countRingkasan = 0;
  let countNaskah = 0;

  activeBorrowings.forEach((b: any) => {
    const type = b.archive.archiveType.toUpperCase().replace(" ", "_");
    if (type === "SKRIPSI") countSkripsi++;
    else if (type === "RINGKASAN_SKRIPSI") countRingkasan++;
    else if (type === "NASKAH_PUBLIKASI") countNaskah++;
  });

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

  const firstName = session?.user?.name?.split(" ")[0] || "Mahasiswa";

  const getTaskDate = (b: any) => {
    return b.status === "BORROWED" || b.status === "OVERDUE"
      ? b.returnDate
      : b.accDate || b.borrowDate;
  };

  const taskDates = activeBorrowings
    .map((b: any) => {
      const ds = getTaskDate(b);
      return ds ? new Date(ds) : null;
    })
    .filter(Boolean) as Date[];

  const tasksForSelectedDate = activeBorrowings.filter((b: any) => {
    if (!date) return false;
    const ds = getTaskDate(b);
    if (!ds) return false;
    const d = new Date(ds);
    return (
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  });

  return {
    session,
    isLoading: isSessionLoading || isLoadingBorrowings || isLoadingSetting,
    firstName,
    currentDate,
    quota: {
      terpakai,
      maksimal,
      countSkripsi,
      maxSkripsi,
      countRingkasan,
      maxRingkasan,
      countNaskah,
      maxNaskah,
    },
    denda: {
      totalDenda,
      fineBorrowings,
    },
    calendar: {
      date,
      setDate,
      taskDates,
      tasksForSelectedDate,
    },
  };
}
