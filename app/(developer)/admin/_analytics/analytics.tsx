"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import AnalyticsHelper from "./_helpers/analyticshelper";

const Analytics = () => {

    const chartConfig = {
        gamesPlayed: {
            label: "Games",
            color: "rgb(206, 52, 52)",
        }
    } satisfies ChartConfig

    // import all helper functions
    const { gamesPlayedToday, gamesPlayedThisWeek, buildWeekData, gamesPlayedThisMonth, buildMonthData } = AnalyticsHelper()

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
                                        <TableCell>Games played today</TableCell>
                                        <TableCell className="text-end">{gamesPlayedToday()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Games played this week</TableCell>
                                        <TableCell className="text-end">{gamesPlayedThisWeek()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Games played this month</TableCell>
                                        <TableCell className="text-end">{gamesPlayedThisMonth()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:basis-1/3 w-full my-4 flex-grow">
                    <Card className="p-2 m-2 h-full">
                        <CardHeader>
                            Past 7 Days
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={buildWeekData()}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        if (value === "Today") {
                                            return value;
                                        }
                                        else return value.slice(0, 3)
                                    }}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="gamesPlayed" fill="var(--color-gamesPlayed)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:basis-1/3 w-full my-4 flex-grow">
                    <Card className="p-2 m-2 h-full">
                        <CardHeader>
                            Games Played By Month
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={buildMonthData()}>
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
                                <Bar dataKey="gamesPlayed" fill="var(--color-gamesPlayed)" radius={4} />
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