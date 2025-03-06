export type ChartType = 'line' | 'bar';

export interface DataPoint {
  date: string;
  value: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  chartType: ChartType;
  seriesId: string;
  seriesTitle: string;
  yAxisLabel: string;
  timeFrequency: 'q' | 'sa' | 'a';
  color: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  barStyle?: 'grouped' | 'stacked';
}

export interface FREDSeries {
  id: string;
  title: string;
  frequency: string;
  units: string;
}

export interface FREDSeriesResponse {
  seriess: FREDSeries[];
}

export interface FREDDataResponse {
  observations: {
    date: string;
    value: string;
  }[];
}