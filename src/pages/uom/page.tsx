import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CategorySidebar } from "./_components/category-sidebar";
import { UomHierarchyPanel } from "./_components/uom-hierarchy-panel";
import { useUomCategories } from "@/api/uom/uom.query";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const breadcrumbItems = [
  { name: "catalog", label: "Catalog", link: "/categories" },
  { name: "uom", label: "UOM", link: "/unit-of-measurement" },
  { name: "list", label: "List of Unit of Measurement" },
];

export default function UOM() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist selected category in URL so it survives page refresh
  const selectedCategoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : null;

  function setSelectedCategoryId(id: number | null) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id == null) next.delete("category_id");
        else next.set("category_id", String(id));
        return next;
      },
      { replace: true }
    );
  }

  const { data: categoriesData } = useUomCategories();
  const categories: any[] = (categoriesData as any)?.data ?? categoriesData ?? [];
  const selectedCategory = categories.find((c: any) => c.id === selectedCategoryId);

  // On mobile, close the drawer after a category is selected
  function handleCategorySelect(id: number) {
    setSelectedCategoryId(id);
    setSidebarOpen(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] min-h-0">
      {/* Top bar: breadcrumb + mobile sidebar toggle */}
      <div className="px-4 md:px-6 py-3 border-b shrink-0 flex items-center gap-2">
        {/* Hamburger — visible only below md */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 shrink-0"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open categories"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Split panel body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Desktop sidebar (md+) ── */}
        <div className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r overflow-y-auto flex-col">
          <CategorySidebar
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>

        {/* ── Main content — full width on mobile, fluid on desktop ── */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {selectedCategoryId == null ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 md:px-8">
              <div className="rounded-full bg-muted p-5">
                <svg
                  className="h-10 w-10 text-muted-foreground/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h3.75M3.75 3h16.5A.75.75 0 0 1 21 3.75v16.5a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 20.25V3.75A.75.75 0 0 1 3.75 3Z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">No category selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="md:hidden">
                    Tap the <strong>≡</strong> menu to choose a category.
                  </span>
                  <span className="hidden md:inline">
                    Select a category from the left panel to view and manage its units.
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <UomHierarchyPanel
              categoryId={selectedCategoryId}
              categoryName={selectedCategory?.name ?? "Category"}
            />
          )}
        </div>
      </div>

      {/* ── Mobile sidebar drawer (below md) ── */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-[85vw]">
          <CategorySidebar
            selectedId={selectedCategoryId}
            onSelect={handleCategorySelect}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
