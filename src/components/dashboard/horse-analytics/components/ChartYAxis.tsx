
import { ChartConfig } from "../types/trendsChart";
import { getYAxisLabels } from "../utils/nonLinearScale";

interface ChartYAxisProps {
  chartConfig: ChartConfig;
  width: number;
}

const ChartYAxis = ({ chartConfig, width }: ChartYAxisProps) => {
  const yAxisLabels = getYAxisLabels();

  return (
    <g>
      {/* "Score" axis label - now on the right */}
      <text
        x={width - chartConfig.padding.right + 45}
        y={chartConfig.padding.top + chartConfig.chartHeight / 2}
        textAnchor="middle"
        className="text-sm fill-gray-600 font-medium"
        transform={`rotate(90, ${width - chartConfig.padding.right + 45}, ${chartConfig.padding.top + chartConfig.chartHeight / 2})`}
      >
        Score
      </text>
      
      {yAxisLabels.map(({ value, position }, index) => {
        const y = chartConfig.padding.top + (1 - position) * chartConfig.chartHeight;
        const isBottomLine = value === 1;
        
        return (
          <g key={value}>
            <text
              x={width - chartConfig.padding.right + 25}
              y={y + 4}
              textAnchor="start"
              className="text-xs fill-gray-500 font-normal"
            >
              {value}
            </text>
            <line
              x1={chartConfig.padding.left}
              y1={y}
              x2={width - chartConfig.padding.right}
              y2={y}
              stroke={isBottomLine ? "#6B7280" : "#E5E7EB"}
              strokeWidth={isBottomLine ? 2 : 1}
            />
          </g>
        );
      })}
      
      {/* Right Y-axis line */}
      <line
        x1={width - chartConfig.padding.right}
        y1={chartConfig.padding.top}
        x2={width - chartConfig.padding.right}
        y2={chartConfig.padding.top + chartConfig.chartHeight}
        stroke="#6B7280"
        strokeWidth={2}
      />
    </g>
  );
};

export default ChartYAxis;
