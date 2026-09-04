import { X, Wrench, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PetugasGuideStep, PetugasConfigValues } from "@/hooks/usePetugasGuide";
import { PetugasGuideStepContent } from "./PetugasGuideStepContent";

interface PetugasGuideModalProps {
  isOpen: boolean;
  isLoading: boolean;
  config: PetugasConfigValues;
  steps: PetugasGuideStep[];
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PetugasGuideModal({
  isOpen,
  isLoading,
  config,
  steps,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onClose,
  onNext,
  onPrev,
}: PetugasGuideModalProps) {
  if (!isOpen) return null;

  const activeStep = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Panduan Sirkulasi Petugas"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white border-2 border-blue-900 rounded-2xl shadow-[6px_6px_0px_#1E3A8A] animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-blue-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-blue-900" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Panduan Operasional
              </p>
              <h2 className="text-sm font-black text-blue-950 leading-tight">
                Circulation Workflow Guide
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-blue-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] hover:bg-rose-50 hover:border-rose-500 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            aria-label="Tutup panduan"
          >
            <X className="w-4 h-4 text-blue-900" />
          </button>
        </div>

        {/* Step Dot Indicator */}
        <div className="flex items-center justify-center gap-2 pt-4 px-5 shrink-0">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full border border-blue-900 transition-all duration-300",
                i === currentStep
                  ? "w-6 bg-amber-400"
                  : i < currentStep
                    ? "w-2 bg-blue-900"
                    : "w-2 bg-slate-200",
              )}
            />
          ))}
        </div>

        {/* Step Counter */}
        <p className="text-center text-[10px] font-bold text-slate-400 mt-1 shrink-0">
          Langkah {currentStep + 1} dari {totalSteps}
        </p>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
              <p className="text-sm font-bold text-slate-500">Memuat konfigurasi...</p>
            </div>
          ) : activeStep ? (
            <PetugasGuideStepContent step={activeStep} config={config} />
          ) : null}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-5 border-t-2 border-blue-900 shrink-0 gap-3">
          {!isFirstStep ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-bold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali
            </Button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
            >
              Lewati Panduan
            </button>
          )}

          <Button
            variant="navy"
            size="sm"
            onClick={onNext}
            className="ml-auto border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-black"
          >
            {isLastStep ? "Siap Bertugas!" : "Lanjut"}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
