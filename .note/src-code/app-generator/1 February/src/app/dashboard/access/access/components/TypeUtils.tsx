
    
export interface ApiErrorDataPayload {
  data: null;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorDataPayload;
}
    
