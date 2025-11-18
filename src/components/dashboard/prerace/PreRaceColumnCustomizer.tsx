
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

type ColumnKey = 'postPosition' | 'jockey' | 'trainer' | 'vet' | 'odds' | 'weight' | 'raceNumber' | 'raceTime' | 'examinationStatus' | 'regularVetApproval';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
}

const availableColumns: ColumnConfig[] = [
  { key: 'postPosition', label: 'Post Position' },
  { key: 'jockey', label: 'Jockey' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'vet', label: 'Veterinarian' },
  { key: 'odds', label: 'Odds' },
  { key: 'weight', label: 'Weight' },
  { key: 'raceNumber', label: 'Race Number' },
  { key: 'raceTime', label: 'Race Time' },
  { key: 'examinationStatus', label: 'Examination Status' },
  { key: 'regularVetApproval', label: 'Regular Vet Approval' }
];

interface PreRaceColumnCustomizerProps {
  visibleColumns: ColumnKey[];
  onColumnToggle: (columnKey: ColumnKey) => void;
}

const PreRaceColumnCustomizer = ({ visibleColumns, onColumnToggle }: PreRaceColumnCustomizerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Show Columns</h4>
          <div className="text-xs text-muted-foreground mb-2">
            Horse Name is always shown
          </div>
          {availableColumns.map(column => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={column.key}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => onColumnToggle(column.key)}
              />
              <label
                htmlFor={column.key}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PreRaceColumnCustomizer;
