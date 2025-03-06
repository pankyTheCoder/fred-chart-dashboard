import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { ChartConfig, DataPoint } from '../types/Chart';
import { getSeriesData } from '../services/fredApi';
import { Button } from './ui/Button';
import ChartConfigForm from './ChartConfigForm';
import { useChartStore } from '../store/chartStore';

interface ChartCardProps {
  config: ChartConfig;
}

const ChartCard = ({ config }: ChartCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const removeChart = useChartStore(state => state.removeChart);
  const updateChart = useChartStore(state => state.updateChart);

  const { data, isLoading, error } = useQuery({
    queryKey: ['chartData', config.seriesId, config.timeFrequency],
    queryFn: () => getSeriesData(config.seriesId, config.timeFrequency),
    enabled: !!config.seriesId,
  });

  const chartData: DataPoint[] = data?.observations
    .filter(obs => obs.value !== '.')
    .map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
    })) || [];

  const handleRemove = () => {
    removeChart(config.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveConfig = (updatedConfig: Partial<ChartConfig>) => {
    updateChart(config.id, updatedConfig);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const renderChart = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-64">Loading chart data...</div>;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-500">
          Error loading chart data. Please check your configuration.
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          No data available for the selected series.
        </div>
      );
    }

    const getStrokeDashArray = () => {
      if (!config.lineStyle || config.lineStyle === 'solid') return '0';
      if (config.lineStyle === 'dashed') return '5 5';
      if (config.lineStyle === 'dotted') return '1 5';
      return '0';
    };

    if (config.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: config.yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' } 
              }} 
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={config.seriesTitle}
              stroke={config.color}
              strokeWidth={2}
              strokeDasharray={getStrokeDashArray()}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (config.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: config.yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' } 
              }} 
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              name={config.seriesTitle} 
              fill={config.color} 
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white">
      {isEditing ? (
        <ChartConfigForm 
          initialConfig={config} 
          onSave={handleSaveConfig} 
          onCancel={handleCancelEdit} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{config.title}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
          {renderChart()}
        </>
      )}
    </div>
  );
};

export default ChartCard;