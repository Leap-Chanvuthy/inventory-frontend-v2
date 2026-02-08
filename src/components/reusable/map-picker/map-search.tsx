import { useRef, useState } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface MapSearchProps {
  onSelect: (lat: number, lng: number, name: string) => void;
}

export function MapSearch({ onSelect }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = async (value: string) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          format: "json",
          q: value,
          countrycodes: "kh",
          limit: "10",
          addressdetails: "1",
          "accept-language": "km,en",
        })
    );

    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const handleSelect = (r: SearchResult) => {
    onSelect(Number(r.lat), Number(r.lon), r.display_name);
    setResults([]);
    setQuery(r.display_name);
    setExpanded(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setExpanded(false);
  };

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* Mobile: floating search button */}
      {!expanded && (
        <button
          onClick={handleExpand}
          className="absolute z-[1000] top-2 right-2 sm:hidden w-9 h-9 bg-white dark:bg-gray-900 rounded-full shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Mobile expanded / Desktop always visible */}
      <div
        className={`absolute z-[1000] top-2 left-2 right-2 transition-all duration-200 ${
          expanded ? "" : "hidden sm:block"
        } sm:top-3 sm:left-3 sm:right-3 md:top-4 md:left-[15%] md:right-[15%] lg:left-[20%] lg:right-[20%]`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => search(e.target.value)}
              placeholder="Search location..."
              className="w-full pl-8 pr-8 py-2 text-xs outline-none bg-transparent placeholder:text-gray-400"
            />
            {(query || expanded) && (
              <button
                onClick={handleClear}
                className="absolute right-2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 dark:border-gray-700/50">
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
              <span className="text-[11px] text-gray-400">Searching...</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-[180px] overflow-y-auto border-t border-gray-100 dark:border-gray-700/50">
              {results.map(r => (
                <button
                  key={`${r.lat}-${r.lon}`}
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-2.5 py-2 flex items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 border-b border-gray-50 dark:border-gray-800/40 last:border-b-0 transition-colors"
                >
                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-[11px] leading-tight text-gray-700 dark:text-gray-300 line-clamp-2">
                    {r.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
