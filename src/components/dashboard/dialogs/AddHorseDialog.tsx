
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Horse {
  id: string;
  name: string;
  registration: string;
  age: number;
  breed: string;
  trainer: string;
}

interface AddHorseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHorse: (horse: Horse) => void;
}

const AddHorseDialog = ({ open, onOpenChange, onAddHorse }: AddHorseDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Horse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - would integrate with ThoroughManager API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call to ThoroughManager
    setTimeout(() => {
      const mockResults: Horse[] = [
        {
          id: "tm001",
          name: searchQuery.includes("Thunder") ? "Thunder's Legacy" : "Storm Chaser",
          registration: "TB123456",
          age: 4,
          breed: "Thoroughbred",
          trainer: "Available"
        },
        {
          id: "tm002",
          name: searchQuery.includes("Swift") ? "Swift Dancer" : "Lightning Bolt",
          registration: "TB789012",
          age: 3,
          breed: "Thoroughbred",
          trainer: "Available"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddHorse = (horse: Horse) => {
    onAddHorse(horse);
    setSearchQuery("");
    setSearchResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Horse to Stable</DialogTitle>
          <DialogDescription>
            Search for horses from ThoroughManager database to add to your stable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Horse Name or Registration</Label>
              <Input
                id="search"
                placeholder="Enter horse name or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="mt-6">
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Search Results</h4>
              {searchResults.map((horse) => (
                <div key={horse.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">{horse.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {horse.registration} • {horse.age}yr {horse.breed}
                    </p>
                  </div>
                  <Button onClick={() => handleAddHorse(horse)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Stable
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No horses found. Try a different search term.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHorseDialog;
