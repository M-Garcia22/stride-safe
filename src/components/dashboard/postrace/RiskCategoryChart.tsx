
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from "recharts";

interface RiskCategoryChartProps {
  historicalData: any[];
  showAggregate: boolean;
  showMeanTrend: boolean;
  showLinearTrend: boolean;
  visibleCategories: Record<number, boolean>;
  showTrackSAFEOverlay: boolean;
  showWeatherOverlay: boolean;
  selectedWeatherMetric: 'temperature' | 'windSpeed' | 'precipitation';
  getRiskCategoryColor: (category: number, sensitivityLevel?: 'low' | 'medium' | 'high') => string;
  getSensitivityStyling: (category: number, level: 'low' | 'medium' | 'high') => any;
  currentSensitivitySettings: any;
  onDataPointClick: (data: any) => void;
  getWeatherMetricColor: () => string;
  getWeatherMetricName: () => string;
}

const RiskCategoryChart = ({
  historicalData,
  showAggregate,
  showMeanTrend,
  showLinearTrend,
  visibleCategories,
  showTrackSAFEOverlay,
  showWeatherOverlay,
  selectedWeatherMetric,
  getRiskCategoryColor,
  getSensitivityStyling,
  currentSensitivitySettings,
  onDataPointClick,
  getWeatherMetricColor,
  getWeatherMetricName
}: RiskCategoryChartProps) => {
  return (
    <div className="h-96 border rounded-lg p-2 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={historicalData} onClick={onDataPointClick}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.7} />
          <XAxis 
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            interval="preserveStartEnd"
            axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: '%', angle: 0, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
          />
          {(showTrackSAFEOverlay || showWeatherOverlay) && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ 
                value: showTrackSAFEOverlay ? 'TrackSAFE Index' : getWeatherMetricName(), 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle' } 
              }}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            />
          )}
          <RechartsTooltip 
            labelFormatter={(value, payload) => {
              if (payload && payload[0]) {
                return `Date: ${payload[0].payload.date}`;
              }
              return value;
            }}
            formatter={(value: number, name: string) => {
              if (name === 'trackSAFEIndex') {
                return [`${value.toFixed(0)}`, 'TrackSAFE Index'];
              }
              if (name === selectedWeatherMetric) {
                return [`${value.toFixed(1)}${selectedWeatherMetric === 'precipitation' ? '/100 in' : selectedWeatherMetric === 'temperature' ? '°F' : ' mph'}`, getWeatherMetricName()];
              }
              if (name.includes('trend')) {
                return [`${value.toFixed(1)}%`, `Trend ${name.replace('trend', '').replace('aggregate', 'Aggregate')}`];
              }
              if (name.includes('aggregate')) {
                return [`${value.toFixed(1)}%`, name.includes('Mean') ? 'Aggregate Avg' : 'Aggregate'];
              }
              return [
                `${value.toFixed(1)}%`, 
                name.includes('mean') ? `Avg Cat ${name.replace('mean', '').replace('aggregate', 'Aggregate')}` : `Cat ${name.replace('cat', '')}`
              ];
            }}
            contentStyle={{ 
              fontSize: '11px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
            iconType="line"
          />
          
          {/* Enhanced line rendering with sensitivity styling */}
          {showAggregate ? (
            <>
              {/* Aggregate curve */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="aggregate"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 2 }}
                name="Aggregate"
                strokeOpacity={0.9}
              />
              
              {/* Aggregate weekly mean */}
              {showMeanTrend && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="aggregateMean"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  strokeDasharray="8 4"
                  dot={{ r: 0 }}
                  activeDot={{ r: 5, fill: '#4f46e5', strokeWidth: 2 }}
                  name="Aggregate Avg"
                  strokeOpacity={0.8}
                />
              )}
              
              {/* Aggregate linear trend */}
              {showLinearTrend && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="aggregateTrend"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  strokeDasharray="12 6"
                  dot={false}
                  name="Aggregate Trend"
                  strokeOpacity={0.7}
                />
              )}
            </>
          ) : (
            <>
              {/* Individual category curves with sensitivity styling */}
              {[1, 2, 3, 4, 5].map(category => {
                const settingKey = `category${category}` as keyof typeof currentSensitivitySettings;
                const settingValue = currentSensitivitySettings[settingKey];
                const sensitivityLevel = (typeof settingValue === 'string' && 
                  (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
                  ? settingValue : 'medium';
                const styling = getSensitivityStyling(category, sensitivityLevel);
                
                return visibleCategories[category] && (
                  <Line
                    key={category}
                    yAxisId="left"
                    type="monotone"
                    dataKey={`cat${category}`}
                    stroke={getRiskCategoryColor(category, sensitivityLevel)}
                    strokeWidth={styling.strokeWidth}
                    strokeOpacity={styling.strokeOpacity}
                    dot={{ r: styling.dotRadius, fill: getRiskCategoryColor(category, sensitivityLevel), strokeWidth: 2 }}
                    activeDot={{ r: styling.activeDotRadius, fill: getRiskCategoryColor(category, sensitivityLevel), strokeWidth: 2 }}
                    name={`Cat ${category}`}
                    className={sensitivityLevel === 'high' ? 'animate-pulse' : undefined}
                  />
                );
              })}
              
              {/* Weekly mean trend lines */}
              {showMeanTrend && [1, 2, 3, 4, 5].map(category => {
                const settingKey = `category${category}` as keyof typeof currentSensitivitySettings;
                const settingValue = currentSensitivitySettings[settingKey];
                const sensitivityLevel = (typeof settingValue === 'string' && 
                  (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
                  ? settingValue : 'medium';
                const styling = getSensitivityStyling(category, sensitivityLevel);
                
                return visibleCategories[category] && (
                  <Line
                    key={`mean${category}`}
                    yAxisId="left"
                    type="monotone"
                    dataKey={`mean${category}`}
                    stroke={getRiskCategoryColor(category, sensitivityLevel)}
                    strokeWidth={styling.strokeWidth}
                    strokeDasharray="8 4"
                    dot={{ r: 0 }}
                    activeDot={{ r: styling.activeDotRadius, fill: getRiskCategoryColor(category, sensitivityLevel), strokeWidth: 2 }}
                    name={`Avg ${category}`}
                    strokeOpacity={styling.strokeOpacity}
                  />
                );
              })}
              
              {/* Linear trend lines */}
              {showLinearTrend && [1, 2, 3, 4, 5].map(category => {
                const settingKey = `category${category}` as keyof typeof currentSensitivitySettings;
                const settingValue = currentSensitivitySettings[settingKey];
                const sensitivityLevel = (typeof settingValue === 'string' && 
                  (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
                  ? settingValue : 'medium';
                const styling = getSensitivityStyling(category, sensitivityLevel);
                
                return visibleCategories[category] && (
                  <Line
                    key={`trend${category}`}
                    yAxisId="left"
                    type="monotone"
                    dataKey={`trend${category}`}
                    stroke={getRiskCategoryColor(category, sensitivityLevel)}
                    strokeWidth={styling.strokeWidth}
                    strokeDasharray="12 6"
                    dot={false}
                    name={`Trend ${category}`}
                    strokeOpacity={styling.strokeOpacity}
                  />
                );
              })}
            </>
          )}

          {/* TrackSAFE Overlay */}
          {showTrackSAFEOverlay && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trackSAFEIndex"
              stroke="#1d4ed8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#1d4ed8', strokeWidth: 1 }}
              activeDot={{ r: 4, fill: '#1d4ed8', strokeWidth: 2 }}
              name="TrackSAFE Index"
              strokeOpacity={0.8}
            />
          )}

          {/* Weather Overlay */}
          {showWeatherOverlay && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={selectedWeatherMetric}
              stroke={getWeatherMetricColor()}
              strokeWidth={2}
              strokeDasharray="6 2"
              dot={{ r: 2, fill: getWeatherMetricColor(), strokeWidth: 1 }}
              activeDot={{ r: 4, fill: getWeatherMetricColor(), strokeWidth: 2 }}
              name={selectedWeatherMetric}
              strokeOpacity={0.8}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskCategoryChart;
