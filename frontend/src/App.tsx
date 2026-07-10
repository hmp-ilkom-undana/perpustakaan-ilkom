import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center bg-white text-3xl font-bold">
                Selamat Datang di Halaman Utama (Katalog)
              </div>
            </ProtectedRoute>
          }
        />
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
