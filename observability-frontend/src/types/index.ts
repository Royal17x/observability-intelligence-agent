export interface AnalysisRequest {
  service_name: string;
  time_range_minutes: number;
  question: string;
}

export interface AnalysisResponse {
  id: string;
  result: string;
}

export interface AnalysisRecord {
  id: string;
  service_name: string;
  question: string;
  result: string;
  created_at: string;
}

export interface AnalysesListResponse {
  analyses: AnalysisRecord[];
}
