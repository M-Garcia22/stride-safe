import { Horse } from "@/types/horse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import VelocityTenSecondsInfoDialog from "./VelocityTenSecondsInfoDialog";
import VelocityTenSecondsMetrics from "./VelocityTenSecondsMetrics";

interface VelocityTenSecondsCardProps {
  horse: Horse;
}

const VelocityTenSecondsCard = ({ horse }: VelocityTenSecondsCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 280 });
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Mock velocity data for first 10 seconds - converted to fps (mph * 1.467)
  const velocityData = [
    { time: 0, velocity: 0 },
    { time: 1, velocity: 17.6 }, // 12 mph * 1.467
    { time: 2, velocity: 41.1 }, // 28 mph * 1.467
    { time: 3, velocity: 51.3 }, // 35 mph * 1.467
    { time: 4, velocity: 60.1 }, // 41 mph * 1.467
    { time: 5, velocity: 64.5 }, // 44 mph * 1.467
    { time: 6, velocity: 67.5 }, // 46 mph * 1.467
    { time: 7, velocity: 69.0 }, // 47 mph * 1.467
    { time: 8, velocity: 70.4 }, // 48 mph * 1.467
    { time: 9, velocity: 71.2 }, // 48.5 mph * 1.467
    { time: 10, velocity: 71.9 } // 49 mph * 1.467
  ];

  const maxVelocity = Math.max(...velocityData.map(d => d.velocity));

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Account for CardContent padding (24px on each side = 48px total)
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
