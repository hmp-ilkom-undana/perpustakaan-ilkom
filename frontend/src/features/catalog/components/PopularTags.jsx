import { Hash } from "lucide-react";

export default function PopularTags({ tags, activeTag, onSelect }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Tag populer">
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700">
        <Hash className="h-4 w-4 text-orange-500" aria-hidden="true" />
        Populer
      </span>
      {tags.map((tag) => {
        const isActive = activeTag === tag;

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
              isActive
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"
            }`}
            aria-pressed={isActive}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
