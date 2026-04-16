"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OPEN_SOURCE_TOOLS } from "@/lib/open-source-tooling";

const OpenSourceToolsList = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <div className="relative">
        <div
          className="space-y-8 overflow-hidden transition-all duration-500"
          style={{ maxHeight: expanded ? "9999px" : "20rem" }}
        >
          {OPEN_SOURCE_TOOLS.map(({ category, packages }) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{category}</p>
              <div className="divide-y divide-border rounded-lg border">
                {packages.map(({ name, href, license }) => (
                  <Link
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{license}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="outline" size="sm" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? (
            <>
              <ChevronUp className="mr-1.5 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-1.5 h-4 w-4" />
              View All
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OpenSourceToolsList;
