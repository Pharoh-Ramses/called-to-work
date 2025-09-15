import { cn } from "~/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "auth";
  padding?: "sm" | "md" | "lg" | "xl";
}

const Card = ({
  children,
  className,
  variant = "default",
  padding = "md"
}: CardProps) => {
  const baseClasses = "rounded-2xl shadow-lg";

  const variantClasses = {
    default: "bg-[#363a4f] border border-[#494d64]",
    gradient: "gradient-border bg-[#363a4f]",
    auth: "bg-[#363a4f]",
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  );

  if (variant === "gradient") {
    return (
      <div className="gradient-border">
        <div className={classes}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;