import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2 } from "lucide-react";

interface MaintenanceCountdownProps {
  targetEndTime: string | null | undefined;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const MaintenanceCountdown: React.FC<MaintenanceCountdownProps> = ({
  targetEndTime,
}) => {
  const calculateTimeRemaining = (): TimeRemaining => {
    if (!targetEndTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const diff = new Date(targetEndTime).getTime() - new Date().getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetEndTime]);

  if (!targetEndTime || timeLeft.isExpired) {
    return (
      <div className="bg-amber-50 border-2 border-blue-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_#1E3A8A] sm:shadow-[4px_4px_0px_#1E3A8A] flex flex-row items-center justify-between gap-2.5 sm:gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 border-2 border-blue-900 rounded-lg flex items-center justify-center text-blue-950 font-black shrink-0 shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[10px] sm:text-xs font-black text-blue-950 uppercase tracking-wide truncate">
              Estimasi Penyelesaian
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
              Tahap Akhir & Pengujian Sistem
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-100 border-2 border-blue-900 rounded text-[10px] sm:text-[11px] font-black text-emerald-900 shadow-[1px_1px_0px_#1E3A8A] shrink-0">
          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
          Segera Selesai
        </span>
      </div>
    );
  }

  const timeUnits = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-1.5 sm:space-y-2 max-w-lg mx-auto">
      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black text-blue-950 uppercase tracking-wider">
        <Clock
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 animate-spin"
          style={{ animationDuration: "8s" }}
        />
        <span>Perkiraan Waktu Selesai</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="bg-white border-2 border-blue-900 rounded-lg p-2 sm:p-3 text-center shadow-[2px_2px_0px_#1E3A8A] sm:shadow-[4px_4px_0px_#1E3A8A] flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xl sm:text-3xl font-black text-blue-950 tabular-nums leading-none">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-wider mt-1 sm:mt-1.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
