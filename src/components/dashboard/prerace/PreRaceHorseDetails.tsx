import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import WelfareReportTable from "./WelfareReportTable";
import { PreRaceHorse, SensitivitySettings } from "../../../data/preRaceData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PreRaceHorseDetailsProps {
  horse: PreRaceHorse;
  onClose: () => void;
  onExaminationAction: (horseId: number, action: 'scratch' | 'pass') => void;
  sensitivitySettings: SensitivitySettings;
}

const PreRaceHorseDetails = ({ horse, onClose, onExaminationAction, sensitivitySettings }: PreRaceHorseDetailsProps) => {
  const getExaminationStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'passed': 'bg-green-100 text-green-800',
      'scratched': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getRecommendationText = (status: string) => {
    const recommendations: { [key: string]: string } = {
      'pending': 'To examine',
      'in-progress': 'To examine',
      'passed': 'Passed',
      'scratched': 'Scratch'
    };
    return recommendations[status] || status;
  };

  const getWelfareAlertExplanation = () => {
    if (!horse.welfareAlert || !horse.welfareReports.length) return '';
    
    const latestReport = horse.welfareReports[0];
    const alerts = latestReport.alerts;
    
    if (alerts.length === 0) return 'Welfare monitoring system has detected irregularities requiring attention.';
    
    const alertDescriptions: { [key: string]: string } = {
      'C-Fx': 'Catastrophic fracture risk detected',
      'S-Fx': 'Stress fracture risk identified', 
      'LF': 'Left front limb irregularity',
      'RF': 'Right front limb irregularity',
      'HL': 'Hind limb concern',
      'BF': 'Both front limbs showing irregularities'
    };

    const descriptions = alerts.map(alert => alertDescriptions[alert] || alert).join(', ');
    return `${descriptions} detected in recent stride analysis.`;
  };

  const getAttendingVetStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
      case 'approved':
        return { text: 'Racing Sound', className: 'bg-green-100 text-green-800' };
      case 'declined':
        return { text: 'Not Racing Sound', className: 'bg-red-100 text-red-800' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const getOfficialRecordStatus = (examinationStatus: string) => {
    switch (examinationStatus) {
      case 'passed':
        return { text: 'Racing', className: 'bg-green-100 text-green-800' };
      case 'scratched':
        return { text: 'Scratched', className: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pre-race Examination</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Horse Basic Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{horse.name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(horse.birthDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • {horse.sex} • {horse.color}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">Race {horse.raceNumber}</div>
              <div className="text-lg font-semibold text-muted-foreground">Post {horse.postPosition}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">Jockey:</span>
              <span className="ml-2 font-medium">{horse.jockey}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Trainer:</span>
              <span className="ml-2 font-medium">{horse.trainer}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Owner:</span>
              <span className="ml-2 font-medium">{horse.owner}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* StrideSAFE Pre-race Report */}
      <Card className={horse.welfareAlert ? "border-red-200 bg-red-50/50" : ""}>
        <CardHeader>
          <CardTitle className="text-lg">StrideSAFE Pre-race Report</CardTitle>
          {horse.welfareAlert && (
            <div className="mt-10 p-3 bg-red-100 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Welfare Alert Notes</p>
                  <p className="text-sm text-red-700 mt-1">
                    {getWelfareAlertExplanation()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <WelfareReportTable reports={horse.welfareReports} />
        </CardContent>
      </Card>

      {/* Attending Veterinarian Examination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attending veterinarian examination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{horse.regularVetApproval.vetName}</p>
                <p className="text-sm text-muted-foreground">{horse.regularVetApproval.vetPractice}</p>
              </div>
              <Badge className={getAttendingVetStatus(horse.regularVetApproval.status).className}>
                {getAttendingVetStatus(horse.regularVetApproval.status).text}
              </Badge>
            </div>
            
            {horse.regularVetApproval.approvalDate && (
              <div className="text-sm">
                <span className="text-muted-foreground">Approval Date:</span>
                <span className="ml-2">{new Date(horse.regularVetApproval.approvalDate).toLocaleDateString()}</span>
              </div>
            )}
            
            <div>
              <span className="text-sm text-muted-foreground block mb-2">Examination notes:</span>
              <div className="text-sm bg-muted/50 p-3 rounded-md">
                {horse.regularVetApproval.comments}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Veterinarian Examination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regulatory veterinarian examination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  disabled={horse.examinationStatus === 'scratched'}
                >
                  Scratch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Scratch {horse.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove the horse from today's race. This cannot be undone.
                    Please confirm that you want to scratch this horse from the race.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onExaminationAction(horse.id, 'scratch')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Scratch Horse
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button 
              variant="default" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onExaminationAction(horse.id, 'pass')}
              disabled={horse.examinationStatus === 'passed'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Pass Examination
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recommendation:</span>
            <Badge className={getExaminationStatusBadge(horse.examinationStatus)}>
              {getRecommendationText(horse.examinationStatus)}
            </Badge>
          </div>

          {horse.recommendationDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date/time when recommendation made:</span>
              <span className="text-sm">{new Date(horse.recommendationDate).toLocaleString()}</span>
            </div>
          )}

          {horse.regulatoryVetComments && (
            <div>
              <span className="text-sm text-muted-foreground block mb-2">Regulatory Vet Comments:</span>
              <div className="text-sm bg-muted/50 p-3 rounded-md">
                {horse.regulatoryVetComments}
              </div>
            </div>
          )}

          <Separator />

          {/* Official Notifications */}
          <div className="space-y-3">
            {horse.officialStewardNotified && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Official Steward informed:</span>
                <span className="text-sm">{new Date(horse.officialStewardNotified).toLocaleString()}</span>
              </div>
            )}

            {horse.trackOfficialNotified && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Track Official informed:</span>
                <span className="text-sm">{new Date(horse.trackOfficialNotified).toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Official record:</span>
              <Badge className={getOfficialRecordStatus(horse.examinationStatus).className}>
                {getOfficialRecordStatus(horse.examinationStatus).text}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreRaceHorseDetails;
