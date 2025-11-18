
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "../../../data/preRaceData";

interface CategoryFilterProps {
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
  categoryCounts: Record<number, number>;
}

const CategoryFilter = ({
  selectedCategories,
  onCategoryChange,
  categoryCounts
}: CategoryFilterProps) => {
  const categories = [1, 2, 3, 4, 5];

  const toggleCategory = (category: number) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const selectAll = () => {
    onCategoryChange(categories);
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  const selectRedFlagged = () => {
    onCategoryChange([3, 4, 5]);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground">Risk Categories:</span>
      
      <div className="flex items-center gap-1">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          const count = categoryCounts[category] || 0;
          const isRedFlagged = category >= 3;
          
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCategory(category)}
              className={`h-8 px-3 ${
                isRedFlagged && !isSelected
                  ? 'border-red-300 text-red-700 hover:bg-red-50'
                  : ''
              } ${
                isRedFlagged && isSelected
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }`}
            >
              <Badge 
                variant="outline" 
                className={`mr-2 text-xs ${getCategoryColor(category)}`}
              >
                {category}
              </Badge>
              {count}
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 ml-2 border-l pl-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={selectAll}
          className="h-8 px-2 text-xs"
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={selectRedFlagged}
          className="h-8 px-2 text-xs text-red-700 hover:bg-red-50"
        >
          Red-flagged
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-8 px-2 text-xs"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilter;
