import * as React from "react";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Lang = "en" | "km";

type LanguageToggleProps = {
  /** Optional controlled value */
  value?: Lang;
  /** Optional controlled handler */
  onChange?: (lang: Lang) => void;
  /** LocalStorage key */
  storageKey?: string;
  /** Optional className */
  className?: string;
};

const DEFAULT_STORAGE_KEY = "app_lang";

export default function LanguageToggle({
  value,
  onChange,
  storageKey = DEFAULT_STORAGE_KEY,
  className,
}: LanguageToggleProps) {
  const isControlled = value !== undefined;

  const [internal, setInternal] = React.useState<Lang>("en");

  // init from localStorage (uncontrolled)
  React.useEffect(() => {
    if (isControlled) return;

    const stored = (localStorage.getItem(storageKey) as Lang | null) ?? "en";
    setInternal(stored === "km" ? "km" : "en");
  }, [isControlled, storageKey]);

  const lang = isControlled ? value : internal;

  // reflect to <html lang="...">
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Lang) => {
    if (!isControlled) setInternal(next);
    localStorage.setItem(storageKey, next);
    onChange?.(next);

    // Optional: notify app listeners (if you want to react elsewhere without prop drilling)
    window.dispatchEvent(new CustomEvent("app:language-changed", { detail: next }));
  };

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger className={cn("w-[130px] h-9", className)} aria-label="Language">
        <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="km">ខ្មែរ</SelectItem>
      </SelectContent>
    </Select>
  );
}