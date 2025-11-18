
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HorseAnalyticsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onShowSearchDialog: () => void;
}

const HorseAnalyticsHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onShowSearchDialog 
}: HorseAnalyticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search horses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button onClick={onShowSearchDialog}>
        <Search className="h-4 w-4 mr-2" />
        Browse Horses
      </Button>
    </div>
  );
};

export default HorseAnalyticsHeader;
