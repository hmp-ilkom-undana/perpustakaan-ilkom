import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import logoIlkom from "../assets/Logo_Ilkom.png";

export default function SetupPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { email, name } = location.state || {};

  if (!email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <ShieldCheck className="w-12 h-12 text-orange-500" />
        <p>Akses ditolak. Silakan mulai dari halaman login.</p>
        <Link to="/login" className="text-orange-500 hover:underline">Kembali ke Login</Link>
      </div>
    );
  }

  const handleSetup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Gagal mengatur kata sandi.");
        setIsLoading(false);
        return;
      }

      // Automatically redirect to login page for the user to log in with new password
      navigate("/login", { state: { message: "Kata sandi berhasil diatur. Silakan login." } });
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden relative justify-center items-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950 opacity-90 mix-blend-multiply" />
        <img
          src={logoIlkom}
          alt="Watermark"
          className="absolute inset-0 m-auto w-96 h-96 opacity-[0.03] blur-[1px] brightness-50 pointer-events-none object-contain"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6 py-12">
        <Link
          to="/login"
          className="absolute -top-12 left-6 text-slate-500 hover:text-slate-200 flex items-center gap-1.5 text-sm transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Atur Kata Sandi Baru</h2>
          <p className="text-slate-500 text-sm mt-2">
            Halo <span className="text-slate-300 font-medium">{name}</span>, akun Anda terdeteksi sebagai pengguna lama. Silakan atur kata sandi untuk sistem baru.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSetup} className="space-y-5 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl backdrop-blur-md">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-3 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kata Sandi Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="pl-10 pr-11 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500/80 rounded-lg transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Konfirmasi Kata Sandi
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi"
                className="pl-10 pr-11 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500/80 rounded-lg transition-colors"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
