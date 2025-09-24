import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Play, 
  Settings, 
  Trash2, 
  RotateCcw, 
  MessageCircle,
  Crown,
  Sword,
  Calendar
} from "lucide-react";
import { useState } from "react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastPlayed: string;
  turnCount: number;
  isActive: boolean;
  characterLevel: number;
}

interface CampaignManagerProps {
  campaigns: Campaign[];
  activeCampaignId: string | null;
  onCreateCampaign: (name: string, description: string) => void;
  onSwitchCampaign: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onResetRounds: (campaignId: string) => void;
  onOpenDMChat: () => void;
  className?: string;
}

export default function CampaignManager({
  campaigns,
  activeCampaignId,
  onCreateCampaign,
  onSwitchCampaign,
  onDeleteCampaign,
  onResetRounds,
  onOpenDMChat,
  className = ""
}: CampaignManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState<string | null>(null);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId);

  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      onCreateCampaign(newCampaignName.trim(), newCampaignDescription.trim());
      setNewCampaignName("");
      setNewCampaignDescription("");
      setShowCreateDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Campaign Header */}
      {activeCampaign && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Current Campaign</CardTitle>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{activeCampaign.name}</h3>
                <p className="text-sm text-muted-foreground">{activeCampaign.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Turn {activeCampaign.turnCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3" />
                  <span>Level {activeCampaign.characterLevel}</span>
                </div>
                <div>Last played: {formatDate(activeCampaign.lastPlayed)}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetDialog(activeCampaign.id)}
                  data-testid="button-reset-rounds"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset Rounds
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenDMChat}
                  data-testid="button-dm-chat"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  DM Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Actions */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Your Campaigns</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-campaign">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g., The Lost Mines of Phandelver"
                  data-testid="input-campaign-name"
                />
              </div>
              <div>
                <Label htmlFor="campaign-description">Description (Optional)</Label>
                <Input
                  id="campaign-description"
                  value={newCampaignDescription}
                  onChange={(e) => setNewCampaignDescription(e.target.value)}
                  placeholder="Describe your adventure..."
                  data-testid="input-campaign-description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={!newCampaignName.trim()}
                data-testid="button-create-campaign"
              >
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Sword className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">No campaigns yet</h3>
                  <p className="text-sm text-muted-foreground">Create your first campaign to begin your adventure</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          campaigns.map(campaign => (
            <Card 
              key={campaign.id} 
              className={`hover-elevate ${campaign.id === activeCampaignId ? 'ring-2 ring-primary/20' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                      {campaign.id === activeCampaignId && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Turn {campaign.turnCount}</span>
                      <span>Level {campaign.characterLevel}</span>
                      <span>Created {formatDate(campaign.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.id !== activeCampaignId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSwitchCampaign(campaign.id)}
                        data-testid={`button-switch-${campaign.id}`}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Play
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteDialog(campaign.id)}
                      data-testid={`button-delete-${campaign.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Campaign Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
              All progress, characters, and story will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (showDeleteDialog) {
                  onDeleteCampaign(showDeleteDialog);
                  setShowDeleteDialog(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Rounds Dialog */}
      <AlertDialog open={!!showResetDialog} onOpenChange={() => setShowResetDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Rounds</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the turn counter back to 1. The campaign story and character 
              progress will remain intact. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (showResetDialog) {
                  onResetRounds(showResetDialog);
                  setShowResetDialog(null);
                }
              }}
              data-testid="button-confirm-reset"
            >
              Reset Rounds
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}