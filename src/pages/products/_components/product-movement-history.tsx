import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, ArrowDownToLine, ArrowUpFromLine, Inbox } from "lucide-react";
import { formatDate } from "@/utils/date-format";
import { ProductMovement } from "@/api/product/product.type";

interface ProductMovementHistoryProps {
  movements: ProductMovement[];
}

export function ProductMovementHistory({
  movements,
}: ProductMovementHistoryProps) {
  if (movements.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950">
              <Hash className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-base">Movement History</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stock in/out records
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No movement history found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950">
            <Hash className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-base">Movement History</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stock in/out records
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "Type",
                  "Dir",
                  "Qty",
                  "Sell (USD)",
                  "Status",
                  "Date",
                  "By",
                ].map(h => (
                  <th
                    key={h}
                    className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map(mv => (
                <tr
                  key={mv.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-3">
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-nowrap"
                    >
                      {mv.movement_type.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        mv.direction === "IN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {mv.direction === "IN" ? (
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpFromLine className="h-3.5 w-3.5" />
                      )}
                      {mv.direction}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold">
                    {parseFloat(mv.quantity).toFixed(2)}
                  </td>
                  <td className="px-3 py-3">
                    ${mv.selling_unit_price_in_usd.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <Badge
                      variant="outline"
                      className={
                        mv.product_status === "COMPLETED"
                          ? "border-green-500 text-green-600 text-xs"
                          : "text-xs"
                      }
                    >
                      {mv.product_status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {formatDate(mv.movement_date)}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {mv.created_by?.name || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
