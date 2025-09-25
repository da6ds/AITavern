import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import StickyBottomActions from "./StickyBottomActions";
import { 
  Dice6, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Plus,
  Minus
} from "lucide-react";

interface AbilityScoreRollerProps {
  character: {
    name: string;
    appearance: string;
    backstory: string;
    portraitUrl?: string;
    race?: string;
    class?: string;
  };
  suggestedAbilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  onComplete: (abilities: AbilityScores) => void;
  onBack: () => void;
  onSkip?: () => void;
  className?: string;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const ABILITY_NAMES = {
  strength: "Strength",
  dexterity: "Dexterity", 
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma"
} as const;

const ABILITY_DESCRIPTIONS = {
  strength: "Physical power and muscle",
  dexterity: "Agility and reflexes",
  constitution: "Health and stamina",
  intelligence: "Reasoning and memory",
  wisdom: "Perception and insight",
  charisma: "Force of personality"
} as const;

// Point buy system - total of 72 points to distribute
const TOTAL_POINTS = 72;
const MIN_ABILITY = 8;
const MAX_ABILITY = 18;

export default function AbilityScoreRoller({
  character,
  suggestedAbilities,
  onComplete,
  onBack,
  onSkip,
  className = ""
}: AbilityScoreRollerProps) {
  const [abilities, setAbilities] = useState<AbilityScores>(suggestedAbilities);
  const [method, setMethod] = useState<"suggested" | "manual" | "random">("suggested");

  const handleSkipWithSuggested = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Use the suggested abilities as defaults
      onComplete(suggestedAbilities);
    }
  };

  const getCurrentTotal = () => {
    return Object.values(abilities).reduce((sum, score) => sum + score, 0);
  };

  const getPointsRemaining = () => {
    return TOTAL_POINTS - getCurrentTotal();
  };

  const rollRandomAbilities = () => {
    const rolled: AbilityScores = {
      strength: rollAbilityScore(),
      dexterity: rollAbilityScore(),
      constitution: rollAbilityScore(),
      intelligence: rollAbilityScore(),
      wisdom: rollAbilityScore(),
      charisma: rollAbilityScore()
    };
    setAbilities(rolled);
    setMethod("random");
  };

  const rollAbilityScore = () => {
    // Roll 4d6, drop lowest
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  };

  const adjustAbility = (ability: keyof AbilityScores, delta: number) => {
    const newValue = abilities[ability] + delta;
    
    if (newValue < MIN_ABILITY || newValue > MAX_ABILITY) return;
    
    const newAbilities = { ...abilities, [ability]: newValue };
    const newTotal = Object.values(newAbilities).reduce((sum, score) => sum + score, 0);
    
    if (newTotal <= TOTAL_POINTS) {
      setAbilities(newAbilities);
      setMethod("manual");
    }
  };

  const getAbilityModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const resetToSuggested = () => {
    setAbilities(suggestedAbilities);
    setMethod("suggested");
  };

  const canIncrease = (ability: keyof AbilityScores) => {
    return abilities[ability] < MAX_ABILITY && getPointsRemaining() > 0;
  };

  const canDecrease = (ability: keyof AbilityScores) => {
    return abilities[ability] > MIN_ABILITY;
  };

  return (
    <>
      <div className={`min-h-screen bg-background text-foreground p-4 pb-32 ${className}`}>
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl flex items-center justify-center gap-2">
              <Dice6 className="w-6 h-6 text-primary" />
              Ability Scores
            </CardTitle>
            <p className="text-muted-foreground">
              Set your character's core abilities that determine their strengths
            </p>
          </CardHeader>
        </Card>

        {/* Method Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant={method === "suggested" ? "default" : "outline"}
                onClick={resetToSuggested}
                className="h-auto p-4"
                data-testid="button-suggested-abilities"
              >
                <div className="text-center">
                  <div className="font-medium">Use Suggested</div>
                  <div className="text-xs text-muted-foreground">Based on your answers</div>
                </div>
              </Button>
              
              <Button
                variant={method === "manual" ? "default" : "outline"}
                onClick={() => setMethod("manual")}
                className="h-auto p-4"
                data-testid="button-manual-abilities"
              >
                <div className="text-center">
                  <div className="font-medium">Point Buy</div>
                  <div className="text-xs text-muted-foreground">Customize manually</div>
                </div>
              </Button>

              <Button
                variant={method === "random" ? "default" : "outline"}
                onClick={rollRandomAbilities}
                className="h-auto p-4"
                data-testid="button-roll-abilities"
              >
                <div className="text-center">
                  <div className="font-medium">Roll Dice</div>
                  <div className="text-xs text-muted-foreground">Random generation</div>
                </div>
              </Button>
            </div>

            {method === "manual" && (
              <div className="mt-4 text-center">
                <Badge variant={getPointsRemaining() === 0 ? "default" : "secondary"}>
                  {getPointsRemaining()} points remaining
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ability Scores */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Object.entries(abilities).map(([ability, score]) => (
                <div key={ability} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{ABILITY_NAMES[ability as keyof typeof ABILITY_NAMES]}</div>
                    <div className="text-sm text-muted-foreground">
                      {ABILITY_DESCRIPTIONS[ability as keyof typeof ABILITY_DESCRIPTIONS]}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {method === "manual" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustAbility(ability as keyof AbilityScores, -1)}
                          disabled={!canDecrease(ability as keyof AbilityScores)}
                          className="h-8 w-8 p-0"
                          data-testid={`button-decrease-${ability}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustAbility(ability as keyof AbilityScores, 1)}
                          disabled={!canIncrease(ability as keyof AbilityScores)}
                          className="h-8 w-8 p-0"
                          data-testid={`button-increase-${ability}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="text-center min-w-[60px]">
                      <div className="text-2xl font-bold">{score}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatModifier(getAbilityModifier(score))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {method === "random" && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={rollRandomAbilities}
                  data-testid="button-reroll-abilities"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Roll Again
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
      
    <StickyBottomActions
      onBack={onBack}
      onSkip={handleSkipWithSuggested}
      onContinue={() => onComplete(abilities)}
      continueDisabled={method === "manual" && getPointsRemaining() !== 0}
      backLabel="Back to Questionnaire"
      skipLabel="Use Suggested"
      continueLabel="Create Character"
      data-testid="character-abilities-actions"
    />
  </>
  );
}