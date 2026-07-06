import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Globe,
  ArrowLeft,
  User,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  ShieldCheck,
} from "lucide-react";
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
import logoIlkom from "../assets/Logo_Ilkom.png";
import logoArthasena from "../assets/Arthasena.png";
import logoUndana from "../assets/Undana.png";

const FEATURE_POINTS = [
  {
    Icon: BookOpen,
    title: "Koleksi Lengkap",
    desc: "Akses arsip skripsi dan laporan penelitian ILKOM Undana.",
  },
  {
    Icon: Clock,
    title: "Peminjaman Mandiri",
    desc: "Ajukan dari mana saja, ambil fisik di perpustakaan.",
  },
  {
    Icon: ShieldCheck,
    title: "Tercatat & Terlacak",
    desc: "Riwayat, tenggat, dan status peminjaman otomatis tersinkron.",
  },
];

import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check setup first to handle legacy users
      const res = await fetch("http://localhost:5000/api/auth/check-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ loginId })
      });
      
      const data = await res.json();
      
      if (data.requiresSetup) {
        navigate("/setup-password", { state: { email: data.email, name: data.name } });
        return;
      }

      // If already set up, attempt standard login
      const { data: signInData, error: signInError } = await authClient.signIn.email({
        email: data.email,
        password
      });

      if (signInError) {
        setError(signInError.message || "Email atau kata sandi salah");
        setIsLoading(false);
        return;
      }

      // Successful login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { opacity: 0; animation: fadeUp 0.55s ease-out forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.12s; }
        .d3 { animation-delay: 0.20s; }
        .d4 { animation-delay: 0.28s; }
        .d5 { animation-delay: 0.36s; }
      `}</style>

      {/* ── KOLOM KIRI: BRANDING (hidden on mobile) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-1/2 flex-col relative bg-slate-950 border-r border-white/[0.06] overflow-hidden">

        {/* ── Background: subtle grid + glow ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px)," +
              "linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blob — orange, centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[380px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* ── Watermark ILKOM — very subtle, behind everything ── */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
          <img
            src={logoIlkom}
            alt=""
            className="w-[26rem] h-[26rem] object-contain opacity-[0.04] blur-[2px] grayscale"
          />
        </div>

        {/* ── HEADER (top anchor) ── */}
        <div className="relative z-10 flex items-center gap-3 px-10 pt-10">
          <img src={logoIlkom} alt="Logo ILKOM" className="h-9 w-9 object-contain" />
          <div>
            <p className="text-white text-sm font-bold leading-tight tracking-tight">ILKOM Undana</p>
            <p className="text-slate-500 text-[11px] leading-tight">Perpustakaan Digital</p>
          </div>
        </div>

        {/* ── MAIN CONTENT (flex-1, vertically centered) ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14 py-6">

          {/* Kicker */}
          <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-5">
            Portal Akademik · Ilmu Komputer
          </p>

          {/* Headline */}
          <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
            Satu Pintu untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">
              Seluruh Arsip
            </span>{" "}
            Akademik
          </h1>

          {/* Sub */}
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            Sistem peminjaman terpadu skripsi dan laporan penelitian Program
            Studi Ilmu Komputer, Universitas Nusa Cendana.
          </p>

          {/* Feature list */}
          <ul className="space-y-4 mb-10">
            {FEATURE_POINTS.map(({ Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                  <Icon className="h-4 w-4 text-orange-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-200 leading-snug">{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px w-full bg-white/[0.07] mb-8" />

          {/* Stats row */}
          <div className="flex items-center gap-8">
            {[
              { value: "500+", label: "Koleksi Skripsi" },
              { value: "2 Buku", label: "Maks. Peminjaman" },
              { value: "1 Bulan", label: "Durasi Pinjam" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-bold text-lg leading-tight">{value}</p>
                <p className="text-slate-500 text-[11px] leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER: Institutional logos ── */}
        <div className="relative z-10 px-10 pb-8 pt-5 border-t border-white/[0.06]">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-4">
            Didukung oleh
          </p>
          <div className="flex items-center gap-5">
            <img
              src={logoUndana}
              alt="Universitas Nusa Cendana"
              style={{ width: '80px', height: 'auto' }}
              className="object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <div className="h-6 w-px bg-white/15" />
            <img
              src={logoArthasena}
              alt="HMP Arthasena"
              style={{ width: '72px', height: 'auto' }}
              className="object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* ── KOLOM KANAN: AUTH FORM ───────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] xl:w-1/2 flex flex-col items-center justify-center relative bg-slate-950 lg:bg-[#080d14] px-6 sm:px-10 py-12">

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="anim d1 absolute top-7 left-6 sm:left-10 text-slate-500 hover:text-slate-200 flex items-center gap-1.5 text-sm transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Beranda
        </Link>

        {/* Soft glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-orange-500/8 blur-[100px] rounded-full pointer-events-none" />

        {/* ── Login Card ── */}
        <div className="anim d2 w-full max-w-[400px] relative z-10">

          {/* Mobile-only logo (shown only on small screens where left col is hidden) */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <img src={logoIlkom} alt="Logo ILKOM" className="h-8 w-8 object-contain" />
            <div>
              <p className="text-white text-sm font-bold">ILKOM Undana</p>
              <p className="text-slate-500 text-[11px]">Perpustakaan Digital</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Masuk ke Akun</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Masukkan kredensial mahasiswa Anda untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Email/NIM */}
            <div className="space-y-1.5">
              <Label
                htmlFor="loginId"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Email atau NIM
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <Input
                  id="loginId"
                  type="text"
                  autoComplete="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="2006080001 atau email@student.undana.ac.id"
                  className="pl-10 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500/80 rounded-lg transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Kata Sandi
                </Label>
                <Link
                  to="#"
                  className="text-xs text-orange-500 hover:text-orange-400 transition-colors font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-11 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500/80 rounded-lg transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Masuk ke Sistem"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Divider & SSO Buttons (Disembunyikan sementara)
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#080d14] lg:bg-[#080d14] bg-slate-950 px-3 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                atau lanjutkan dengan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 text-sm font-medium hover:bg-white/[0.07] hover:text-slate-200 hover:border-white/20 transition-all"
            >
              <Globe className="w-4 h-4" />
              SSO Undana
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 text-sm font-medium hover:bg-white/[0.07] hover:text-slate-200 hover:border-white/20 transition-all"
            >
              <Mail className="w-4 h-4" />
              Google
            </button>
          </div>
          */}

          {/* Footer link */}
          <p className="text-center text-xs text-slate-600 mt-8">
            Belum memiliki akun?{" "}
            <Link
              to="#"
              className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
            >
              Hubungi Admin HMP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
