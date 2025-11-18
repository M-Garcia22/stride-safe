
import { Search } from "lucide-react";

const NoHorseSelected = () => {
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      <div className="text-center">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">No horse selected</p>
        <p className="text-sm">Use the search function to select a horse from your stable</p>
      </div>
    </div>
  );
};

export default NoHorseSelected;
