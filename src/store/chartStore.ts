import { create } from 'zustand';
import { ChartConfig } from '../types/Chart';
import { v4 as uuidv4 } from 'uuid';

interface ChartState {
  charts: ChartConfig[];
  addChart: (chart: Omit<ChartConfig, 'id'>) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  removeChart: (id: string) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  charts: [],
  addChart: (chart) => set((state) => ({ 
    charts: [...state.charts, { ...chart, id: uuidv4() }] 
  })),
  updateChart: (id, updates) => set((state) => ({
    charts: state.charts.map(chart => 
      chart.id === id ? { ...chart, ...updates } : chart
    )
  })),
  removeChart: (id) => set((state) => ({
    charts: state.charts.filter(chart => chart.id !== id)
  })),
}));