import { cn } from "~/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText = ({ children, className }: GradientTextProps) => {
  return (
    <span className={cn("text-gradient", className)}>
      {children}
    </span>
  );
};

// Solid text component for headers
export const SolidText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={cn("text-[#cad3f5]", className)}>
      {children}
    </span>
  );
};

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  gradient?: boolean;
}

export const Heading = ({
  children,
  level = 1,
  className,
  gradient = false
}: HeadingProps) => {
  const baseClasses = "text-slate-100";

  const levelClasses = {
    1: "text-4xl font-bold",
    2: "text-3xl font-semibold",
    3: "text-2xl font-semibold",
    4: "text-xl font-semibold",
    5: "text-lg font-medium",
    6: "text-base font-medium",
  };

  const classes = cn(baseClasses, levelClasses[level], className);

  if (gradient) {
    return (
      <GradientText className={classes}>
        {children}
      </GradientText>
    );
  }

  const Component = level === 1 ? "h1" :
                   level === 2 ? "h2" :
                   level === 3 ? "h3" :
                   level === 4 ? "h4" :
                   level === 5 ? "h5" : "h6";

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};

interface TextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "muted" | "accent";
  size?: "sm" | "base" | "lg" | "xl";
  className?: string;
}

export const Text = ({
  children,
  variant = "primary",
  size = "base",
  className
}: TextProps) => {
  const variantClasses = {
    primary: "text-slate-100",
    secondary: "text-slate-200",
    muted: "text-slate-400",
    accent: "text-slate-300",
  };

  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <p className={cn(variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </p>
  );
};