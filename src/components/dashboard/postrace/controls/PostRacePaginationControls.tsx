
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PostRacePaginationControlsProps {
  itemsPerPage: string;
  onItemsPerPageChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PostRacePaginationControls = ({
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPreviousPage,
  onNextPage
}: PostRacePaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Select value={itemsPerPage} onValueChange={onItemsPerPageChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
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
              onClick={onPreviousPage}
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
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostRacePaginationControls;
