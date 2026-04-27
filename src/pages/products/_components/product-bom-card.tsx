import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRawMaterial } from "@/api/product/product.type";

interface ProductBomCardProps {
  rawMaterials?: ProductRawMaterial[];
}

export function ProductBomCard({ rawMaterials = [] }: ProductBomCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950">
            <Layers className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-base">Bill of Materials</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Raw materials used to produce this product
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rawMaterials.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-10">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Material Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    SKU Code
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Qty / Unit
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Scrap %
                  </th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map((rm, idx) => (
                  <tr
                    key={rm.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {rm.raw_material?.material_name || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {rm.raw_material?.material_sku_code || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {Number(rm.quantity_per_unit ?? rm.quantity ?? 0).toFixed(
                        2,
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {Number(rm.scrap_percentage ?? 0).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
