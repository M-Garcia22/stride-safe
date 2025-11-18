
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import { Horse } from "@/types/horse";
import VetSharingDialog from "@/components/dashboard/dialogs/VetSharingDialog";

interface HorseBasicInfoCardProps {
  horse: Horse;
}

const HorseBasicInfoCard = ({ horse }: HorseBasicInfoCardProps) => {
  const [showVetDialog, setShowVetDialog] = useState(false);
  const [currentHorse, setCurrentHorse] = useState<Horse>(horse);

  const getMonthYear = (yearOfBirth: number) => {
    // Assuming January for simplicity, in real implementation this would come from actual data
    return `January ${yearOfBirth}`;
  };

  const handleSaveVetSharing = (sharedVets: string[]) => {
    setCurrentHorse(prev => ({
      ...prev,
      sharedWithVets: sharedVets
    }));
    console.log(`Updated vet sharing for ${horse.name}:`, sharedVets);
  };

  const hasSharedVets = currentHorse.sharedWithVets && currentHorse.sharedWithVets.length > 0;

  return (
    <>
      <Card>
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            {/* Left side - Horse Details */}
            <div className="space-y-2 flex-1">
              <div>
                <CardTitle className="text-xl mb-1">{currentHorse.name}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{getMonthYear(currentHorse.yearOfBirth)}</span>
                  <span>•</span>
                  <span>{currentHorse.sex}</span>
                  <span>•</span>
                  <span>{currentHorse.color}</span>
                </div>
              </div>
            </div>

            {/* Right side - Veterinary Sharing */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              <Button
                variant="outline"
                onClick={() => setShowVetDialog(true)}
                className="flex items-center gap-2 h-7 px-2 text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                Manage Vet Access
              </Button>
              {hasSharedVets && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                    <Check className="w-3 h-3 text-green-700" />
                  </div>
                  <span className="text-green-700 font-medium">Shared</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <VetSharingDialog
        open={showVetDialog}
        onOpenChange={setShowVetDialog}
        horse={currentHorse}
        onSave={handleSaveVetSharing}
      />
    </>
  );
};

export default HorseBasicInfoCard;
