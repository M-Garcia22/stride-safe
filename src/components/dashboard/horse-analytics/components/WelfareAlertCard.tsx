
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { useState } from "react";
import WelfareAlertInfoDialog from "./WelfareAlertInfoDialog";

interface WelfareAlertCardProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const getMarkerBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge variant="destructive" className="text-xs">
      Alert
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600">
      None
    </Badge>
  );
};

const WelfareAlertCard = ({ horse, selectedReport }: WelfareAlertCardProps) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Use selected report data if available, otherwise fall back to mock data
  const welfareMarkers = selectedReport ? {
    condylarFx: selectedReport.condylarFx,
    sesamoidFx: selectedReport.sesamoidFx,
    leftFront: selectedReport.leftFront,
    rightFront: selectedReport.rightFront,
    bothFront: selectedReport.bothFront,
    hindLimb: selectedReport.hindLimb
  } : {
    condylarFx: false,
    sesamoidFx: false,
    leftFront: false,
    rightFront: false,
    bothFront: false,
    hindLimb: false
  };

  const markers = [
    { key: 'condylarFx', label: 'Condylar Fx', active: welfareMarkers.condylarFx },
    { key: 'sesamoidFx', label: 'Sesamoid Fx', active: welfareMarkers.sesamoidFx },
    { key: 'leftFront', label: 'Left Front', active: welfareMarkers.leftFront },
    { key: 'rightFront', label: 'Right Front', active: welfareMarkers.rightFront },
    { key: 'bothFront', label: 'Both Front', active: welfareMarkers.bothFront },
    { key: 'hindLimb', label: 'Hind Limb', active: welfareMarkers.hindLimb }
  ];

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader className="pb-4 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Welfare Alert</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-1">
            {markers.map((marker) => (
              <div 
                key={marker.key} 
                className="flex items-center justify-between border rounded-md p-1.5 bg-gray-50/50"
              >
                <span className="text-sm font-medium text-gray-700">
                  {marker.label}
                </span>
                {getMarkerBadge(marker.active)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <WelfareAlertInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />
    </>
  );
};

export default WelfareAlertCard;
