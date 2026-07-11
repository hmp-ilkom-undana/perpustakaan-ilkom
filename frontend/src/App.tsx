import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import MahasiswaLayout from "./layouts/MahasiswaLayout";
import Katalog from "./pages/mahasiswa/Katalog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Petugas */}
        <Route
          path="/petugas"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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
            element={<div>Dashboard Ringkasan (Akan Segera Dibuat)</div>}
          />

          {/* Sub-halaman  */}
          <Route path="katalog" element={<Katalog />} />
          <Route path="peminjaman" element={<div>Peminjaman Saya</div>} />
          <Route path="riwayat" element={<div>Riwayat Peminjaman</div>} />
          <Route path="profil" element={<div>Profil & Pengaturan</div>} />
        </Route>

        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirect dari root (/) ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}

export default App;
