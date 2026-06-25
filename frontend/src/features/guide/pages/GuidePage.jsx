import React from "react";
import { 
  Search, 
  MapPin, 
  Hand, 
  CheckCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { 
  BORROWING_STEPS, 
  BORROWING_RULES, 
  LATE_POLICIES, 
  FAQ_ITEMS 
} from "../data/guideData";

export default function GuidePage() {
  const icons = [Search, MapPin, Hand, CheckCircle];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* SECTION 1 — HERO */}
      <section className="bg-slate-900 pt-20 pb-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-orange-500/5 blur-[120px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[80%] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-semibold mb-6">
              Informasi Layanan
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Panduan Layanan <span className="text-orange-500">Perpustakaan</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Panduan ini menjelaskan alur peminjaman arsip akademik berupa skripsi, naskah publikasi, dan ringkasan skripsi melalui sistem Perpustakaan ILKOM UNDANA.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ALUR PEMINJAMAN */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Alur Peminjaman</h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BORROWING_STEPS.map((step, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all group"
                >
                  <div className="h-14 w-14 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-black text-slate-100 group-hover:text-orange-100 transition-colors">0{index + 1}</span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — ATURAN & DURASI */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Header Column */}
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Aturan & Durasi</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Ketentuan dasar peminjaman arsip akademik yang berlaku untuk pengguna layanan Perpustakaan ILKOM UNDANA.
              </p>
              
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-900 leading-relaxed font-medium">
                  Pastikan data peminjaman sudah sesuai sebelum mengambil arsip fisik di perpustakaan.
                </p>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {BORROWING_RULES.map((rule, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {rule.label}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-3">
                      {rule.value}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — RINCIAN KETERLAMBATAN */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Kebijakan Sanksi</h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full mb-6" />
            <p className="text-slate-600">
              Kebijakan sanksi dapat disesuaikan berdasarkan ketentuan Perpustakaan ILKOM UNDANA.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-1/3">Kategori</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-1/3">Sanksi</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-1/3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LATE_POLICIES.map((policy, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 text-slate-900 font-medium align-top">{policy.category}</td>
                    <td className="py-5 px-6 text-orange-700 font-medium align-top">{policy.penalty}</td>
                    <td className="py-5 px-6 text-slate-600 text-sm leading-relaxed align-top">{policy.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {LATE_POLICIES.map((policy, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">{policy.category}</h4>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
                  <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block mb-1">Sanksi</span>
                  <span className="text-sm font-medium text-orange-900">{policy.penalty}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Tanya Jawab (FAQ)</h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <details 
                key={index} 
                className="group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-6 font-semibold text-slate-900 cursor-pointer select-none">
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-orange-500" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
