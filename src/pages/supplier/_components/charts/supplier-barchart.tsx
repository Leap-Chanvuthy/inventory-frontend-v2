// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import { useSupplierStatistics } from "@/api/suppliers/supplier.query"
// import { Skeleton } from "@/components/ui/skeleton"

// const chartConfig = {
//   total: {
//     label: "Suppliers",
//     color: "var(--chart-1)",
//   },
// } satisfies ChartConfig

// export function SupplierBarchart() {
//   const { data, isPending } = useSupplierStatistics()
//   const provinceData = data?.data?.charts?.top_provinces?.slice(0, 10) || []

//   if (isPending) {
//     return (
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-6 w-48" />
//           <Skeleton className="h-4 w-32" />
//         </CardHeader>
//         <CardContent>
//           <Skeleton className="h-[250px] w-full" />
//         </CardContent>
//         <CardFooter>
//           <Skeleton className="h-4 w-full" />
//         </CardFooter>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Label</CardTitle>
//         <CardDescription>Top 10 Provinces</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={provinceData}
//             margin={{
//               top: 20,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="province"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 8)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="total" fill="var(--color-total)" radius={8}>
//               <LabelList
//                 position="top"
//                 offset={12}
//                 className="fill-foreground"
//                 fontSize={12}
//               />
//             </Bar>
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 leading-none font-medium">
//           {provinceData[0] && `Top province: ${provinceData[0].province}`}
//           <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="text-muted-foreground leading-none">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }



import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSupplierStatistics } from "@/api/suppliers/supplier.query";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  total: {
    label: "Suppliers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SupplierBarchart() {
  const { data, isPending } = useSupplierStatistics();
  const provinceData = data?.data?.charts?.top_provinces?.slice(0, 10) || [];

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>Top 10 Provinces</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={provinceData}
            margin={{
              top: 20,
              bottom: provinceData.length > 5 ? 60 : 10,
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="province"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              angle={provinceData.length > 5 ? -45 : 0}
              textAnchor={provinceData.length > 5 ? "end" : "middle"}
              fontSize={11}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {provinceData[0] && `Top province: ${provinceData[0].province}`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
