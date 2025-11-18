
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { PostRaceColumnKey } from "../../../../data/postRaceData";

type SortDirection = 'asc' | 'desc' | null;

interface PostRaceTableHeaderProps {
  displayColumns: Array<{ key: PostRaceColumnKey; label: string; sortable: boolean }>;
  sortField: PostRaceColumnKey | null;
  sortDirection: SortDirection;
  onSort: (field: PostRaceColumnKey) => void;
}

const PostRaceTableHeader = ({
  displayColumns,
  sortField,
  sortDirection,
  onSort
}: PostRaceTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[120px]">Horse Name</TableHead>
        {displayColumns.map(column => (
          <TableHead 
            key={column.key} 
            className={`${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
            onClick={() => column.sortable && onSort(column.key)}
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
  );
};

export default PostRaceTableHeader;
