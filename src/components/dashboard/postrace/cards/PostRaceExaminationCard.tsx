
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PostRaceHorse } from "../../../../data/postRaceData";

interface PostRaceExaminationCardProps {
  horse: PostRaceHorse;
}

const getExaminationStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'not-required': 'bg-gray-100 text-gray-800'
  };
  return variants[status] || 'bg-gray-100 text-gray-800';
};

const PostRaceExaminationCard = ({ horse }: PostRaceExaminationCardProps) => {
  const [isExaminationDetailsOpen, setIsExaminationDetailsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 pb-2">
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <div className="space-y-3">
          {/* Placeholder for future functionality */}
          <div className="text-xs bg-muted/30 p-2 rounded-md">
            <span className="text-muted-foreground">
              Additional functionality can be added to this view as required.
            </span>
          </div>

          {/* Collapsible Examination Details */}
          <Collapsible open={isExaminationDetailsOpen} onOpenChange={setIsExaminationDetailsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 hover:bg-muted/50 rounded-md transition-colors">
              <span className="text-xs font-medium">
                {isExaminationDetailsOpen ? 'Hide Examination Details' : 'Show Examination Details'}
              </span>
              {isExaminationDetailsOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <div className="space-y-2 p-2 bg-muted/30 rounded-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0">Status:</span>
                  <Badge className={getExaminationStatusBadge(horse.postRaceExamination.status)}>
                    {horse.postRaceExamination.status.charAt(0).toUpperCase() + horse.postRaceExamination.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                
                {horse.postRaceExamination.vetName && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">Vet:</span>
                    <span className="text-xs font-medium truncate">{horse.postRaceExamination.vetName}</span>
                  </div>
                )}

                {horse.postRaceExamination.cleared !== undefined && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">Cleared:</span>
                    <Badge className={horse.postRaceExamination.cleared ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {horse.postRaceExamination.cleared ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                )}

                {horse.postRaceExamination.followUpRequired !== undefined && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">Follow-up:</span>
                    <Badge className={horse.postRaceExamination.followUpRequired ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                      {horse.postRaceExamination.followUpRequired ? 'Required' : 'Not Required'}
                    </Badge>
                  </div>
                )}
                
                {horse.postRaceExamination.findings && (
                  <>
                    <Separator className="my-2" />
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Findings:</span>
                      <div className="text-xs bg-muted/50 p-2 rounded-md break-words">
                        {horse.postRaceExamination.findings}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostRaceExaminationCard;
