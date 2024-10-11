"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const Analytics = () => {

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
      ]

    const totalLatestMonth = chartData[chartData.length - 1].desktop + chartData[chartData.length - 1].mobile;

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    return (
        <>
            <div className="flex text-start flex-wrap justify-items-center">
                <div className="md:basis-1/3 w-full my-4 flex-grow">
                    <Card className="p-2 m-2 h-full">
                        <CardHeader>
                            <h2 className="text-2xl">User Data</h2>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Active this month</TableCell>
                                        <TableCell className="text-end">{totalLatestMonth}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Games played this month</TableCell>
                                        <TableCell className="text-end">465</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Attempted today&apos;s challenge</TableCell>
                                        <TableCell className="text-end">35</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:basis-1/3 w-full my-4 flex-grow">
                    <Card className="p-2 m-2 h-full">
                        <CardHeader>
                            Monthly Users
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:basis-1/3 w-full my-4 flex-grow">
                    <Card className="p-2 m-2 h-full">
                        <CardHeader>
                            Monthly Users
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Analytics;