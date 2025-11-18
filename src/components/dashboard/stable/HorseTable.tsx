import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, Star, TreePine, ArrowUp, Trash2, Eye, Home, UserX } from "lucide-react";
import TripleRings from "../TripleRings";
import ColumnCustomizer from "./ColumnCustomizer";

type ColumnKey = 'born' | 'sex' | 'lastRace' | 'lastBreeze' | 'lifetimePurse' | 'vet' | 'breeder' | 'lifetimeWins' | 'colour' | 'owner' | 'stableId' | 'status' | 'dateLastRaced' | 'lastBreezed' | 'lastBreezeTime' | 'nextListing';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  className?: string;
}

interface Horse {
  id: number;
  name: string;
  born?: string;
  sex?: string;
  lastRace?: string;
  lastBreeze?: string;
  performanceScore: number;
  wellnessScore: number;
  performanceRingScore: number;
  welfareAlert: boolean;
  isFollowing?: boolean;
  followedHorse?: boolean;
  hasUpcomingRace?: boolean;
  nextRace?: string | null;
  lifetimePurse?: string;
  vet?: string;
  breeder?: string;
  lifetimeWins?: number;
  paddockMode?: boolean;
  status?: string;
  birthMonth?: string;
  birthYear?: number;
  colour?: string;
  owner?: string;
  stableId?: string;
  dateLastRaced?: string | null;
  lastBreezed?: string | null;
  lastBreezeTime?: string | null;
  nextListing?: string | null;
}

interface HorseTableProps {
  horses: Horse[];
  visibleColumns?: ColumnKey[];
  isEditMode?: boolean;
  selectedHorse?: Horse | null;
  onHorseSelect?: (horse: Horse) => void;
  onToggleFollow?: (horseId: number) => void;
  onVetMessage?: (horseName: string) => void;
  onEditAction?: (horseId: number, action: 'remove' | 'paddock' | 'activate') => void;
  onViewProfile?: (horseId: number) => void;
  onMoveAction?: (horseId: number, action: 'paddock' | 'remove') => void;
  showEditActions?: boolean;
  showAllColumns?: boolean;
  onColumnToggle?: (columnKey: ColumnKey) => void;
}

const allColumns: ColumnConfig[] = [
  { key: 'born', label: 'Month/Year Born', className: 'hidden sm:table-cell' },
  { key: 'sex', label: 'Sex', className: 'hidden md:table-cell' },
  { key: 'colour', label: 'Colour', className: 'hidden lg:table-cell' },
  { key: 'owner', label: 'Owner', className: 'hidden xl:table-cell' },
  { key: 'stableId', label: 'Stable ID', className: 'hidden sm:table-cell' },
  { key: 'status', label: 'Status' },
  { key: 'dateLastRaced', label: 'Date Last Raced', className: 'hidden md:table-cell' },
  { key: 'lastBreezed', label: 'Last Breezed', className: 'hidden lg:table-cell' },
  { key: 'lastBreezeTime', label: 'Last Breeze Time', className: 'hidden xl:table-cell' },
  { key: 'nextListing', label: 'Next Listing', className: 'hidden lg:table-cell' },
  { key: 'lastRace', label: 'Last Race' },
  { key: 'lastBreeze', label: 'Last Breeze' },
  { key: 'lifetimePurse', label: 'Lifetime Purse' },
  { key: 'vet', label: 'Vet' },
  { key: 'breeder', label: 'Breeder' },
  { key: 'lifetimeWins', label: 'Lifetime Wins' }
];

const HorseTable = ({ 
  horses, 
  visibleColumns = [], 
  isEditMode = false, 
  selectedHorse,
  onHorseSelect,
  onToggleFollow,
  onVetMessage,
  onEditAction,
  onViewProfile,
  onMoveAction,
  showEditActions = false,
  showAllColumns = false,
  onColumnToggle
}: HorseTableProps) => {
  const [itemsPerPage, setItemsPerPage] = useState<string>("20");
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status: string, paddockMode: boolean) => {
    if (paddockMode) {
      return 'bg-orange-100 text-orange-800';
    }
    
    const variants: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Rest': 'bg-blue-100 text-blue-800',
      'Medical': 'bg-red-100 text-red-800',
      'Paddock': 'bg-orange-100 text-orange-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const renderColumnValue = (horse: Horse, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'born':
        return horse.born || (horse.birthMonth && horse.birthYear ? `${horse.birthMonth} ${horse.birthYear}` : '');
      case 'sex':
        return horse.sex;
      case 'colour':
        return horse.colour;
      case 'owner':
        return horse.owner;
      case 'stableId':
        return horse.stableId;
      case 'status':
        return (
          <Badge className={getStatusBadge(horse.status || '', horse.paddockMode || false)}>
            {horse.paddockMode ? 'Paddock' : horse.status}
          </Badge>
        );
      case 'dateLastRaced':
        return horse.dateLastRaced ? new Date(horse.dateLastRaced).toLocaleDateString() : 'N/A';
      case 'lastBreezed':
        return horse.lastBreezed ? new Date(horse.lastBreezed).toLocaleDateString() : 'N/A';
      case 'lastBreezeTime':
        return horse.lastBreezeTime ? `${horse.lastBreezeTime}s` : 'N/A';
      case 'nextListing':
        return horse.nextListing ? new Date(horse.nextListing).toLocaleDateString() : 'N/A';
      case 'lastRace':
        return horse.lastRace || (horse.dateLastRaced ? new Date(horse.dateLastRaced).toLocaleDateString() : 'N/A');
      case 'lastBreeze':
        return horse.lastBreeze || (horse.lastBreezed ? new Date(horse.lastBreezed).toLocaleDateString() : 'N/A');
      case 'lifetimePurse':
        return horse.lifetimePurse;
      case 'vet':
        return horse.vet;
      case 'breeder':
        return horse.breeder;
      case 'lifetimeWins':
        return horse.lifetimeWins;
      default:
        return '';
    }
  };

  // Determine which columns to display
  const getDisplayColumns = () => {
    if (showAllColumns) {
      // For "In Training" tab, use visibleColumns to filter allColumns
      return allColumns.filter(col => visibleColumns.includes(col.key));
    } else {
      // For other tabs, use the basic columns from visibleColumns
      return allColumns.filter(col => visibleColumns.includes(col.key));
    }
  };

  const displayColumns = getDisplayColumns();

  // Pagination logic
  const totalItems = horses.length;
  const itemsToShow = itemsPerPage === "all" ? totalItems : parseInt(itemsPerPage);
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / itemsToShow);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsToShow;
  const endIndex = itemsPerPage === "all" ? totalItems : startIndex + itemsToShow;
  const paginatedHorses = horses.slice(startIndex, endIndex);

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
          {showAllColumns && onColumnToggle && (
            <ColumnCustomizer
              visibleColumns={visibleColumns}
              onColumnToggle={onColumnToggle}
            />
          )}
          
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
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              <TableHead>Wellness</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHorses.map((horse) => (
              <TableRow 
                key={horse.id}
                className={`cursor-pointer hover:bg-muted/50 ${selectedHorse?.id === horse.id ? 'bg-primary/10' : ''}`}
                onClick={() => !isEditMode && onHorseSelect && onHorseSelect(horse)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {horse.paddockMode && <TreePine className="w-4 h-4 text-orange-500" />}
                    <div>
                      <p className="font-medium">{horse.name}</p>
                      {showAllColumns && (
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {horse.birthMonth} {horse.birthYear}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                {displayColumns.map(column => (
                  <TableCell key={column.key} className={column.className}>
                    {renderColumnValue(horse, column.key)}
                  </TableCell>
                ))}
                <TableCell>
                  <TripleRings
                    size="small"
                    performanceScore={horse.performanceScore}
                    welfareAlert={horse.welfareAlert}
                    wellnessScore={horse.wellnessScore}
                    performanceRingScore={horse.performanceRingScore}
                    paddockMode={horse.paddockMode}
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVetMessage && onVetMessage(horse.name)}
                      className="h-8 w-8 p-0"
                      title="Send message to veterinarian"
                    >
                      <Stethoscope className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleFollow && onToggleFollow(horse.id)}
                      className={`h-8 w-8 p-0 ${(horse.followedHorse || horse.isFollowing) ? 'bg-yellow-100 text-yellow-700' : ''}`}
                      title={(horse.followedHorse || horse.isFollowing) ? 'Remove from watch list' : 'Add to watch list'}
                    >
                      <Star className={`w-3 h-3 ${(horse.followedHorse || horse.isFollowing) ? 'fill-current' : ''}`} />
                    </Button>
                    {onViewProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProfile(horse.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    {(showEditActions || isEditMode) && onEditAction && (
                      <>
                        {horse.paddockMode ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditAction(horse.id, 'activate')}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditAction(horse.id, 'paddock')}
                            className="h-8 w-8 p-0"
                          >
                            <TreePine className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditAction(horse.id, 'remove')}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {onMoveAction && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMoveAction(horse.id, 'paddock')}
                          className="h-8 w-8 p-0"
                        >
                          <Home className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMoveAction(horse.id, 'remove')}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HorseTable;
