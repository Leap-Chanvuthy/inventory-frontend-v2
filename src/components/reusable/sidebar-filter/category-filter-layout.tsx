import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListFilter } from "lucide-react";

interface CategoryFilterLayoutProps {
  categoryKey: string;
  categoryLabel?: string;
  sidebar: ReactNode;
  children: ReactNode;
}

export function CategoryFilterLayout({
  categoryKey,
  categoryLabel = "Categories",
  sidebar,
  children,
}: CategoryFilterLayoutProps) {
  return (
    <div className="mt-4 flex flex-col lg:flex-row gap-6 items-start">
      <div className="w-full lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <ListFilter className="h-4 w-4 mr-2" />
              Filter {categoryLabel}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[92vw] sm:max-w-sm p-0">
            <SheetHeader className="px-4 pt-4 pb-2 border-b">
              <SheetTitle>{categoryLabel}</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-80px)] overflow-hidden">{sidebar}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div
        className="hidden lg:block w-full lg:min-w-[220px] lg:max-w-[240px] xl:min-w-[240px] xl:max-w-[260px] shrink-0"
        data-category-key={categoryKey}
      >
        {sidebar}
      </div>

      <div className="flex-1 min-w-0 rounded-xl border bg-card p-4 sm:p-6 w-full">
        {children}
      </div>
    </div>
  );
}
