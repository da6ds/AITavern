import { Settings, Moon, Sun, Monitor, Info, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { useTooltips } from "@/components/TooltipProvider";

export default function SettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const { showTooltips, toggleTooltips } = useTooltips();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid="button-settings"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Theme Settings */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent" : ""}
          data-testid="theme-light"
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
          data-testid="theme-dark"
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent" : ""}
          data-testid="theme-system"
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Tooltip Settings */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Interface
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={toggleTooltips}
          data-testid="toggle-tooltips"
        >
          {showTooltips ? (
            <EyeOff className="mr-2 h-4 w-4" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          {showTooltips ? "Hide Tooltips" : "Show Tooltips"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}