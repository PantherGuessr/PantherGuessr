import * as React from "react";

import { cn } from "@/lib/utils";

interface CustomTextAreaProps {
  resizeable?: boolean | undefined;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & CustomTextAreaProps
>(({ className, resizeable = true, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      style={resizeable ? undefined : { resize: 'none' }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };