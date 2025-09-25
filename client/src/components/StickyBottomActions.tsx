import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

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
    <div className={`sticky bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border ${className}`}>
      {/* Safe area padding for mobile notches */}
      <div className="px-4 py-3 pb-safe space-y-3">
        {/* Primary action row */}
        <div className="flex gap-3">
          {showBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 min-h-[2.75rem] text-sm"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          )}
          
          {showContinue && (
            <Button
              onClick={onContinue}
              disabled={continueDisabled}
              className="flex-1 min-h-[2.75rem] text-sm bg-gradient-to-r from-amber-600 to-green-600 hover:from-amber-700 hover:to-green-700"
              data-testid="button-continue"
            >
              {continueLabel}
              {continueLabel.includes("Start") || continueLabel.includes("Play") ? (
                <Play className="w-4 h-4 ml-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
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
              className="min-h-[2.75rem] text-sm text-muted-foreground hover:text-foreground"
              data-testid="button-skip"
            >
              {skipLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}