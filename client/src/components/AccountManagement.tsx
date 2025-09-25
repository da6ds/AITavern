import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { LogOut, User, Calendar, MapPin, Star, Shield } from "lucide-react";
import type { Campaign } from "@shared/schema";

export function AccountManagement() {
  const { user, isAuthenticated } = useAuth();

  // Fetch user's adventures/campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Please log in to access your account.</p>
        <Button 
          className="mt-4"
          onClick={() => window.location.href = '/api/login'}
          data-testid="button-login-account"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Adventurer';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Section */}
      <Card data-testid="card-user-profile">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl" data-testid="text-display-name">
                {getDisplayName()}
              </CardTitle>
              <CardDescription data-testid="text-user-email">
                {user.email || 'No email provided'}
              </CardDescription>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Account
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Adventures Section */}
      <Card data-testid="card-user-adventures">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Your Adventures
          </CardTitle>
          <CardDescription>
            Your saved adventures and campaigns in Skunk Tales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaignsLoading ? (
            <div className="text-center py-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                  data-testid={`adventure-${campaign.id}`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`text-campaign-name-${campaign.id}`}>
                      {campaign.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-campaign-description-${campaign.id}`}>
                      {campaign.description || 'A mysterious adventure awaits...'}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      {campaign.isActive && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Last played: {new Date(campaign.lastPlayed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No adventures yet! Start your first adventure to begin your journey.
              </p>
              <Button variant="outline" data-testid="button-start-first-adventure">
                Start Your First Adventure
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card data-testid="card-account-actions">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/logout'}
              className="flex-1"
              data-testid="button-logout-account"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>
              Account ID: <span className="font-mono text-xs">{user.id}</span>
            </p>
            <p>
              Last updated: {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}