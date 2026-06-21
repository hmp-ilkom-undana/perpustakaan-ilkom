import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEARCH_TYPES, STATUS_OPTIONS } from "../constants/catalogOptions.js";

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
          <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              id="catalog-search"
              value={filters.q}
              onChange={(event) => onChange("q", event.target.value)}
              placeholder="Cari judul, penulis, topik..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <SelectField
          label="Mode"
          value={filters.type}
          onChange={(value) => onChange("type", value)}
          options={SEARCH_TYPES}
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
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
