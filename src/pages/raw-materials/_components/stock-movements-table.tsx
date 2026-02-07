import { RawMaterialStockMovement } from "@/api/raw-materials/raw-material.types";
import { UOM } from "@/api/uom/uom.types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/date-format";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react"; // UI Icons

interface StockMovementsTableProps {
  movements: RawMaterialStockMovement[];
  uom: UOM | null,
}

export function StockMovementsTable({ movements , uom }: StockMovementsTableProps) {
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
          </div>
          <Badge variant="secondary" className="font-mono">
            {movements.length} Entries
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-transparent">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="hidden md:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map(movement => {
              const isStockIn = movement.direction === "IN";

              return (
                <TableRow key={movement.id} className="group transition-colors">
                  <TableCell className="font-medium text-muted-foreground">
                    {formatDate(movement.movement_date)}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-xs font-semibold tracking-wide">
                      {movement.movement_type.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-1.5 font-bold ${
                        isStockIn ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isStockIn ? (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                      <span className="text-xs uppercase tracking-wider">
                        {movement.direction}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {isStockIn ? "+" : "-"}
                    {movement.quantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })} {uom?.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    ${movement.unit_price_in_usd.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    $
                    {movement.total_value_in_usd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[150px]">
                    <span
                      className="text-xs text-muted-foreground line-clamp-1 italic"
                      title={movement?.note || ""}
                    >
                      {movement.note || "No notes"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
