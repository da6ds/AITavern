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
      const response = await fetch(`/api/character/${character.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update name');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/character'] });
      setIsEditingName(false);
    },
  });

  const handleSaveName = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== character.name) {
      updateNameMutation.mutate(trimmedName);
    } else {
      setIsEditingName(false);
      setEditedName(character.name);
    }
  };

  const handleCancelEdit = () => {
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
    <div className={`space-y-4 ${className}`} data-testid="character-sheet">
      {/* Character Header */}
      <Card>
        <CardHeader className="text-center">
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2">
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-serif text-2xl text-primary text-center max-w-xs"
                autoFocus
                disabled={updateNameMutation.isPending}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveName}
                disabled={updateNameMutation.isPending}
                className="h-8 w-8 p-0"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={updateNameMutation.isPending}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="font-serif text-2xl text-primary">{character.name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
                className="h-8 w-8 p-0"
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
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Ability Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Ability Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatDisplay label="STR" value={character.strength} />
            <StatDisplay label="DEX" value={character.dexterity} />
            <StatDisplay label="CON" value={character.constitution} />
            <StatDisplay label="INT" value={character.intelligence} />
            <StatDisplay label="WIS" value={character.wisdom} />
            <StatDisplay label="CHA" value={character.charisma} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}