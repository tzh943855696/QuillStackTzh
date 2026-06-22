"use client";

import { CircleCheck } from "lucide-react";

export type FormStatusOverlayProps = {
  status: "success" | "error";
  onReset: () => void;
};

export function FormStatusOverlay({ status, onReset }: FormStatusOverlayProps) {
  const resetClass =
    "text-sm text-portfolio-surface-foreground/50 underline underline-offset-4 hover:text-portfolio-surface-foreground/80 transition-colors cursor-pointer";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-2">
      {status === "success" ? (
        <>
          <CircleCheck className="text-portfolio-surface-foreground size-8 sm:size-10 shrink-0" />
          <p className="text-portfolio-surface-foreground font-medium text-lg">
            Got it! I’ll get back to you shortly.
          </p>
          <button type="button" onClick={onReset} className={resetClass}>
            Send another message
          </button>
        </>
      ) : (
        <>
          <p className="text-red-400 font-medium text-lg">
            Something went wrong. Please try again.
          </p>
          <button type="button" onClick={onReset} className={resetClass}>
            Go back
          </button>
        </>
      )}
    </div>
  );
}
