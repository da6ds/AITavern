import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Settings, Sword, Scroll, UserPlus, Map } from "lucide-react";
import MultipleAdventures from "./MultipleAdventures";

interface StartMenuProps {
  onStartGame: (campaignId: string) => void;
  onShowGuide: () => void;
  onCreateCharacter: () => void;
  onShowAdventureTemplates: () => void;
  onShowSettings?: () => void;
}

export default function StartMenu({ 
  onStartGame, 
  onShowGuide, 
  onCreateCharacter,
  onShowAdventureTemplates,
  onShowSettings 
}: StartMenuProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <Sword className="w-16 h-16 mx-auto text-primary mb-2" />
          <Scroll className="w-12 h-12 mx-auto text-accent -mt-8 ml-8" />
        </div>
        <h1 className="font-serif text-4xl text-primary mb-2" data-testid="game-title">
          AI Dungeon Master
        </h1>
        <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
          Embark on epic adventures powered by artificial intelligence. Your story awaits.
        </p>
      </div>

      {/* Main Menu Cards */}
      <div className="w-full max-w-sm space-y-4">
        <MultipleAdventures 
          onContinueAdventure={onStartGame}
          onCreateNew={onCreateCharacter}
        />

        <Card className="p-6 hover-elevate">
          <Button 
            variant="outline"
            onClick={onCreateCharacter}
            className="w-full h-16 text-lg font-semibold"
            data-testid="button-create-character"
          >
            <UserPlus className="w-6 h-6 mr-3" />
            Create New Character
          </Button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Design your adventurer with AI-generated portrait
          </p>
        </Card>

        <Card className="p-6 hover-elevate">
          <Button 
            variant="outline"
            onClick={onShowAdventureTemplates}
            className="w-full h-16 text-lg font-semibold"
            data-testid="button-adventure-templates"
          >
            <Map className="w-6 h-6 mr-3" />
            Adventure Templates
          </Button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Choose from preset adventures in familiar worlds
          </p>
        </Card>

        <Card className="p-6 hover-elevate">
          <Button 
            variant="outline"
            onClick={onShowGuide}
            className="w-full h-16 text-lg font-semibold"
            data-testid="button-show-guide"
          >
            <HelpCircle className="w-6 h-6 mr-3" />
            New Player Guide
          </Button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Learn the basics of tabletop RPG adventures
          </p>
        </Card>

        {onShowSettings && (
          <Card className="p-6 hover-elevate">
            <Button 
              variant="ghost"
              onClick={onShowSettings}
              className="w-full h-12 text-base"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
          </Card>
        )}
      </div>

    </div>
  );
}