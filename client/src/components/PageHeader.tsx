import { CardHeader, CardTitle } from "@/components/ui/card";
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
  className?: string;
}

export default function PageHeader({
  title,
  icon: Icon,
  subtitle,
  badges,
  className = ""
}: PageHeaderProps) {
  return (
    <CardHeader className={className}>
      <CardTitle className="font-serif text-xl flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </CardTitle>
      {(subtitle || badges) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
          {badges && badges.length > 0 && (
            <div className="flex gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || "secondary"} className="text-xs">
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
