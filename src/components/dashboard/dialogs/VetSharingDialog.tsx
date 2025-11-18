
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Horse, Vet } from '@/types/horse';

interface VetSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: Horse;
  onSave: (sharedVets: string[]) => void;
}

// Mock data for Kentucky registered race horse vets
const mockKentuckyVets: Vet[] = [
  {
    id: "vet1",
    name: "Dr. Sarah Johnson",
    practice: "Bluegrass Equine Clinic",
    location: "Lexington, KY",
    licenseNumber: "KY-V-001234"
  },
  {
    id: "vet2",
    name: "Dr. Michael Thompson",
    practice: "Kentucky Horse Park Veterinary Services",
    location: "Lexington, KY",
    licenseNumber: "KY-V-001235"
  },
  {
    id: "vet3",
    name: "Dr. Emily Rodriguez",
    practice: "Churchill Downs Veterinary Center",
    location: "Louisville, KY",
    licenseNumber: "KY-V-001236"
  },
  {
    id: "vet4",
    name: "Dr. James Wilson",
    practice: "Woodford Equine Hospital",
    location: "Versailles, KY",
    licenseNumber: "KY-V-001237"
  },
  {
    id: "vet5",
    name: "Dr. Lisa Chen",
    practice: "Rood & Riddle Equine Hospital",
    location: "Lexington, KY",
    licenseNumber: "KY-V-001238"
  },
  {
    id: "vet6",
    name: "Dr. Robert Davis",
    practice: "Hagyard Equine Medical Institute",
    location: "Lexington, KY",
    licenseNumber: "KY-V-001239"
  }
];

const VetSharingDialog = ({ open, onOpenChange, horse, onSave }: VetSharingDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVets, setSelectedVets] = useState<string[]>(horse.sharedWithVets || []);

  const filteredVets = mockKentuckyVets.filter(vet =>
    vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVetToggle = (vetId: string) => {
    setSelectedVets(prev =>
      prev.includes(vetId)
        ? prev.filter(id => id !== vetId)
        : [...prev, vetId]
    );
  };

  const handleSave = () => {
    onSave(selectedVets);
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    setSelectedVets(filteredVets.map(vet => vet.id));
  };

  const handleDeselectAll = () => {
    setSelectedVets([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Horse Data with Veterinarians</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select veterinarians to share {horse.name}'s data with
          </p>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search veterinarians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          {/* Vet List */}
          <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredVets.map((vet) => {
                  const isSelected = selectedVets.includes(vet.id);
                  const wasOriginallyShared = horse.sharedWithVets?.includes(vet.id);
                  
                  return (
                    <div 
                      key={vet.id} 
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        wasOriginallyShared ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleVetToggle(vet.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{vet.name}</p>
                          {wasOriginallyShared && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Currently Shared
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{vet.practice}</p>
                        <p className="text-xs text-muted-foreground">{vet.location}</p>
                        <p className="text-xs text-muted-foreground">License: {vet.licenseNumber}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VetSharingDialog;
