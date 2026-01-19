import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardSkeletonProps = {
  className?: string;
};

const StatCardSkeleton = ({ className }: StatCardSkeletonProps) => {
  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* title */}
        <Skeleton className="h-4 w-28" />
        {/* pill (icon + % text) */}
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5">
          <Skeleton className="mr-1 h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      </CardHeader>

      <CardContent>
        {/* value */}
        <Skeleton className="mb-4 h-10 w-24" />

        <div className="flex flex-col gap-1">
          {/* trend label + arrow */}
          <div className="flex items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-2 h-4 w-4 rounded-full" />
          </div>

          {/* description */}
          <Skeleton className="h-4 w-64" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCardSkeleton;
