"use client";

import { Loader2 } from "lucide-react";

export type FormSubmitButtonProps = {
  loading: boolean;
};

export function FormSubmitButton({ loading }: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-150 bg-portfolio-surface-foreground text-portfolio-surface hover:bg-white active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading && <Loader2 className="size-[1.125em] shrink-0 animate-spin text-portfolio-surface" />}
      {loading ? "Sending…" : "Let's Talk"}
    </button>
  );
}
