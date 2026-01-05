
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  const handleSaveVetSharing = (sharedVets: string[]) => {
    setCurrentHorse(prev => ({
      ...prev,
      sharedWithVets: sharedVets
    }));
    console.log(`Updated vet sharing for ${horse.name}:`, sharedVets);
  };

  const hasSharedVets = currentHorse.sharedWithVets && currentHorse.sharedWithVets.length > 0;

  // Only show color if it's not "Unknown"
  const showColor = currentHorse.color && currentHorse.color !== "Unknown";

  return (
    <>
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            {/* Left side - Horse Details */}
            <div className="space-y-1 flex-1">
              <div>
                <CardTitle className="text-xl mb-1">{currentHorse.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span>{currentHorse.yearOfBirth}</span>
                  <span>•</span>
                  <span>{currentHorse.sex}</span>
                  {showColor && (
                    <>
                      <span>•</span>
                      <span>{currentHorse.color}</span>
                    </>
                  )}
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
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {/* Pedigree */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Sire</p>
              <p className="font-medium">{currentHorse.sire || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Dam</p>
              <p className="font-medium">{currentHorse.dam || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Sire's Sire</p>
              <p className="font-medium">{currentHorse.paternalGrandfather || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Dam's Sire</p>
              <p className="font-medium">{currentHorse.maternalGrandfather || "Unknown"}</p>
            </div>
            
            {/* Owner & Breeder */}
            {(currentHorse.owner && currentHorse.owner !== "Unknown") && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-0.5">Owner</p>
                <p className="font-medium truncate" title={currentHorse.owner}>{currentHorse.owner}</p>
              </div>
            )}
            {(currentHorse.breeder && currentHorse.breeder !== "Unknown") && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-0.5">Breeder</p>
                <p className="font-medium">{currentHorse.breeder}</p>
              </div>
            )}
          </div>
        </CardContent>
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
