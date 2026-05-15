import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRawMaterial } from "@/api/product/product.type";
import { useProductBomSummary } from "@/api/product/product.query";
import { DataTable } from "@/components/reusable/data-table/data-table";
import {
  PRODUCT_BOM_FALLBACK_COLUMNS,
  PRODUCT_BOM_SUMMARY_COLUMNS,
} from "../utils/product-bom-table-feature";

interface ProductBomCardProps {
  productId: number;
  rawMaterials?: ProductRawMaterial[];
}

export function ProductBomCard({ productId, rawMaterials = [] }: ProductBomCardProps) {
  const { data: bomResponse } = useProductBomSummary(productId);
  const bom = bomResponse?.data;
  const materials = bom?.materials ?? [];

  const showSummary = !!bom && materials.length > 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950">
            <Layers className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-base">BOM Cost & Raw Material Usage</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Raw materials, actual usage, scrap, and production spend
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total BOM Cost</p>
              <p className="text-base font-semibold">${Number(bom?.total_bom_cost_usd ?? 0).toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Raw Materials Used</p>
              <p className="text-base font-semibold">{materials.length}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total Scrap Cost</p>
              <p className="text-base font-semibold">${Number(bom?.total_scrap_cost_usd ?? 0).toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Average Cost / Unit</p>
              <p className="text-base font-semibold">${Number(bom?.average_bom_cost_per_unit_usd ?? 0).toFixed(4)}</p>
            </div>
          </div>
        )}

        {materials.length > 0 ? (
          <DataTable
            columns={PRODUCT_BOM_SUMMARY_COLUMNS}
            data={materials}
            emptyText="No BOM materials found."
          />
        ) : rawMaterials.length > 0 ? (
          <DataTable
            columns={PRODUCT_BOM_FALLBACK_COLUMNS}
            data={rawMaterials}
            emptyText="No BOM materials found."
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Layers className="h-8 w-8" />
            <p className="text-sm">No materials added</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
