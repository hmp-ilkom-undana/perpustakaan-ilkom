import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  Globe,
  Mail,
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  // State untuk form input nantinya
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Nanti disambungkan dengan endpoint backend /login
    console.log("Login attempt with:", email, password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Cahaya di belakang card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Kartu Login Glassmorphism */}
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative z-10 rounded-2xl overflow-hidden">
        
        {/* Garis Aksen Emas di Atas Kartu */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-75"></div>

        <CardHeader className="space-y-3 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 mb-2">
            <Lock className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white font-poppins">
            Selamat Datang
          </CardTitle>
          <CardDescription className="text-slate-400 font-inter text-sm">
            Masuk ke portal akademik perpustakaan digital ILKOM
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email/NIM */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Email atau NIM
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Masukkan NIM atau email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-xl focus-visible:ring-orange-500/50 focus-visible:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Kata Sandi
                </Label>
                <Link to="#" className="text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-xl focus-visible:ring-orange-500/50 focus-visible:border-orange-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Login Utama */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-bold shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] mt-4 flex items-center justify-center gap-2 group"
            >
              Masuk ke Sistem <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Pemisah (Divider) */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-4 text-slate-500 font-medium tracking-wider">
                Akses Alternatif
              </span>
            </div>
          </div>

          {/* Tombol Alternatif (SSO Undana) */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 transition-colors">
              <Globe className="mr-2 h-4 w-4" /> SSO Undana
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 transition-colors">
              <Mail className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-8 border-t border-white/5 pt-6 mt-4 bg-white/[0.02]">
          <p className="text-sm text-slate-400 font-inter">
            Belum memiliki akun?{" "}
            <Link to="#" className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Hubungi Admin HMP
            </Link>
          </p>
        </CardFooter>
      </Card>

    </div>
  );
}