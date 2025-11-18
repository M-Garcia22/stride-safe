
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { PostRaceHorse, PostRaceColumnKey } from "../../../../data/postRaceData";
import { getWelfareBadge, getRiskBadge, getWelfareAlertBadge } from "../badges/PostRaceBadges";

interface PostRaceTableRowProps {
  horse: PostRaceHorse;
  displayColumns: Array<{ key: PostRaceColumnKey; label: string; sortable: boolean }>;
  selectedHorse?: PostRaceHorse | null;
  onHorseSelect: (horse: PostRaceHorse) => void;
}

const PostRaceTableRow = ({
  horse,
  displayColumns,
  selectedHorse,
  onHorseSelect
}: PostRaceTableRowProps) => {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const getMarkerBadge = (isPositive: boolean) => {
    return isPositive ? (
      <Badge variant="destructive" className="px-1 py-0">
        <X className="w-3 h-3" />
      </Badge>
    ) : null;
  };

  const renderColumnValue = (horse: PostRaceHorse, columnKey: PostRaceColumnKey) => {
    switch (columnKey) {
      case 'race':
        return `Race ${horse.raceNumber}`;
      case 'finish':
        if (horse.finishPosition) {
          return `${horse.finishPosition}${getOrdinalSuffix(horse.finishPosition)}`;
        } else {
          return <Badge className="bg-red-100 text-red-800 font-semibold">DNF</Badge>;
        }
      case 'welfare':
        return getWelfareBadge(horse);
      case 'risk':
        return getRiskBadge(horse);
      case 'cFx':
        return getMarkerBadge(horse.markers.includes('C-Fx'));
      case 'sFx':
        return getMarkerBadge(horse.markers.includes('S-Fx'));
      case 'lf':
        return getMarkerBadge(horse.markers.includes('LF'));
      case 'rf':
        return getMarkerBadge(horse.markers.includes('RF'));
      case 'bf':
        return getMarkerBadge(horse.markers.includes('BF'));
      case 'hl':
        return getMarkerBadge(horse.markers.includes('HL'));
      case 'welfareAlert':
        return getWelfareAlertBadge(horse);
      default:
        return '';
    }
  };

  return (
    <TableRow 
      className={`cursor-pointer hover:bg-muted/50 ${selectedHorse?.id === horse.id ? 'bg-primary/10' : ''}`}
      onClick={() => onHorseSelect(horse)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium">{horse.name}</p>
            <p className="text-xs text-muted-foreground">
              Post {horse.postPosition}
            </p>
          </div>
        </div>
      </TableCell>
      {displayColumns.map(column => (
        <TableCell key={column.key} className="text-center">
          {renderColumnValue(horse, column.key)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default PostRaceTableRow;
