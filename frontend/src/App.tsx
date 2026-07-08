import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rute Default sementara diarahkan ke tulisan ini */}
        <Route path="/" element={
          <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
            <h1 className="text-2xl font-bold">Halaman Utama (Nantinya Dashboard)</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;