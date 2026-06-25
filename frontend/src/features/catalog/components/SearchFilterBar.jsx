import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARCHIVE_TYPES, STATUS_OPTIONS } from "../constants/catalogOptions.js";

export default function SearchFilterBar({
  filters,
  categoryOptions,
  yearOptions,
  onChange,
  onReset,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.7fr_auto]">
        <div>
          <label
            htmlFor="catalog-search"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Kata kunci
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              id="catalog-search"
              value={filters.q}
              onChange={(event) => onChange("q", event.target.value)}
              placeholder="Cari judul, penulis, topik..."
              className="h-11 rounded-xl bg-slate-50 pl-9 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-400"
            />
          </div>
        </div>

        <SelectField
          label="Jenis Arsip"
          value={filters.archiveType}
          onChange={(value) => onChange("archiveType", value)}
          options={ARCHIVE_TYPES}
        />
        <SelectField
          label="Kategori"
          value={filters.category}
          onChange={(value) => onChange("category", value)}
          options={categoryOptions}
        />
        <SelectField
          label="Tahun"
          value={filters.year}
          onChange={(value) => onChange("year", value)}
          options={yearOptions}
        />
        <SelectField
          label="Status"
          value={filters.status}
          onChange={(value) => onChange("status", value)}
          options={STATUS_OPTIONS}
        />

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="h-11 w-full gap-2 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 lg:w-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}

function SelectField({ label, value, options, onChange }) {
  const id = `catalog-${label.toLowerCase()}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          id={id}
          className="h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:ring-orange-500/20 focus:border-orange-400"
        >
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
