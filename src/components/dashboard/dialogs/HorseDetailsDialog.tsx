
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Network, ExternalLink } from "lucide-react";

interface Horse {
  id: string;
  name: string;
  yearOfBirth: number;
  sex: string;
  sire: string;
  dam: string;
  paternalGrandfather: string;
  paternalGrandmother: string;
  maternalGrandfather: string;
  maternalGrandmother: string;
  breeder: string;
  owner: string;
  vet: string;
  description: string;
}

interface HorseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: Horse;
  onConnectionClick: (type: "breeder" | "owner" | "vet", name: string) => void;
}

const HorseDetailsDialog = ({ open, onOpenChange, horse, onConnectionClick }: HorseDetailsDialogProps) => {
  const generateTMLink = (horseName: string) => {
    return `https://www.tmracingdata.com/Go/Go.aspx?PID=3001&FROM=rgHSearch&H=${encodeURIComponent(horseName)}&YOB=${horse.yearOfBirth}&BR=TB`;
  };

  const PedigreeLink = ({ horseName }: { horseName: string }) => (
    <a
      href={generateTMLink(horseName)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
    >
      {horseName}
      <ExternalLink className="w-3 h-3" />
    </a>
  );

  const ConnectionButton = ({ 
    type, 
    name 
  }: { 
    type: "breeder" | "owner" | "vet"; 
    name: string; 
  }) => (
    <button
      onClick={() => onConnectionClick(type, name)}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {name}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Horse Details - {horse.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="lifetime" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lifetime" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Lifetime
            </TabsTrigger>
            <TabsTrigger value="pedigree" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pedigree
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lifetime" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Lifetime Performance</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Career Summary:</span> {horse.description}</p>
                <p className="text-sm text-muted-foreground">
                  Detailed lifetime racing statistics and performance data from ThoroughManager will be displayed here.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pedigree" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Pedigree</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Sire: <PedigreeLink horseName={horse.sire} /></p>
                  <div className="pl-4 space-y-1 text-sm">
                    <p>Grandfather: <PedigreeLink horseName={horse.paternalGrandfather} /></p>
                    <p>Grandmother: <PedigreeLink horseName={horse.paternalGrandmother} /></p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Dam: <PedigreeLink horseName={horse.dam} /></p>
                  <div className="pl-4 space-y-1 text-sm">
                    <p>Grandfather: <PedigreeLink horseName={horse.maternalGrandfather} /></p>
                    <p>Grandmother: <PedigreeLink horseName={horse.maternalGrandmother} /></p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Connections</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <p><span className="font-medium">Breeder:</span> <ConnectionButton type="breeder" name={horse.breeder} /></p>
                <p><span className="font-medium">Owner:</span> <ConnectionButton type="owner" name={horse.owner} /></p>
                <p><span className="font-medium">Vet:</span> <ConnectionButton type="vet" name={horse.vet} /></p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HorseDetailsDialog;
