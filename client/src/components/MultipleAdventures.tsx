import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Edit2, 
  Trash2, 
  Plus,
  Check,
  X,
  AlertTriangle
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Campaign } from "@shared/schema";

interface MultipleAdventuresProps {
  onContinueAdventure: (campaignId: string) => void;
  onCreateNew: () => void;
  className?: string;
}

export default function MultipleAdventures({ 
  onContinueAdventure, 
  onCreateNew,
  className = "" 
}: MultipleAdventuresProps) {
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { toast } = useToast();

  // Fetch all campaigns
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  // Rename campaign mutation
  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await apiRequest('PATCH', `/api/campaigns/${id}`, { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setEditingCampaign(null);
      toast({
        title: "Adventure renamed",
        description: "Your adventure name has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to rename campaign:', error);
      toast({
        title: "Failed to rename adventure",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/campaigns/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setDeletingCampaign(null);
      setDeleteConfirmation("");
      toast({
        title: "Adventure deleted",
        description: "Your adventure has been permanently removed.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete campaign:', error);
      toast({
        title: "Failed to delete adventure",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Start editing campaign name
  const startEditing = (campaign: Campaign) => {
    setEditingCampaign(campaign.id);
    setEditValue(campaign.name);
  };

  // Save campaign name
  const saveEdit = () => {
    if (editValue.trim() && editingCampaign) {
      renameMutation.mutate({ id: editingCampaign, name: editValue.trim() });
    } else {
      setEditingCampaign(null);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCampaign(null);
    setEditValue("");
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (deleteConfirmation === "delete" && deletingCampaign) {
      deleteMutation.mutate(deletingCampaign.id);
    }
  };

  // Format last played date
  const formatLastPlayed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <h2 className="font-serif text-xl text-primary mb-2">Your Adventures</h2>
          <p className="text-muted-foreground">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  // Show up to 4 most recent campaigns
  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
    .slice(0, 4);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h2 className="font-serif text-xl text-primary mb-2">Your Adventures</h2>
        <p className="text-muted-foreground text-sm">
          {campaigns.length === 0 
            ? "No adventures yet. Create your first character to begin!"
            : campaigns.length === 1
              ? "Continue your adventure"
              : `Choose from your ${campaigns.length} adventures`
          }
        </p>
      </div>

      {recentCampaigns.length > 0 && (
        <div className="space-y-3">
          {recentCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {editingCampaign === campaign.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="h-8 text-sm"
                          autoFocus
                          data-testid={`input-rename-campaign-${campaign.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEdit}
                          disabled={renameMutation.isPending}
                          className="h-8 w-8 p-0"
                          data-testid={`button-save-rename-${campaign.id}`}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={renameMutation.isPending}
                          className="h-8 w-8 p-0"
                          data-testid={`button-cancel-rename-${campaign.id}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate" data-testid={`campaign-name-${campaign.id}`}>
                            {campaign.name}
                          </h3>
                          {campaign.isActive && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last played: {formatLastPlayed(campaign.lastPlayed)}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onContinueAdventure(campaign.id)}
                      className="h-8 px-3 text-xs"
                      data-testid={`button-continue-${campaign.id}`}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(campaign)}
                      className="h-8 w-8 p-0"
                      data-testid={`button-edit-${campaign.id}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingCampaign(campaign)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      data-testid={`button-delete-${campaign.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="hover-elevate">
        <CardContent className="p-4">
          <Button 
            onClick={onCreateNew}
            variant="outline"
            className="w-full h-12 text-sm font-medium"
            data-testid="button-create-new-adventure"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Adventure
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCampaign} onOpenChange={() => setDeletingCampaign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Adventure
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your adventure 
              <strong className="text-foreground"> "{deletingCampaign?.name}"</strong> and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Type <strong>delete</strong> to confirm:
              </p>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="text-sm"
                data-testid="input-delete-confirmation"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeletingCampaign(null);
                  setDeleteConfirmation("");
                }}
                data-testid="button-cancel-delete"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation !== "delete" || deleteMutation.isPending}
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Adventure"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}