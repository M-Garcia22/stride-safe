import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Info, Loader2 } from "lucide-react";
import VelocityTenSecondsInfoDialog from "./VelocityTenSecondsInfoDialog";
import VelocityTenSecondsMetrics from "./VelocityTenSecondsMetrics";
import { useVelocityData } from "@/hooks/useVelocityData";

interface VelocityTenSecondsCardProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const VelocityTenSecondsCard = ({ horse, selectedReport }: VelocityTenSecondsCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 280 });
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Fetch real velocity data if we have an entry code
  const { first10SecondsData, metrics, loading, error } = useVelocityData({
    entryCode: selectedReport?.entryCode ?? null,
  });

  // Use real data if available, otherwise show placeholder
  const velocityData = first10SecondsData.length > 0 
    ? first10SecondsData 
    : [{ time: 0, velocity: 0 }];

  const maxVelocity = metrics?.maxVelocity ?? 
    Math.max(...velocityData.map(d => d.velocity), 0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const availableWidth = width - 48;
        setDimensions({
          width: Math.max(280, availableWidth),
          height: 280
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error || !selectedReport?.entryCode) {
      return (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          {error || "No velocity data available"}
        </div>
      );
    }

    if (first10SecondsData.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          No velocity data for this race
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={velocityData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="velocityGradientBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, 'dataMax']}
            tickFormatter={(value) => `${value}`}
          />
          <Area
            type="monotone"
            dataKey="velocity"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#velocityGradientBlue)"
            activeDot={{ r: 4, fill: '#3B82F6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Velocity - First 10 Seconds</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-2">
          <div ref={containerRef} className="space-y-4">
            <VelocityTenSecondsMetrics
              velocityAtPeak={maxVelocity}
            />
            
            <div className="h-48">
              {renderContent()}
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Time (seconds) vs Velocity (fps)
            </div>
          </div>
        </CardContent>
      </Card>

      <VelocityTenSecondsInfoDialog 
        open={showInfoDialog} 
        onOpenChange={setShowInfoDialog} 
      />
    </>
  );
};

export default VelocityTenSecondsCard;
