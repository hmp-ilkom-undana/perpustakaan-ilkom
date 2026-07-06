import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import CatalogPage from "./features/catalog/pages/CatalogPage";

import ArchiveDetail from "./features/catalog/pages/ArchiveDetail";
import GuidePage from "./features/guide/pages/GuidePage";
import Login from "./pages/Login";
import SetupPassword from "./pages/SetupPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/setup-password" element={<SetupPassword />} />

          <Route path="/" element={<PublicLayout />}>
            <Route path="" element={<Home />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/katalog/:id" element={<ArchiveDetail />} />
            <Route path="/panduan" element={<GuidePage />} />
            
            {/* Example of protected route */}
            <Route element={<ProtectedRoute allowedRoles={["MAHASISWA", "ADMIN"]} />}>
               {/* Add protected routes here */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
