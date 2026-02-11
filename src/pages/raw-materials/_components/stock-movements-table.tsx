import { RawMaterialStockMovement } from "@/api/raw-materials/raw-material.types";
import { UOM } from "@/api/uom/uom.types";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { History } from "lucide-react"; 
import { RM_STOCK_MOVEMENT_COLUMNS } from "../utils/table-feature";

interface StockMovementsTableProps {
  movements: RawMaterialStockMovement[];
  rawMaterialId: number;
  materialName: string;
  uom: UOM | null,
}

export function StockMovementsTable({ movements, rawMaterialId, materialName, uom }: StockMovementsTableProps) {
  if (!movements.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <History className="h-8 w-8 mb-2 opacity-20" />
          <p>No stock movements recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Stock Movements
            </CardTitle>
            <CardDescription>
              Recent inventory activity and price logs
            </CardDescription>
            <CardDescription>
              <span className="font-bold text-red-500">*</span> Reorder stock quntity which is not already in used for production process are allowed to make an update to ensure stock quantity consistency.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono">
            {movements.length} Entries
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <DataTable 
          columns={RM_STOCK_MOVEMENT_COLUMNS(
            materialName,
            rawMaterialId,
            uom?.symbol || uom?.name
          )}
          data={movements}
        />
      </CardContent>
    </Card>
  );
}
