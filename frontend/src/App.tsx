import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ManajemenPengguna from "./pages/admin/ManajemenPengguna";

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
import Beranda from "./pages/Beranda"; // if still used, but probably we can remove if replaced by roles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="sirkulasi" element={<Sirkulasi />} />
          <Route path="sirkulasi/:id" element={<SirkulasiDetail />} />
          <Route path="katalog" element={<KatalogAdmin />} />
          <Route path="denda" element={<Denda />} />
          <Route path="pengguna" element={<ManajemenPengguna />} />
        </Route>

        {/* Petugas */}
        <Route
          path="/petugas"
          element={
            <ProtectedRoute>
              <PetugasLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPetugas />} />
          <Route path="sirkulasi" element={<Sirkulasi />} />
          <Route path="sirkulasi/:id" element={<SirkulasiDetail />} />
          <Route path="katalog" element={<KatalogAdmin />} />
          <Route path="denda" element={<Denda />} />
        </Route>

        {/* Mahasiswa */}
        <Route
          path="/mahasiswa"
          element={
            <ProtectedRoute>
              <MahasiswaLayout />
            </ProtectedRoute>
          }
        >
          {/* Halaman utama /mahasiswa */}
          <Route
            index
            element={<DashboardMahasiswa />}
          />

          {/* Sub-halaman  */}
          <Route path="katalog" element={<Katalog />} />
          <Route path="peminjaman" element={<Peminjaman />} />
          <Route path="riwayat" element={<Riwayat />} />
          <Route path="profil" element={<div>Profil & Pengaturan</div>} />
        </Route>

        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirect dari root (/) ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
