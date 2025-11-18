
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PostRaceHorse, PostRaceColumnKey } from "../../../data/postRaceData";
import PostRacePaginationControls from "./controls/PostRacePaginationControls";
import PostRaceTableHeader from "./table/PostRaceTableHeader";
import PostRaceTableRow from "./table/PostRaceTableRow";

type SortDirection = 'asc' | 'desc' | null;

interface PostRaceTableProps {
  horses: PostRaceHorse[];
  visibleColumns: PostRaceColumnKey[];
  viewMode: 'single' | 'split';
  selectedHorse?: PostRaceHorse | null;
  onHorseSelect: (horse: PostRaceHorse) => void;
}

const PostRaceTable = ({ 
  horses, 
  visibleColumns, 
  viewMode,
  selectedHorse,
  onHorseSelect
}: PostRaceTableProps) => {
  const [itemsPerPage, setItemsPerPage] = useState<string>("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<PostRaceColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: PostRaceColumnKey) => {
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
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'finish') {
        aValue = a.finishPosition || 999;
        bValue = b.finishPosition || 999;
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

  const sortedHorses = getSortedHorses();

  // Pagination logic
  const totalItems = sortedHorses.length;
  const itemsToShow = itemsPerPage === "all" ? totalItems : parseInt(itemsPerPage);
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / itemsToShow);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsToShow;
  const endIndex = itemsPerPage === "all" ? totalItems : startIndex + itemsToShow;
  const paginatedHorses = sortedHorses.slice(startIndex, endIndex);

  const allColumns = [
    { key: 'race' as PostRaceColumnKey, label: 'Race', sortable: true },
    { key: 'finish' as PostRaceColumnKey, label: 'Finish', sortable: true },
    { key: 'welfare' as PostRaceColumnKey, label: 'Welfare', sortable: true },
    { key: 'risk' as PostRaceColumnKey, label: 'Risk', sortable: true },
    { key: 'cFx' as PostRaceColumnKey, label: 'C-Fx', sortable: false },
    { key: 'sFx' as PostRaceColumnKey, label: 'S-Fx', sortable: false },
    { key: 'lf' as PostRaceColumnKey, label: 'LF', sortable: false },
    { key: 'rf' as PostRaceColumnKey, label: 'RF', sortable: false },
    { key: 'bf' as PostRaceColumnKey, label: 'BF', sortable: false },
    { key: 'hl' as PostRaceColumnKey, label: 'HL', sortable: false },
    { key: 'welfareAlert' as PostRaceColumnKey, label: 'Welfare Alert', sortable: true }
  ];

  const displayColumns = allColumns.filter(col => visibleColumns.includes(col.key));

  return (
    <div className="space-y-4 w-full min-w-0">
      <PostRacePaginationControls
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        onPreviousPage={() => setCurrentPage(currentPage - 1)}
        onNextPage={() => setCurrentPage(currentPage + 1)}
      />

      <div className="w-full overflow-x-auto">
        <div className={`min-w-full ${viewMode === 'split' ? 'min-w-[600px]' : ''}`}>
          <Table>
            <PostRaceTableHeader
              displayColumns={displayColumns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {paginatedHorses.map((horse) => (
                <PostRaceTableRow
                  key={horse.id}
                  horse={horse}
                  displayColumns={displayColumns}
                  selectedHorse={selectedHorse}
                  onHorseSelect={onHorseSelect}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PostRaceTable;
