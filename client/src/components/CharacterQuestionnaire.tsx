import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StickyBottomActions from "./StickyBottomActions";
import { 
  HelpCircle, 
  ArrowRight,
  ArrowLeft,
  Wand2,
  Sword,
  Shield,
  Zap,
  Heart,
  Brain,
  Eye,
  Users
} from "lucide-react";

interface CharacterQuestionnaireProps {
  character: {
    name: string;
    appearance: string;
    backstory: string;
    portraitUrl?: string;
  };
  onComplete: (results: CharacterQuestionnaireResults) => void;
  onBack: () => void;
  onSkip?: () => void;
  className?: string;
}

export interface CharacterQuestionnaireResults {
  suggestedRace: string;
  suggestedClass: string;
  suggestedAbilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

type QuestionnaireStep = "size" | "magic" | "combat" | "social" | "skills" | "summary";

const questions = {
  size: {
    title: "Physical Build",
    question: "How would you describe your character's physical stature?",
    options: [
      { id: "tall", label: "Tall and imposing", icon: <Sword className="w-4 h-4" /> },
      { id: "average", label: "Average height", icon: <Users className="w-4 h-4" /> },
      { id: "short", label: "Short and nimble", icon: <Zap className="w-4 h-4" /> },
      { id: "doesnt-matter", label: "Doesn't matter to me", icon: <HelpCircle className="w-4 h-4" /> }
    ]
  },
  magic: {
    title: "Magic Affinity",
    question: "What's your character's relationship with magic?",
    options: [
      { id: "caster", label: "Born with magical talent", icon: <Wand2 className="w-4 h-4" /> },
      { id: "learn", label: "Will learn magic eventually", icon: <Brain className="w-4 h-4" /> },
      { id: "avoid", label: "Prefers to avoid magic", icon: <Sword className="w-4 h-4" /> },
      { id: "doesnt-matter", label: "No preference", icon: <HelpCircle className="w-4 h-4" /> }
    ]
  },
  combat: {
    title: "Combat Style",
    question: "How does your character approach battle?",
    options: [
      { id: "frontline", label: "Charges into the thick of battle", icon: <Sword className="w-4 h-4" /> },
      { id: "support", label: "Provides support from behind", icon: <Shield className="w-4 h-4" /> },
      { id: "ranged", label: "Attacks from a distance", icon: <Zap className="w-4 h-4" /> },
      { id: "balanced", label: "Adapts to the situation", icon: <Eye className="w-4 h-4" /> }
    ]
  },
  social: {
    title: "Social Nature",
    question: "How does your character interact with others?",
    options: [
      { id: "leader", label: "Natural born leader", icon: <Users className="w-4 h-4" /> },
      { id: "charming", label: "Charming and persuasive", icon: <Heart className="w-4 h-4" /> },
      { id: "observant", label: "Quiet but observant", icon: <Eye className="w-4 h-4" /> },
      { id: "direct", label: "Direct and honest", icon: <Sword className="w-4 h-4" /> }
    ]
  },
  skills: {
    title: "Natural Talents",
    question: "What comes most naturally to your character?",
    options: [
      { id: "physical", label: "Physical prowess and strength", icon: <Sword className="w-4 h-4" /> },
      { id: "mental", label: "Intelligence and problem-solving", icon: <Brain className="w-4 h-4" /> },
      { id: "social", label: "People skills and charisma", icon: <Heart className="w-4 h-4" /> },
      { id: "intuitive", label: "Instincts and wisdom", icon: <Eye className="w-4 h-4" /> }
    ]
  }
};

const stepOrder: QuestionnaireStep[] = ["size", "magic", "combat", "social", "skills", "summary"];

export default function CharacterQuestionnaire({
  character,
  onComplete,
  onBack,
  onSkip,
  className = ""
}: CharacterQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState<QuestionnaireStep>("size");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleSkipWithDefaults = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Provide default results
      const defaultResults: CharacterQuestionnaireResults = {
        suggestedRace: "Human",
        suggestedClass: "Fighter", 
        suggestedAbilities: {
          strength: 14,
          dexterity: 13,
          constitution: 15,
          intelligence: 12,
          wisdom: 13,
          charisma: 11
        }
      };
      onComplete(defaultResults);
    }
  };

  const goBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const generateResults = (): CharacterQuestionnaireResults => {
    // Simple logic to suggest race and class based on answers
    let suggestedRace = "Human";
    let suggestedClass = "Fighter";
    
    // Race suggestions based on size and magic affinity
    if (answers.size === "tall" && answers.magic === "avoid") {
      suggestedRace = "Human";
    } else if (answers.size === "short" && answers.magic === "caster") {
      suggestedRace = "Halfling";
    } else if (answers.magic === "caster") {
      suggestedRace = "Elf";
    } else if (answers.size === "short") {
      suggestedRace = "Dwarf";
    }

    // Class suggestions based on combat and magic
    if (answers.magic === "caster") {
      suggestedClass = "Wizard";
    } else if (answers.combat === "support" && answers.magic === "learn") {
      suggestedClass = "Cleric";
    } else if (answers.combat === "ranged") {
      suggestedClass = "Ranger";
    } else if (answers.social === "charming") {
      suggestedClass = "Bard";
    } else if (answers.combat === "frontline") {
      suggestedClass = "Fighter";
    } else {
      suggestedClass = "Rogue";
    }

    // Generate ability scores based on class and answers
    const baseAbilities = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    };

    // Boost abilities based on suggested class
    switch (suggestedClass) {
      case "Fighter":
        baseAbilities.strength += 4;
        baseAbilities.constitution += 2;
        break;
      case "Wizard":
        baseAbilities.intelligence += 4;
        baseAbilities.wisdom += 2;
        break;
      case "Ranger":
        baseAbilities.dexterity += 4;
        baseAbilities.wisdom += 2;
        break;
      case "Cleric":
        baseAbilities.wisdom += 4;
        baseAbilities.constitution += 2;
        break;
      case "Bard":
        baseAbilities.charisma += 4;
        baseAbilities.dexterity += 2;
        break;
      case "Rogue":
        baseAbilities.dexterity += 4;
        baseAbilities.intelligence += 2;
        break;
    }

    // Minor adjustments based on specific answers
    if (answers.skills === "physical") baseAbilities.strength += 1;
    if (answers.skills === "mental") baseAbilities.intelligence += 1;
    if (answers.skills === "social") baseAbilities.charisma += 1;
    if (answers.skills === "intuitive") baseAbilities.wisdom += 1;

    return {
      suggestedRace,
      suggestedClass,
      suggestedAbilities: baseAbilities
    };
  };

  const renderQuestion = () => {
    if (currentStep === "summary") {
      const results = generateResults();
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6 text-primary" />
              Character Recommendations
            </CardTitle>
            <p className="text-muted-foreground">
              Based on your answers, here's what we suggest for your character
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Suggested Race</h3>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {results.suggestedRace}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Suggested Class</h3>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {results.suggestedClass}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 text-center">Ability Scores</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(results.suggestedAbilities).map(([ability, score]) => (
                    <div key={ability} className="text-center">
                      <div className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                        {ability.slice(0, 3)}
                      </div>
                      <div className="text-2xl font-bold text-primary">{score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Replace with StickyBottomActions for summary step */}
          </CardContent>
        </Card>
      );
    }

    const questionData = questions[currentStep];
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {questionData.title}
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            {questionData.question}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {questionData.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => handleAnswer(option.id)}
                className="h-auto p-4 justify-start text-left"
                data-testid={`button-answer-${option.id}`}
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Replace with StickyBottomActions for question steps */}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className={`min-h-screen bg-background text-foreground p-4 pb-32 ${className}`}>
        {/* Progress indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {stepOrder.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep === step ? 'bg-primary text-primary-foreground' : 
                    stepOrder.indexOf(currentStep) > index 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                {index < stepOrder.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    stepOrder.indexOf(currentStep) > index 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              {currentStep === "summary" ? "Review" : `Question ${stepOrder.indexOf(currentStep) + 1} of ${stepOrder.length}`}
            </Badge>
          </div>
        </div>

        {renderQuestion()}
      </div>
      
      <StickyBottomActions
        onBack={goBack}
        onSkip={handleSkipWithDefaults}
        onContinue={currentStep === "summary" ? () => onComplete(generateResults()) : undefined}
        backLabel={currentStep === "size" ? "Back to Character" : "Back"}
        skipLabel="Use Defaults"
        continueLabel={currentStep === "summary" ? "Continue with These" : undefined}
        data-testid="character-questionnaire-actions"
      />
    </>
  );
}