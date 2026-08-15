import { cn } from "@/lib/utils";

/**
 * =========================================================================
 * PUSAT KONFIGURASI LOGO NAVIGASI (Mahasiswa, Petugas, Admin)
 * =========================================================================
 * Ubah nilai konstanta di bawah ini jika ingin menyesuaikan tampilan logo
 * tanpa perlu mengubah file layout satu per satu.
 */
export const NAV_LOGO_CONFIG = {
  src: "/assets/Logo_Ilkom.png",
  alt: "Logo Perpustakaan ILKOM",
  // Tingkat perbesaran (zoom) logo untuk memfokuskan lambang
  scaleClass: "scale-[1.35]",
  // Penyesuaian posisi vertikal/horizontal jika diperlukan (contoh: "-translate-y-0.5")
  positionClass: "top-0 left-1/2 -translate-x-1/2",
};

interface NavLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "brutalist";
}

export function NavLogo({
  className,
  size = "md",
  variant = "default",
}: NavLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-lg",
    lg: "w-12 h-12 rounded-xl",
  }[size];

  const variantClasses =
    variant === "brutalist"
      ? "border-2 border-blue-900 rounded-md"
      : "rounded-lg";

  return (
    <div
      className={cn(
        "relative overflow-hidden flex-shrink-0 bg-white",
        sizeClasses,
        variantClasses,
        className,
      )}
    >
      <img
        src={NAV_LOGO_CONFIG.src}
        alt={NAV_LOGO_CONFIG.alt}
        className={cn(
          "absolute origin-top object-cover max-w-none w-full",
          NAV_LOGO_CONFIG.positionClass,
          NAV_LOGO_CONFIG.scaleClass,
        )}
      />
    </div>
  );
}
