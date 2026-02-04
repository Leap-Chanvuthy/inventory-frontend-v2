// "use client";

// import { Pie, PieChart, Cell } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// interface MovementTypeCount {
//   type: string;
//   count: number;
//   fill: string;
// }

// interface RawMaterialPiechartProps {
//   data: MovementTypeCount[];
//   title?: string;
//   description?: string;
// }

// const COLORS = [
//   "var(--chart-1)",
//   "var(--chart-2)",
//   "var(--chart-3)",
//   "var(--chart-4)",
//   "var(--chart-5)",
// ];

// export function RawMaterialPiechart({
//   data,
//   title = "Movement Type Breakdown",
//   description = "Distribution of stock movements by type",
// }: RawMaterialPiechartProps) {
//   const total = data.reduce((acc, item) => acc + item.count, 0);

//   const chartConfig = data.reduce((config, item, index) => {
//     config[item.type] = {
//       label: item.type.replace(/_/g, " "),
//       color: COLORS[index % COLORS.length],
//     };
//     return config;
//   }, {} as ChartConfig);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={data}
//               dataKey="count"
//               nameKey="type"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 leading-none font-medium">
//           Total Movements: {total}
//         </div>
//         <div className="flex flex-wrap justify-center gap-3 text-muted-foreground">
//           {data.map((item, index) => (
//             <div key={item.type} className="flex items-center gap-1">
//               <div
//                 className="h-3 w-3 rounded-full"
//                 style={{ backgroundColor: COLORS[index % COLORS.length] }}
//               />
//               <span className="text-xs">
//                 {item.type.replace(/_/g, " ")} ({item.count})
//               </span>
//             </div>
//           ))}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
