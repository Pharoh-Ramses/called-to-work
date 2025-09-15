import { Link } from "react-router";
import { cn } from "~/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "auth" | "back" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  as?: "button" | "link";
  to?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  as = "button",
  to,
  type = "button",
  onClick,
}: ButtonProps) => {
  const baseClasses = "font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variantClasses = {
    primary: "bg-gradient-to-b from-[#8aadf4] to-[#8bd5ca] text-[#cad3f5] rounded-full hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-[#8aadf4]",
    auth: "bg-gradient-to-b from-[#8aadf4] to-[#8bd5ca] text-[#cad3f5] rounded-full hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-[#8aadf4]",
    back: "flex flex-row items-center gap-2 rounded-lg border border-[#494d64] bg-[#363a4f] text-[#cad3f5] hover:bg-[#494d64] focus:ring-[#8aadf4]",
    secondary: "bg-[#363a4f] border border-[#494d64] text-[#cad3f5] rounded-lg hover:bg-[#494d64] focus:ring-[#8aadf4]",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const authSizeClasses = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3",
    lg: "px-10 py-4 text-lg",
    xl: "w-96 max-w-full py-4 text-xl",
  };

  const classes = cn(
    baseClasses,
    variant === "auth" ? authSizeClasses[size] : sizeClasses[size],
    variantClasses[variant],
    disabled && "opacity-50 cursor-not-allowed",
    loading && "animate-pulse",
    className
  );

  if (as === "link" && to) {
    return (
      <Link to={to} className={classes}>
        {loading ? "Loading..." : children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;