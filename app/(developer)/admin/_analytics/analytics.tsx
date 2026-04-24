"use client";

import { useQuery } from "convex/react";
import { AlertCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";

// ─── helpers ────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── stat cards ──────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <Card className="p-2 md:p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-bold md:text-2xl">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </Card>
);

const AlertCard = ({ label, value }: { label: string; value: string | number }) => {
  const isWarning = typeof value === "number" && value > 0;
  return (
    <Card className={`p-2 md:p-4 ${isWarning ? "border-amber-500/50 bg-amber-500/5" : ""}`}>
      <div className="flex items-center gap-1">
        {isWarning && <AlertCircle className="h-3 w-3 shrink-0 text-amber-500" />}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-1 text-xl font-bold md:text-2xl ${isWarning ? "text-amber-500" : ""}`}>{value}</p>
    </Card>
  );
};

// ─── chart configs ────────────────────────────────────────────────────────────

const gamesChartConfig = {
  gamesPlayed: { label: "Games Played", color: "rgb(206, 52, 52)" },
} satisfies ChartConfig;

const usersChartConfig = {
  count: { label: "New Users", color: "rgb(59, 130, 246)" },
} satisfies ChartConfig;

const gameTypeChartConfig = {
  count: { label: "Games", color: "rgb(34, 197, 94)" },
} satisfies ChartConfig;

const GAME_TYPE_COLORS: Record<string, string> = {
  Singleplayer: "rgb(234, 179, 8)",
  Weekly: "rgb(59, 130, 246)",
  Multiplayer: "rgb(34, 197, 94)",
};

// ─── component ───────────────────────────────────────────────────────────────

const Analytics = () => {
  const summary = useQuery(api.admin.getAdminSummary);
  const dailyStats = useQuery(api.gamestats.getPastNDaysOfStats, { n: 7 });
  const monthlyStats = useQuery(api.gamestats.getAllMonthlyGameStats);

  // Daily games chart — reverse so oldest is on the left
  const todayPST = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dailyGamesData = dailyStats
    ? [...dailyStats].reverse().map((d) => {
        // Parse at noon UTC so the date is unambiguously the same calendar day in PST
        const date = new Date(d.isoDay + "T12:00:00Z");
        return {
          day: d.isoDay === todayPST ? "Today" : dayLabels[date.getUTCDay()],
          gamesPlayed: Number(d.count),
        };
      })
    : [];
  const totalGamesThisWeek = dailyGamesData.reduce((acc, d) => acc + d.gamesPlayed, 0);

  // Monthly games chart
  const monthlyGamesData = monthlyStats
    ? monthlyStats.map((m) => ({
        month: MONTHS[Number(m.isoYearMonth.split("-")[1]) - 1],
        gamesPlayed: Number(m.count),
      }))
    : [];
  const totalGamesAllMonths = monthlyGamesData.reduce((acc, m) => acc + m.gamesPlayed, 0);

  // Game type chart
  const totalGames = summary?.totalGames ?? 0;
  const gameTypeData = summary
    ? [
        { type: "Singleplayer", count: summary.gameTypeBreakdown.singleplayer },
        { type: "Weekly", count: summary.gameTypeBreakdown.weekly },
        { type: "Multiplayer", count: summary.gameTypeBreakdown.multiplayer },
      ]
    : [];

  // New registrations total this week
  const totalRegistrationsThisWeek = (summary?.newUsersPerDay ?? []).reduce((acc, d) => acc + d.count, 0);

  const loading = "…";

  return (
    <div className="space-y-6 text-start">
      {/* ── Users ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Users</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total Users"
            value={summary?.totalUsers ?? loading}
            sub={`${summary?.bannedUsers ?? loading} banned`}
          />
          <StatCard
            label="New Users — Last 7 Days"
            value={summary?.newUsersLast7Days ?? loading}
            sub={`${summary?.newUsersLast30Days ?? loading} in the last 30 days`}
          />
          <StatCard label="Active Streaks" value={summary?.activeStreakUsers ?? loading} />
          <AlertCard label="Open Profile Reports" value={summary?.openReports ?? loading} />
          <AlertCard label="Open Ban Appeals" value={summary?.openAppeals ?? loading} />
        </div>
      </section>

      {/* ── Gameplay ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gameplay</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Games Played" value={summary?.totalGames ?? loading} />
          <StatCard
            label="Avg Score / Game"
            value={summary ? summary.avgScore.toLocaleString() : loading}
            sub="across all 5 rounds"
          />
          <StatCard
            label="Avg Distance / Round"
            value={summary ? `${summary.avgDistancePerRound.toLocaleString()} m` : loading}
          />
          <StatCard label="Avg Time / Game" value={summary ? formatTime(summary.avgTimeSecs) : loading} />
        </div>
      </section>

      {/* ── Daily charts ── */}
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">
              <CardTitle className="text-base">Games Played — Last 7 Days</CardTitle>
              <CardDescription>
                {dailyStats ? `${totalGamesThisWeek.toLocaleString()} total · PST` : "Loading…"}
              </CardDescription>
            </CardHeader>
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
            <CardHeader className="px-3 md:px-6">
              <CardTitle className="text-base">New Registrations — Last 7 Days</CardTitle>
              <CardDescription>
                {summary ? `${totalRegistrationsThisWeek.toLocaleString()} total · PST` : "Loading…"}
              </CardDescription>
            </CardHeader>
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

      {/* ── Monthly + game type charts ── */}
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">
              <CardTitle className="text-base">Games Played — By Month</CardTitle>
              <CardDescription>
                {monthlyStats
                  ? `${totalGamesAllMonths.toLocaleString()} total · ${monthlyGamesData.length} month${monthlyGamesData.length !== 1 ? "s" : ""}`
                  : "Loading…"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={gamesChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={monthlyGamesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="gamesPlayed" fill="var(--color-gamesPlayed)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0 flex-1">
          <Card className="h-full p-1 md:p-2">
            <CardHeader className="px-3 md:px-6">
              <CardTitle className="text-base">Game Type Breakdown — All Time</CardTitle>
              <CardDescription>
                {summary
                  ? gameTypeData
                      .map((g) => `${g.type}: ${totalGames > 0 ? Math.round((g.count / totalGames) * 100) : 0}%`)
                      .join(" · ")
                  : "Loading…"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ChartContainer config={gameTypeChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={gameTypeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="type" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4}>
                    {gameTypeData.map((entry) => (
                      <Cell key={entry.type} fill={GAME_TYPE_COLORS[entry.type] ?? "rgb(34, 197, 94)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Top levels ── */}
      <Card className="p-1 md:p-2">
        <CardHeader className="px-3 md:px-6">
          <CardTitle className="text-base">Top 5 Most Played Levels</CardTitle>
          <CardDescription>
            {summary ? `${summary.totalLevels.toLocaleString()} total levels` : "Loading…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6 [&_td]:px-2 [&_td]:py-2 md:[&_td]:px-4 [&_th]:px-2 md:[&_th]:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Times Played</TableHead>
                <TableHead className="text-right">% of All Games</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary ? (
                summary.topLevels.map((level, i) => (
                  <TableRow key={level._id}>
                    <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>{level.title}</TableCell>
                    <TableCell className="text-right">{Number(level.timesPlayed).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {totalGames > 0 ? `${((Number(level.timesPlayed) / totalGames) * 100).toFixed(1)}%` : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
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
