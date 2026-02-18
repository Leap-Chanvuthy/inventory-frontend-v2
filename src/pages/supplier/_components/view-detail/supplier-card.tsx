import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSupplierStatistics } from "@/api/suppliers/supplier.query"
import { Skeleton } from "@/components/ui/skeleton"

export function SupplierCard() {
  const { data, isPending } = useSupplierStatistics()
  const stats = data?.data

  if (isPending) {
    return (
      <Card className="w-full max-w-sm bg-white/70 dark:bg-neutral-900/70 dark:border-neutral-800 rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm bg-white/70 dark:bg-neutral-900/70 dark:border-neutral-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Supplier Summary
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Track your current supplier stats and recent updates
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Suppliers</span>
          <span className="text-lg font-medium text-gray-900 dark:text-gray-50">
            {stats?.total_suppliers || 0} Suppliers
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">New This Month</span>
          <span className="text-lg font-semibold text-green-600">
            +{stats?.new_suppliers?.this_month || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</span>
          <span className={`text-sm font-medium ${
            stats?.total_suppliers_trend?.direction === "up"
              ? "text-green-600"
              : "text-red-600"
          }`}>
            {stats?.total_suppliers_trend?.direction === "up" ? "+" : "-"}
            {stats?.total_suppliers_trend?.percent || 0}%
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="default">
          View Detail <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
