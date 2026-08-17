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

// Petugas Imports
import PetugasLayout from "./layouts/PetugasLayout";
import DashboardPetugas from "./pages/petugas/DashboardPetugas";
import Sirkulasi from "./pages/petugas/Sirkulasi";
import SirkulasiDetail from "./pages/petugas/SirkulasiDetail";
import KatalogAdmin from "./pages/petugas/KatalogAdmin";
import Denda from "./pages/petugas/Denda";

// Mahasiswa Imports
import MahasiswaLayout from "./layouts/MahasiswaLayout";
import DashboardMahasiswa from "./pages/mahasiswa/DashboardMahasiswa";
import Katalog from "./pages/mahasiswa/Katalog";
import Peminjaman from "./pages/mahasiswa/Peminjaman";
import Riwayat from "./pages/mahasiswa/Riwayat";

// Auth & Public Imports
import Login from "./pages/Login";
import LupaSandi from "./pages/LupaSandi";

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

// 5. Petugas Layout & Routes
const petugasLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/petugas",
  component: PetugasLayout,
});

const petugasIndexRoute = createRoute({
  getParentRoute: () => petugasLayoutRoute,
  path: "/",
  component: DashboardPetugas,
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

// 6. Mahasiswa Layout & Routes
const mahasiswaLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/mahasiswa",
  component: MahasiswaLayout,
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

const mahasiswaPeminjamanRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "peminjaman",
  component: Peminjaman,
});

const mahasiswaRiwayatRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "riwayat",
  component: Riwayat,
});

const mahasiswaProfilRoute = createRoute({
  getParentRoute: () => mahasiswaLayoutRoute,
  path: "profil",
  component: () => <div>Profil & Pengaturan</div>,
});

// 7. Assemble Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  lupaSandiRoute,
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
    ]),
    petugasLayoutRoute.addChildren([
      petugasIndexRoute,
      petugasSirkulasiRoute,
      petugasSirkulasiDetailRoute,
      petugasKatalogRoute,
      petugasDendaRoute,
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
