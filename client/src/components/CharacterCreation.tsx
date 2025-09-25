import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Wand2, 
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Dice6,
  Upload,
  Image
} from "lucide-react";
import CharacterQuestionnaire, { type CharacterQuestionnaireResults } from "./CharacterQuestionnaire";
import AbilityScoreRoller, { type AbilityScores } from "./AbilityScoreRoller";
import CharacterTemplates from "./CharacterTemplates";
import MobileStepLayout from "./MobileStepLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CharacterCreationProps {
  onComplete: (character: CharacterData) => void;
  onBack: () => void;
  className?: string;
}

interface CharacterData {
  name: string;
  appearance: string;
  backstory: string;
  portraitUrl?: string;
  race?: string;
  class?: string;
  abilities?: AbilityScores;
  questionnaireResults?: CharacterQuestionnaireResults;
}

type CreationStep = "templates" | "basics" | "portrait" | "questionnaire" | "abilities";

export default function CharacterCreation({
  onComplete,
  onBack,
  className = ""
}: CharacterCreationProps) {
  const [currentStep, setCurrentStep] = useState<CreationStep>("templates");
  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    appearance: "",
    backstory: ""
  });
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBasicsSubmit = () => {
    if (character.name.trim() && character.appearance.trim() && character.backstory.trim()) {
      setCurrentStep("portrait");
    }
  };

  const generateRandomCharacter = () => {
    const randomNames = [
      "Aldric", "Lyra", "Theron", "Kira", "Gareth", "Nora", "Daven", "Zara",
      "Ren", "Mira", "Torin", "Sela", "Bran", "Vera", "Cade", "Iris"
    ];
    
    const randomAppearances = [
      "A tall figure with piercing blue eyes and silver hair that catches the light",
      "A sturdy build with warm brown eyes and auburn hair braided with leather cords",
      "An athletic frame with emerald green eyes and raven-black hair swept back",
      "A lean stature with golden amber eyes and honey-blonde hair adorned with small braids",
      "A compact build with deep violet eyes and copper-red hair that seems to glow",
      "A graceful figure with storm-grey eyes and platinum hair that flows like silk"
    ];
    
    const randomBackstories = [
      "Raised in a small mountain village, I learned the ways of survival from an early age. When mysterious creatures began threatening our home, I set out to discover the source and protect those I care about.",
      "Born into a family of traveling merchants, I've seen many lands and peoples. After witnessing an ancient evil stirring in the far reaches, I've decided to take up arms to prevent a coming darkness.",
      "Once a scholar in the great libraries, I discovered forbidden knowledge that changed everything. Now I seek to use what I've learned to right the wrongs of the past and forge a better future.",
      "Growing up on the streets taught me to be resourceful and quick-witted. When I stumbled upon a conspiracy that threatens the realm, I realized my unique skills could make all the difference.",
      "Trained from childhood in the sacred arts by my mentor, I was sent into the world when dark omens appeared. My mission is to find the source of this corruption and cleanse it before it spreads.",
      "After losing everything to a great catastrophe, I wandered the wilderness learning from hermits and wise creatures. Now I return to civilization with new purpose and ancient wisdom."
    ];

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomAppearance = randomAppearances[Math.floor(Math.random() * randomAppearances.length)];
    const randomBackstory = randomBackstories[Math.floor(Math.random() * randomBackstories.length)];

    setCharacter({
      name: randomName,
      appearance: randomAppearance,
      backstory: randomBackstory
    });
  };

  const generatePortrait = async () => {
    setIsGeneratingPortrait(true);
    try {
      const data = await apiRequest('POST', '/api/character/generate-portrait', {
        appearance: character.appearance,
        name: character.name,
      });

      setCharacter(prev => ({ 
        ...prev, 
        portraitUrl: data.url 
      }));
    } catch (error) {
      console.error('Failed to generate portrait:', error);
      // Leave portraitUrl empty to use AvatarFallback instead
      setCharacter(prev => ({ 
        ...prev, 
        portraitUrl: '' 
      }));
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setCharacter(prev => ({ 
        ...prev, 
        portraitUrl: objectUrl 
      }));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSkipBasics = () => {
    // Fill with default values and continue
    if (!character.name || !character.appearance || !character.backstory) {
      generateRandomCharacter();
    }
    setCurrentStep("portrait");
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "basics": return 1;
      case "portrait": return 2;
      case "questionnaire": return 3;
      case "abilities": return 4;
      default: return 1;
    }
  };

  const renderStepIndicator = () => (
    <div className="max-w-lg mx-auto mb-6">
      <div className="flex items-center justify-center space-x-2 mb-3">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${getStepNumber() === step ? 'bg-primary text-primary-foreground' : 
                getStepNumber() > step 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted text-muted-foreground'}
            `}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-8 h-0.5 mx-1 ${
                getStepNumber() > step 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Badge variant="secondary" className="text-xs">
          Step {getStepNumber()} of 4
        </Badge>
      </div>
    </div>
  );

  const renderBasicsStep = () => (
    <MobileStepLayout
      onBack={onBack}
      onSkip={handleSkipBasics}
      onContinue={handleBasicsSubmit}
      continueDisabled={!character.name.trim() || !character.appearance.trim() || !character.backstory.trim()}
      backLabel="Back to Menu"
      skipLabel="Use Defaults"
      continueLabel="Continue"
      showSkip={true}
    >
      {renderStepIndicator()}
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center pb-3">
          <CardTitle className="font-serif text-lg sm:text-xl flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Create Your Character
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tell us about your adventurer's identity and background
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="character-name" className="text-sm">Character Name</Label>
        <Input
          id="character-name"
          placeholder="Enter your character's name..."
          value={character.name}
          onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
          data-testid="input-character-name"
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="character-appearance" className="text-sm">Physical Appearance</Label>
        <Textarea
          id="character-appearance"
          placeholder="Describe what your character looks like. Be as detailed as you'd like - this will help generate your portrait!"
          value={character.appearance}
          onChange={(e) => setCharacter(prev => ({ ...prev, appearance: e.target.value }))}
          rows={2}
          data-testid="textarea-character-appearance"
          className="text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Example: "A tall elf with silver hair and piercing blue eyes, wearing a dark hooded cloak"
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="character-backstory" className="text-sm">Character Backstory</Label>
        <Textarea
          id="character-backstory"
          placeholder="What's your character's history? Where do they come from? What drives them to adventure?"
          value={character.backstory}
          onChange={(e) => setCharacter(prev => ({ ...prev, backstory: e.target.value }))}
          rows={2}
          data-testid="textarea-character-backstory"
          className="text-sm resize-none"
        />
      </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={generateRandomCharacter}
              className="w-full text-sm"
              data-testid="button-random-character"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Quick Start - Generate Random Character
            </Button>
          </div>
        </CardContent>
      </Card>
    </MobileStepLayout>
  );

  const handleSkipPortrait = () => {
    // Set a placeholder portrait URL or leave empty for AvatarFallback
    setCharacter(prev => ({ 
      ...prev, 
      portraitUrl: '' 
    }));
    setCurrentStep("questionnaire");
  };

  const renderPortraitStep = () => (
    <MobileStepLayout
      onBack={() => setCurrentStep(character.race ? "templates" : "basics")}
      onSkip={handleSkipPortrait}
      onContinue={() => setCurrentStep("questionnaire")}
      backLabel="Back"
      skipLabel="Use Default"
      continueLabel="Continue"
      showSkip={true}
    >
      {renderStepIndicator()}
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center pb-3">
          <CardTitle className="font-serif text-lg sm:text-xl flex items-center justify-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Generate Your Portrait
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create an AI-generated image of your character
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            {character.portraitUrl ? (
              <div className="space-y-3">
                <img
                  src={character.portraitUrl}
                  alt="Character Portrait"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg border-2 border-primary/20 object-cover"
                  data-testid="character-portrait"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={generatePortrait}
                    disabled={isGeneratingPortrait}
                    data-testid="button-regenerate-portrait"
                    className="text-xs"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                    Generate New
                  </Button>
                  <Button
                    variant="outline"
                    onClick={triggerFileUpload}
                    data-testid="button-upload-portrait"
                    className="text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Your Own
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/10">
                  {isGeneratingPortrait ? (
                    <div className="text-center">
                      <RefreshCw className="w-6 h-6 mx-auto animate-spin text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Generating portrait...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Character Portrait</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={generatePortrait}
                    disabled={isGeneratingPortrait}
                    className="w-full text-sm"
                    data-testid="button-generate-portrait"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                    Generate New Portrait
                  </Button>
                  <Button
                    variant="outline"
                    onClick={triggerFileUpload}
                    className="w-full text-sm"
                    data-testid="button-upload-portrait"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your Image
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Appearance Description:</h4>
            <p className="text-sm text-muted-foreground">"{character.appearance}"</p>
          </div>

          {/* Hidden file input for portrait upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="file-input-portrait"
          />

        </CardContent>
      </Card>
    </MobileStepLayout>
  );

  const handleTemplateSelect = (template: any) => {
    // Convert template to character data format and skip to portrait step
    setCharacter({
      name: template.name,
      appearance: template.appearance,
      backstory: template.backstory,
      race: template.race,
      class: template.class,
      abilities: template.abilities
    });
    setCurrentStep("portrait");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "templates":
        return (
          <CharacterTemplates
            onSelectTemplate={handleTemplateSelect}
            onCreateCustom={() => setCurrentStep("basics")}
            onBack={onBack}
          />
        );
      case "basics":
        return renderBasicsStep();
      case "portrait":
        return renderPortraitStep();
      case "questionnaire":
        return (
          <CharacterQuestionnaire
            character={character}
            onComplete={(results) => {
              setCharacter(prev => ({ 
                ...prev, 
                race: results.suggestedRace,
                class: results.suggestedClass,
                questionnaireResults: results
              }));
              setCurrentStep("abilities");
            }}
            onBack={() => setCurrentStep("portrait")}
            onSkip={() => {
              // Skip with default results
              setCharacter(prev => ({ 
                ...prev, 
                race: "Human",
                class: "Fighter",
                questionnaireResults: {
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
                }
              }));
              setCurrentStep("abilities");
            }}
          />
        );
      case "abilities":
        return (
          <AbilityScoreRoller
            character={character}
            suggestedAbilities={character.abilities || character.questionnaireResults?.suggestedAbilities || {
              strength: 10, dexterity: 10, constitution: 10,
              intelligence: 10, wisdom: 10, charisma: 10
            }}
            onComplete={async (abilities) => {
              const finalCharacter = {
                ...character,
                abilities
              };
              
              // Save character to backend
              try {
                await apiRequest('POST', '/api/character', {
                  name: finalCharacter.name,
                  class: finalCharacter.class || 'Fighter',
                  level: 1,
                  experience: 0,
                  strength: abilities.strength,
                  dexterity: abilities.dexterity,
                  constitution: abilities.constitution,
                  intelligence: abilities.intelligence,
                  wisdom: abilities.wisdom,
                  charisma: abilities.charisma,
                  maxHealth: 10 + Math.floor((abilities.constitution - 10) / 2),
                  currentHealth: 10 + Math.floor((abilities.constitution - 10) / 2),
                  maxMana: abilities.intelligence > 12 ? 5 + Math.floor((abilities.intelligence - 10) / 2) : 0,
                  currentMana: abilities.intelligence > 12 ? 5 + Math.floor((abilities.intelligence - 10) / 2) : 0
                });
                
                // Invalidate character query to refresh data
                queryClient.invalidateQueries({ queryKey: ['/api/character'] });
                
                onComplete(finalCharacter);
              } catch (error) {
                console.error('Failed to save character:', error);
                // Still call onComplete to proceed, character data is in memory
                onComplete(finalCharacter);
              }
            }}
            onBack={() => setCurrentStep("questionnaire")}
            onSkip={async () => {
              // Skip with suggested abilities and save character
              const suggestedAbilities = character.questionnaireResults?.suggestedAbilities || {
                strength: 14,
                dexterity: 13,
                constitution: 15,
                intelligence: 12,
                wisdom: 13,
                charisma: 11
              };
              
              const finalCharacter = {
                ...character,
                abilities: suggestedAbilities
              };
              
              // Save character to backend
              try {
                await apiRequest('POST', '/api/character', {
                  name: finalCharacter.name,
                  class: finalCharacter.class || 'Fighter',
                  level: 1,
                  experience: 0,
                  strength: suggestedAbilities.strength,
                  dexterity: suggestedAbilities.dexterity,
                  constitution: suggestedAbilities.constitution,
                  intelligence: suggestedAbilities.intelligence,
                  wisdom: suggestedAbilities.wisdom,
                  charisma: suggestedAbilities.charisma,
                  maxHealth: 10 + Math.floor((suggestedAbilities.constitution - 10) / 2),
                  currentHealth: 10 + Math.floor((suggestedAbilities.constitution - 10) / 2),
                  maxMana: suggestedAbilities.intelligence > 12 ? 5 + Math.floor((suggestedAbilities.intelligence - 10) / 2) : 0,
                  currentMana: suggestedAbilities.intelligence > 12 ? 5 + Math.floor((suggestedAbilities.intelligence - 10) / 2) : 0
                });
                
                // Invalidate character query to refresh data
                queryClient.invalidateQueries({ queryKey: ['/api/character'] });
                
                onComplete(finalCharacter);
              } catch (error) {
                console.error('Failed to save character:', error);
                // Still call onComplete to proceed, character data is in memory
                onComplete(finalCharacter);
              }
            }}
          />
        );
      default:
        return renderBasicsStep();
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground p-4 ${className}`}>
      {/* Progress indicator - show for all steps */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          {["templates", "basics", "portrait", "questionnaire", "abilities"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${currentStep === step ? 'bg-primary text-primary-foreground' : 
                  ["templates", "basics", "portrait", "questionnaire", "abilities"].indexOf(currentStep) > index 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'}
              `}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-6 h-0.5 mx-1 ${
                  ["templates", "basics", "portrait", "questionnaire", "abilities"].indexOf(currentStep) > index 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            Step {["templates", "basics", "portrait", "questionnaire", "abilities"].indexOf(currentStep) + 1} of 5
          </Badge>
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  );
}