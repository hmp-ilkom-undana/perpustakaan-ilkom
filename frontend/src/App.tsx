import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
