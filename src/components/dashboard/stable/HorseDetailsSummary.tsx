
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreePine, TrendingUp } from "lucide-react";
import TripleRings from "../TripleRings";

interface Horse {
  id: number;
  name: string;
  birthMonth?: string;
  birthYear?: number;
  sex?: string;
  colour?: string;
  owner?: string;
  status?: string;
  stableId?: string;
  dateLastRaced?: string | null;
  lastBreezed?: string | null;
  lastBreezeTime?: string | null;
  nextListing?: string | null;
  performanceScore: number;
  welfareAlert: boolean;
  wellnessScore: number;
  performanceRingScore: number;
  paddockMode?: boolean;
}

interface HorseDetailsSummaryProps {
  horse: Horse;
  onGoToAnalysis?: (horse: Horse) => void;
}

const HorseDetailsSummary = ({ horse, onGoToAnalysis }: HorseDetailsSummaryProps) => {
  const getStatusBadge = (status: string, paddockMode: boolean) => {
    if (paddockMode) {
      return 'bg-orange-100 text-orange-800';
    }
    
    const variants: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Rest': 'bg-blue-100 text-blue-800',
      'Medical': 'bg-red-100 text-red-800',
      'Paddock': 'bg-orange-100 text-orange-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Summary</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGoToAnalysis && onGoToAnalysis(horse)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Go to Horse Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Horse Profile and Triple Rings Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                {horse.paddockMode && <TreePine className="w-5 h-5 text-orange-500" />}
                <h3 className="text-lg font-semibold text-primary">{horse.name}</h3>
                {horse.paddockMode && (
                  <Badge className="bg-orange-100 text-orange-800">Paddock Mode</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Born</p>
                  <p className="font-medium">{horse.birthMonth} {horse.birthYear}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sex</p>
                  <p className="font-medium">{horse.sex}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Colour</p>
                  <p className="font-medium">{horse.colour}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="font-medium">{horse.owner}</p>
                </div>
                {horse.status && (
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={getStatusBadge(horse.status, horse.paddockMode || false)}>
                      {horse.paddockMode ? 'Paddock' : horse.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Triple Rings Display */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h4 className="text-sm font-medium mb-3 text-center">Wellness Status</h4>
              <div className="flex justify-center">
                <TripleRings
                  size="large"
                  performanceScore={horse.performanceScore}
                  welfareAlert={horse.welfareAlert}
                  wellnessScore={horse.wellnessScore}
                  performanceRingScore={horse.performanceRingScore}
                  paddockMode={horse.paddockMode}
                />
              </div>
            </div>
          </div>

          {!horse.paddockMode && (
            <>
              {/* Racing Information */}
              <div>
                <h4 className="font-semibold mb-3">Racing Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stable ID</p>
                    <p className="font-medium">{horse.stableId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Raced</p>
                    <p className="font-medium">
                      {horse.dateLastRaced ? new Date(horse.dateLastRaced).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Breezed</p>
                    <p className="font-medium">
                      {horse.lastBreezed ? new Date(horse.lastBreezed).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Breeze Time</p>
                    <p className="font-medium">
                      {horse.lastBreezeTime ? `${horse.lastBreezeTime}s` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Listing</p>
                    <p className="font-medium">
                      {horse.nextListing ? new Date(horse.nextListing).toLocaleDateString() : 'None scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wellness Metrics */}
              <div>
                <h4 className="font-semibold mb-3">Wellness Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Heart Rate</p>
                    <p className="text-lg font-bold text-green-700">32 bpm</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Stride Pattern</p>
                    <p className="text-lg font-bold text-blue-700">Normal</p>
                  </div>
                </div>
              </div>

              {/* Veterinary Status */}
              <div>
                <h4 className="font-semibold mb-3">Veterinary Status</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Last Checkup</p>
                  <p className="font-medium">January 10, 2024</p>
                  <p className="text-sm text-muted-foreground mt-2">Next Appointment</p>
                  <p className="font-medium">January 30, 2024</p>
                </div>
              </div>
            </>
          )}

          {horse.paddockMode && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold mb-2 text-orange-800">Paddock Mode</h4>
              <p className="text-sm text-orange-700">
                This horse is in paddock mode. Wellness and performance data are not available. 
                Activate the horse to restore full functionality.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HorseDetailsSummary;
