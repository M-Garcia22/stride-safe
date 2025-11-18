import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RaceBreeze } from '@/types/performance';
import { cn } from "@/lib/utils";

interface RaceBreezesTableProps {
  data: RaceBreeze[];
  highlightedDate: string | null;
  selectedEntryId: string | null;
  onRowClick: (entry: RaceBreeze) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const RaceBreezesTable = ({
  data,
  highlightedDate,
  selectedEntryId,
  onRowClick,
  isCollapsed,
  onToggleCollapse
}: RaceBreezesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Track</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Wellness</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow
            key={entry.id}
            onClick={() => onRowClick(entry)}
            className={cn(
              "cursor-pointer hover:bg-muted",
              highlightedDate === entry.date && "bg-accent hover:bg-accent",
              selectedEntryId === entry.id && "ring-2 ring-primary"
            )}
          >
            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={entry.type === 'race' ? 'default' : 'secondary'}>
                {entry.type}
              </Badge>
            </TableCell>
            <TableCell>{entry.track}</TableCell>
            <TableCell>{entry.performanceScore}</TableCell>
            <TableCell>{entry.wellnessScore}</TableCell>
          </TableRow>
        ))}
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No data found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RaceBreezesTable;
