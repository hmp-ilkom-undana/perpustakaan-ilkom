import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { ArchiveType } from "@/types/katalog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importType: ArchiveType;
  setImportType: (type: ArchiveType) => void;
  isImporting: boolean;
  onImport: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function KatalogImportSheet({
  isOpen,
  onOpenChange,
  importType,
  setImportType,
  isImporting,
  onImport,
  fileInputRef,
}: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto z-[60] bg-white border-l-4 border-blue-900 [box-shadow:-6px_0px_0px_#1E3A8A] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <SheetHeader className="p-0 border-b-2 border-blue-900 pb-4 text-left">
            <SheetTitle className="text-2xl font-black text-blue-950">
              Import Data Excel
            </SheetTitle>
            <SheetDescription className="text-xs font-semibold text-slate-600 mt-1">
              Pilih jenis arsip dan unggah file .xlsx Anda. Sistem akan secara otomatis mendeteksi dan mengabaikan baris duplikat.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider text-blue-950">
                Jenis Arsip dalam File
              </Label>
              <Select
                value={importType}
                onValueChange={(val) => val && setImportType(val as ArchiveType)}
              >
                <SelectTrigger className="w-full border-2 border-blue-900 bg-white font-bold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] rounded-none h-10">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent className="border-2 border-blue-900 bg-white [box-shadow:4px_4px_0px_#1E3A8A] rounded-none">
                  <SelectItem value="Skripsi">Skripsi</SelectItem>
                  <SelectItem value="Ringkasan Skripsi">
                    Ringkasan Skripsi
                  </SelectItem>
                  <SelectItem value="Naskah Publikasi">
                    Naskah Publikasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider text-blue-950">
                File Spreadsheet (.xlsx / .xls)
              </Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef}
                disabled={isImporting}
                className="border-2 border-blue-900 bg-white font-semibold text-blue-950 [box-shadow:2px_2px_0px_#1E3A8A] focus-visible:ring-0 rounded-none file:mr-3 file:py-1 file:px-3 file:border-2 file:border-blue-900 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-950 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="p-0 pt-6 mt-6 border-t-2 border-blue-900 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
            className="w-full sm:w-1/2 border-2 border-blue-900 font-bold text-blue-900 bg-slate-100 hover:bg-slate-200 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-none transition-all cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onImport}
            disabled={isImporting}
            className="w-full sm:w-1/2 bg-emerald-500 hover:bg-emerald-600 text-blue-950 font-black border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-none transition-all cursor-pointer"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <FileUp className="w-4 h-4 mr-2" />
                Mulai Import
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
