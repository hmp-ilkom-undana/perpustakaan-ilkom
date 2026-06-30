import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import CatalogPage from "./features/catalog/pages/CatalogPage";

import ArchiveDetail from "./features/catalog/pages/ArchiveDetail";
import GuidePage from "./features/guide/pages/GuidePage";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="" element={<Home />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/katalog/:id" element={<ArchiveDetail />} />
          <Route path="/panduan" element={<GuidePage />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
