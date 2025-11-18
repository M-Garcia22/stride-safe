
import { useState } from "react";
import { VelocityEvent } from "@/types/velocity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface VelocityHistoryTableProps {
  data: VelocityEvent[];
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
  onEventHighlight: (eventId: string | null) => void;
  isComparisonMode?: boolean;
  selectedComparisonIds?: string[];
}

// Define comparison colors - 5 colors for comparison races
const COMPARISON_COLORS = [
  { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
  { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
  { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800' },
];

// Blue color for most recent event
const MOST_RECENT_COLOR = { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' };

const VelocityHistoryTable = ({
  data,
  selectedEventId,
  onEventSelect,
  onEventHighlight,
  isComparisonMode = false,
  selectedComparisonIds = []
}: VelocityHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Calculate pagination
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  const getRowBackgroundClass = (event: VelocityEvent) => {
    // Most recent event (first in array) gets blue highlight
    const isMostRecent = data.length > 0 && event.id === data[0].id;
    
    if (isComparisonMode) {
      // In comparison mode, most recent gets blue, others get comparison colors
      if (isMostRecent) {
        return MOST_RECENT_COLOR;
      }
      
      const comparisonIndex = selectedComparisonIds.indexOf(event.id);
      if (comparisonIndex !== -1) {
        return COMPARISON_COLORS[comparisonIndex % COMPARISON_COLORS.length];
      }
    } else {
      // In normal mode, selected event gets blue (usually the most recent)
      if (selectedEventId === event.id) {
        return MOST_RECENT_COLOR;
      }
    }
    return null;
  };

  const isSelectable = (eventId: string) => {
    if (!isComparisonMode) return true;
    
    // Most recent is always highlighted in comparison mode
    const isMostRecent = data.length > 0 && eventId === data[0].id;
    if (isMostRecent) return false; // Not selectable as it's always shown
    
    return selectedComparisonIds.includes(eventId) || selectedComparisonIds.length < 5;
  };

  const isSelected = (eventId: string) => {
    if (isComparisonMode) {
      // Most recent is always "selected" in comparison mode
      const isMostRecent = data.length > 0 && eventId === data[0].id;
      return isMostRecent || selectedComparisonIds.includes(eventId);
    }
    return selectedEventId === eventId;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Historic Race Records</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isComparisonMode 
                ? `Most recent race (blue) + select up to 5 additional races to compare (${selectedComparisonIds.length}/5 selected)`
                : `Showing ${startIndex + 1}-${Math.min(endIndex, totalRecords)} of ${totalRecords} race events`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show:</span>
            <Select value={recordsPerPage.toString()} onValueChange={handleRecordsPerPageChange}>
              <SelectTrigger className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {isComparisonMode && <TableHead className="w-12 text-xs">Select</TableHead>}
              <TableHead className="w-20 text-xs">Date</TableHead>
              <TableHead className="text-xs">Track</TableHead>
              <TableHead className="w-24 text-xs">Distance</TableHead>
              <TableHead className="w-20 text-xs">Max Speed</TableHead>
              <TableHead className="w-20 text-xs">Avg Speed</TableHead>
              <TableHead className="w-16 text-xs">Time</TableHead>
              {!isComparisonMode && <TableHead className="w-16 text-xs">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((event) => {
              const colorClass = getRowBackgroundClass(event);
              const canSelect = isSelectable(event.id);
              const isEventSelected = isSelected(event.id);
              const isMostRecent = data.length > 0 && event.id === data[0].id;
              
              return (
                <TableRow
                  key={event.id}
                  className={`cursor-pointer transition-colors ${
                    colorClass 
                      ? `${colorClass.bg} ${colorClass.border} border-2`
                      : canSelect 
                        ? 'hover:bg-muted/50' 
                        : isComparisonMode && !canSelect
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-muted/50'
                  }`}
                  onMouseEnter={() => !isComparisonMode && onEventHighlight(event.id)}
                  onMouseLeave={() => !isComparisonMode && onEventHighlight(null)}
                  onClick={() => canSelect && onEventSelect(event.id)}
                >
                  {isComparisonMode && (
                    <TableCell className="text-center">
                      {isMostRecent ? (
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${MOST_RECENT_COLOR.bg} ${MOST_RECENT_COLOR.border} border-2`}>
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                      ) : isEventSelected && selectedComparisonIds.includes(event.id) ? (
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${colorClass?.bg} ${colorClass?.border} border-2`}>
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      ) : null}
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-xs">
                    {event.formattedDate}
                  </TableCell>
                  <TableCell className="text-xs">{event.location}</TableCell>
                  <TableCell className="text-xs">{event.distance}</TableCell>
                  <TableCell className="text-xs font-medium">
                    {event.maxVelocity} mph
                  </TableCell>
                  <TableCell className="text-xs">
                    {event.avgVelocity} mph
                  </TableCell>
                  <TableCell className="text-xs">{event.raceTime}</TableCell>
                  {!isComparisonMode && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventSelect(event.id);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-7 w-7 p-0 text-xs ${
                      currentPage === pageNum 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 border' 
                        : 'border bg-background text-foreground hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VelocityHistoryTable;
