import * as React from "react";
import { format, parse, isValid, addHours, addDays, setHours, setMinutes } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string; // Format: "YYYY-MM-DDTHH:mm" or ISO string
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal dan waktu...",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse initial date from value
  const parsedInitialDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    parsedInitialDate || new Date()
  );
  const [selectedHour, setSelectedHour] = React.useState<string>(
    parsedInitialDate ? String(parsedInitialDate.getHours()).padStart(2, "0") : "12"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    parsedInitialDate ? String(parsedInitialDate.getMinutes()).padStart(2, "0") : "00"
  );

  // Sync state when value changes or dialog opens
  React.useEffect(() => {
    if (open) {
      const d = value ? new Date(value) : new Date();
      if (isValid(d)) {
        setSelectedDate(d);
        setSelectedHour(String(d.getHours()).padStart(2, "0"));
        setSelectedMinute(String(d.getMinutes()).padStart(2, "0"));
      } else {
        setSelectedDate(new Date());
        setSelectedHour("12");
        setSelectedMinute("00");
      }
    }
  }, [open, value]);

  const handleApply = () => {
    if (!selectedDate) {
      onChange("");
      setOpen(false);
      return;
    }

    const hourNum = parseInt(selectedHour, 10) || 0;
    const minNum = parseInt(selectedMinute, 10) || 0;

    const finalDate = setMinutes(setHours(selectedDate, hourNum), minNum);
    const formatted = format(finalDate, "yyyy-MM-dd'T'HH:mm");
    onChange(formatted);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const applyPreset = (presetDate: Date) => {
    setSelectedDate(presetDate);
    setSelectedHour(String(presetDate.getHours()).padStart(2, "0"));
    setSelectedMinute(String(presetDate.getMinutes()).padStart(2, "0"));
  };

  // Human readable trigger text
  const displayText = React.useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    if (!isValid(d)) return null;
    return format(d, "EEEE, dd MMMM yyyy - HH:mm 'WIB'", { locale: id });
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("relative flex items-center", className)}>
        <DialogTrigger
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] text-left transition-all cursor-pointer font-bold text-xs",
            "hover:bg-slate-50 hover:shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-slate-500 font-semibold"
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded bg-orange-100 border border-blue-900 flex items-center justify-center text-orange-600 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
            <span className={cn("truncate", value ? "text-blue-950 font-bold" : "text-slate-400 font-medium")}>
              {displayText || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                title="Hapus Tanggal"
                className="w-5 h-5 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-md p-5 bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-xl">
        <DialogHeader className="pb-3 border-b-2 border-blue-900">
          <DialogTitle className="text-base font-black text-blue-950 flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-amber-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1px_1px_0px_#1E3A8A]">
              <CalendarIcon className="w-4 h-4" />
            </div>
            Pilih Target Waktu Selesai
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* 1. Quick Presets Bar */}
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Pilihan Cepat (Quick Presets)
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(addHours(new Date(), 1))}
                className="h-7 text-[11px] font-black border-2 border-blue-900 bg-slate-50 hover:bg-amber-100 text-blue-950 shadow-[1px_1px_0px_#1E3A8A]"
              >
                +1 Jam
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(addHours(new Date(), 3))}
                className="h-7 text-[11px] font-black border-2 border-blue-900 bg-slate-50 hover:bg-amber-100 text-blue-950 shadow-[1px_1px_0px_#1E3A8A]"
              >
                +3 Jam
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(addHours(new Date(), 6))}
                className="h-7 text-[11px] font-black border-2 border-blue-900 bg-slate-50 hover:bg-amber-100 text-blue-950 shadow-[1px_1px_0px_#1E3A8A]"
              >
                +6 Jam
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  applyPreset(setMinutes(setHours(addDays(new Date(), 1), 8), 0))
                }
                className="h-7 text-[11px] font-black border-2 border-blue-900 bg-slate-50 hover:bg-amber-100 text-blue-950 shadow-[1px_1px_0px_#1E3A8A]"
              >
                Besok (08:00)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  applyPreset(setMinutes(setHours(addDays(new Date(), 1), 17), 0))
                }
                className="h-7 text-[11px] font-black border-2 border-blue-900 bg-slate-50 hover:bg-amber-100 text-blue-950 shadow-[1px_1px_0px_#1E3A8A]"
              >
                Besok (17:00)
              </Button>
            </div>
          </div>

          {/* 2. Calendar Component */}
          <div className="bg-slate-50 p-2.5 rounded-lg border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              locale={id}
              className="p-0"
            />
          </div>

          {/* 3. Time Picker Selector */}
          <div className="bg-amber-50 p-3 rounded-lg border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-400 border border-blue-900 flex items-center justify-center text-blue-950 shadow-[1px_1px_0px_#1E3A8A]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-blue-950 uppercase tracking-tight leading-none">
                  Jam & Menit (WIB)
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  Format 24 Jam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Hour selector */}
              <div className="flex flex-col items-center">
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="bg-white border-2 border-blue-900 rounded px-2 py-1 font-black text-sm text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(
                    (hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    )
                  )}
                </select>
                <span className="text-[9px] font-black text-slate-500 uppercase mt-0.5">
                  Jam
                </span>
              </div>

              <span className="font-black text-lg text-blue-950 pb-3">:</span>

              {/* Minute selector */}
              <div className="flex flex-col items-center">
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="bg-white border-2 border-blue-900 rounded px-2 py-1 font-black text-sm text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map(
                    (min) => (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    )
                  )}
                </select>
                <span className="text-[9px] font-black text-slate-500 uppercase mt-0.5">
                  Menit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-blue-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="border-2 border-blue-900 text-slate-600 hover:text-rose-600 font-bold text-xs h-9 shadow-[2px_2px_0px_#1E3A8A]"
          >
            Kosongkan (Reset)
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-blue-900 font-black text-xs h-9 px-5 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Terapkan Waktu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
