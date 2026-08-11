import { RefObject } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArchiveType } from "@/types/katalog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importType: ArchiveType;
  setImportType: (type: ArchiveType) => void;
  isImporting: boolean;
  onImport: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export function KatalogImportSheet({ isOpen, onOpenChange, importType, setImportType, isImporting, onImport, fileInputRef }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto z-[60]">
        <SheetHeader className="mb-6">
          <SheetTitle>Import Data Excel</SheetTitle>
          <SheetDescription>
            Pilih jenis arsip dan unggah file .xlsx Anda. Sistem akan melewati data yang sudah ada (duplikat).
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Jenis Arsip dalam File</Label>
            <Select value={importType} onValueChange={(val) => setImportType(val as ArchiveType)}>
              <SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Skripsi">Skripsi</SelectItem>
                <SelectItem value="Ringkasan Skripsi">Ringkasan Skripsi</SelectItem>
                <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File Excel (.xlsx)</Label>
            <Input type="file" accept=".xlsx, .xls" ref={fileInputRef} />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isImporting}>
            Batal
          </Button>
          <Button onClick={onImport} disabled={isImporting} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            {isImporting ? "Memproses..." : "Mulai Import"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
