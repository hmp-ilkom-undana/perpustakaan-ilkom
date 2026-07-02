import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import gambar andalan kita
import bgHero from "@/assets/hero-bg.png";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden pb-32">
      
      {/* HERO SECTION DENGAN ANIMASI CONTAINER SCROLL */}
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-4">
              Langkah mudah menuju literasi. <br />
              <span className="text-5xl md:text-[6rem] font-bold mt-2 leading-none text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Sistem Peminjaman Mandiri
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mt-6">
              Gulir ke bawah untuk mempelajari cara menelusuri, memesan secara digital, dan mengambil skripsi fisik tanpa antrean.
            </p>
          </>
        }
      >
        {/* Gambar yang dirender di dalam layar komputer animasi 3D */}
        <img
          src={bgHero}
          alt="Dashboard Preview"
          className="mx-auto rounded-2xl object-cover h-full w-full object-center opacity-90 transition-transform duration-500 hover:scale-105"
          draggable={false}
        />
      </ContainerScroll>

      {/* BAGIAN KONTEN PANDUAN MURNI (Di Bawah Animasi) */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 w-full -mt-20 md:-mt-40 relative z-10">
        
        {/* Step 1 */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold shrink-0">
            1
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Penelusuran & Pengajuan Digital</h3>
            <p className="text-slate-600 leading-relaxed">
              Mulai dengan mencari judul skripsi yang Anda butuhkan melalui halaman <strong>Katalog Arsip</strong>. Jika status buku <em>Tersedia</em>, Anda bisa langsung menekan tombol "Ajukan Peminjaman". Sistem akan merekam pengajuan Anda tanpa memerlukan tanda tangan basah.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold shrink-0">
            2
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Verifikasi & Pengambilan Fisik</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Kunjungi ruang HMP untuk mengambil fisik skripsi. Admin hanya perlu memverifikasi kondisi buku (normal/rusak) dan memfoto sampul depan buku sebagai bukti serah terima. 
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800">Batas Kuota:</span> Maksimal meminjam <strong className="text-orange-600">3 Judul Skripsi</strong> sekaligus.
            </div>
          </div>
        </div>

        {/* Step 3 (Denda) */}
        <div className="bg-slate-900 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/20 mb-12 flex flex-col md:flex-row gap-8 items-start text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-orange-400 flex items-center justify-center text-3xl font-bold shrink-0 border border-white/10">
            3
          </div>
          <div className="w-full">
            <h3 className="text-2xl font-bold text-white mb-3">Aturan Durasi & Sistem Denda Otomatis</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Sistem akan mulai menghitung masa aktif peminjaman selama <strong>1 Bulan</strong> sejak buku diterima. Jika melewati batas waktu atau terjadi kerusakan, sistem denda otomatis akan diaktifkan.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <span className="block text-sm text-slate-400 mb-1">Denda Keterlambatan</span>
                <span className="text-xl font-bold text-orange-400">Rp50.000</span>
                <span className="block text-xs text-slate-500 mt-1">+ Rp10.000/minggu berikutnya</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <span className="block text-sm text-slate-400 mb-1">Denda Kerusakan</span>
                <span className="text-xl font-bold text-red-400">Rp75.000</span>
                <span className="block text-xs text-slate-500 mt-1">Denda Kehilangan: Rp100.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Akhir */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-12 h-14 text-lg font-bold shadow-xl hover:scale-105 transition-all">
            <Link to="/katalog">
              Mulai Pinjam Sekarang
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}