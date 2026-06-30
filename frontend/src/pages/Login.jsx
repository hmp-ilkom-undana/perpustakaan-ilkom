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
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cahaya dibelakang card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <Card className="">
        <CardHeader>
          <CardTitle>Selamat Datang</CardTitle>
          <CardDescription>
            Masuk ke portal akademik perpustakaan digital ILKOM
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
