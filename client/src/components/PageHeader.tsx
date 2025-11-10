import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  subtitle?: string;
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  };
  className?: string;
}

export default function PageHeader({
  title,
  icon: Icon,
  subtitle,
  badges,
  action,
  className = ""
}: PageHeaderProps) {
  return (
    <CardHeader className={`pb-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="font-serif text-lg sm:text-xl flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
            <span className="truncate">{title}</span>
          </CardTitle>
        </div>
        {action && (
          <Button
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            className="shrink-0 min-h-[44px]"
          >
            {action.icon && <action.icon className="w-4 h-4 sm:mr-2" />}
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        )}
      </div>
      {(subtitle || badges) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
          {subtitle && (
            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{subtitle}</div>
          )}
          {badges && badges.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || "secondary"} className="text-xs h-6">
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </CardHeader>
  );
}
