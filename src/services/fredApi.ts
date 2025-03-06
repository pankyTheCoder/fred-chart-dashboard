import { FREDDataResponse, FREDSeriesResponse } from '../types/Chart';

const API_KEY = 'b5012636c81dde3475ff4c99dba14ec9';

export const searchSeries = async (query: string): Promise<FREDSeriesResponse> => {
  const response = await fetch(
    `/api/fred/series/search?search_text=${encodeURIComponent(query)}&api_key=${API_KEY}&file_type=json`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch series data');
  }
  
  return response.json();
};

export const getSeriesData = async (
  seriesId: string, 
  frequency: string
): Promise<FREDDataResponse> => {
  const response = await fetch(
    `/api/fred/series/observations?series_id=${seriesId}&frequency=${frequency}&api_key=${API_KEY}&file_type=json`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch series observations');
  }
  
  return response.json();
};