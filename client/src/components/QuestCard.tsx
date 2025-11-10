import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, CheckCircle, Clock, AlertTriangle, Trash2 } from "lucide-react";
import type { Quest } from "@shared/schema";
import { useState } from "react";

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
  onDelete?: (questId: string) => void;
  className?: string;
}

export default function QuestCard({ quest, onClick, onDelete, className = "" }: QuestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressPercentage = (quest.progress / quest.maxProgress) * 100;

  const getPriorityIcon = () => {
    switch (quest.priority) {
      case "urgent": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "high": return <Clock className="w-4 h-4 text-amber-500" />;
      default: return null;
    }
  };

  const getPriorityVariant = () => {
    switch (quest.priority) {
      case "urgent": return "destructive";
      case "high": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = () => {
    switch (quest.status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking delete
    onDelete?.(quest.id);
  };

  return (
    <Card
      className={`hover-elevate cursor-pointer transition-all duration-200 ${className}`}
      onClick={handleClick}
      data-testid={`quest-card-${quest.id}`}
    >
      <CardHeader className="pb-3 sm:pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              {getStatusIcon()}
              <CardTitle className="text-sm sm:text-base font-serif leading-tight flex-1">
                {quest.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getPriorityVariant()} className="text-xs h-6">
                {getPriorityIcon()}
                <span className="ml-1">{quest.priority}</span>
              </Badge>
              {quest.status === "active" && (
                <Badge variant="outline" className="text-xs h-6">
                  {quest.progress}/{quest.maxProgress}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-200 shrink-0 mt-1 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{quest.description}</p>

            {quest.status === "active" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{quest.progress}/{quest.maxProgress}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {quest.reward && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm font-medium text-foreground mb-1">Reward</div>
                <div className="text-sm text-muted-foreground">{quest.reward}</div>
              </div>
            )}

            {onDelete && (
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-testid={`delete-quest-${quest.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Quest
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}