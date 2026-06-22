"use client";

import clsx from "clsx";
import { forwardRef } from "react";

export type FormFieldProps = {
  placeholder: string;
  error?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(function FormField(
  { placeholder, error, type = "text", textarea = false, rows = 5, ...props },
  ref
) {
  const baseClass =
    "w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-white/35 text-portfolio-surface-foreground placeholder:text-white/30 focus:outline-none focus:ring-3 focus:ring-white/20 transition text-lg sm:text-xl font-mono font-normal tracking-tight";

  return (
    <div>
      {textarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
      <p
        className={clsx(
          "text-red-400 text-sm mt-0.5 sm:mt-1 h-3 sm:h-4 transition-all duration-300",
          error ? "opacity-100" : "opacity-0"
        )}
      >
        {error ?? " "}
      </p>
    </div>
  );
});

FormField.displayName = "FormField";
