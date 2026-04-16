export const REPORT_REASONS = [
  { value: "not_university_property", label: "Not part of the university property" },
  { value: "pin_incorrectly_placed", label: "Pin is incorrectly placed" },
  { value: "wrong_image", label: "Something is wrong with the image" },
  { value: "outdated_image", label: "Outdated image" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];

export const REPORT_REASON_LABELS: Record<string, string> = Object.fromEntries(
  REPORT_REASONS.map(({ value, label }) => [value, label])
);
