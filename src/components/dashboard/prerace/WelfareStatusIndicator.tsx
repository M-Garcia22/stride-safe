
import { cn } from "@/lib/utils";

interface WelfareStatusIndicatorProps {
  status: 'good' | 'warning' | 'alert';
  size?: 'sm' | 'md';
}

const WelfareStatusIndicator = ({ status, size = 'md' }: WelfareStatusIndicatorProps) => {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'alert':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={cn("rounded-full", dotSize, getStatusColor(status))} />
  );
};

export default WelfareStatusIndicator;
