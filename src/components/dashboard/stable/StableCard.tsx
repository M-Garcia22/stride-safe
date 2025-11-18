
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Horse } from "@/types/horse";
import { AlertTriangle } from "lucide-react";

interface StableCardProps {
  horse: Horse;
  onClick: () => void;
}

const StableCard = ({ horse, onClick }: StableCardProps) => {
  // Calculate color intensity based on scores (1-140 scale)
  const getWellnessColor = (score: number) => {
    const intensity = Math.min(score / 140, 1);
    const hue = 200; // Blue hue
    const saturation = 60 + (intensity * 40); // 60-100%
    const lightness = 70 - (intensity * 20); // 70-50%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getPerformanceColor = (score: number) => {
    const intensity = Math.min(score / 140, 1);
    const hue = 45; // Golden yellow hue
    const saturation = 60 + (intensity * 40); // 60-100%
    const lightness = 70 - (intensity * 20); // 70-50%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with name and welfare alert */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{horse.name}</h3>
            <p className="text-sm text-gray-600">
              {horse.yearOfBirth} • {horse.sex} • {horse.color}
            </p>
          </div>
          {horse.welfareAlert && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          )}
        </div>

        {/* Score badges */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary"
            style={{ 
              backgroundColor: getPerformanceColor(horse.performanceScore),
              color: 'white',
              fontWeight: '600'
            }}
            className="text-xs px-2 py-1"
          >
            Performance: {horse.performanceScore}
          </Badge>
          <Badge 
            variant="secondary"
            style={{ 
              backgroundColor: getWellnessColor(horse.wellnessScore),
              color: 'white',
              fontWeight: '600'
            }}
            className="text-xs px-2 py-1"
          >
            Wellness: {horse.wellnessScore}
          </Badge>
        </div>

        {/* Additional info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Trainer:</span>
            <span>{horse.trainer}</span>
          </div>
          <div className="flex justify-between">
            <span>Owner:</span>
            <span>{horse.owner}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Report:</span>
            <span>{horse.daysSinceLastReport} days ago</span>
          </div>
        </div>

        {horse.description && (
          <p className="text-xs text-gray-600 italic border-t pt-2">
            {horse.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StableCard;
