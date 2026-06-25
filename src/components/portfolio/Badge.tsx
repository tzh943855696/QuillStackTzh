import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "outline" | "filled";
  className?: string;
};

export default function PortfolioBadge({
  children,
  variant = "outline",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs lg:text-sm font-medium tracking-tight",
        {
          "border-[1.75px] border-portfolio-surface-foreground/70 text-portfolio-surface-foreground/70 uppercase":
            variant === "outline",
          "bg-portfolio-surface-foreground/70 text-portfolio-surface":
            variant === "filled",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
