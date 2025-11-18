
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StrideNavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const StrideNavigationControls = ({ 
  onPrevious, 
  onNext, 
  className = "" 
}: StrideNavigationControlsProps) => {
  // Default positioning for overlay mode
  const defaultClasses = "absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none";
  
  // Check if we're in a custom positioning mode (when className overrides default positioning)
  const isCustomPositioning = className.includes("relative") || className.includes("static");
  
  const containerClasses = isCustomPositioning 
    ? `flex justify-between ${className}`
    : `${defaultClasses} ${className}`;

  return (
    <div className={containerClasses}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrevious}
        className="flex items-center gap-1 pointer-events-auto bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onNext}
        className="flex items-center gap-1 pointer-events-auto bg-background/80 backdrop-blur-sm"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default StrideNavigationControls;
