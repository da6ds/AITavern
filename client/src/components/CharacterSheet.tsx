import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatDisplay from "./StatDisplay";
import HealthBar from "./HealthBar";
import type { Character } from "@shared/schema";
import { analytics } from "@/lib/posthog";

interface CharacterSheetProps {
  character: Character;
  className?: string;
}

export default function CharacterSheet({ character, className = "" }: CharacterSheetProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(character.name);
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: async (newName: string) => {
      console.log('[CharacterSheet] Updating character name', {
        oldName: character.name,
        newName
      });
      const response = await fetch(`/api/character/${character.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update name');
      return response.json();
    },
    onSuccess: (data, newName) => {
      console.log('[CharacterSheet] Character name updated successfully');
      analytics.characterNameEdited(character.name, newName);
      queryClient.invalidateQueries({ queryKey: ['/api/character'] });
      setIsEditingName(false);
    },
    onError: (error) => {
      console.error('[CharacterSheet] Failed to update character name:', error);
      analytics.errorOccurred('character_name_update_error', error instanceof Error ? error.message : 'Unknown error');
    }
  });

  const handleSaveName = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== character.name) {
      console.log('[CharacterSheet] Save name button clicked');
      analytics.buttonClicked('Save Character Name', 'Character Sheet', {
        old_name: character.name,
        new_name: trimmedName
      });
      updateNameMutation.mutate(trimmedName);
    } else {
      console.log('[CharacterSheet] Name unchanged, cancelling edit');
      setIsEditingName(false);
      setEditedName(character.name);
    }
  };

  const handleCancelEdit = () => {
    console.log('[CharacterSheet] Cancel name edit button clicked');
    analytics.buttonClicked('Cancel Name Edit', 'Character Sheet');
    setIsEditingName(false);
    setEditedName(character.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`${className}`} data-testid="character-sheet">
      {/* Single Combined Card for Mobile Optimization */}
      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-4">
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2">
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-serif text-xl sm:text-2xl text-primary text-center max-w-xs"
                autoFocus
                disabled={updateNameMutation.isPending}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveName}
                disabled={updateNameMutation.isPending}
                className="h-9 w-9 p-0 min-w-[44px] min-h-[44px]"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={updateNameMutation.isPending}
                className="h-9 w-9 p-0 min-w-[44px] min-h-[44px]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="font-serif text-xl sm:text-2xl text-primary">{character.name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  console.log('[CharacterSheet] Edit name button clicked');
                  analytics.buttonClicked('Edit Character Name', 'Character Sheet');
                  setIsEditingName(true);
                }}
                className="h-9 w-9 p-0 min-w-[44px] min-h-[44px]"
                data-testid="edit-name-button"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="secondary" data-testid="character-class">{character.class}</Badge>
            <Badge variant="outline" data-testid="character-level">Level {character.level}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Health and Mana */}
          <div className="space-y-2">
            <HealthBar
              current={character.currentHealth}
              max={character.maxHealth}
              type="health"
            />
            {character.maxMana > 0 && (
              <HealthBar
                current={character.currentMana}
                max={character.maxMana}
                type="mana"
              />
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Experience</span>
              <span className="text-sm text-muted-foreground">{character.experience} XP</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((character.experience % 100) / 100) * 100}%` }}
                data-testid="experience-progress"
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {character.experience % 100}/100 to level {character.level + 1}
            </div>
          </div>

          {/* Ability Scores - Compact mobile layout */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 text-foreground">Ability Scores</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatDisplay label="STR" value={character.strength} />
              <StatDisplay label="DEX" value={character.dexterity} />
              <StatDisplay label="CON" value={character.constitution} />
              <StatDisplay label="INT" value={character.intelligence} />
              <StatDisplay label="WIS" value={character.wisdom} />
              <StatDisplay label="CHA" value={character.charisma} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}