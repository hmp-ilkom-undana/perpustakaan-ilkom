import { useQuery } from "@tanstack/react-query";
import {
  userService,
  type UserItem,
  type BorrowingHistoryItem,
} from "@/services/user.service";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  students: (search?: string) => ["users", "students", search] as const,
  studentBorrowings: (userId?: string) =>
    ["users", "students", "borrowings", userId] as const,
  staff: (search?: string) => ["users", "staff", search] as const,
};

/**
 * Hook untuk mengambil daftar seluruh mahasiswa terdaftar
 */
export function useStudentsQuery(search?: string) {
  return useQuery<UserItem[]>({
    queryKey: USER_QUERY_KEYS.students(search),
    queryFn: () => userService.getStudents(search),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook untuk mengambil riwayat sirkulasi & denda mahasiswa tertentu
 */
export function useStudentBorrowingsQuery(
  userId?: string,
  enabled: boolean = true,
) {
  return useQuery<BorrowingHistoryItem[]>({
    queryKey: USER_QUERY_KEYS.studentBorrowings(userId),
    queryFn: () => userService.getStudentBorrowings(userId!),
    enabled: Boolean(userId) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook untuk mengambil daftar akun staf/petugas
 */
export function useStaffQuery(search?: string) {
  return useQuery<UserItem[]>({
    queryKey: USER_QUERY_KEYS.staff(search),
    queryFn: () => userService.getStaff(search),
    staleTime: 1000 * 60 * 5,
  });
}
