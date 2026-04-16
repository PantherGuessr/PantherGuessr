"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Flag, X } from "lucide-react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="absolute top-2 right-2 z-[1000]">
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <DialogPrimitive.Trigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 shadow-md"
            title="Report this level"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </DialogPrimitive.Trigger>
        <DialogPortal>
          <DialogOverlay className="z-[10000]" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[10001] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex flex-col space-y-1.5">
              <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                Report Level
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                Let us know what&apos;s wrong with this level so we can fix it.
              </DialogPrimitive.Description>
            </div>
            {submitted ? (
              <div className="pt-4 text-center">
                <p className="font-medium">Report submitted, we'll review it soon!</p>
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
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default ReportButton;
