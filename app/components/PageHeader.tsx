import { cn } from "~/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PageHeader = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-8 max-w-4xl text-center max-sm:gap-4", className)}>
      <h1 className={cn("max-sm:text-[3rem] text-6xl leading-tight xl:tracking-[-2px] font-semibold", titleClassName)} style={{ color: '#de9f7c' }}>
        {title}
      </h1>
      {subtitle && (
      <h2 className={cn("max-sm:text-xl text-3xl", subtitleClassName)} style={{ color: '#8aba89' }}>
        {subtitle}
      </h2>
      )}
    </div>
  );
};

export default PageHeader;