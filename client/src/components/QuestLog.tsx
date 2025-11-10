import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestCard from "./QuestCard";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";
import type { Quest } from "@shared/schema";
import { ScrollText, CheckCircle, XCircle } from "lucide-react";

interface QuestLogProps {
  quests: Quest[];
  onQuestClick?: (quest: Quest) => void;
  className?: string;
}

export default function QuestLog({ quests, onQuestClick, className = "" }: QuestLogProps) {
  const activeQuests = quests.filter(q => q.status === "active");
  const completedQuests = quests.filter(q => q.status === "completed");
  const failedQuests = quests.filter(q => q.status === "failed");
  
  return (
    <div className={`h-full ${className}`} data-testid="quest-log">
      <Card className="h-full">
        <PageHeader
          title="Quest Log"
          icon={ScrollText}
          badges={[
            { label: `${activeQuests.length} Active`, variant: "secondary" },
            { label: `${completedQuests.length} Completed`, variant: "outline" }
          ]}
        />
        
        <CardContent className="h-full overflow-hidden">
          <Tabs defaultValue="active" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active" className="text-xs">
                <ScrollText className="w-4 h-4 mr-1" />
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">
                <CheckCircle className="w-4 h-4 mr-1" />
                Done
              </TabsTrigger>
              <TabsTrigger value="failed" className="text-xs">
                <XCircle className="w-4 h-4 mr-1" />
                Failed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="flex-1 overflow-auto mt-4">
              <div className="space-y-4">
                {activeQuests.length === 0 ? (
                  <EmptyState
                    icon={ScrollText}
                    title="No active quests"
                    description="Speak with NPCs to discover new adventures!"
                  />
                ) : (
                  activeQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => onQuestClick?.(quest)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="flex-1 overflow-auto mt-4">
              <div className="space-y-4">
                {completedQuests.length === 0 ? (
                  <EmptyState
                    icon={CheckCircle}
                    title="No completed quests yet"
                  />
                ) : (
                  completedQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => onQuestClick?.(quest)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="failed" className="flex-1 overflow-auto mt-4">
              <div className="space-y-4">
                {failedQuests.length === 0 ? (
                  <EmptyState
                    icon={XCircle}
                    title="No failed quests"
                  />
                ) : (
                  failedQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => onQuestClick?.(quest)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}