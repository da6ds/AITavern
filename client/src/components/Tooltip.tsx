import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface TooltipProps {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'auto';
  delay?: number;
  isVisible: boolean;
  onDismiss: () => void;
  targetRef?: React.RefObject<HTMLElement>;
  className?: string;
}

export default function Tooltip({
  id,
  title,
  content,
  position = 'top',
  trigger = 'auto',
  delay = 1000,
  isVisible,
  onDismiss,
  targetRef,
  className = ""
}: TooltipProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible && trigger === 'auto') {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delay);
      return () => clearTimeout(timer);
    } else if (isVisible) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, trigger, delay]);

  if (!shouldShow) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-card border-t-8 border-x-transparent border-x-8 border-b-0';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-card border-b-8 border-x-transparent border-x-8 border-t-0';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-card border-l-8 border-y-transparent border-y-8 border-r-0';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-card border-r-8 border-y-transparent border-y-8 border-l-0';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-card border-t-8 border-x-transparent border-x-8 border-b-0';
    }
  };

  return (
    <div className={`absolute z-50 ${getPositionClasses()} ${className}`}>
      <Card className="p-4 max-w-xs shadow-lg border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 hover-elevate"
            data-testid={`tooltip-dismiss-${id}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {content}
        </p>
        <Button
          onClick={onDismiss}
          size="sm"
          className="w-full"
          data-testid={`tooltip-got-it-${id}`}
        >
          Got it!
        </Button>
      </Card>
      
      {/* Arrow */}
      <div 
        className={`absolute w-0 h-0 ${getArrowClasses()}`} 
        style={{ content: '""' }}
      />
    </div>
  );
}