import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Message to display below the spinner */
  message?: string;
  /** Size of the spinner: sm, md, lg */
  size?: "sm" | "md" | "lg";
  /** Additional className for the container */
  className?: string;
  /** Whether to center the spinner in a full container */
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const containerHeights = {
  sm: "h-32",
  md: "h-64",
  lg: "h-96",
};

export function LoadingSpinner({ 
  message, 
  size = "md", 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "min-h-screen" : containerHeights[size],
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {message && (
          <p className="text-muted-foreground text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}

