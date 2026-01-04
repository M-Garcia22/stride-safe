import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TrainerHeaderActionsProps {
  onSettingsClick: () => void;
}

const TrainerHeaderActions = ({ onSettingsClick }: TrainerHeaderActionsProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const handleAccount = () => {
    toast({
      title: "Coming Soon",
      description: "Account management will be available in a future update.",
    });
  };

  const handleHelp = () => {
    toast({
      title: "Coming Soon",
      description: "Help documentation will be available in a future update.",
    });
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        {/* Trainer Name */}
        <div className="flex items-center gap-3 mr-2">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name ?? "Trainer"}</p>
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

export default TrainerHeaderActions;
