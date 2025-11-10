import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, HelpCircle, Settings, Sword, Scroll, Dice6, ScrollText, Package, UserPlus, Map } from "lucide-react";

interface StartMenuProps {
  onStartGame: () => void;
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-6">
      {/* Hero Section - Compact */}
      <div className="text-center mb-4">
        <div className="mb-2 relative h-12">
          <Sword className="w-12 h-12 mx-auto text-primary absolute left-1/2 -translate-x-1/2 top-0" />
          <Scroll className="w-8 h-8 mx-auto text-accent absolute left-1/2 -translate-x-1/2 top-0 translate-x-4 translate-y-2" />
        </div>
        <h1 className="font-serif text-3xl text-primary mb-1" data-testid="game-title">
          AI Dungeon Master
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Embark on epic adventures powered by artificial intelligence. Your story awaits.
        </p>
      </div>

      {/* Main Menu Cards - Compact Grid Layout */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Continue Adventure - Full Width on Mobile, Left on Desktop */}
          <Card className="p-4 hover-elevate md:col-span-2">
            <Button 
              onClick={onStartGame}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-start-game"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Adventure
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Resume your current quest and continue your journey
            </p>
          </Card>

          {/* Create Character */}
          <Card className="p-4 hover-elevate">
            <Button 
              variant="outline"
              onClick={onCreateCharacter}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-create-character"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create New Character
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Design your adventurer with AI-generated portrait
            </p>
          </Card>

          {/* Adventure Templates */}
          <Card className="p-4 hover-elevate">
            <Button 
              variant="outline"
              onClick={onShowAdventureTemplates}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-adventure-templates"
            >
              <Map className="w-5 h-5 mr-2" />
              Adventure Templates
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Choose from preset adventures in familiar worlds
            </p>
          </Card>

          {/* New Player Guide */}
          <Card className="p-4 hover-elevate">
            <Button 
              variant="outline"
              onClick={onShowGuide}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-show-guide"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              New Player Guide
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Learn the basics of tabletop RPG adventures
            </p>
          </Card>

          {/* Settings - Optional */}
          {onShowSettings && (
            <Card className="p-4 hover-elevate md:col-span-1">
              <Button 
                variant="ghost"
                onClick={onShowSettings}
                className="w-full h-12 text-base"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Card>
          )}
        </div>

        {/* Game Features - Compact */}
        <div className="grid grid-cols-4 gap-2 w-full">
          <div className="text-center">
            <Badge variant="secondary" className="mb-1 text-xs px-2 py-1 flex items-center justify-center gap-1">
              <Dice6 className="w-3 h-3" /> Smart AI
            </Badge>
            <p className="text-[10px] text-muted-foreground">Dynamic storytelling</p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1 text-xs px-2 py-1 flex items-center justify-center gap-1">
              <Sword className="w-3 h-3" /> Combat
            </Badge>
            <p className="text-[10px] text-muted-foreground">Turn-based battles</p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1 text-xs px-2 py-1 flex items-center justify-center gap-1">
              <ScrollText className="w-3 h-3" /> Quests
            </Badge>
            <p className="text-[10px] text-muted-foreground">Epic adventures</p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1 text-xs px-2 py-1 flex items-center justify-center gap-1">
              <Package className="w-3 h-3" /> Inventory
            </Badge>
            <p className="text-[10px] text-muted-foreground">Collect & manage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
