import { useState, useEffect, RefObject } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartConfig, ChartType } from '../types/Chart';
import { searchSeries } from '../services/fredApi';
import { Button } from './ui/Button';

type TimeFrequency = 'q' | 'sa' | 'a';

interface ChartConfigFormProps {
  initialConfig?: Partial<ChartConfig>;
  onSave: (config: Partial<ChartConfig>) => void;
  onCancel: () => void;
  displayFooterButtons?: boolean;
  formRef?: RefObject<HTMLFormElement | null>;
}

const ChartConfigForm = ({ 
  initialConfig = {}, 
  onSave, 
  onCancel,
  displayFooterButtons = true,
  formRef
}: ChartConfigFormProps) => {
  const [title, setTitle] = useState(initialConfig.title || '');
  const [chartType, setChartType] = useState<ChartType>(initialConfig.chartType || 'line');
  const [seriesId, setSeriesId] = useState(initialConfig.seriesId || '');
  const [seriesTitle, setSeriesTitle] = useState(initialConfig.seriesTitle || '');
  const [yAxisLabel, setYAxisLabel] = useState(initialConfig.yAxisLabel || '');
  const [timeFrequency, setTimeFrequency] = useState<TimeFrequency>(
    (initialConfig.timeFrequency as TimeFrequency) || 'q'
  );
  const [color, setColor] = useState(initialConfig.color || '#1f77b4');
  const [lineStyle, setLineStyle] = useState(initialConfig.lineStyle || 'solid');
  const [barStyle, setBarStyle] = useState(initialConfig.barStyle || 'grouped');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: seriesResults,
    isLoading: isSearching,
    error: searchError
  } = useQuery({
    queryKey: ['searchSeries', debouncedQuery],
    queryFn: () => searchSeries(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const handleSeriesSelect = (id: string, title: string) => {
    setSeriesId(id);
    setSeriesTitle(title);
    
    if (!title || title.trim() === '') {
      setTitle(title);
    }
  };

  const handleTimeFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrequency(e.target.value as TimeFrequency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedConfig: Partial<ChartConfig> = {
      title,
      chartType,
      seriesId,
      seriesTitle,
      yAxisLabel,
      timeFrequency,
      color,
      ...(chartType === 'line' ? { lineStyle } : {}),
      ...(chartType === 'bar' ? { barStyle } : {}),
    };
    if(!title || !seriesId)
      return;
    onSave(updatedConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4"  ref={formRef}>
      <div>
        <label className="block text-sm font-medium mb-1">
          Chart Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Chart Type</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartType)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Data Series <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for data series..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          
          {isSearching && <div className="text-sm">Searching...</div>}
          {searchError && (
            <div className="text-sm text-red-500">
              Error searching series. Please try again.
            </div>
          )}
          
          {seriesResults && seriesResults.seriess && seriesResults.seriess.length > 0 && (
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
              {seriesResults.seriess.map((series) => (
                <div
                  key={series.id}
                  onClick={() => handleSeriesSelect(series.id, series.title)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    seriesId === series.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <div className="font-medium">{series.title}</div>
                  <div className="text-xs text-gray-500">
                    ID: {series.id} • Frequency: {series.frequency} • Units: {series.units}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {seriesId && (
            <div className="text-sm bg-gray-100 p-2 rounded">
              Selected: {seriesTitle} ({seriesId})
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Y-Axis Label</label>
        <input
          type="text"
          value={yAxisLabel}
          onChange={(e) => setYAxisLabel(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Time Frequency</label>
        <select
          value={timeFrequency}
          onChange={handleTimeFrequencyChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="q">Quarterly</option>
          <option value="sa">Semi Annual</option>
          <option value="a">Annual</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      
      {chartType === 'line' && (
        <div>
          <label className="block text-sm font-medium mb-1">Line Style</label>
          <select
            value={lineStyle}
            onChange={(e) => setLineStyle(e.target.value as 'solid' | 'dashed' | 'dotted')}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      )}
      
      {chartType === 'bar' && (
        <div>
          <label className="block text-sm font-medium mb-1">Bar Style</label>
          <select
            value={barStyle}
            onChange={(e) => setBarStyle(e.target.value as 'grouped' | 'stacked')}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="grouped">Grouped</option>
            <option value="stacked">Stacked</option>
          </select>
        </div>
      )}
      
      {displayFooterButtons && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title || !seriesId}>
            Save Chart
          </Button>
        </div>
      )}
    </form>
  );
};

export default ChartConfigForm;