import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 text-muted-foreground ${className}`}>
      <Icon className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="text-base">{title}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
    </div>
  );
}
