
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { format, subMonths, isAfter, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPerformanceColor, getWellnessColor } from "@/lib/colorUtils";

interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

interface TrendsHistoryTableProps {
  data: TrendsEvent[];
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  eventTypes: 'both' | 'race' | 'breeze';
  selectedEventId: string | null;
  highlightedEventId: string | null;
  onEventSelect: (eventId: string) => void;
  onEventHighlight: (eventId: string | null) => void;
}

const TrendsHistoryTable = ({
  data,
  timeframe,
  eventTypes,
  selectedEventId,
  highlightedEventId,
  onEventSelect,
  onEventHighlight
}: TrendsHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TrendsEvent | null>(null);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by timeframe
    if (timeframe !== 'all') {
      const months = parseInt(timeframe.replace('m', ''));
      const cutoffDate = subMonths(new Date(), months);
      filtered = filtered.filter(event => isAfter(parseISO(event.date), cutoffDate));
    }

    // Filter by event type
    if (eventTypes !== 'both') {
      filtered = filtered.filter(event => event.type === eventTypes);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, timeframe, eventTypes]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  // Reset to page 1 when records per page changes
  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const getScoreBadge = (score: number, type: 'performance' | 'wellness') => {
    const color = type === 'performance' ? getPerformanceColor(score) : getWellnessColor(score);
    
    return (
      <Badge 
        variant="outline" 
        className="font-medium border-0 text-white text-xs px-1.5 py-0.5"
        style={{ backgroundColor: color }}
      >
        {score}
      </Badge>
    );
  };

  const handleActionClick = (action: string, record: TrendsEvent) => {
    if (action === 'summary') {
      setSelectedRecord(record);
      setShowSummaryDialog(true);
    } else if (action === 'fullReport') {
      console.log('Navigate to full report for:', record.id);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="flex-shrink-0 p-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold truncate">Historic Records</h4>
              <p className="text-xs text-muted-foreground">{filteredData.length} found</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-muted-foreground">Show:</span>
              <Select value={recordsPerPage.toString()} onValueChange={handleRecordsPerPageChange}>
                <SelectTrigger className="w-[60px] h-7 text-xs">
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

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto min-h-0">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="text-xs px-2 py-2">Date</TableHead>
                <TableHead className="text-xs px-2 py-2">Type</TableHead>
                <TableHead className="text-xs px-2 py-2">Track</TableHead>
                <TableHead className="text-xs px-2 py-2">Dist</TableHead>
                <TableHead className="text-xs px-2 py-2">Perf</TableHead>
                <TableHead className="text-xs px-2 py-2">Well</TableHead>
                <TableHead className="text-xs px-2 py-2">Alert</TableHead>
                <TableHead className="w-[30px] px-1 py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => onEventSelect(event.id)}
                  onMouseEnter={() => onEventHighlight(event.id)}
                  onMouseLeave={() => onEventHighlight(null)}
                  className={cn(
                    "cursor-pointer hover:bg-accent transition-colors",
                    selectedEventId === event.id && "bg-accent",
                    highlightedEventId === event.id && "bg-accent/50"
                  )}
                >
                  <TableCell className="text-xs px-2 py-2 font-medium">
                    {format(parseISO(event.date), 'MMM dd')}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <Badge 
                      variant={event.type === 'race' ? 'default' : 'secondary'}
                      className="text-xs px-1.5 py-0.5"
                    >
                      {event.type === 'race' ? 'R' : 'T'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs px-2 py-2 max-w-[80px] truncate" title={event.location}>
                    {event.location}
                  </TableCell>
                  <TableCell className="text-xs px-2 py-2">{event.distance}</TableCell>
                  <TableCell className="px-2 py-2">
                    {getScoreBadge(event.performanceScore, 'performance')}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    {getScoreBadge(event.wellnessScore, 'wellness')}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    {event.welfareAlert && (
                      <Badge variant="destructive" className="text-xs px-1 py-0.5">
                        !
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-1 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick('summary', event);
                          }}
                        >
                          Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick('fullReport', event);
                          }}
                        >
                          Full Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-xs text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Compact Pagination */}
        {totalPages > 1 && (
          <div className="flex-shrink-0 flex items-center justify-between p-2 border-t">
            <div className="text-xs text-muted-foreground">
              {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredData.length)} of {filteredData.length}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs px-1">
                {currentPage}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Dialog */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRecord && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{format(parseISO(selectedRecord.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="capitalize">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p>{selectedRecord.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Distance:</span>
                    <p>{selectedRecord.distance}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Performance Score:</span>
                    {getScoreBadge(selectedRecord.performanceScore, 'performance')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Wellness Score:</span>
                    {getScoreBadge(selectedRecord.wellnessScore, 'wellness')}
                  </div>
                  {selectedRecord.welfareAlert && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Welfare Alert:</span>
                      <Badge variant="destructive" className="text-xs">Active</Badge>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrendsHistoryTable;
