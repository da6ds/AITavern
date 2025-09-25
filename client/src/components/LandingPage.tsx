import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gamepad2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [, setLocation] = useLocation();
  const [demoMode, setDemoMode] = useState(false);
  const [isStartingDemo, setIsStartingDemo] = useState(false);

  // Check if demo mode is enabled
  const { data: demoStatus, isLoading: isDemoStatusLoading } = useQuery<{enabled: boolean}>({
    queryKey: ['/api/demo/status'],
    enabled: true,
  });

  const handleStartDemo = async () => {
    try {
      setIsStartingDemo(true);
      const response = await apiRequest('POST', '/api/demo/start');
      if (response.ok) {
        // Force a page reload to trigger authentication check with demo session
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to start demo mode:', error);
    } finally {
      setIsStartingDemo(false);
    }
  };

  const handleMainCTA = () => {
    if (demoMode) {
      handleStartDemo();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 dark:from-amber-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-green-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-green-700 bg-clip-text text-transparent">
              Skunk Tales
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Embark on magical adventures with your AI-powered companion. 
            Create characters, explore worlds, and experience cozy tabletop gaming reimagined for mobile.
          </p>
        </div>

        {/* Example Adventure Preview */}
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-amber-100 to-green-100 dark:from-amber-900/30 dark:to-green-900/30 rounded-lg p-8 border border-amber-200 dark:border-amber-800">
              <div className="text-left space-y-4">
                <p className="text-sm text-muted-foreground">Example Adventure in Progress:</p>
                <blockquote className="text-base italic">
                  "The ancient forest whispers secrets as your character, Thara the Druid, discovers a glowing crystal hidden beneath the roots of an enormous oak tree. What do you do next?"
                </blockquote>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">🏃 Investigate the crystal</Badge>
                  <Badge variant="outline" className="text-xs">🛡️ Proceed with caution</Badge>
                  <Badge variant="outline" className="text-xs">💭 Ask your companion for advice</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Begin Your Adventure?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of adventurers in magical worlds powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo Mode Toggle - only show if demo is enabled */}
              {demoStatus?.enabled && !isDemoStatusLoading && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Label htmlFor="demo-mode" className="text-sm">Demo Mode</Label>
                  <Switch
                    id="demo-mode"
                    checked={demoMode}
                    onCheckedChange={setDemoMode}
                    data-testid="switch-demo-mode"
                  />
                </div>
              )}
              
              <Button 
                onClick={handleMainCTA}
                size="lg"
                className="w-full bg-gradient-to-r from-amber-600 to-green-600 hover:from-amber-700 hover:to-green-700"
                data-testid="button-start-adventure"
                disabled={isStartingDemo}
              >
                {isStartingDemo ? "Starting Demo..." : "Ready to Begin Your Adventure"}
              </Button>
              <div className="text-sm text-muted-foreground">
                {demoMode ? (
                  <p>Try the adventure demo without creating an account. Your progress won't be saved.</p>
                ) : (
                  <>
                    <p>New to Skunk Tales? Create your account and first character.</p>
                    <p>Returning adventurer? Sign in to continue your journey.</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}