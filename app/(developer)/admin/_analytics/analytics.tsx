"use client";

import { useQuery } from "convex/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/convex/_generated/api";

// ─── helpers ────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── stat card ───────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <Card className="p-2 md:p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-bold md:text-2xl">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </Card>
);

// ─── chart configs ────────────────────────────────────────────────────────────

const gamesChartConfig = {
  gamesPlayed: { label: "Games", color: "rgb(206, 52, 52)" },
} satisfies ChartConfig;

const usersChartConfig = {
  count: { label: "New Users", color: "rgb(59, 130, 246)" },
} satisfies ChartConfig;

const gameTypeChartConfig = {
  count: { label: "Games", color: "rgb(34, 197, 94)" },
} satisfies ChartConfig;

// ─── component ───────────────────────────────────────────────────────────────

const Analytics = () => {
  const summary = useQuery(api.admin.getAdminSummary);
  const dailyStats = useQuery(api.gamestats.getPastNDaysOfStats, { n: 7 });
  const monthlyStats = useQuery(api.gamestats.getAllMonthlyGameStats);

  // Daily games chart — reverse so oldest is on the left
  const dailyGamesData = dailyStats
    ? [...dailyStats].reverse().map((d) => {
        const today = new Date().toISOString().split("T")[0];
        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const date = new Date(d.isoDay);
        return {
          day: d.isoDay === today ? "Today" : dayLabels[date.getDay()],
          gamesPlayed: Number(d.count),
        };
      })
    : [];

  // Monthly games chart
  const monthlyGamesData = monthlyStats
    ? monthlyStats.map((m) => ({
        month: MONTHS[Number(m.isoYearMonth.split("-")[1]) - 1],
        gamesPlayed: Number(m.count),
      }))
    : [];

  // Game type chart
  const gameTypeData = summary
    ? [
        { type: "Singleplayer", count: summary.gameTypeBreakdown.singleplayer },
        { type: "Weekly", count: summary.gameTypeBreakdown.weekly },
        { type: "Multiplayer", count: summary.gameTypeBreakdown.multiplayer },
      ]
    : [];

  const loading = "…";

  return (
    <div className="space-y-4 text-start">

      {/* ── Row 1: primary snapshot stats ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Users" value={summary?.totalUsers ?? loading} />
        <StatCard
          label="Active Streaks"
          value={summary?.activeStreakUsers ?? loading}
          sub={summary ? `${summary.bannedUsers} banned` : undefined}
        />
        <StatCard
          label="New This Week"
          value={summary?.newUsersLast7Days ?? loading}
          sub={summary ? `${summary.newUsersLast30Days} this month` : undefined}
        />
        <StatCard label="Total Games" value={summary?.totalGames ?? loading} />
        <StatCard label="Open Reports" value={summary?.openReports ?? loading} />
        <StatCard label="Open Appeals" value={summary?.openAppeals ?? loading} />
      </div>

      {/* ── Row 2: game performance averages ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Avg Score / Game"
          value={summary ? summary.avgScore.toLocaleString() : loading}
          sub="across all 5 rounds"
        />
        <StatCard
          label="Avg Distance / Round"
          value={summary ? summary.avgDistancePerRound.toLocaleString() : loading}
        />
        <StatCard
          label="Avg Time / Game"
          value={summary ? formatTime(summary.avgTimeSecs) : loading}
        />
      </div>

      {/* ── Row 3: daily charts ── */}
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">Games Played — Last 7 Days</CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={gamesChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={dailyGamesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="gamesPlayed" fill="var(--color-gamesPlayed)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">New Signups — Last 7 Days</CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={usersChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={summary?.newUsersPerDay ?? []}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Row 4: monthly + game type charts ── */}
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">Games Played — By Month</CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={gamesChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={monthlyGamesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="gamesPlayed" fill="var(--color-gamesPlayed)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">Games By Type — All Time</CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={gameTypeChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={gameTypeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="type" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Row 5: top levels ── */}
      <Card className="p-1 md:p-2">
        <CardHeader className="px-3 md:px-6">Top 5 Most Played Levels</CardHeader>
        <CardContent className="px-2 md:px-6 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_th]:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Times Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary
                ? summary.topLevels.map((level, i) => (
                    <TableRow key={level._id}>
                      <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>{level.title}</TableCell>
                      <TableCell className="text-right">
                        {Number(level.timesPlayed).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-16 text-center text-muted-foreground">
                        Loading…
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default Analytics;
