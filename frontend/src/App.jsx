import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";

// Komponen Halaman
const Katalog = () => <h1>Katalog</h1>;
const Panduan = () => <h1>Panduan Peminjaman</h1>;
const Login = () => <h1>Login</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="" element={<Home />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
