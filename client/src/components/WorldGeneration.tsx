import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Globe, Users, Map, Scroll } from "lucide-react";

interface WorldGenerationProps {
  characterName: string;
  onComplete?: () => void;
}

const generationSteps = [
  {
    icon: Globe,
    message: "Analyzing your character...",
    subtext: "Understanding your unique story",
    duration: 2000
  },
  {
    icon: Map,
    message: "Building your world...",
    subtext: "Creating a universe that matches your vibe",
    duration: 3000
  },
  {
    icon: Users,
    message: "Populating with characters...",
    subtext: "Bringing NPCs to life",
    duration: 2500
  },
  {
    icon: Scroll,
    message: "Generating your first quest...",
    subtext: "Crafting your opening adventure",
    duration: 2500
  }
];

export default function WorldGeneration({ characterName, onComplete }: WorldGenerationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation - goes to 90% then waits for completion
    const interval = 50; // Update every 50ms
    const incrementPerTick = 0.5; // Slower increment

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + incrementPerTick;
        // Stop at 90% and wait for actual completion
        if (next >= 90) {
          return 90;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    // Cycle through step messages for visual feedback
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % generationSteps.length);
    }, 2500);

    return () => clearInterval(stepInterval);
  }, []);

  const currentStep = generationSteps[currentStepIndex];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-2xl border-primary/20 shadow-xl">
        <CardContent className="pt-12 pb-10 px-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Creating Your World</h2>
            <p className="text-muted-foreground">
              Generating a unique universe for <span className="text-foreground font-semibold">{characterName}</span>
            </p>
          </div>

          {/* Current Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <div className="p-3 bg-background rounded-full">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-lg">{currentStep.message}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentStep.subtext}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {generationSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/20"
                      : isComplete
                      ? "bg-muted/50 opacity-60"
                      : "opacity-30"
                  }`}
                >
                  <div className={`p-2 rounded-full ${isCurrent ? "bg-primary/20" : "bg-muted"}`}>
                    <StepIcon className={`w-4 h-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.message}
                    </p>
                  </div>
                  {isComplete && (
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground italic">
              This may take a moment as we craft your unique adventure...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
