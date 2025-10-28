import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ProductCard() {
  return (
      <Card className="w-full max-w-sm bg-white/70 dark:bg-neutral-900/70 dark:border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Inventory Summary
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Track your current stock value and recent updates
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Current Stock</span>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-50">2,540 Units</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Stock Value (USD)</span>
            <span className="text-lg font-semibold text-green-600">$12,380</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Oct 25, 2025</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            variant="default"
            // className="flex items-center gap-2 text-sm font-medium rounded-xl text-white transition-all"
          >
            View Detail <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
  )
}
