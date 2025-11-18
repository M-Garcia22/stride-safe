import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown, CheckCircle, X, AlertTriangle } from "lucide-react";
import { PreRaceHorse } from "../panes/PreRaceExaminationPane";
import PassConfirmDialog from "./PassConfirmDialog";
import ScratchConfirmDialog from "./ScratchConfirmDialog";

type ColumnKey = 'postPosition' | 'jockey' | 'trainer' | 'vet' | 'odds' | 'weight' | 'raceNumber' | 'raceTime' | 'examinationStatus' | 'regularVetApproval' | 'history' | 'welfareAlert' | 'actions';
type SortDirection = 'asc' | 'desc' | null;

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  className?: string;
}

const allColumns: ColumnConfig[] = [
  { key: 'postPosition', label: 'Post', sortable: true },
  { key: 'jockey', label: 'Jockey', sortable: true, className: 'hidden sm:table-cell' },
  { key: 'trainer', label: 'Trainer', sortable: true, className: 'hidden md:table-cell' },
  { key: 'vet', label: 'Vet', sortable: true, className: 'hidden lg:table-cell' },
  { key: 'odds', label: 'Odds', sortable: true },
  { key: 'weight', label: 'Weight', sortable: true, className: 'hidden sm:table-cell' },
  { key: 'raceNumber', label: 'Race #', sortable: true },
  { key: 'raceTime', label: 'Race Time', sortable: true, className: 'hidden md:table-cell' },
  { key: 'examinationStatus', label: 'Status', sortable: true },
  { key: 'regularVetApproval', label: 'Vet Approval', sortable: true, className: 'hidden lg:table-cell' },
  { key: 'history', label: 'History', sortable: false },
  { key: 'welfareAlert', label: 'Welfare Alert', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

interface PreRaceTableProps {
  horses: PreRaceHorse[];
  visibleColumns: ColumnKey[];
  viewMode: 'single' | 'split';
  selectedHorse?: PreRaceHorse | null;
  onHorseSelect: (horse: PreRaceHorse) => void;
  onExaminationAction: (horseId: number, action: 'scratch' | 'pass') => void;
}

const PreRaceTable = ({ 
  horses, 
  visibleColumns, 
  viewMode,
  selectedHorse,
  onHorseSelect,
  onExaminationAction
}: PreRaceTableProps) => {
  const [itemsPerPage, setItemsPerPage] = useState<string>("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  const [scratchDialogOpen, setScratchDialogOpen] = useState(false);
  const [selectedHorseForAction, setSelectedHorseForAction] = useState<PreRaceHorse | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { label: string; className: string } } = {
      'pending': { label: 'To examine', className: 'bg-gray-100 text-gray-800' },
      'in-progress': { label: 'To examine', className: 'bg-gray-100 text-gray-800' },
      'passed': { label: 'Passed', className: 'bg-green-100 text-green-800' },
      'scratched': { label: 'Scratched', className: 'bg-red-100 text-red-800' }
    };
    const variant = variants[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getApprovalBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'declined': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const renderHistoryDots = (history?: Array<{ status: 'good' | 'warning' | 'alert'; date: string }>) => {
    const totalDots = 5;
    const actualReports = history || [];
    const dotsToShow = actualReports.slice(0, totalDots);
    
    return (
      <div className="flex gap-1">
        {Array.from({ length: totalDots }, (_, index) => {
          const report = dotsToShow[index];
          
          if (report) {
            const dotColor = report.status === 'good' ? 'bg-green-500' : 
                            report.status === 'warning' ? 'bg-amber-500' : 'bg-red-500';
            return (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${dotColor}`}
                title={`${report.status} - ${report.date}`}
              />
            );
          } else {
            return (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
                title="No report available"
              />
            );
          }
        })}
      </div>
    );
  };

  const handleSort = (field: ColumnKey) => {
    if (sortField === field) {
      setSortDirection(prev => 
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedHorses = () => {
    if (!sortField || !sortDirection) return horses;

    return [...horses].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'regularVetApproval':
          aValue = a.regularVetApproval.status;
          bValue = b.regularVetApproval.status;
          break;
        case 'welfareAlert':
          aValue = a.welfareAlert ? 1 : 0;
          bValue = b.welfareAlert ? 1 : 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handlePassClick = (horse: PreRaceHorse) => {
    setSelectedHorseForAction(horse);
    setPassDialogOpen(true);
  };

  const handleScratchClick = (horse: PreRaceHorse) => {
    setSelectedHorseForAction(horse);
    setScratchDialogOpen(true);
  };

  const handlePassConfirm = () => {
    if (selectedHorseForAction) {
      onExaminationAction(selectedHorseForAction.id, 'pass');
    }
    setPassDialogOpen(false);
    setSelectedHorseForAction(null);
  };

  const handleScratchConfirm = (reason: string) => {
    if (selectedHorseForAction) {
      onExaminationAction(selectedHorseForAction.id, 'scratch');
    }
    setScratchDialogOpen(false);
    setSelectedHorseForAction(null);
  };

  const renderColumnValue = (horse: PreRaceHorse, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'postPosition':
        return horse.postPosition;
      case 'jockey':
        return horse.jockey;
      case 'trainer':
        return horse.trainer;
      case 'vet':
        return horse.vet;
      case 'odds':
        return horse.odds;
      case 'weight':
        return `${horse.weight} lbs`;
      case 'raceNumber':
        return `Race ${horse.raceNumber}`;
      case 'raceTime':
        return horse.raceTime;
      case 'examinationStatus':
        return getStatusBadge(horse.examinationStatus);
      case 'regularVetApproval':
        return (
          <Badge className={getApprovalBadge(horse.regularVetApproval.status)}>
            {horse.regularVetApproval.status.charAt(0).toUpperCase() + horse.regularVetApproval.status.slice(1)}
          </Badge>
        );
      case 'history':
        return renderHistoryDots(horse.history);
      case 'welfareAlert':
        return horse.welfareAlert ? (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        ) : null;
      case 'actions':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handlePassClick(horse);
              }}
              className="h-8 px-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              disabled={horse.examinationStatus === 'passed'}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Pass
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleScratchClick(horse);
              }}
              className="h-8 px-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              disabled={horse.examinationStatus === 'scratched'}
            >
              <X className="w-3 h-3 mr-1" />
              Scratch
            </Button>
          </div>
        );
      default:
        return '';
    }
  };

  const displayColumns = allColumns.filter(col => visibleColumns.includes(col.key));
  const sortedHorses = getSortedHorses();

  // Pagination logic
  const totalItems = sortedHorses.length;
  const itemsToShow = itemsPerPage === "all" ? totalItems : parseInt(itemsPerPage);
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / itemsToShow);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsToShow;
  const endIndex = itemsPerPage === "all" ? totalItems : startIndex + itemsToShow;
  const paginatedHorses = sortedHorses.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select value={itemsPerPage} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Horse Name</TableHead>
              {displayColumns.map(column => (
                <TableHead 
                  key={column.key} 
                  className={`${column.className || ''} ${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${sortField === column.key && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground'}`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${sortField === column.key && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHorses.map((horse) => (
              <TableRow 
                key={horse.id}
                className={`cursor-pointer hover:bg-muted/50 ${selectedHorse?.id === horse.id ? 'bg-primary/10' : ''}`}
                onClick={() => onHorseSelect(horse)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium">{horse.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Post {horse.postPosition} • {horse.jockey}
                      </p>
                    </div>
                  </div>
                </TableCell>
                {displayColumns.map(column => (
                  <TableCell key={column.key} className={column.className}>
                    {renderColumnValue(horse, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PassConfirmDialog
        open={passDialogOpen}
        onOpenChange={setPassDialogOpen}
        horse={selectedHorseForAction}
        onConfirm={handlePassConfirm}
      />

      <ScratchConfirmDialog
        open={scratchDialogOpen}
        onOpenChange={setScratchDialogOpen}
        horse={selectedHorseForAction}
        onConfirm={handleScratchConfirm}
      />
    </div>
  );
};

export default PreRaceTable;
