"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Eye, EyeOff } from "lucide-react";

import { REPORT_REASON_LABELS } from "@/app/(main)/game/_constants/reportReasons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import LevelReportReviewDialog, { ReviewableReport } from "./level-report-review-dialog";

const LevelReports = () => {
  const reports = useQuery(api.reports.getLevelReports);

  const [showResolved, setShowResolved] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReviewableReport | null>(null);

  const pendingCount = reports?.filter((r) => r.status === "pending").length ?? 0;
  const resolvedCount = reports?.filter((r) => r.status !== "pending").length ?? 0;
  const visible = reports?.filter((r) => showResolved || r.status === "pending") ?? [];

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} open report${pendingCount !== 1 ? "s" : ""} awaiting review`
            : reports !== undefined
              ? "No open reports"
              : ""}
        </p>
        {resolvedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowResolved((v) => !v)}>
            {showResolved ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Resolved ({resolvedCount})
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Resolved ({resolvedCount})
              </>
            )}
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports === undefined ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : reports === null ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Unauthorized.
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No level reports.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className="font-medium">{report.levelTitle}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate text-sm">{REPORT_REASON_LABELS[report.reason] ?? report.reason}</p>
                  </TableCell>
                  <TableCell>
                    {report.status === "pending" ? (
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Open</Badge>
                    ) : report.status === "resolved" ? (
                      <Badge variant="secondary">Resolved</Badge>
                    ) : (
                      <Badge variant="secondary">Dismissed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(report._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={report.status !== "pending"}
                      onClick={() => setSelectedReport(report as ReviewableReport)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <LevelReportReviewDialog
        report={selectedReport}
        open={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
      />
    </>
  );
};

export default LevelReports;
