"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
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

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
        players: {
            label: "Players",
            color: "#2563eb",
        }
    } satisfies ChartConfig

    const monthlyPlayData = useQuery(api.gamestats.getPastNDaysOfStats, { n: 30 });

    const gamesPlayedThisWeek = () => {
        // iterate only through the first 7 days if there are more than 7 days. if not, iterate through all
        if (monthlyPlayData && monthlyPlayData.length > 0) {
            return monthlyPlayData.reduce((acc, curr) => acc + Number(curr.count), 0);
        }
        else if (monthlyPlayData && monthlyPlayData.length > 7) {
            return monthlyPlayData.slice(0, 7).reduce((acc, curr) => acc + Number(curr.count), 0);
        }
        return 0;
    }

    const buildWeekData = () => {
        const data = [];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        if (monthlyPlayData && monthlyPlayData.length > 0) {
            const end = Math.min(monthlyPlayData.length, 7);
            for (let i = end - 1; i >= 0; i--) {
                const isoDate = monthlyPlayData[i].isoDay;
                const date = new Date(isoDate);
                const today = new Date();
                let dayOfWeek = daysOfWeek[date.getDay()];
                if (isoDate === today.toISOString().split("T")[0]) {
                    dayOfWeek = "Today";
                }

                data.push({
                    day: dayOfWeek,
                    players: Number(monthlyPlayData[i].count),
                });
            }
        }
        return data
    }

    const gamesPlayedToday = () => {
        // get first day played
        if (monthlyPlayData && monthlyPlayData.length > 0) {
            return Number(monthlyPlayData[0].count);
        }
    }

    const gamesPlayedThisMonth = () => {
        if (monthlyPlayData && monthlyPlayData.length > 0) {
            return monthlyPlayData.reduce((acc, curr) => acc + Number(curr.count), 0);
        }
        return 0;
    }

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
                                <Bar dataKey="players" fill="var(--color-players)" radius={4} />
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