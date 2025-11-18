
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderActionsProps {
  onSettingsClick: () => void;
}

const HeaderActions = ({ onSettingsClick }: HeaderActionsProps) => {
  const handleLogout = () => {
    console.log("Logout clicked");
    // Add logout logic here
  };

  const handleAccount = () => {
    console.log("Account management clicked");
    // Add account management logic here
  };

  const handleHelp = () => {
    console.log("Help clicked");
    // Add help logic here
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        {/* Client Name */}
        <div className="flex items-center gap-3 mr-2">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Track Incorporated</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHelp}
                className="text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAccount}
                className="text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <User className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Account Management</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-foreground hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HeaderActions;
