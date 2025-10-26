export interface IResponse {
  data: unknown;
  message: string;
  status: number;
  ok: boolean;
}

// Helper to format responses
export const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status > 209 ? false : true,
});
