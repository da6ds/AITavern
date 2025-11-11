import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Sparkles, ArrowLeft } from "lucide-react";

interface SimpleCharacterCreationProps {
  onComplete: (characterData: {
    name: string;
    description: string;
    backstory: string;
  }) => void;
  onBack: () => void;
  className?: string;
}

export default function SimpleCharacterCreation({
  onComplete,
  onBack,
  className = ""
}: SimpleCharacterCreationProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [backstory, setBackstory] = useState("");

  const isValid = name.trim().length > 0 &&
                  description.trim().length > 10 &&
                  backstory.trim().length > 10;

  const handleSubmit = () => {
    if (isValid) {
      onComplete({
        name: name.trim(),
        description: description.trim(),
        backstory: backstory.trim()
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${className}`}>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Create Your Character</CardTitle>
          <p className="text-muted-foreground text-base">
            Tell us about your character. Your story will shape the entire world.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Character Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Fuzz the Lint Ball, Sir Gregory, Luna..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base py-6"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              What do people call you?
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., A small ball of lint with tiny legs and hopeful eyes, I'm made of soft gray fibers from forgotten clothes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-base min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>What do you look like? What makes you unique?</span>
              <span className={description.length > 450 ? "text-amber-500" : ""}>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Backstory Field */}
          <div className="space-y-2">
            <Label htmlFor="backstory" className="text-base font-semibold">
              Backstory
            </Label>
            <Textarea
              id="backstory"
              placeholder="e.g., I was separated from my lint family when a gust of wind blew me out of the dryer. I've been wandering the laundry room ever since, searching for my way back home..."
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="text-base min-h-[160px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>What's your story? What are you trying to accomplish?</span>
              <span className={backstory.length > 950 ? "text-amber-500" : ""}>
                {backstory.length}/1000
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Your world will be generated from this</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A whimsical character gets a whimsical world. A dark character gets a dark world.
                  The NPCs, quests, items, and entire universe will match your character's vibe.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 py-6 text-base font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My World
            </Button>
          </div>

          {!isValid && (name || description || backstory) && (
            <p className="text-xs text-center text-muted-foreground">
              Fill out all fields to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
