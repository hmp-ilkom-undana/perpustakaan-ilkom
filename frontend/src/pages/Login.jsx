import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Globe, ArrowLeft, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import Aset Visual
import bgHero from "../assets/hero-bg.png";
import logoIlkom from "../assets/Logo_Ilkom.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden">
      
      {/* ========================================================
          KOLOM KIRI: VISUAL & BRANDING
          (Disembunyikan di HP, Muncul separuh layar di Laptop 'lg')
          ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5">
        
        {/* Latar Belakang Gambar Isometrik dengan Efek Gelap (Overlay) */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHero}
            alt="Library Background"
            className="w-full h-full object-cover opacity-20"
          />
          {/* Gradien dari bawah ke atas agar teks bawah terbaca jelas */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          {/* Gradien dari kanan ke kiri untuk memperhalus batas pembelahan layar */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        </div>

        {/* Konten Kiri Atas: Logo & Nama Sistem */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logoIlkom} alt="Logo ILKOM" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-white tracking-wide">
            Perpustakaan ILKOM
          </span>
        </div>

        {/* Konten Kiri Bawah: Copywriting & Aturan PRD */}
        <div className="relative z-10 space-y-6 max-w-lg mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight">
            Akses literatur akademik dalam genggaman.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Sistem <i>Hybrid Physical Borrowing</i> memberikan Anda kebebasan untuk menelusuri,
            mengajukan, dan melacak status skripsi secara mandiri tanpa birokrasi yang rumit.
          </p>
          
          {/* Kotak Info Aturan (Sesuai PRD) */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              "Mahasiswa diizinkan meminjam maksimal 2 skripsi selama 1 bulan. Konfirmasi instan tanpa memerlukan persetujuan Admin/Kabid."
            </p>
          </div>
        </div>
      </div>


      {/* ========================================================
          KOLOM KANAN: FORM OTENTIKASI (Penuh di HP, Separuh di Laptop)
          ======================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-6 sm:p-12">
        
        {/* Tombol Kembali */}
        <Link 
          to="/" 
          className="absolute top-8 left-6 sm:left-12 lg:left-auto lg:right-12 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Beranda</span>
        </Link>

        {/* Pendaran Cahaya (Glow) di belakang form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Kartu Login Glassmorphism */}
        <Card className="w-full max-w-md relative z-10 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-slate-100 rounded-[2rem]">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-orange-500">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Masuk ke portal akademik perpustakaan digital ILKOM.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              
              {/* Input Email/NIM */}
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-slate-300 font-medium ml-1 text-xs uppercase tracking-wider">Email atau NIM</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan NIM atau email..."
                    className="pl-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-300 font-medium text-xs uppercase tracking-wider">Kata Sandi</Label>
                  <Link to="#" className="text-xs text-orange-400 hover:text-orange-500 transition-colors">
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi..."
                    className="pl-11 pr-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-12 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit Utama */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:scale-[1.02] mt-4"
              >
                Masuk ke Sistem <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Garis Pemisah (Divider) */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#0f172a] px-3 text-slate-500 rounded-full">
                  Akses Alternatif
                </span>
              </div>
            </div>

            {/* Tombol Alternatif (SSO) */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 bg-slate-900/40 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl">
                <Globe className="w-4 h-4 mr-2" />
                SSO Undana
              </Button>
              <Button variant="outline" className="h-11 bg-slate-900/40 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl">
                <Mail className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-8 pt-2">
            <p className="text-sm text-slate-400">
              Belum memiliki akun?{" "}
              <Link to="#" className="text-orange-400 hover:text-orange-500 font-semibold transition-colors">
                Hubungi Admin HMP
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}