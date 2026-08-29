import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
} from "@tanstack/react-router";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import KelolaPengguna from "./pages/admin/KelolaPengguna";
import KelolaPetugas from "./pages/admin/KelolaPetugas";
import AdminProfil from "./pages/admin/AdminProfil";
import PengaturanSistem from "./pages/admin/PengaturanSistem";
import LogAktivitas from "./pages/admin/LogAktivitas";

// Petugas Imports
import PetugasLayout from "./layouts/PetugasLayout";
import DashboardPetugas from "./pages/petugas/DashboardPetugas";
import Sirkulasi from "./pages/petugas/Sirkulasi";
import SirkulasiDetail from "./pages/petugas/SirkulasiDetail";
import KatalogAdmin from "./pages/petugas/KatalogAdmin";
import Denda from "./pages/petugas/Denda";
import ProfilPetugas from "./pages/petugas/ProfilPetugas";

// Mahasiswa Imports
import MahasiswaLayout from "./layouts/MahasiswaLayout";
import DashboardMahasiswa from "./pages/mahasiswa/DashboardMahasiswa";
import Katalog from "./pages/mahasiswa/Katalog";
import Peminjaman from "./pages/mahasiswa/Peminjaman";
import Profil from "./pages/mahasiswa/Profil";

// Auth & Public Imports
import Login from "./pages/Login";
import LupaSandi from "./pages/LupaSandi";
import ResetSandi from "./pages/ResetSandi";
import Maintenance from "./pages/Maintenance";
import MaintenanceGuard from "./components/MaintenanceGuard";

// 1. Root Route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  ),
});

// 2. Public / Root Redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/login" replace />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const lupaSandiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lupa-sandi",
  component: LupaSandi,
});

const resetSandiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-sandi",
  component: ResetSandi,
});

const maintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/maintenance",
  component: Maintenance,
});

// 3. Authenticated Route Wrapper
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_auth",
  component: ProtectedRoute,
});

// 4. Admin Layout & Routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/admin",
  component: AdminLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: DashboardAdmin,
});

const adminSirkulasiRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "sirkulasi",
  component: Sirkulasi,
});

const adminSirkulasiDetailRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "sirkulasi/$id",
  component: SirkulasiDetail,
});

const adminKatalogRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "katalog",
  component: KatalogAdmin,
});

const adminDendaRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "denda",
  component: Denda,
});

const adminPenggunaRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "pengguna",
  component: KelolaPengguna,
});

const adminPetugasRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "petugas",
  component: KelolaPetugas,
});

const adminProfilRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "profil",
  component: AdminProfil,
});

const adminPengaturanRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "pengaturan",
  component: PengaturanSistem,
});

const adminLogAktivitasRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "log-aktivitas",
  component: LogAktivitas,
});

// 5. Petugas Layout & Routes
const petugasLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/petugas",
  component: PetugasLayout,
});

const petugasIndexRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "/",
  component: () => <Navigate to="/petugas/sirkulasi" replace />,
});

const petugasSirkulasiRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "sirkulasi",
  component: Sirkulasi,
});

const petugasSirkulasiDetailRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "sirkulasi/$id",
  component: SirkulasiDetail,
});

const petugasKatalogRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "katalog",
  component: KatalogAdmin,
});

const petugasDendaRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "denda",
  component: Denda,
});

const petugasProfilRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "profil",
  component: ProfilPetugas,
});

// 6. Mahasiswa Layout & Routes
const mahasiswaLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/mahasiswa",
  component: () => (
    <MaintenanceGuard>
      <MahasiswaLayout />
    </MaintenanceGuard>
  ),
});

const mahasiswaIndexRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "/",
  component: DashboardMahasiswa,
});

const mahasiswaKatalogRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "katalog",
  component: Katalog,
});

export interface PeminjamanSearch {
  selectedId?: string;
  filter?: "ALL" | "ACTIVE" | "UNPAID_FINE" | "COMPLETED";
}

export const mahasiswaPeminjamanRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "peminjaman",
  validateSearch: (search: Record<string, unknown>): PeminjamanSearch => ({
    selectedId: typeof search.selectedId === "string" ? search.selectedId : undefined,
    filter:
      search.filter === "ALL" ||
      search.filter === "ACTIVE" ||
      search.filter === "UNPAID_FINE" ||
      search.filter === "COMPLETED"
        ? search.filter
        : undefined,
  }),
  component: Peminjaman,
});

const mahasiswaRiwayatRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "riwayat",
  component: () => <Navigate to="/mahasiswa/peminjaman" replace />,
});

const mahasiswaProfilRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "profil",
  component: Profil,
});

// 7. Assemble Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  lupaSandiRoute,
  resetSandiRoute,
  maintenanceRoute,
  authenticatedRoute.addChildren([
    adminLayoutRoute.addChildren([
      adminIndexRoute,
      adminSirkulasiRoute,
      adminSirkulasiDetailRoute,
      adminKatalogRoute,
      adminDendaRoute,
      adminPenggunaRoute,
      adminPetugasRoute,
      adminProfilRoute,
      adminPengaturanRoute,
      adminLogAktivitasRoute,
    ]),
    petugasLayoutRoute.addChildren([
      petugasIndexRoute,
      petugasSirkulasiRoute,
      petugasSirkulasiDetailRoute,
      petugasKatalogRoute,
      petugasDendaRoute,
      petugasProfilRoute,
    ]),
    mahasiswaLayoutRoute.addChildren([
      mahasiswaIndexRoute,
      mahasiswaKatalogRoute,
      mahasiswaPeminjamanRoute,
      mahasiswaRiwayatRoute,
      mahasiswaProfilRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
