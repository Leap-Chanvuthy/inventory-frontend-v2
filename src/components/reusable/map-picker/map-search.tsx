import { useState } from "react";

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

  return (
    <div className="absolute z-[1000] top-3 right-3 w-[300px] bg-white rounded-lg shadow-lg overflow-hidden">
      <input
        value={query}
        onChange={e => search(e.target.value)}
        placeholder="ស្វែងរកទីតាំង (Search location)"
        className="w-full px-3 py-2 text-sm outline-none border-b"
      />

      {loading && (
        <div className="px-3 py-2 text-xs text-gray-400">កំពុងស្វែងរក...</div>
      )}

      {results.map(r => (
        <button
          key={`${r.lat}-${r.lon}`}
          onClick={() => {
            onSelect(Number(r.lat), Number(r.lon), r.display_name);
            setResults([]);
            setQuery(r.display_name);
          }}
          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
        >
          {r.display_name}
        </button>
      ))}
    </div>
  );
}
