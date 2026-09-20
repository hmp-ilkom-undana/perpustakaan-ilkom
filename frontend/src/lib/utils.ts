import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number | null | undefined = 0): string {
  const validAmount = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return `Rp ${new Intl.NumberFormat("id-ID").format(validAmount)}`;
}
