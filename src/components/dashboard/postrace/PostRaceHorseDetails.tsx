
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import HorseBasicInfoCard from "./cards/HorseBasicInfoCard";
import StrideSafeReportCard from "./cards/StrideSafeReportCard";
import PostRaceExaminationCard from "./cards/PostRaceExaminationCard";
import RaceDataCard from "./RaceDataCard";
import { PostRaceHorse, mockRaceData } from "../../../data/postRaceData";

interface PostRaceHorseDetailsProps {
  horse: PostRaceHorse;
  onClose: () => void;
  onHistoricReports?: (horseName: string) => void;
}

const PostRaceHorseDetails = ({ horse, onClose, onHistoricReports }: PostRaceHorseDetailsProps) => {
  // Find the race data for this horse
  const raceData = mockRaceData.find(race => race.raceNumber === horse.raceNumber);

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate">Post-race Analysis</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Horse Basic Information */}
      <HorseBasicInfoCard horse={horse} />

      {/* Race Data Card */}
      <RaceDataCard horse={horse} raceData={raceData} />

      {/* StrideSAFE Post-race Report */}
      <StrideSafeReportCard horse={horse} onHistoricReports={onHistoricReports} />

      {/* Post-race Examination */}
      <PostRaceExaminationCard horse={horse} />
    </div>
  );
};

export default PostRaceHorseDetails;
