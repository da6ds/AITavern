import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import CtaIndicator from "./CtaIndicator";

interface StickyBottomActionsProps {
  onBack?: () => void;
  onSkip?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  skipLabel?: string;
  continueLabel?: string;
  showBack?: boolean;
  showSkip?: boolean;
  showContinue?: boolean;
  continueDisabled?: boolean;
  className?: string;
}

export default function StickyBottomActions({
  onBack,
  onSkip,
  onContinue,
  backLabel = "Back",
  skipLabel = "Skip for now",
  continueLabel = "Continue",
  showBack = true,
  showSkip = true,
  showContinue = true,
  continueDisabled = false,
  className = ""
}: StickyBottomActionsProps) {
  return (
    <>
      <CtaIndicator />
      <div className={`sticky bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border ${className}`}>
      {/* Safe area padding for mobile notches */}
      <div 
        className="px-4 py-3 space-y-3"
        style={{ paddingBottom: `max(0.75rem, env(safe-area-inset-bottom))` }}
      >
        {/* Primary action row */}
        <div className="flex gap-2 sm:gap-3">
          {showBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 min-h-[2.75rem] text-xs sm:text-sm px-2 sm:px-3 truncate"
              data-testid="button-back"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
              <span className="truncate">{backLabel}</span>
            </Button>
          )}
          
          {showContinue && (
            <Button
              onClick={onContinue}
              disabled={continueDisabled}
              className="flex-1 min-h-[2.75rem] text-xs sm:text-sm px-2 sm:px-3 bg-gradient-to-r from-amber-600 to-green-600 hover:from-amber-700 hover:to-green-700 truncate"
              data-testid="button-continue"
            >
              <span className="truncate">{continueLabel}</span>
              {continueLabel.includes("Start") || continueLabel.includes("Play") ? (
                <Play className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 shrink-0" />
              ) : (
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 shrink-0" />
              )}
            </Button>
          )}
        </div>
        
        {/* Skip action */}
        {showSkip && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="min-h-[2.75rem] text-xs sm:text-sm text-muted-foreground hover:text-foreground px-3 truncate max-w-xs"
              data-testid="button-skip"
            >
              <span className="truncate">{skipLabel}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}