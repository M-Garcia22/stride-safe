import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrainerHorse } from "@/types/horse";
import { useTrainerHorses } from "@/hooks/useTrainerHorses";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, Search } from "lucide-react";

interface HorseSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectHorse: (horse: TrainerHorse) => void;
}

const HorseSearchDialog = ({ open, onOpenChange, onSelectHorse }: HorseSearchDialogProps) => {
  const { horses, loading, error } = useTrainerHorses();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHorses = useMemo(() => {
    if (!searchQuery.trim()) return horses;
    const query = searchQuery.toLowerCase();
    return horses.filter(horse => 
      horse.name.toLowerCase().includes(query)
    );
  }, [horses, searchQuery]);

  const handleSelectHorse = (horse: TrainerHorse) => {
    onSelectHorse(horse);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Horse Profile</DialogTitle>
          <DialogDescription>
            Search and select a horse from your training roster.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8">
            <LoadingSpinner message="Loading horses..." />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search horses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border">
              {filteredHorses.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No horses found.
                </div>
              ) : (
                <div className="p-1">
                  {filteredHorses.map((horse) => (
                    <button
                      key={horse.id}
                      type="button"
                      onClick={() => handleSelectHorse(horse)}
                      className="w-full flex flex-col items-start rounded-sm px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <span className="font-medium">{horse.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {horse.yearOfBirth || 'Unknown'} • {horse.sex || 'Unknown'} • {horse.totalRaces} races
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HorseSearchDialog;
