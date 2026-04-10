import { useState } from "react";
import { Product } from "@/api/product/product.type";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { formatDate } from "@/utils/date-format";
import { useRecoverProduct } from "@/api/product/product.mutation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";

const CategoryBadge = ({ product }: { product: Product }) => (
  <Badge
    className="min-w-[160px] max-w-[160px] h-6 inline-flex items-center justify-center truncate"
    style={
      product.category?.label_color
        ? { backgroundColor: product.category.label_color, color: "#fff" }
        : undefined
    }
    title={product.product_category_name}
  >
    <span className="truncate">{product.product_category_name}</span>
  </Badge>
);

export const RecoverProductAction = ({ product }: { product: Product }) => {
  const recoverMutation = useRecoverProduct();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    recoverMutation.mutate(product.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button" className="inline-flex items-center">
                <RotateCcw className="w-4 h-4 text-emerald-500 cursor-pointer" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Recover Product</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Recover This Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to recover "{product.product_name}"? It will
            be restored to the active products list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm}>
            Recover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DELETED_SORT_OPTIONS = [
  { value: "-deleted_at", label: "Recently Deleted" },
  { value: "deleted_at", label: "Oldest Deleted" },
  { value: "product_name", label: "Name (A-Z)" },
  { value: "-product_name", label: "Name (Z-A)" },
];

export const DELETED_COLUMNS: DataTableColumn<Product>[] = [
  {
    key: "product_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: product => (
      <span className="font-medium whitespace-nowrap">{product.product_name}</span>
    ),
  },
  {
    key: "product_sku_code",
    header: "SKU",
    className: "whitespace-nowrap py-6",
    render: product => (
      <span className="text-muted-foreground whitespace-nowrap font-mono text-xs">
        {product.product_sku_code}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: product => <CategoryBadge product={product} />,
  },
  {
    key: "product_type",
    header: "Type",
    className: "whitespace-nowrap py-6",
    render: product => (
      <Badge variant={product.product_type === "INTERNAL_PRODUCED" ? "default" : "secondary"}>
        {product.product_type === "INTERNAL_PRODUCED" ? "Internal" : "External"}
      </Badge>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "whitespace-nowrap py-6",
    render: product => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.official_name || "—"}
      </span>
    ),
  },
  {
    key: "warehouse",
    header: "Warehouse",
    className: "whitespace-nowrap py-6",
    render: product => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.warehouse_name || "—"}
      </span>
    ),
  },
  {
    key: "deleted_at",
    header: "Deleted At",
    className: "whitespace-nowrap py-6",
    render: product => (
      <span className="text-muted-foreground whitespace-nowrap">
        {product.deleted_at ? formatDate(product.deleted_at) : "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: product => <RecoverProductAction product={product} />,
  },
];
