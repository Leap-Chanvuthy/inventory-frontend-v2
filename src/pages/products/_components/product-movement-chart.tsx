import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Inbox } from "lucide-react";
import { RawMaterialPiechart } from "@/pages/raw-materials/_components/charts/raw-material-piechart";

interface ProductMovementChartProps {
  data: Record<string, number>;
}

export function ProductMovementChart({ data }: ProductMovementChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950">
              <BarChart2 className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-base">Movement Type Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Distribution of stock movements by type
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No movement data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <RawMaterialPiechart
      data={data}
      title="Movement Type Breakdown"
      description="Distribution of stock movements by type"
    />
  );
}
