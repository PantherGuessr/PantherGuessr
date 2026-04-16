"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const REPORT_REASONS = [
  { value: "not_university_property", label: "Not part of the university property" },
  { value: "pin_incorrectly_placed", label: "Pin is incorrectly placed" },
  { value: "wrong_image", label: "Something is wrong with the image" },
  { value: "outdated_image", label: "Outdated image" },
] as const;

type ReportReason = (typeof REPORT_REASONS)[number]["value"];

interface ReportButtonProps {
  levelId: Id<"levels">;
}

const ReportButton = ({ levelId }: ReportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = useMutation(api.reports.submitLevelReport);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await submitReport({ levelId, reason: selectedReason });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedReason("");
      setSubmitted(false);
    }
  };

  return (
    <div className="absolute right-2 top-2 z-[1000]">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon" className="h-8 w-8 shadow-md" title="Report this level">
            <Flag className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Level</DialogTitle>
            <DialogDescription>Let us know what&apos;s wrong with this level so we can fix it.</DialogDescription>
          </DialogHeader>
          {submitted ? (
            <div className="pt-4 text-center">
              <p className="font-medium">Report submitted, we&apos;ll review it soon!</p>
              <Button className="mt-4 w-full" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              <Select value={selectedReason} onValueChange={(val) => setSelectedReason(val as ReportReason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent className="z-[10002]">
                  {REPORT_REASONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} disabled={!selectedReason || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportButton;
