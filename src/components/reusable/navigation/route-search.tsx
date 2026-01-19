import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

import { SIDEBAR_CONFIG } from "@/consts/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { getAvailableRoutesByRole } from "./route-search.utils";

const RouteSearch = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const routes = useMemo(
    () => getAvailableRoutesByRole(SIDEBAR_CONFIG, role),
    [role]
  );

  // Keyboard shortcut: press "P" to open route search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "p" || e.metaKey || e.ctrlKey || e.altKey) return;

      // don't hijack typing in inputs/textareas/selects/contenteditable
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();
      const isTypingContext =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        el?.isContentEditable;

      if (isTypingContext) return;

      e.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus the input when dialog opens
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Search pages (Shortcut: P)"
          title="Search pages (P)"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search page</span>

          <KbdGroup className="ml-1 hidden md:inline-flex rounded border border-border bg-muted text-[10px] font-medium text-muted-foreground">
            <Kbd>P</Kbd>
          </KbdGroup>
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-lg">
        <Command>
          <CommandInput ref={inputRef} placeholder="Search routes..." />
          <CommandList>
            <CommandEmpty>No page found.</CommandEmpty>

            <CommandGroup heading="Navigation">
              {routes.map((route) => (
                <CommandItem
                  key={route.url}
                  value={route.title}
                  onSelect={() => {
                    navigate(route.url);
                    setOpen(false);
                  }}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default RouteSearch;
