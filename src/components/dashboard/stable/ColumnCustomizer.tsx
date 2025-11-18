
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

type ColumnKey = 'born' | 'sex' | 'lastRace' | 'lastBreeze' | 'lifetimePurse' | 'vet' | 'breeder' | 'lifetimeWins' | 'colour' | 'owner' | 'stableId' | 'status' | 'dateLastRaced' | 'lastBreezed' | 'lastBreezeTime' | 'nextListing';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
}

const availableColumns: ColumnConfig[] = [
  { key: 'born', label: 'Month/Year Born' },
  { key: 'sex', label: 'Sex' },
  { key: 'colour', label: 'Colour' },
  { key: 'owner', label: 'Owner' },
  { key: 'stableId', label: 'Stable ID' },
  { key: 'status', label: 'Status' },
  { key: 'lastRace', label: 'Last Race' },
  { key: 'dateLastRaced', label: 'Date Last Raced' },
  { key: 'lastBreeze', label: 'Last Breeze' },
  { key: 'lastBreezed', label: 'Last Breezed' },
  { key: 'lastBreezeTime', label: 'Last Breeze Time' },
  { key: 'nextListing', label: 'Next Listing' },
  { key: 'lifetimePurse', label: 'Lifetime Purse' },
  { key: 'vet', label: 'Vet' },
  { key: 'breeder', label: 'Breeder' },
  { key: 'lifetimeWins', label: 'Lifetime Wins' }
];

interface ColumnCustomizerProps {
  visibleColumns: ColumnKey[];
  onColumnToggle: (columnKey: ColumnKey) => void;
}

const ColumnCustomizer = ({ visibleColumns, onColumnToggle }: ColumnCustomizerProps) => {
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

export default ColumnCustomizer;
