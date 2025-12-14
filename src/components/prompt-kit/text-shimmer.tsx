"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TextShimmer = React.forwardRef<HTMLDivElement, TextShimmerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
        <span className="relative">{children}</span>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  },
);
TextShimmer.displayName = "TextShimmer";
