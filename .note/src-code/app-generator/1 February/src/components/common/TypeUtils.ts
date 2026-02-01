/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

export interface ApiErrorDataPayload {
  data: null;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorDataPayload;
}
